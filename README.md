# OneDollarStats

[![npm version](https://img.shields.io/npm/v/onedollarstats)](https://www.npmjs.com/package/onedollarstats)  
[![Website](https://img.shields.io/badge/site-onedollarstats.com-blue)](https://onedollarstats.com/home)

A lightweight, zero-dependency analytics tracker for front-end apps. OneDollarStats automatically collects pageviews, UTM parameters, and custom events with minimal setup.

## Features

- Automatic pageview tracking (supports browser navigation, visibility changes, and hash routing)
- UTM parameter extraction for campaigns
- Click autocapture for elements with `data-s:event` attributes
- Fallbacks for sending data: Image beacon → `sendBeacon` → `fetch`
- Zero dependencies, easy to integrate

## Installation

```bash
pnpm install onedollarstats
```

## Usage Example

### Setup Analytics

> ⚠️ Only initialize **once** in your app (usually at app entrypoint).
> Config is applied on the **first initialization only**.

```ts
import { Analytics } from "onedollarstats";

// Initialize tracker
const tracker = Analytics({
  collectorUrl: "https://collector.onedollarstats.com/events",
  autocollect: true, // automatically track pageviews & clicks
  hashRouting: true // track SPA hash route changes
});
```

All subsequent calls will return the same tracker instance. You can access
this instance anywhere in your app by calling Analytics() again. This
allows you to use the tracker methods (event, view, etc.) in
different modules.

#### Manual Track Pageviews

```ts
// Manual pageview
tracker.view("/homepage");

// Pageview with additional properties
tracker.view("/checkout", { step: 2, plan: "pro" });
```

#### Manual Track Custom Events

```ts
// Simple event
tracker.event("ButtonClicked");

// Event with path
tracker.event("SignupStarted", "/signup");

// Event with properties
tracker.event("Purchase", { amount: 49, currency: "USD" });

// Event with path + properties
tracker.event("CheckoutStep", "/checkout", { step: 3 });
```

## API

The tracker exposes three main methods:

### `tracker.view(pathOrProps?: string | Record<string, string>, props?:  Record<string, string>)`

Record a page view.

**Parameters:**

- `pathOrProps` – Optional URL path string or properties object
- `props` – Optional properties if the first argument is a path string

---

### `tracker.event(eventName: string, pathOrProps?: string |  Record<string, string>, extraProps?:  Record<string, string>)`

Track a custom event.

**Parameters:**

- `eventName` – Event name
- `pathOrProps` – Optional path string or properties object
- `extraProps` – Optional properties if the first argument is a path string

---

### `tracker.cleanup()`

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
> - Manual calls to `tracker.view()` or `tracker.event()` **ignore** `excludePages`/`includePages`.
> - By default, events from `localhost` are ignored. Use the `trackLocalhostAs` option to simulate a hostname for local testing.

## Click Autocapture

You can automatically capture clicks on elements by adding special HTML attributes:

- `data-s:event` – sets the event name.
- `data-s:event-path` – sets the path representing the page where the event occurred (optional).
- `data-s:event-props` – sets properties that will be sent with the event (optional).

For full details, see the [Click Autocapture documentation](https://docs.onedollarstats.com/send-events).
