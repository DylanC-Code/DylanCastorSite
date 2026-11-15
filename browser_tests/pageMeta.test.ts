import type { BrowserContext, Page } from "playwright";
import { describe, expect, it } from "vitest";

import { desktop, openSite, siteUrl } from "./servedSite.ts";

/** What a page says about itself: in search results and in a shared link. */
const pages = [
    ["/", "Dylan Castor · Shopify & CRO engineer"],
    ["/agencies", "White-label test builds for CRO agencies · Dylan Castor"],
    ["/cro", "One developer for your whole store · Dylan Castor"],
    ["/shopify-cro", "Shopify & CRO · Dylan Castor"],
    [
        "/shopify-cro/flicker-free-ab-tests",
        "Flicker-free A/B tests · Dylan Castor",
    ],
    ["/legal", "Legal notice · Dylan Castor"],
    ["/mentions-legales", "Mentions légales · Dylan Castor"],
] as const;

const imageTags = `Object.fromEntries(
    [...document.querySelectorAll("meta[property^='og:image'], meta[name='twitter:card']")]
        .map((tag) => [tag.getAttribute("property") || tag.getAttribute("name"), tag.getAttribute("content")]))`;

/** The page's `<title>` and its shared link's title, side by side. */
async function titlesOf(tab: Page, path: string): Promise<string> {
    await tab.goto(`${siteUrl}${path}`, { waitUntil: "load" });
    const shared = await tab.getAttribute(
        'meta[property="og:title"]',
        "content",
    );
    return `${await tab.title()} | ${String(shared)}`;
}

/** Every page's titles, each page in its own tab. */
function allTitles(context: BrowserContext): Promise<string[]> {
    return Promise.all(
        pages.map(async ([path]) => titlesOf(await context.newPage(), path)),
    );
}

const expected = pages.map(([, title]) => `${title} | ${title}`);

describe("each page's head", () => {
    it("has its own title, matched by the shared link's title", async () => {
        const site = await openSite(desktop);
        expect(await allTitles(site.page.context())).toStrictEqual(expected);
        await site.browser.close();
    });

    it("shares one finished picture, by its full address", async () => {
        const site = await openSite(desktop);
        await site.page.goto(`${siteUrl}/cro`, { waitUntil: "load" });
        expect(await site.page.evaluate(imageTags)).toStrictEqual({
            "og:image": "https://dylancastor.com/shareImage.png",
            "og:image:width": "1200",
            "og:image:height": "630",
            "og:image:alt": "Dylan Castor, Shopify & CRO engineer",
            "twitter:card": "summary_large_image",
        });
        expect(
            await site.page.evaluate<string>(
                'fetch("/shareImage.png").then((answer) => answer.headers.get("content-type"))',
            ),
        ).toBe("image/png");
        await site.browser.close();
    });
});
