import type { NextConfig } from "next";
import createMDX from "@next/mdx";

// Skapa MDX-plugin: gör att .mdx-filer i content/ kan importeras som React-komponenter
const withMDX = createMDX({});

const nextConfig: NextConfig = {
  // Standalone-bygge för PM2-deploy (server + minimala node_modules i .next/standalone)
  output: "standalone",
  // Låt Next.js känna igen mdx-tillägget i app-router filer om vi vill det senare
  pageExtensions: ["ts", "tsx", "md", "mdx"],
};

export default withMDX(nextConfig);
