import type { PlateSession } from "#/presentation/visitor/check_test/behaviour/plateSession.ts";
import {
    closeTicket,
    focusMark,
    hoverMark,
    leaveMark,
    type MarkId,
    markIds,
    pressMark,
    pullLever,
} from "#/presentation/visitor/check_test/state/plateState.ts";

/**
 * What the visitor does on the sheet. A mouse shows a ticket while it rests on
 * a mark (wide screens only); a click, a tap, Enter or Space keeps it open or
 * closes it; focus keeps it open; Escape closes it. The lever is a button too.
 */
function markOf(target: EventTarget | null): MarkId | null {
    const mark =
        target instanceof Element ? target.closest("[data-mark]") : null;
    const id = mark instanceof SVGElement ? mark.dataset["mark"] : undefined;
    return markIds.find((one) => one === id) ?? null;
}

function onLever(target: EventTarget | null): boolean {
    return target instanceof Element && target.closest("[data-lever]") !== null;
}

/** The mark under a mouse, on a wide screen; a finger never hovers. */
function mouseMark(event: PointerEvent, phone: boolean): MarkId | null {
    return event.pointerType === "mouse" && !phone
        ? markOf(event.target)
        : null;
}

function hovering(session: PlateSession, signal: AbortSignal): void {
    const { sheet, phone } = session.view;
    sheet.addEventListener(
        "pointerover",
        (event) => {
            const mark = mouseMark(event, phone);
            if (mark !== null) {
                session.apply((state) => hoverMark(state, mark));
            }
        },
        { signal },
    );
    sheet.addEventListener(
        "pointerout",
        (event) => {
            const leaving = mouseMark(event, phone) !== null;
            if (leaving && markOf(event.relatedTarget) === null) {
                session.apply(leaveMark);
            }
        },
        { signal },
    );
}

/** A click, a tap, Enter or Space on a mark or the lever. */
export function press(session: PlateSession, event: Event): void {
    const mark = markOf(event.target);
    if (onLever(event.target)) {
        session.apply(pullLever);
    } else if (mark !== null) {
        event.stopPropagation();
        session.apply((state) => pressMark(state, mark));
    }
}

function keys(session: PlateSession, signal: AbortSignal): void {
    session.view.sheet.addEventListener(
        "keydown",
        (event) => {
            if (event.key === "Escape") {
                session.apply(closeTicket);
            } else if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                press(session, event);
            }
        },
        { signal },
    );
}

function focusing(session: PlateSession, signal: AbortSignal): void {
    session.view.sheet.addEventListener(
        "focusin",
        (event) => {
            const mark = markOf(event.target);
            const byKeys =
                event.target instanceof Element
                && event.target.matches(":focus-visible");
            if (mark !== null && byKeys) {
                session.apply((state) => focusMark(state, mark));
            }
        },
        { signal },
    );
}

export function bindSheet(session: PlateSession, signal: AbortSignal): void {
    hovering(session, signal);
    keys(session, signal);
    focusing(session, signal);
}
