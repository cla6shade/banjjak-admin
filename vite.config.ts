import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  plugins: [viteStaticCopy({
    targets: [
      {
        src: './app/generated/prisma/**/*.node',
        dest: './',
      }
    ]
  }), tailwindcss(), reactRouter(), tsconfigPaths()],
});
