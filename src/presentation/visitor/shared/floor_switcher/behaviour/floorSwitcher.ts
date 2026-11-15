import {
    leaveTowards,
    skipUnlessLeaving,
} from "#/presentation/visitor/shared/floor_switcher/behaviour/pageLeave.ts";
import {
    hrefOf,
    otherOpeners,
    part,
    upgradeOpener,
} from "#/presentation/visitor/shared/floor_switcher/behaviour/switcherParts.ts";
import {
    openingFocus,
    planPick,
} from "#/presentation/visitor/shared/floor_switcher/state/switcherSteps.ts";

interface Switcher {
    root: HTMLElement;
    panel: HTMLElement;
    opener: HTMLButtonElement;
    /** Every button that opens it: its opener, and a closed floor's lift. */
    openers: HTMLElement[];
}

/** Where focus goes back when a switcher closes: the button that opened it. */
const openedBy = new WeakMap<HTMLElement, HTMLElement>();

/**
 * Brings one switcher to life: its panel comes out of the template, its link
 * becomes a button. Escape, the scrim or the opener close it, focus going back
 * to what opened it (the opener, or a closed floor's lift). Nothing is stored.
 */
export function initFloorSwitcher(root: HTMLElement): void {
    const template = root.querySelector("template");
    if (template === null) {
        return;
    }
    const switcher = switcherOf(root, template);
    bindEvents(switcher);
    bindOthers(switcher);
    skipUnlessLeaving();
    setOpen(switcher, false, false);
}

/** The panel out of its template, named; the opener a button for it. */
function switcherOf(
    root: HTMLElement,
    template: HTMLTemplateElement,
): Switcher {
    root.prepend(template.content.cloneNode(true));
    const panel = part(root, "[data-switcher-panel]");
    panel.id = `floors-panel-${root.dataset["design"] ?? ""}`;
    const opener = upgradeOpener(root, panel.id);
    return { root, panel, opener, openers: [opener, ...otherOpeners(root)] };
}

function bindEvents(switcher: Switcher): void {
    switcher.opener.addEventListener("click", () => {
        openedBy.set(switcher.root, switcher.opener);
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

/** A closed floor's lift opens the panel too, and gets the focus back. */
function bindOthers(switcher: Switcher): void {
    for (const other of switcher.openers.slice(1)) {
        other.setAttribute("aria-controls", switcher.panel.id);
        other.addEventListener("click", () => {
            openedBy.set(switcher.root, other);
            setOpen(switcher, true);
        });
    }
}

function setOpen(switcher: Switcher, open: boolean, moveFocus = true): void {
    const { dataset } = switcher.root;
    dataset["open"] = String(open);
    for (const opener of switcher.openers) {
        opener.setAttribute("aria-expanded", String(open));
    }
    switcher.panel.toggleAttribute("inert", !open);
    if (moveFocus) {
        focusAfter(switcher, open);
    }
}

function focusAfter(switcher: Switcher, open: boolean): void {
    if (!open) {
        (openedBy.get(switcher.root) ?? switcher.opener).focus();
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
