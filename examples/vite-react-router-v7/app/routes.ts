import { index, route, type RouteConfig } from "@react-router/dev/routes";

export default [index("routes/home.tsx"), route("page-2", "routes/page-2.tsx")] satisfies RouteConfig;
