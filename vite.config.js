import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

/** Project Pages need a base like "/birthday/". Local/dev stays "/". */
const base = process.env.VITE_BASE_PATH || "/";

function rewritePublicAssetUrls() {
  return {
    name: "rewrite-public-asset-urls",
    transform(code, id) {
      if (base === "/") return null;
      if (!/\.(css|jsx|js|mjs)$/.test(id)) return null;
      if (id.includes("node_modules")) return null;

      const prefix = base.endsWith("/") ? base.slice(0, -1) : base;
      const next = code
        .replaceAll('"/assets/', `"${prefix}/assets/`)
        .replaceAll("'/assets/", `'${prefix}/assets/`)
        .replaceAll("url(/assets/", `url(${prefix}/assets/`)
        .replaceAll('url("/assets/', `url("${prefix}/assets/`)
        .replaceAll("url('/assets/", `url('${prefix}/assets/`);

      return next === code ? null : next;
    },
  };
}

export default defineConfig({
  base,
  plugins: [react(), rewritePublicAssetUrls()],
});
