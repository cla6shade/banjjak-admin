import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("admin/index.tsx"),
  route("admin/chats", "admin/chats/index.tsx"),
  route("admin/users", "admin/users/index.tsx"),
  route("admin/posts", "admin/posts/index.tsx"),
] satisfies RouteConfig;
