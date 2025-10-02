# OneDollarStats

[![npm version](https://img.shields.io/npm/v/onedollarstats)](https://www.npmjs.com/package/onedollarstats)  
[![Website](https://img.shields.io/badge/site-onedollarstats.com-blue)](https://onedollarstats.com/home)

A lightweight, zero-dependency analytics tracker for client apps. OneDollarStats automatically collects pageviews, UTM parameters, and custom events with minimal setup.

## Features

- Automatic pageview tracking (supports client/server side navigation, and hash routing)
- Automatically sends UTM parameters
- Automatically sends events on click on elements with `data-s-event` attributes
- Zero dependencies, easy to integrate

## Installation

```bash
npm i onedollarstats
```

## Getting Started

### Configure analytics

> ⚠️ Initialize the analytics on every page for static sites, and to the root layout(app entrypoint) in spa apps.
> Calling `view` or `event` before `configure` will automatically initialize the tracker with the default configuration.

```ts
import { configure } from "onedollarstats";

// Configure analytics
configure({
  collectorUrl: "https://collector.onedollarstats.com/events",
  autocollect: true, // automatically tracks pageviews & clicks
  hashRouting: true, // track SPA hash route changes
});
```

#### Track Pageviews Manually

По дефолут все пейджвью трекаются автоматически. Если вы хотите делать это вручную, и ставите `autocollect: false` тогда вы можете использовать функцию `view` для отправки пейдж вью 

```ts
import { view } from "onedollarstats";

// Simple pageview
view("/homepage");

// Pageview with extra properties
view("/checkout", { step: 2, plan: "pro" });
```

#### Track Custom Events

Аргументы функции `event` могут варироваться в зависимости от типа данных

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

#### `configure(config?: AnalyticsConfig)` initializes tracker with your configuration.

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

#### `view(pathOrProps?: string | Record<string, string>, props?:  Record<string, string>)` sends a page view event.

**Parameters:**

- `pathOrProps` – Optional, если строка то это путь, если обьект то кастомные пропсы
- `props` – Optional, properties if the first argument is a path string

---

#### `event(eventName: string, pathOrProps?: string |  Record<string, string>, props?:  Record<string, string>)` sends a custom event.

**Parameters:**

- `eventName` – Event name
- `pathOrProps` – Optional, если строка то это путь, если обьект то кастомные пропсы
- `props` – Optional, properties if the second argument is a path string

---



## Click Autocapture

You can automatically capture clicks on elements by adding special HTML attributes:

- `data-s:event`/`data-s-event` – sets the event name.
- `data-s:event-path`/`data-s-event-path` – sets the path representing the page where the event occurred (optional).
- `data-s:event-props`/`data-s-event-props` – sets properties that will be sent with the event (optional).

For full details, see the [Click Autocapture documentation](https://docs.onedollarstats.com/send-events).
