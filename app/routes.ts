import { type RouteConfig, index } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  { path: "test1", file: "routes/test1.tsx" },
  { path: "test2", file: "routes/test2.tsx" },
  { path: "test3", file: "routes/test3.tsx" },
] satisfies RouteConfig;
