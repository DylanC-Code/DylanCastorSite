import { bindClicks } from "#/presentation/visitor/check_test/behaviour/plateClicks.ts";
import { bindSheet } from "#/presentation/visitor/check_test/behaviour/plateEvents.ts";
import { sessionOf } from "#/presentation/visitor/check_test/behaviour/plateSession.ts";

/**
 * The check plate, alive, in the sheet shown: one under the other below 768px,
 * side by side above. Its marks and its lever become buttons, its street starts
 * to walk. When the screen crosses 768px the plate starts again in the other
 * sheet, as the prototype does.
 */
const phoneQuery = "(max-width: 47.99rem)";

/** The marks and the lever: buttons in the sheet shown, nothing in the other. */
function wake(sheet: SVGSVGElement, awake: boolean): void {
    for (const part of sheet.querySelectorAll<SVGElement>(
        "[data-mark], [data-lever]",
    )) {
        if (awake) {
            part.setAttribute("role", "button");
            part.setAttribute("tabindex", "0");
            part.setAttribute("aria-label", part.dataset["label"] ?? "");
        } else {
            part.removeAttribute("role");
            part.removeAttribute("tabindex");
        }
    }
}

function shownSheet(plate: HTMLElement, phone: boolean): SVGSVGElement {
    const sheets = [...plate.querySelectorAll<SVGSVGElement>("[data-sheet]")];
    const shown = sheets.find(
        (one) => one.dataset["sheet"] === (phone ? "stack" : "desk"),
    );
    if (shown === undefined) {
        throw new Error("The check plate has no sheet for this screen");
    }
    sheets.forEach((one) => {
        wake(one, one === shown);
    });
    return shown;
}

function start(plate: HTMLElement, ticket: HTMLElement): () => void {
    const phone = window.matchMedia(phoneQuery).matches;
    const sheet = shownSheet(plate, phone);
    const session = sessionOf({ plate, sheet, ticket, phone });
    const stop = new AbortController();
    bindSheet(session, stop.signal);
    bindClicks(session, stop.signal);
    return () => {
        stop.abort();
        session.stop();
    };
}

export function initCheckPlate(plate: HTMLElement): void {
    const ticket = plate.querySelector<HTMLElement>("[data-ticket]");
    if (ticket === null) {
        return;
    }
    const memory = { stop: start(plate, ticket) };
    window.matchMedia(phoneQuery).addEventListener("change", () => {
        memory.stop();
        memory.stop = start(plate, ticket);
    });
}
