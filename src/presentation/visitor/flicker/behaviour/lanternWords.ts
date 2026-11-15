import type {
    Caption,
    Lantern,
    Way,
} from "#/presentation/visitor/flicker/state/lanternState.ts";

/** A copy of the caption template `key`, from the plate's own words. */
function copyOf(plate: HTMLElement, key: string): DocumentFragment {
    const template = plate.querySelector(`template[data-caption-for="${key}"]`);
    if (!(template instanceof HTMLTemplateElement)) {
        return new DocumentFragment();
    }
    const fragment = template.content.cloneNode(true);
    return fragment instanceof DocumentFragment
        ? fragment
        : new DocumentFragment();
}

/**
 * Writes the caption after a move (fading in), with the red line if a way was
 * left.
 */
export function say(
    plate: HTMLElement,
    caption: Caption | "hello",
    left: boolean,
): void {
    const line = plate.querySelector<HTMLElement>("[data-caption]");
    if (line === null) {
        return;
    }
    line.replaceChildren(copyOf(plate, caption));
    if (left) {
        line.append(copyOf(plate, "left"));
    }
    line.classList.remove("is-new");
    void line.offsetWidth;
    line.classList.add("is-new");
}

/** A tab's state: chosen, left, done, or at rest. */
function tabState(lantern: Lantern, way: Way): string {
    if (lantern.intent === way) {
        return "on";
    }
    if (lantern.left === way) {
        return "left";
    }
    return lantern.done[way] ? "done" : "off";
}

/** Shows each tab's state (✓ done, ↺ left, chosen in red). */
export function markTabs(plate: HTMLElement, lantern: Lantern): void {
    for (const tab of plate.querySelectorAll<HTMLElement>("[data-way]")) {
        const way = tab.dataset["way"] === "clean" ? "clean" : "usual";
        const { dataset } = tab;
        dataset["state"] = tabState(lantern, way);
        tab.setAttribute("aria-pressed", String(lantern.intent === way));
    }
}
