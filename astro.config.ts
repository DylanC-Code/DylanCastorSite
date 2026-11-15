import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, fontProviders } from "astro/config";

import books from "./src/content/books.json" with { type: "json" };
import floors from "./src/content/floors.json" with { type: "json" };

/**
 * Fonts come from npm packages pinned in bun.lock, never from a CDN: the build
 * needs no network, and visitors' browsers only ever call dylancastor.com.
 */
const fromPackages = fontProviders.npm({ remote: false });

/**
 * The reading paths' and the floors' pages and the topics under a floor are
 * marked noindex until they are written: the sitemap leaves them out too.
 */
const placeholders = new Set(
    [...books.books, ...floors.floors].map(
        (page) => new URL(page.href, "https://dylancastor.com").href,
    ),
);

const topicsUnder = floors.floors.map(
    (floor) => new URL(`${floor.href}/`, "https://dylancastor.com").href,
);

function isWritten(page: string): boolean {
    return (
        !placeholders.has(page)
        && !topicsUnder.some((floor) => page.startsWith(floor))
    );
}

export default defineConfig({
    site: "https://dylancastor.com",
    // One URL per page, no trailing slash: /cro/flicker-free-ab-tests is built
    // as cro/flicker-free-ab-tests.html, and canonicals and the sitemap agree.
    trailingSlash: "never",
    build: { format: "file" },
    integrations: [sitemap({ filter: isWritten })],
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
