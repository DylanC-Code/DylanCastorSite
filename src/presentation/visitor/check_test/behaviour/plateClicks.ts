import { press } from "#/presentation/visitor/check_test/behaviour/plateEvents.ts";
import type { PlateSession } from "#/presentation/visitor/check_test/behaviour/plateSession.ts";
import {
    closeTicket,
    seeCorrected,
} from "#/presentation/visitor/check_test/state/plateState.ts";

/**
 * The plate's clicks: on the sheet (a mark, the lever), "Start again", and
 * anywhere on the page: the ticket's cross, "See it corrected", or a click away
 * from a ticket kept open.
 */
function within(element: Element | null, selector: string): boolean {
    return (element?.closest(selector) ?? null) !== null;
}

function closes(session: PlateSession, element: Element | null): boolean {
    const away = session.state().kept && !session.view.ticket.contains(element);
    return within(element, "[data-ticket-close]") || away;
}

function clickAnywhere(
    session: PlateSession,
    target: EventTarget | null,
): void {
    const element = target instanceof Element ? target : null;
    if (within(element, "[data-see-corrected]")) {
        session.apply(seeCorrected);
    } else if (closes(session, element)) {
        session.apply(closeTicket);
    }
}

export function bindClicks(session: PlateSession, signal: AbortSignal): void {
    const { plate, sheet } = session.view;
    sheet.addEventListener(
        "click",
        (event) => {
            press(session, event);
        },
        { signal },
    );
    plate.querySelector("[data-start-again]")?.addEventListener(
        "click",
        (event) => {
            event.stopPropagation();
            session.startAgain();
        },
        { signal },
    );
    document.addEventListener(
        "click",
        (event) => {
            clickAnywhere(session, event.target);
        },
        { signal },
    );
}
