import axe from "axe-core";
import type { Page } from "playwright";

/**
 * Measures run inside the page. The scripts are strings: they run in the
 * browser, where nothing of this file exists.
 */
function axeRun(context: string): string {
    return `axe
    .run(${context}, { runOnly: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "best-practice"] })
    .then((result) => result.violations.map((v) => v.id + " (" + v.nodes.length + "): " + v.help))`;
}

const layoutShiftSum = `new Promise((resolve) => {
    new PerformanceObserver((list) => {
        resolve(list.getEntries().reduce((sum, entry) => sum + entry.value, 0));
    }).observe({ type: "layout-shift", buffered: true });
    setTimeout(() => resolve(0), 500);
})`;

/** Every WCAG 2.1 A and AA problem axe finds, with best practices. */
export async function accessibilityProblems(
    page: Page,
    selector?: string,
): Promise<string[]> {
    await page.addScriptTag({ content: axe.source });
    const context =
        selector === undefined ? "document" : JSON.stringify(selector);
    return page.evaluate<string[]>(axeRun(context));
}

/** The page's cumulative layout shift so far. */
export function layoutShift(page: Page): Promise<number> {
    return page.evaluate<number>(layoutShiftSum);
}

/** How far the page is wider than the screen, in pixels. */
export function sideOverflow(page: Page): Promise<number> {
    return page.evaluate<number>(
        "document.documentElement.scrollWidth - document.documentElement.clientWidth",
    );
}

/** The `id` of the focused element, or of the book it sits in. */
export function focused(page: Page): Promise<string> {
    return page.evaluate<string>(
        `(document.activeElement?.id || document.activeElement?.closest("[data-book]")?.dataset.book) ?? ""`,
    );
}

/** Scrolls to the bottom and back, so every entrance has played. */
export async function scrollThrough(page: Page): Promise<void> {
    await page.evaluate<number>(
        "window.scrollTo(0, document.body.scrollHeight), document.body.scrollHeight",
    );
    await page.waitForTimeout(300);
    await page.evaluate<number>("window.scrollTo(0, 0), 0");
}

/** The `href` of every element a selector matches, in page order. */
export function hrefs(
    page: Page,
    selector: string,
): Promise<(string | null)[]> {
    return page
        .locator(selector)
        .evaluateAll((links) => links.map((link) => link.getAttribute("href")));
}

/** The `href` of the focused element, or "" when it has none. */
export function focusedHref(page: Page): Promise<string> {
    return page.evaluate<string>(
        `document.activeElement?.getAttribute("href") ?? ""`,
    );
}

/**
 * Where an anchor's target sits after a jump: its gap under the sticky header,
 * and how far an element (the books' stage) runs past the bottom of the
 * screen.
 */
export async function landing(
    page: Page,
    target: string,
    mustFit: string,
): Promise<{ gap: number; cut: number }> {
    const header = await box(page, "body > header");
    const top = await box(page, target);
    const fit = await box(page, mustFit);
    const height = page.viewportSize()?.height ?? 0;
    return {
        gap: Math.round(top.y - header.y - header.height),
        cut: Math.max(0, Math.round(fit.y + fit.height - height)),
    };
}

async function box(
    page: Page,
    selector: string,
): Promise<{ y: number; height: number }> {
    const found = await page.locator(selector).first().boundingBox();
    if (found === null) {
        throw new Error(`Nothing on screen for ${selector}`);
    }
    return found;
}

/** True when focus sits on a book's contents page. */
export function onContents(page: Page): Promise<boolean> {
    return page.evaluate<boolean>(
        `document.activeElement?.hasAttribute("data-contents") ?? false`,
    );
}
