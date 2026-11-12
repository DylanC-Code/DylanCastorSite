import {
    clampLevel,
    houseLayout,
} from "#/presentation/visitor/brands/state/houseLayout.ts";

interface House {
    section: HTMLElement;
    drawing: HTMLElement;
    tabs: HTMLElement[];
    panels: HTMLElement[];
}

/** The keys that move the choice along the tablist, and where to. */
const moves: Readonly<Record<string, (k: number, last: number) => number>> = {
    ArrowDown: (k) => k + 1,
    ArrowRight: (k) => k + 1,
    ArrowUp: (k) => k - 1,
    ArrowLeft: (k) => k - 1,
    Home: () => 0,
    End: (_k, last) => last,
};

/** Shows level `k`: its tab, its panel, and the house's geometry for it. */
function choose(house: House, k: number): void {
    const layout = houseLayout(k);
    const { style } = house.drawing;
    style.setProperty("--street", `${layout.street}px`);
    style.setProperty("--cabin", `${layout.cabin}px`);
    style.setProperty("--needle", `${layout.needle}deg`);
    style.setProperty("--belt-top", `${layout.belt.top}px`);
    style.setProperty("--belt-bottom", `${layout.belt.bottom}px`);
    house.tabs.forEach((tab, index) => {
        tab.setAttribute("aria-selected", String(index === k));
        tab.setAttribute("tabindex", index === k ? "0" : "-1");
    });
    house.panels.forEach((panel, index) => {
        panel.classList.toggle("is-chosen", index === k);
    });
}

function chosenIndex(house: House): number {
    return house.tabs.findIndex(
        (tab) => tab.getAttribute("aria-selected") === "true",
    );
}

function onKey(house: House, event: KeyboardEvent): void {
    const move = moves[event.key];
    if (move === undefined) {
        return;
    }
    event.preventDefault();
    const k = clampLevel(move(chosenIndex(house), house.tabs.length - 1));
    choose(house, k);
    house.tabs[k]?.focus();
}

/**
 * Opens the house: the one trigger of the front (the button for now; it may
 * later also open by itself when the section comes into view).
 */
function openHouse(house: House): void {
    const { dataset } = house.drawing;
    dataset["open"] = "";
    reachable(house, "[data-house-levels]", true);
    reachable(house, "[data-house-open]", false);
    house.tabs[chosenIndex(house)]?.focus({ preventScroll: true });
}

/** Lets keyboard and assistive tech reach a part of the house, or not. */
function reachable(house: House, selector: string, on: boolean): void {
    house.drawing.querySelector(selector)?.toggleAttribute("inert", !on);
}

function reducedMotion(): boolean {
    return matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Closes the front, unless motion is reduced: then the house stays open. */
function closeFront(house: House): void {
    const front =
        house.drawing.querySelector<HTMLElement>("[data-house-front]");
    if (front === null || reducedMotion()) {
        return;
    }
    front.hidden = false;
    reachable(house, "[data-house-levels]", false);
    front.addEventListener("click", (event) => {
        if (isOpenButton(event.target)) {
            openHouse(house);
        }
    });
}

function isOpenButton(target: EventTarget | null): boolean {
    return (
        target instanceof Element
        && target.closest("[data-house-open]") !== null
    );
}

/** Pauses the scenes and the belt while the house is off screen. */
function watchOnScreen(drawing: HTMLElement): void {
    const observer = new IntersectionObserver(([entry]) => {
        const { dataset } = drawing;
        dataset["onscreen"] = String(entry?.isIntersecting ?? true);
    });
    observer.observe(drawing);
}

/**
 * The house: its levels are tabs (click, or arrow keys, Home and End), each
 * choice moving the heights, the street, the lift, the dial and the belt.
 */
export function initStoreHouse(section: HTMLElement): void {
    const drawing = section.querySelector<HTMLElement>("[data-house]");
    if (drawing === null) {
        return;
    }
    const house: House = {
        section,
        drawing,
        tabs: [...drawing.querySelectorAll<HTMLElement>('[role="tab"]')],
        panels: [...section.querySelectorAll<HTMLElement>('[role="tabpanel"]')],
    };
    house.tabs.forEach((tab, index) => {
        tab.addEventListener("click", () => {
            choose(house, index);
        });
    });
    drawing
        .querySelector("[data-house-levels]")
        ?.addEventListener("keydown", (event) => {
            if (event instanceof KeyboardEvent) {
                onKey(house, event);
            }
        });
    closeFront(house);
    watchOnScreen(drawing);
    const { dataset } = section;
    dataset["live"] = "";
}
