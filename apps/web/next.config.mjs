import createNextIntlPlugin from "next-intl/plugin";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const workspaceRoot = resolve(__dirname, "../..");

const nextConfig = {
  reactStrictMode: true,
  compress: true,

  typescript: {
    ignoreBuildErrors: true,
  },

  output: "standalone",
  outputFileTracingRoot: workspaceRoot,

  outputFileTracingIncludes: {
    "**/*": ["locale/**/*"],
  },

  transpilePackages: ["@mep/ui", "@mep/types"],
};

export default createNextIntlPlugin("./src/lib/locale/request.ts")(nextConfig);
