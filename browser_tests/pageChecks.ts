import axe from "axe-core";
import type { Page } from "playwright";

/**
 * Measures run inside the page. The scripts are strings: they run in the
 * browser, where nothing of this file exists.
 */
const axeRun = `axe
    .run(document, { runOnly: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "best-practice"] })
    .then((result) => result.violations.map((v) => v.id + " (" + v.nodes.length + "): " + v.help))`;

const layoutShiftSum = `new Promise((resolve) => {
    new PerformanceObserver((list) => {
        resolve(list.getEntries().reduce((sum, entry) => sum + entry.value, 0));
    }).observe({ type: "layout-shift", buffered: true });
    setTimeout(() => resolve(0), 500);
})`;

/** Every WCAG 2.1 A and AA problem axe finds, with best practices. */
export async function accessibilityProblems(page: Page): Promise<string[]> {
    await page.addScriptTag({ content: axe.source });
    return page.evaluate<string[]>(axeRun);
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
