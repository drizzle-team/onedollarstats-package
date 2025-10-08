import type { AnalyticsConfig, BaseProps, BodyToSend, Event, ViewArguments } from "./types";
import { getEnvironment, isClient } from "./utils/environment";
import { parseUtmParams } from "./utils/parse-utm-params";
import { parseProps } from "./utils/props-parser";
import { resolvePath } from "./utils/resolve-path";
import { shouldTrackPath } from "./utils/should-track";

const defaultConfig: Required<AnalyticsConfig> = {
  trackLocalhostAs: null,
  collectorUrl: "https://collector.onedollarstats.com/events",
  hashRouting: false,
  autocollect: true,
  excludePages: [],
  includePages: []
};

class AnalyticsTracker {
  private static instance: AnalyticsTracker | null = null;

  private autocollectSetupDone = false;
  private config: Required<AnalyticsConfig>;
  private lastPage: string | null = null;

  public static getInstance(userConfig: AnalyticsConfig = {}): AnalyticsTracker {
    // Fresh no-op instance for SSR
    if (!isClient()) return new AnalyticsTracker(userConfig);

    if (!AnalyticsTracker.instance) {
      AnalyticsTracker.instance = new AnalyticsTracker(userConfig);
    }
    return AnalyticsTracker.instance;
  }

  private constructor(userConfig: AnalyticsConfig = {}) {
    this.config = { ...defaultConfig, ...userConfig };

    // Skip setup in non-client environments
    if (!isClient()) return;

    const { isLocalhost } = getEnvironment();

    // Log connection only if on localhost and tracking is configured
    if (isLocalhost && this.config.trackLocalhostAs) {
      console.log(`[onedollarstats]\nOneDollarStats successfully connected! Tracking your localhost as ${this.config.trackLocalhostAs}`);
    }

    // Auto-start autocollect
    if (this.config.autocollect) this.setupAutocollect();
  }

  private async sendWithBeaconOrFetch(stringifiedBody: string): Promise<void> {
    // First fallback: try sendBeacon
    if (navigator.sendBeacon?.(this.config.collectorUrl, stringifiedBody)) return;

    // Second fallback: use fetch() with keepalive
    fetch(this.config.collectorUrl, {
      method: "POST",
      body: stringifiedBody,
      headers: { "Content-Type": "application/json" },
      keepalive: true
    }).catch((err: Error) => console.error("[onedollarstats] fetch() failed:", err.message));
  }

  // Handles localhost replacement, referrer, UTM parameters, and debug mode.
  // Uses img beacon then `navigator.sendBeacon` if available, otherwise falls back to `fetch`.
  private async send(data: Event): Promise<void> {
    const { isLocalhost, isHeadlessBrowser } = getEnvironment();
    if ((isLocalhost && !this.config.trackLocalhostAs) || isHeadlessBrowser) return;

    const urlToSend = new URL(location.href);

    // Determine debug mode and handle localhost replacement
    let isDebug: boolean = false;
    if (isLocalhost && this.config.trackLocalhostAs && urlToSend.hostname !== this.config.trackLocalhostAs) {
      isDebug = true;
      urlToSend.hostname = this.config.trackLocalhostAs;
    }

    // Clean query string unless UTM is explicitly provided
    urlToSend.search = "";
    if (data.path) urlToSend.pathname = data.path;

    const cleanUrl = urlToSend.href.replace(/\/$/, "");

    // Determine referrer
    let referrer: string | undefined = data.referrer;
    try {
      if (!referrer && document.referrer && document.referrer !== "null") {
        const referrerURL = new URL(document.referrer);
        if (referrerURL.hostname !== urlToSend.hostname) referrer = referrerURL.href;
      }
    } catch {} // ignore malformed referrer

    // Build request body
    const body: BodyToSend = {
      u: cleanUrl,
      e: [
        {
          t: data.type,
          h: this.config.hashRouting,
          r: referrer,
          p: data.props
        }
      ]
    };

    if (data.utm && Object.keys(data.utm).length > 0) body.qs = data.utm;
    if (isDebug) {
      body.debug = true;
      let logMessage = `[onedollarstats]\nEvent name: ${data.type}\nEvent collected from: ${cleanUrl}`;
      if (data.props && Object.keys(data.props).length > 0) logMessage += `\nProps: ${JSON.stringify(data.props, null, 2)}`;
      if (referrer) logMessage += `\nReferrer: ${referrer}`;
      if (this.config.hashRouting) logMessage += `\nHashRouting: ${this.config.hashRouting}`;
      if (data.utm && Object.keys(data.utm).length > 0) logMessage += `\nUTM: ${data.utm}`;

      console.log(logMessage);
    }

    // Prepare the event payload
    const stringifiedBody = JSON.stringify(body);
    // Encode for safe inclusion in query string using Base64
    const payloadBase64 = btoa(stringifiedBody);

    const safeGetThreshold = 1500; // limit for query-string-containing URLs
    const tryImageBeacon = payloadBase64.length <= safeGetThreshold;

    if (tryImageBeacon) {
      // Send via image beacon
      const img = new Image(1, 1);

      // If loading image fails (server unavailable, blocked, etc.)
      img.onerror = () => this.sendWithBeaconOrFetch(stringifiedBody);

      // Primary attempt: send data via image beacon (GET request with query string)
      img.src = `${this.config.collectorUrl}?data=${payloadBase64}`;
    } else await this.sendWithBeaconOrFetch(stringifiedBody);
  }

  // Prevents duplicate pageviews and respects include/exclude page rules. Automatically parses UTM parameters from URL.
  private trackPageView({ path, props }: ViewArguments, checkBlock: boolean = false) {
    if (!isClient()) return;

    const viewPath = resolvePath(path);

    const viewProps =
      props ||
      (() => {
        const newProps = {};
        const elements = document.querySelectorAll("[data-s\\:view-props], [data-s-view-props]");

        for (const el of Array.from(elements)) {
          const propsString = el.getAttribute("data-s-view-props") || el.getAttribute("data-s:view-props");
          if (!propsString) continue;
          const parsedProps = parseProps(propsString);
          Object.assign(newProps, parsedProps);
        }

        return Object.keys(newProps).length ? newProps : undefined;
      })();

    // Skip duplicate pageviews or excluded pages
    if (!this.config.hashRouting && this.lastPage === viewPath) return;

    // Skip page if checkBlock is true and the path should be excluded
    if (checkBlock && !shouldTrackPath(viewPath, this.config)) return;

    this.lastPage = viewPath;

    const utm = parseUtmParams(new URLSearchParams(location.search));
    this.send({ type: "PageView", path: viewPath, props: viewProps, utm });
  }

  /**
   * Tracks a custom event.
   * Can accept path string or a props object.
   *
   * @param eventName Name of the event to track.
   * @param pathOrProps Optional path string or props object.
   * @param props Optional props object if path string is provided.
   */
  public async event(eventName: string, pathOrProps?: string | BaseProps, props?: BaseProps) {
    if (!isClient()) return;

    const { isLocalhost, isHeadlessBrowser } = getEnvironment();
    if ((isLocalhost && !this.config.trackLocalhostAs) || isHeadlessBrowser) return;

    const args: ViewArguments = {};
    if (typeof pathOrProps === "string") {
      args.path = resolvePath(pathOrProps);

      args.props = props;
    } else if (typeof pathOrProps === "object") args.props = pathOrProps;

    this.send({ type: eventName, ...args });
  }

  /**
   * Records a page view.
   * Can accept path string or a props object.
   *
   * @param pathOrProps Optional path string or props object.
   * @param props Optional props when first arg is a path string.
   */
  public async view(pathOrProps?: string | BaseProps, props?: BaseProps) {
    if (!isClient()) return;

    const args: ViewArguments = {};

    if (typeof pathOrProps === "string") {
      args.path = pathOrProps;
      args.props = props;
    } else if (typeof pathOrProps === "object") {
      args.props = pathOrProps;
    }

    this.trackPageView(args);
  }

  /**
   * Installs global DOM/window listeners exactly once for:
   *  - visibilitychange
   *  - history.pushState
   *  - popstate
   *  - hashchange
   *  - click autocapture for elements annotated with `data-s:event` & `data-s-event`
   *
   */
  private setupAutocollect() {
    if (!isClient() || this.autocollectSetupDone) return;
    this.autocollectSetupDone = true;

    const handlePageView = () => this.trackPageView({}, true);

    // visibilitychange
    const onVisibility = () => {
      if (document.visibilityState === "visible") handlePageView();
    };
    document.addEventListener("visibilitychange", onVisibility);

    // pushState
    const origPush = history.pushState.bind(history);
    history.pushState = (...args) => {
      origPush(...args);
      requestAnimationFrame(() => {
        handlePageView();
      });
    };

    // popstate
    window.addEventListener("popstate", handlePageView);

    // hashchange
    window.addEventListener("hashchange", handlePageView);

    // click autocapture
    const onClick: EventListener = (ev: Event) => {
      const clickEvent = ev as MouseEvent;
      if (clickEvent.type === "auxclick" && clickEvent.button !== 1) return;

      const target = clickEvent.target as Element | null;
      if (!target) return;

      // Check if inside <a> or <button>
      const insideInteractive = !!target.closest("a, button");

      let el: Element | null = target;
      let depth = 0;

      while (el) {
        const eventName = el.getAttribute("data-s-event") || el.getAttribute("data-s:event");
        if (eventName) {
          const propsAttr = el.getAttribute("data-s-event-props") || el.getAttribute("data-s:event-props");
          const props = propsAttr ? parseProps(propsAttr) : undefined;
          const path = el.getAttribute("data-s-event-path") || el.getAttribute("data-s:event-path") || undefined;

          if ((path && !shouldTrackPath(path, this.config)) || !shouldTrackPath(location.pathname, this.config)) {
            return;
          }

          this.event(eventName, path ?? props, props);
          return;
        }

        el = el.parentElement;
        depth++;

        // If not in <a>/<button>, stop after 3 levels
        if (!insideInteractive && depth >= 3) break;
      }
    };

    document.addEventListener("click", onClick);

    // Fire initial pageview if already visible
    if (document.visibilityState === "visible") handlePageView();
  }
}

export const configure = (userConfig: AnalyticsConfig = {}) => {
  AnalyticsTracker.getInstance(userConfig);
};

export const event = async (eventName: string, pathOrProps?: string | BaseProps, props?: BaseProps) => {
  const instance = AnalyticsTracker.getInstance();
  await instance.event(eventName, pathOrProps, props);
};

export const view = async (pathOrProps?: string | BaseProps, props?: BaseProps) => {
  const instance = AnalyticsTracker.getInstance();
  await instance.view(pathOrProps, props);
};
