import { initCheckPlate } from "#/presentation/visitor/check_test/behaviour/checkPlate.ts";
import { playOnceInView } from "#/presentation/visitor/check_test/behaviour/playOnce.ts";
import { initCabinet } from "#/presentation/visitor/shared/topic/behaviour/cabinet.ts";
import { followPath } from "#/presentation/visitor/shared/topic/behaviour/topicPath.ts";

/**
 * The check page, alive: the visitor's version of the words, the ask's link,
 * the plate, the engravings that play once and the cabinet.
 */
export function initCheckPage(page: HTMLElement): void {
    followPath(page);
    const plate = page.querySelector<HTMLElement>("[data-check-plate]");
    if (plate !== null) {
        initCheckPlate(plate);
    }
    playOnceInView(page);
    const cabinet = page.querySelector<HTMLElement>("[data-cabinet]");
    if (cabinet !== null) {
        initCabinet(cabinet);
    }
}
