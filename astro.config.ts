import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, fontProviders } from "astro/config";

import searchListing from "./src/content/searchListing.json" with { type: "json" };

/**
 * Fonts come from npm packages pinned in bun.lock, never from a CDN: the build
 * needs no network, and visitors' browsers only ever call dylancastor.com.
 */
const fromPackages = fontProviders.npm({ remote: false });

/**
 * The sitemap lists only the pages open to search (searchListing.json, which
 * the head's noindex reads too): the main home, the agencies and brands homes,
 * floor I and the flicker page. The legal pages are hidden on purpose (they
 * show Dylan's address and phone); the pages that only say "This page is being
 * written" are hidden until written.
 */
const listed = new Set(
    searchListing.open.map(
        (path) => new URL(path, "https://dylancastor.com").href,
    ),
);

function isListed(page: string): boolean {
    return listed.has(page);
}

export default defineConfig({
    site: "https://dylancastor.com",
    // One URL per page, no trailing slash: /cro/flicker-free-ab-tests is built
    // as cro/flicker-free-ab-tests.html, and canonicals and the sitemap agree.
    trailingSlash: "never",
    build: { format: "file" },
    integrations: [sitemap({ filter: isListed })],
    vite: { plugins: [tailwindcss()] },
    fonts: [
        {
            provider: fromPackages,
            name: "Libre Caslon Text",
            cssVariable: "--font-caslon",
            weights: [400],
            styles: ["normal", "italic"],
            fallbacks: ["Georgia", "serif"],
            options: { package: "@fontsource/libre-caslon-text" },
        },
        {
            provider: fromPackages,
            name: "Hanken Grotesk",
            cssVariable: "--font-hanken",
            weights: ["400 600"],
            styles: ["normal"],
            fallbacks: ["system-ui", "sans-serif"],
            options: {
                package: "@fontsource-variable/hanken-grotesk",
                file: "wght.css",
            },
        },
        {
            provider: fromPackages,
            name: "DM Mono",
            cssVariable: "--font-dm-mono",
            weights: [400, 500],
            styles: ["normal"],
            fallbacks: ["ui-monospace", "monospace"],
            options: { package: "@fontsource/dm-mono" },
        },
    ],
});
