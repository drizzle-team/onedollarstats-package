import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "@remix-run/react";
import { configure } from "onedollarstats";
import { useEffect } from "react";

export default function Root() {
  useEffect(() => {
    configure({ trackLocalhostAs: "example.com" });
  }, []);
  return (
    <html lang='en'>
      <head>
        <link
          href='/app/index.css'
          rel='stylesheet'
        ></link>
        <Links />
        <Meta />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
