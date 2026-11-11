import {
    leaveTowards,
    skipUnlessLeaving,
} from "#/presentation/visitor/shared/floor_switcher/behaviour/pageLeave.ts";
import {
    openingFocus,
    planPick,
} from "#/presentation/visitor/shared/floor_switcher/state/switcherSteps.ts";

interface Switcher {
    root: HTMLElement;
    panel: HTMLElement;
    opener: HTMLButtonElement;
}

/**
 * Brings one switcher to life: its panel comes out of the template, its link
 * becomes a button. Escape, the scrim or the opener close it, focus going back
 * to the opener. Nothing is stored.
 */
export function initFloorSwitcher(root: HTMLElement): void {
    const template = root.querySelector("template");
    if (template === null) {
        return;
    }
    root.prepend(template.content.cloneNode(true));
    const panel = part(root, "[data-switcher-panel]");
    panel.id = `floors-panel-${root.dataset["design"] ?? ""}`;
    const switcher = { root, panel, opener: upgradeOpener(root, panel.id) };
    bindEvents(switcher);
    skipUnlessLeaving();
    setOpen(switcher, false, false);
}

function bindEvents(switcher: Switcher): void {
    switcher.opener.addEventListener("click", () => {
        setOpen(switcher, switcher.root.dataset["open"] !== "true");
    });
    part(switcher.root, "[data-switcher-scrim]").addEventListener(
        "click",
        () => {
            setOpen(switcher, false);
        },
    );
    document.addEventListener("keydown", (event) => {
        closeOnEscape(switcher, event);
    });
    switcher.panel.addEventListener("click", (event) => {
        pick(switcher, event);
    });
}

function upgradeOpener(root: HTMLElement, panelId: string): HTMLButtonElement {
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

function setOpen(switcher: Switcher, open: boolean, moveFocus = true): void {
    const { dataset } = switcher.root;
    dataset["open"] = String(open);
    switcher.opener.setAttribute("aria-expanded", String(open));
    switcher.panel.toggleAttribute("inert", !open);
    if (moveFocus) {
        focusAfter(switcher, open);
    }
}

function focusAfter(switcher: Switcher, open: boolean): void {
    if (!open) {
        switcher.opener.focus();
        return;
    }
    const links = [
        ...switcher.panel.querySelectorAll<HTMLAnchorElement>("a[data-floor]"),
    ];
    const target = openingFocus(
        links.map((link) => hrefOf(link)),
        currentHref(switcher),
    );
    links.find((link) => hrefOf(link) === target)?.focus();
}

function closeOnEscape(switcher: Switcher, event: KeyboardEvent): void {
    if (event.key === "Escape" && switcher.root.dataset["open"] === "true") {
        setOpen(switcher, false);
    }
}

function pick(switcher: Switcher, event: MouseEvent): void {
    const link = chosenLink(event);
    if (link === null) {
        return;
    }
    const order = (switcher.root.dataset["order"] ?? "").split(" ");
    const plan = planPick(order, currentHref(switcher), hrefOf(link));
    if (plan.kind === "close") {
        event.preventDefault();
        setOpen(switcher, false);
        return;
    }
    leaveTowards(switcher, { link, plan, event });
}

function chosenLink(event: MouseEvent): HTMLAnchorElement | null {
    const target =
        event.target instanceof Element
            ? event.target.closest("a[data-floor]")
            : null;
    return target instanceof HTMLAnchorElement ? target : null;
}

function currentHref(switcher: Switcher): string | null {
    const current = switcher.panel.querySelector<HTMLAnchorElement>(
        'a[aria-current="page"]',
    );
    return current === null ? null : hrefOf(current);
}

function hrefOf(link: HTMLAnchorElement): string {
    return link.getAttribute("href") ?? "";
}

function part(root: HTMLElement, selector: string): HTMLElement {
    const element = root.querySelector<HTMLElement>(selector);
    if (element === null) {
        throw new Error(`The floor switcher has no ${selector}`);
    }
    return element;
}
