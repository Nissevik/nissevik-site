import type { MDXComponents } from "mdx/types";

// Global MDX-styling: minimalt, låter Tailwind-typografi ligga i wrappern istället
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
  };
}
