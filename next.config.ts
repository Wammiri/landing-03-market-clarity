import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /*
    Next.js otherwise appends a managed agent rules block to CLAUDE.md or
    AGENTS.md on every `next dev`. That block contains em dashes, which the
    house style rule in CLAUDE.md forbids, and it rewrites a pack file that is
    outside any batch's bounded file list. Turning it off is the supported
    switch and keeps the em dash scan clean. Decision D-16.
  */
  agentRules: false,
};

export default nextConfig;
