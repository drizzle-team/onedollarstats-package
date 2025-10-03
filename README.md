# OneDollarStats

[![npm version](https://img.shields.io/npm/v/onedollarstats)](https://www.npmjs.com/package/onedollarstats)  
[![Website](https://img.shields.io/badge/site-onedollarstats.com-blue)](https://onedollarstats.com/home)

A lightweight, zero-dependency analytics tracker for client apps. OneDollarStats automatically collects pageviews, UTM parameters, and custom events with minimal setup.

## Features

- Automatic pageview tracking (supports client/server side navigation and hash routing)
- Automatic UTM parameter collection
- Automatic event tracking on clicks of elements with data-s-event attributes
- Zero dependencies, easy to integrate

## Installation

```bash
npm i onedollarstats
```

## Getting Started

### Configure analytics

> ⚠️ Initialize analytics on every page for static sites, or at the root layout (app entrypoint) in SPA apps.
> Calling `view` or `event` before `configure` will automatically initialize the tracker with the default configuration.

```ts
import { configure } from "onedollarstats";

// Configure analytics
configure({
  collectorUrl: "https://collector.onedollarstats.com/events",
  autocollect: true, // automatically tracks pageviews & clicks
  hashRouting: true // track SPA hash route changes
});
```

#### Track Pageviews Manually

By default, pageviews are tracked automatically. If you want to track them manually (for example, with autocollect: false), you can use the `view` function:

```ts
import { view } from "onedollarstats";

// Simple pageview
view("/homepage");

// Pageview with extra properties
view("/checkout", { step: 2, plan: "pro" });
```

#### Track Custom Events Manually

The `event` function can accept different types of arguments depending on your needs:

```ts
import { event } from "onedollarstats";

// Simple event
event("Purchase");

// Event with a path
event("Purchase", "/product");

// Event with properties
event("Purchase", { amount: 1, color: "green" });

// Event with path + properties
event("Purchase", "/product", { amount: 1, color: "green" });
```

## API

#### `configure(config?: AnalyticsConfig)` initializes the tracker with your configuration.

**Config Options:**

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
> - Manual calls of `view` or `event` **ignore** `excludePages`/`includePages`.
> - By default, events from `localhost` are ignored. Use the `trackLocalhostAs` option to simulate a hostname for local development.

---

#### `view(pathOrProps?: string | Record<string, string>, props?:  Record<string, string>)` sends a pageview event.

**Parameters:**

- `pathOrProps` – Optional, **string** represents the path, **object** represents custom properties.
- `props` – Optional, properties if the first argument is a path string.

---

#### `event(eventName: string, pathOrProps?: string |  Record<string, string>, props?:  Record<string, string>)` sends a custom event.

**Parameters:**

- `eventName` – Name of the event.
- `pathOrProps` – Optional, **string** represents the path, **object** represents custom properties.
- `props` – Optional, properties if the second argument is a path string.

---

## Click Autocapture

Automatically capture clicks on elements using these HTML attributes:

- `data-s-event`– Name of the event
- `data-s-event-path` Optional, the path representing the page where the event occurred
- `data-s-event-props` – Optional, properties to send with the event

For full details, see the [Click Autocapture documentation](https://docs.onedollarstats.com/send-events).
