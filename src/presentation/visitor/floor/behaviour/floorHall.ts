import { initHallWalk } from "#/presentation/visitor/floor/behaviour/hallWalk.ts";
import { initPhoneRooms } from "#/presentation/visitor/floor/behaviour/phoneRooms.ts";
import { initTwoDoorsRooms } from "#/presentation/visitor/floor/behaviour/twoDoorsRoom.ts";
import { pointAsk } from "#/presentation/visitor/shared/path_memory/behaviour/askLinks.ts";
import { passPathOn } from "#/presentation/visitor/shared/path_memory/behaviour/pathVia.ts";

/** Pauses the lantern's smoke, dust and slide while the floor is off screen. */
function watchOnScreen(floor: HTMLElement): void {
    const observer = new IntersectionObserver(([entry]) => {
        const { dataset } = floor;
        dataset["onscreen"] = String(entry?.isIntersecting ?? true);
    });
    observer.observe(floor);
}

/**
 * A floor's hall, upgraded: the visitor walks to a room on desktop, the room in
 * the middle opens on a phone, the two doors room walks its visitors, and
 * "Write to me" finds the right ask. Without this script the lit room is a
 * plain link and nothing moves.
 */
export function initFloorHall(hall: HTMLElement): void {
    const floor = hall.querySelector<HTMLElement>("[data-floor]");
    if (floor === null) {
        return;
    }
    passPathOn(document);
    pointAsk(hall);
    watchOnScreen(floor);
    initHallWalk(floor);
    initPhoneRooms(hall, floor);
    initTwoDoorsRooms(floor);
}
