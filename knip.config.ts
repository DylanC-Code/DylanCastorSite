import type { KnipConfig } from "knip";

export default {
    include: ["nsExports", "nsTypes"],
    includeEntryExports: true,
    ignoreExportsUsedInFile: false,
    treatConfigHintsAsErrors: true,
    // Read by Astro's Fonts API, by package name (astro.config.ts); no file
    // imports them.
    ignoreDependencies: [
        "@fontsource-variable/hanken-grotesk",
        "@fontsource/dm-mono",
        "@fontsource/libre-caslon-text",
    ],
} satisfies KnipConfig;
