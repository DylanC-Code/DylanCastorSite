import type { PlateView } from "#/presentation/visitor/check_test/behaviour/plateView.ts";
import type { MarkId } from "#/presentation/visitor/check_test/state/plateState.ts";

/**
 * Where the open ticket goes. On a wide screen, 18px to the right of its mark,
 * centred on it; to its left if it would leave the sheet; never out of the
 * plate. On a phone it is fixed at the bottom of the screen: the page moves
 * only if the tapped mark would sit behind it, just enough to leave the mark
 * 16px above it.
 */
function markBox(view: PlateView, mark: MarkId): DOMRect | null {
    return (
        view.sheet
            .querySelector(`[data-mark="${mark}"] .mark-dot`)
            ?.getBoundingClientRect() ?? null
    );
}

function besideX(centre: number, width: number, room: number): number {
    const right = centre + 18;
    if (right + width <= room) {
        return right;
    }
    const left = centre - 18 - width;
    return left >= 0
        ? left
        : Math.max(0, Math.min(room - width, centre - width / 2));
}

function placeBeside(view: PlateView, dot: DOMRect): void {
    const plate = view.plate.getBoundingClientRect();
    const sheet = view.sheet.getBoundingClientRect();
    const { offsetWidth: width, offsetHeight: height } = view.ticket;
    const x = besideX(
        dot.left + dot.width / 2 - sheet.left,
        width,
        sheet.width,
    );
    const centreY = dot.top + dot.height / 2 - sheet.top;
    const y = Math.max(
        -10,
        Math.min(sheet.height - height + 40, centreY - height / 2),
    );
    view.ticket.style.setProperty("left", `${sheet.left - plate.left + x}px`);
    view.ticket.style.setProperty("top", `${sheet.top - plate.top + y}px`);
}

function keepInView(view: PlateView, dot: DOMRect): void {
    const behind =
        dot.bottom + 16 - (window.innerHeight - 8 - view.ticket.offsetHeight);
    if (behind > 1) {
        const still = window.matchMedia(
            "(prefers-reduced-motion: reduce)",
        ).matches;
        window.scrollBy({ top: behind, behavior: still ? "auto" : "smooth" });
    }
}

export function placeTicket(view: PlateView, mark: MarkId | null): void {
    const dot = mark === null ? null : markBox(view, mark);
    if (dot === null) {
        return;
    }
    if (view.phone) {
        keepInView(view, dot);
    } else {
        placeBeside(view, dot);
    }
}
