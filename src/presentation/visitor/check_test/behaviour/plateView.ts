import {
    markIds,
    type PlateState,
} from "#/presentation/visitor/check_test/state/plateState.ts";

/**
 * The plate as the state draws it: in the sheet shown (side by side, or one
 * under the other on a phone), the seen and open marks, the red ovals, the
 * lever, the end; around it the counter, "Start again", the sentence and the
 * one ticket open.
 */
export interface PlateView {
    readonly plate: HTMLElement;
    readonly sheet: SVGSVGElement;
    readonly ticket: HTMLElement;
    readonly phone: boolean;
}

function show(element: Element | null, shown: boolean): void {
    element?.toggleAttribute("hidden", !shown);
}

function drawMarks(sheet: SVGSVGElement, state: PlateState): void {
    for (const mark of sheet.querySelectorAll<SVGElement>("[data-mark]")) {
        const id = mark.dataset["mark"];
        const seen = markIds.some(
            (one) => one === id && state.seen.includes(one),
        );
        mark.classList.toggle("is-seen", seen);
        mark.classList.toggle("is-open", state.open === id);
        mark.setAttribute("aria-expanded", String(state.open === id));
        sheet
            .querySelector(`[data-ring="${id}"]`)
            ?.classList.toggle("is-seen", seen);
    }
}

function drawSheet(view: PlateView, state: PlateState): void {
    const { sheet } = view;
    sheet.classList.toggle("is-done", state.done);
    sheet.classList.toggle("is-off", state.leverOff);
    sheet
        .querySelector("[data-lever]")
        ?.setAttribute("aria-pressed", String(state.leverOff));
    drawMarks(sheet, state);
}

function drawWords(view: PlateView, state: PlateState): void {
    const { plate } = view;
    const counter = plate.dataset["counter"] ?? "{seen}";
    const count = plate.querySelector("[data-seen-count]");
    if (count !== null) {
        count.replaceChildren(
            counter.replace("{seen}", String(state.seen.length)),
        );
    }
    show(plate.querySelector("[data-start-again]"), state.done);
    show(plate.querySelector("[data-sentence-start]"), !state.done);
    show(plate.querySelector("[data-sentence-end]"), state.done);
}

function drawTicket(view: PlateView, state: PlateState): void {
    const { ticket } = view;
    show(ticket, state.open !== null);
    for (const card of ticket.querySelectorAll<HTMLElement>(
        "[data-ticket-for]",
    )) {
        const open = card.dataset["ticketFor"] === state.open;
        show(card, open);
        show(
            card.querySelector("[data-see-corrected]"),
            open && view.phone && state.seen.length === markIds.length,
        );
    }
}

export function drawPlate(view: PlateView, state: PlateState): void {
    drawSheet(view, state);
    drawWords(view, state);
    drawTicket(view, state);
}
