import { initLanternPlate } from "#/presentation/visitor/flicker/behaviour/lanternPlate.ts";
import { initWideView } from "#/presentation/visitor/flicker/behaviour/wideView.ts";
import { initCabinet } from "#/presentation/visitor/shared/topic/behaviour/cabinet.ts";
import { followPath } from "#/presentation/visitor/shared/topic/behaviour/topicPath.ts";

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
