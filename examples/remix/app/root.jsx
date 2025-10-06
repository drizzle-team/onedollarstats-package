import { Links, LiveReload, Meta, Outlet, Scripts } from "@remix-run/react";
import { configure } from "onedollarstats";
import { useEffect } from "react";

export default function App() {
  useEffect(() => {
    configure({ trackLocalhostAs: "example.com" });
    console.log(22);
  }, []);

  return (
    <html>
      <head>
        <link
          rel='icon'
          href='data:image/x-icon;base64,AA'
        />
        <Meta />
        <Links />
      </head>
      <body>
        <LiveReload />
        <h1>Hello world!</h1>
        <Outlet />

        <Scripts />
      </body>
    </html>
  );
}
