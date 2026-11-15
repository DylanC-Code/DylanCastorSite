import {
    holdAfterClick,
    turnCrank,
    watchPriceNote,
} from "#/presentation/visitor/flicker/behaviour/lanternInvite.ts";
import {
    type Plate,
    type Session,
    sessionOf,
} from "#/presentation/visitor/flicker/behaviour/lanternSession.ts";
import {
    draw,
    sceneOf,
} from "#/presentation/visitor/flicker/behaviour/lanternView.ts";

function need(root: Element, mark: string): Element {
    const found = root.querySelector(`[data-${mark}]`);
    if (found === null) {
        throw new Error(`The plate has no ${mark}`);
    }
    return found;
}

function plateOf(root: HTMLElement): Plate {
    return {
        root,
        scene: sceneOf(need(root, "scene")),
        pen: need(root, "pen"),
        end: need(root, "end"),
        crank: need(root, "crank"),
    };
}

function isPress(event: Event): boolean {
    return (
        event instanceof KeyboardEvent
        && (event.key === "Enter" || event.key === " ")
    );
}

/**
 * Makes a drawn part a button (only with the script: without it the parts are
 * drawing), named from its `data-label`; Enter or Space works it.
 */
function pressable(element: Element, work: () => void): void {
    element.setAttribute("role", "button");
    element.setAttribute("tabindex", "0");
    const label =
        element instanceof SVGElement ? element.dataset["label"] : undefined;
    element.setAttribute("aria-label", label ?? "");
    element.addEventListener("click", work);
    element.addEventListener("keydown", (event) => {
        if (isPress(event)) {
            event.preventDefault();
            work();
        }
    });
}

function wireParts(root: HTMLElement, session: Session): void {
    for (const part of root.querySelectorAll<SVGElement>("[data-part]")) {
        const which = part.dataset["part"] === "open" ? "open" : "slide";
        pressable(part, () => {
            void session.act(which);
        });
    }
    holdAfterClick(root.querySelectorAll("[data-part]"));
}

function wireTabs(root: HTMLElement, session: Session): void {
    for (const tab of root.querySelectorAll<HTMLElement>("[data-way]")) {
        const way = tab.dataset["way"] === "clean" ? "clean" : "usual";
        tab.addEventListener("click", () => {
            session.begin(way);
        });
    }
}

/**
 * The lantern plate, alive: the parts move one at a time, the tabs start a way
 * with the red pen's loops, the crank starts again, each move rewrites the
 * caption, and both ways done raise the hand below. Without this script the
 * plate shows the scene at rest and its first caption, and no tabs.
 */
export function initLanternPlate(root: HTMLElement): void {
    const plate = plateOf(root);
    const session = sessionOf(plate);
    wireParts(root, session);
    wireTabs(root, session);
    pressable(plate.crank, () => {
        turnCrank(plate.crank, "is-spinning");
        session.begin(null);
    });
    watchPriceNote(root);
    draw(plate.scene, { open: 0, slide: 0, dial: 0 });
    const { dataset } = root;
    dataset["live"] = "";
}
