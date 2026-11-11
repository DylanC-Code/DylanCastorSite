import {
    type Browser,
    type BrowserContextOptions,
    chromium,
    type Page,
} from "playwright";

/** Where the built site answers, inside the test browser only. */
export const siteUrl = "http://dylancastor.test";

export const desktop = {
    name: "desktop",
    viewport: { width: 1440, height: 900 },
} as const;

export const phone = {
    name: "phone",
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
} as const;

export interface OpenedSite {
    browser: Browser;
    page: Page;
    /** Every request made to another host: refused, and kept here. */
    foreign: string[];
}

/**
 * Opens the built site (dist/) in Chromium, served as production serves it:
 * `/cro` answers `cro.html`. Nothing else is reachable.
 */
export async function openSite(
    options: BrowserContextOptions,
): Promise<OpenedSite> {
    const browser = await chromium.launch();
    const context = await browser.newContext(options);
    const foreign: string[] = [];
    await context.route("**/*", async (route) => {
        const url = new URL(route.request().url());
        if (url.origin !== siteUrl) {
            foreign.push(url.href);
            await route.abort();
            return;
        }
        await route.fulfill({ path: distPath(url.pathname) });
    });
    return { browser, page: await context.newPage(), foreign };
}

/** The file in dist/ that answers a path. */
function distPath(pathname: string): string {
    const file = pathname === "/" ? "index" : pathname.slice(1);
    return file.includes(".") ? `dist/${file}` : `dist/${file}.html`;
}
