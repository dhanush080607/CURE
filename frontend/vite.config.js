import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// The trailing slash is load-bearing: with a bare "/api" context the proxy also
// swallowed the "/api-access" client route and forwarded it to the backend.
const apiProxy = {
  "/api/": {
    target: "http://127.0.0.1:8000",
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/api/, ""),
  },
};

// The dev server needs 'unsafe-inline' in script-src because @react-refresh
// ships an inline module preamble. The production bundle contains no inline
// scripts, so the strict directive is applied to the build output only.
function strictCsp() {
  return {
    name: "cure-strict-csp",
    apply: "build",
    enforce: "post",
    transformIndexHtml(html) {
      return html.replace(
        "script-src 'self' 'unsafe-inline';",
        "script-src 'self';",
      );
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), strictCsp()],
  server: { proxy: apiProxy },
  // The dev-only proxy left production builds talking to a /api path that
  // nothing serves, so preview needs the same rewrite.
  preview: { proxy: apiProxy },
});
