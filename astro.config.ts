import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, fontProviders } from "astro/config";

import searchListing from "./src/content/searchListing.json" with { type: "json" };

/**
 * Fonts come from npm packages pinned in bun.lock, never from a CDN: the build
 * needs no network, and visitors' browsers only ever call dylancastor.com.
 * Latin only, named file by file (the npm provider would take every alphabet of
 * a package): Latin covers English and French (é, è, à, ç, œ…); the extended
 * Latin, Vietnamese and Cyrillic files were never used.
 */
const fromFiles = fontProviders.local();

/** One face of a package's Latin file, e.g. latin-400-normal. */
function latin(
    file: string,
    weight: number | string,
    style: "normal" | "italic",
): { src: [string]; weight: number | string; style: "normal" | "italic" } {
    return { src: [`${file}.woff2`], weight, style };
}

const caslon =
    "@fontsource/libre-caslon-text/files/libre-caslon-text-latin-400";
const hanken =
    "@fontsource-variable/hanken-grotesk/files/hanken-grotesk-latin-wght-normal";
const mono = "@fontsource/dm-mono/files/dm-mono-latin";

/**
 * The sitemap lists only the pages open to search (searchListing.json, which
 * the head's noindex reads too): the main home, the agencies and brands homes,
 * floor I and its two written pages. The legal pages are hidden on purpose
 * (they show Dylan's address and phone); the pages that only say "This page is
 * being written" are hidden until written.
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
            provider: fromFiles,
            name: "Libre Caslon Text",
            cssVariable: "--font-caslon",
            fallbacks: ["Georgia", "serif"],
            options: {
                variants: [
                    latin(`${caslon}-normal`, 400, "normal"),
                    latin(`${caslon}-italic`, 400, "italic"),
                ],
            },
        },
        {
            provider: fromFiles,
            name: "Hanken Grotesk",
            cssVariable: "--font-hanken",
            fallbacks: ["system-ui", "sans-serif"],
            options: { variants: [latin(hanken, "100 900", "normal")] },
        },
        {
            provider: fromFiles,
            name: "DM Mono",
            cssVariable: "--font-dm-mono",
            fallbacks: ["ui-monospace", "monospace"],
            options: {
                variants: [
                    latin(`${mono}-400-normal`, 400, "normal"),
                    latin(`${mono}-500-normal`, 500, "normal"),
                ],
            },
        },
    ],
});
