import type { BrowserContext } from "playwright";
import { describe, expect, it } from "vitest";

import { desktop, openSite, siteUrl } from "./servedSite.ts";

/**
 * Which pages search engines may list (launch decisions, section 8): the open
 * ones carry no noindex and are in the sitemap; the legal pages and the pages
 * being written carry noindex and are not.
 */
const open = [
    "/",
    "/agencies",
    "/cro",
    "/shopify-cro",
    "/shopify-cro/flicker-free-ab-tests",
];
const hidden = ["/legal", "/mentions-legales", "/engineering", "/development"];

const robots = `(document.querySelector('meta[name="robots"]') || { content: "listed" }).content`;

/** What a page tells search engines: "listed", or its robots words. */
async function robotsOf(
    context: BrowserContext,
    path: string,
): Promise<string> {
    const tab = await context.newPage();
    await tab.goto(`${siteUrl}${path}`, { waitUntil: "load" });
    return `${path} ${await tab.evaluate<string>(robots)}`;
}

function robotsOfAll(context: BrowserContext): Promise<string[]> {
    return Promise.all(
        [...open, ...hidden].map((path) => robotsOf(context, path)),
    );
}

const expected = [
    ...open.map((path) => `${path} listed`),
    ...hidden.map((path) => `${path} noindex`),
];

/** The page addresses a sitemap lists, without the site. */
function pathsIn(sitemap: string): string[] {
    const found = sitemap.matchAll(
        /<loc>https:\/\/dylancastor\.com([^<]*)<\/loc>/gu,
    );
    return [...found].map(([, path]) => String(path));
}

describe("what search engines may list", () => {
    it("opens five pages and hides the others", async () => {
        const site = await openSite(desktop);
        expect(await robotsOfAll(site.page.context())).toStrictEqual(expected);
        await site.browser.close();
    });

    it("lists exactly the open pages in the sitemap", async () => {
        const site = await openSite(desktop);
        await site.page.goto(siteUrl, { waitUntil: "load" });
        const sitemap = await site.page.evaluate<string>(
            'fetch("/sitemap-0.xml").then((answer) => answer.text())',
        );
        expect(pathsIn(sitemap)).toStrictEqual(open);
        await site.browser.close();
    });
});
