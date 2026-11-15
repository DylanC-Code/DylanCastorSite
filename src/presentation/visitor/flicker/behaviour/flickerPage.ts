import { initCabinet } from "#/presentation/visitor/flicker/behaviour/cabinet.ts";
import { initLanternPlate } from "#/presentation/visitor/flicker/behaviour/lanternPlate.ts";
import { initWideView } from "#/presentation/visitor/flicker/behaviour/wideView.ts";
import {
    cameFromAgencies,
    pointAsk,
} from "#/presentation/visitor/shared/path_memory/behaviour/askLinks.ts";
import { passPathOn } from "#/presentation/visitor/shared/path_memory/behaviour/pathVia.ts";

/** The agency wording, put in place for a visitor from the agencies home. */
function useAgencyWording(page: HTMLElement): void {
    if (!cameFromAgencies()) {
        return;
    }
    for (const text of page.querySelectorAll("[data-versioned]")) {
        const template = text.querySelector("template");
        if (template !== null) {
            text.replaceChildren(template.content.cloneNode(true));
        }
    }
}

/** The hand under the plate scrolls to the signpost. */
function wireCue(page: HTMLElement): void {
    const cue = page.querySelector("[data-cue]");
    const signpost = page.querySelector("#signpost");
    const smooth = !matchMedia("(prefers-reduced-motion: reduce)").matches;
    cue?.addEventListener("click", () => {
        signpost?.scrollIntoView({
            behavior: smooth ? "smooth" : "auto",
            block: "start",
        });
    });
}

/** The visitor's path: passed on, its wording, its ask. */
function followPath(page: HTMLElement): void {
    passPathOn(document);
    useAgencyWording(page);
    pointAsk(page);
}

/**
 * The flicker page, alive: the visitor's version of the three texts, the ask's
 * link, the lantern plate, the hand, the cabinet and, on a phone, the plate's
 * wide view.
 */
export function initFlickerPage(page: HTMLElement): void {
    followPath(page);
    const plate = page.querySelector<HTMLElement>("[data-plate]");
    if (plate !== null) {
        initLanternPlate(plate);
        initWideView(plate);
    }
    wireCue(page);
    const cabinet = page.querySelector<HTMLElement>("[data-cabinet]");
    if (cabinet !== null) {
        initCabinet(cabinet);
    }
}
