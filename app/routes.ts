import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("pages/index.tsx"),
  route("login", "pages/login/index.tsx"),
  route("admin/members", "pages/members/index.tsx"),
  route("admin/posts", "pages/posts/index.tsx"),
] satisfies RouteConfig;
