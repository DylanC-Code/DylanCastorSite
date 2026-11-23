import { initCabinet } from "#/presentation/visitor/shared/topic/behaviour/cabinet.ts";
import { followPath } from "#/presentation/visitor/shared/topic/behaviour/topicPath.ts";

/**
 * The check page, alive: the visitor's version of the words, the ask's link and
 * the cabinet.
 */
export function initCheckPage(page: HTMLElement): void {
    followPath(page);
    const cabinet = page.querySelector<HTMLElement>("[data-cabinet]");
    if (cabinet !== null) {
        initCabinet(cabinet);
    }
}
