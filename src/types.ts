type UtmParams = Record<string, string | string[]>;
export type BaseProps = Record<string, string>;

export type EventTypes = "visibilitychange" | "popstate" | "hashchange" | "click";

// Short notations
// u: url
// t: type
// h: hash routing
// r: referrer
// p: properties
// e: events
// qs: utm params
export type MinimizedEvent = {
  t: string;
  h?: boolean;
  r?: string;
  p?: BaseProps;
};

export type Event = {
  type: string;
  path?: string;
  props?: BaseProps;
  utm?: UtmParams;
  referrer?: string;
};
export type BodyToSend = {
  u: string;
  e: [MinimizedEvent];
  qs?: UtmParams;
  debug?: boolean;
};

export type ViewArguments = {
  path?: string;
  props?: BaseProps;
};

export type AnalyticsConfig = {
  collectorUrl?: string;
  trackLocalhostAs?: string | null;
  hashRouting?: boolean;
  autocollect?: boolean;
  excludePages?: string[];
  includePages?: string[];
};
