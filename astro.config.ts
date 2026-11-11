import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, fontProviders } from "astro/config";

/**
 * Fonts come from npm packages pinned in bun.lock, never from a CDN: the build
 * needs no network, and visitors' browsers only ever call dylancastor.com.
 */
const fromPackages = fontProviders.npm({ remote: false });

export default defineConfig({
    site: "https://dylancastor.com",
    // One URL per page, no trailing slash: /cro/flicker-free-ab-tests is built
    // as cro/flicker-free-ab-tests.html, and canonicals and the sitemap agree.
    trailingSlash: "never",
    build: { format: "file" },
    integrations: [sitemap()],
    vite: { plugins: [tailwindcss()] },
    fonts: [
        {
            provider: fromPackages,
            name: "Bodoni Moda",
            cssVariable: "--font-bodoni",
            weights: ["400 500"],
            styles: ["normal"],
            fallbacks: ["Georgia", "serif"],
            options: {
                package: "@fontsource-variable/bodoni-moda",
                file: "opsz.css",
            },
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
