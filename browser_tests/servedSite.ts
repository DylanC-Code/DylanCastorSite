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

export const laptop = {
    name: "laptop",
    viewport: { width: 1280, height: 720 },
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
    /** What the forms posted to the form Worker's address. */
    posted: unknown[];
}

interface SiteOptions extends BrowserContextOptions {
    /** The switcher design: the card, or the shelf kept for later. */
    switcher?: "card" | "shelf";
    /** How the form Worker answers: sent (204) or refused (400, the default). */
    mail?: "sent" | "refused";
}

/**
 * Opens the built site (dist/) in Chromium, served as production serves it:
 * `/cro` answers `cro.html`, and `/api/message` stands for the form Worker.
 * Nothing else is reachable.
 */
export async function openSite(options: SiteOptions): Promise<OpenedSite> {
    const { switcher = "card", mail = "refused", ...context } = options;
    const browser = await chromium.launch();
    const opened = await browser.newContext(context);
    const foreign: string[] = [];
    const posted: unknown[] = [];
    await opened.route("**/*", async (route) => {
        const url = new URL(route.request().url());
        if (url.origin === siteUrl) {
            await (url.pathname === "/api/message"
                ? answerForm(route, mail, posted)
                : serve(route, distPath(url.pathname), switcher));
            return;
        }
        foreign.push(url.href);
        await route.abort();
    });
    return { browser, page: await opened.newPage(), foreign, posted };
}

/** The form Worker's answer: sent or refused, the posted body kept. */
async function answerForm(
    route: Route,
    mail: "sent" | "refused",
    posted: unknown[],
): Promise<void> {
    posted.push(route.request().postDataJSON());
    await route.fulfill({ status: mail === "sent" ? 204 : 400 });
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
        body: withSwitcher(html, switcher),
    });
}

/**
 * The page as built (the card), or with the shelf asked for, as development
 * does.
 */
function withSwitcher(html: string, switcher: string): string {
    return switcher === "shelf"
        ? html.replace("<html ", '<html data-switcher="shelf" ')
        : html;
}

/** The file in dist/ that answers a path. */
function distPath(pathname: string): string {
    const file = pathname === "/" ? "index" : pathname.slice(1);
    return file.includes(".") ? `dist/${file}` : `dist/${file}.html`;
}
