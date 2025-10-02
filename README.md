# OneDollarStats

[![npm version](https://img.shields.io/npm/v/onedollarstats)](https://www.npmjs.com/package/onedollarstats)  
[![Website](https://img.shields.io/badge/site-onedollarstats.com-blue)](https://onedollarstats.com/home)

A lightweight, zero-dependency analytics tracker for front-end apps. OneDollarStats automatically collects pageviews, UTM parameters, and custom events with minimal setup.

## Features

- Automatic pageview tracking (supports browser navigation, visibility changes, and hash routing)
- UTM parameter extraction for campaigns
- Click autocapture for elements with `data-s:event` or `data-s-event` attributes
- Fallbacks for sending data: Image beacon → `sendBeacon` → `fetch`
- Zero dependencies, easy to integrate

## Installation

```bash
pnpm install onedollarstats
```

## Getting Started

### Configure analytics

> ⚠️ Important: The tracker configuration is applied only once. Call configure() once in your app (usually at the entrypoint).
> Calling view() or event() before configure() will automatically initialize the tracker with the default configuration.

```ts
import { configure } from "onedollarstats";

// Configure analytics
configure({
  collectorUrl: "https://collector.onedollarstats.com/events",
  autocollect: true, // automatically track pageviews & clicks
  hashRouting: true // track SPA hash route changes
});
```

#### Track Pageviews

```ts
import { view } from "onedollarstats";

// Simple pageview
view("/homepage");

// Pageview with extra properties
view("/checkout", { step: 2, plan: "pro" });
```

#### Track Custom Events

Custom events can be tracked in multiple ways:

```ts
import { event } from "onedollarstats";

// Simple event
event("ButtonClicked");

// Event with a path
event("SignupStarted", "/signup");

// Event with properties
event("Purchase", { amount: 49, currency: "USD" });

// Event with path + properties
event("CheckoutStep", "/checkout", { step: 3 });
```

## API

**Onedollarstats export four main methods:**

### `configure(config?: AnalyticsConfig)`

Initialize tracker with your configuration.

**Parameters:**

- `config` – Optional configuration object to customize behavior (collector URL, autocollect, hashRouting, etc.).

---

### `view(pathOrProps?: string | Record<string, string>, props?:  Record<string, string>)`

Record a page view.

**Parameters:**

- `pathOrProps` – Optional URL path string or properties object
- `props` – Optional properties if the first argument is a path string

---

### `event(eventName: string, pathOrProps?: string |  Record<string, string>, extraProps?:  Record<string, string>)`

Track a custom event.

**Parameters:**

- `eventName` – Event name
- `pathOrProps` – Optional path string or properties object
- `extraProps` – Optional properties if the first argument is a path string

---

### `cleanup`

Removes all event listeners and restores original `history.pushState`.
Use when unmounting apps or cleaning up SPA components.

## Configuration Options

| Option             | Type             | Default                                         | Description                                |
| ------------------ | ---------------- | ----------------------------------------------- | ------------------------------------------ |
| `collectorUrl`     | `string`         | `"https://collector.onedollarstats.com/events"` | URL to send analytics events               |
| `trackLocalhostAs` | `string \| null` | `null`                                          | Replace localhost hostname for dev testing |
| `hashRouting`      | `boolean`        | `false`                                         | Track hash route changes as pageviews      |
| `autocollect`      | `boolean`        | `true`                                          | Automatically track pageviews & clicks     |
| `excludePages`     | `string[]`       | `[]`                                            | Pages to ignore for automatic tracking     |
| `includePages`     | `string[]`       | `[]`                                            | Pages to explicitly include for tracking   |

> **Notes:**
>
> - Manual calls to `view` or `event` **ignore** `excludePages`/`includePages`.
> - By default, events from `localhost` are ignored. Use the `trackLocalhostAs` option to simulate a hostname for local testing.

## Click Autocapture

You can automatically capture clicks on elements by adding special HTML attributes:

- `data-s:event`/`data-s-event` – sets the event name.
- `data-s:event-path`/`data-s-event-path` – sets the path representing the page where the event occurred (optional).
- `data-s:event-props`/`data-s-event-props` – sets properties that will be sent with the event (optional).

For full details, see the [Click Autocapture documentation](https://docs.onedollarstats.com/send-events).
