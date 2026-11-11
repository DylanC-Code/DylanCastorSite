import {
    type Browser,
    type BrowserContextOptions,
    chromium,
    type Page,
    type Route,
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

interface SiteOptions extends BrowserContextOptions {
    /** The switcher design, written into each page as the edge will. */
    switcher?: "card" | "shelf";
}

/**
 * Opens the built site (dist/) in Chromium, served as production serves it:
 * `/cro` answers `cro.html`. Nothing else is reachable.
 */
export async function openSite(options: SiteOptions): Promise<OpenedSite> {
    const { switcher = "card", ...context } = options;
    const browser = await chromium.launch();
    const opened = await browser.newContext(context);
    const foreign: string[] = [];
    await opened.route("**/*", async (route) => {
        const url = new URL(route.request().url());
        if (url.origin === siteUrl) {
            await serve(route, distPath(url.pathname), switcher);
            return;
        }
        foreign.push(url.href);
        await route.abort();
    });
    return { browser, page: await opened.newPage(), foreign };
}

async function serve(
    route: Route,
    path: string,
    switcher: string,
): Promise<void> {
    if (!path.endsWith(".html")) {
        await route.fulfill({ path });
        return;
    }
    const file = await fetch(new URL(`../${path}`, import.meta.url));
    const html = await file.text();
    await route.fulfill({
        contentType: "text/html; charset=utf-8",
        body: html.replace(
            'data-switcher="card"',
            `data-switcher="${switcher}"`,
        ),
    });
}

/** The file in dist/ that answers a path. */
function distPath(pathname: string): string {
    const file = pathname === "/" ? "index" : pathname.slice(1);
    return file.includes(".") ? `dist/${file}` : `dist/${file}.html`;
}
