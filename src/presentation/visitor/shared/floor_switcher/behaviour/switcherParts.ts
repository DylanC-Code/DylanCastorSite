/** The switcher's pieces in the page, found or made. */

export function part(root: HTMLElement, selector: string): HTMLElement {
    const element = root.querySelector<HTMLElement>(selector);
    if (element === null) {
        throw new Error(`The floor switcher has no ${selector}`);
    }
    return element;
}

export function hrefOf(link: HTMLAnchorElement): string {
    return link.getAttribute("href") ?? "";
}

/** The opener's link (it works without script) becomes a button for its panel. */
export function upgradeOpener(
    root: HTMLElement,
    panelId: string,
): HTMLButtonElement {
    const link = part(root, "[data-switcher-opener]");
    const button = document.createElement("button");
    button.type = "button";
    button.className = link.className;
    button.setAttribute("aria-label", link.getAttribute("aria-label") ?? "");
    button.setAttribute("aria-controls", panelId);
    button.append(...link.childNodes);
    link.replaceWith(button);
    return button;
}

/**
 * The other buttons that open the floors (a closed floor's lift), when this
 * switcher is the design shown: the card, unless the page asks for the shelf.
 */
export function otherOpeners(root: HTMLElement): HTMLElement[] {
    const shown =
        document.documentElement.dataset["switcher"] === "shelf"
            ? "shelf"
            : "card";
    return root.dataset["design"] === shown
        ? [...document.querySelectorAll<HTMLElement>("[data-opens-floors]")]
        : [];
}
