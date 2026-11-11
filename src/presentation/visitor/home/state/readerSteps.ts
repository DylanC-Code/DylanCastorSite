/**
 * The shelf of books as a state machine: which book is open, and where focus
 * goes after each step. Escape, the back button and a click on the open cover
 * all send `close`.
 */
export type ShelfEvent = { type: "pick"; id: string } | { type: "close" };

/** Focus goes into a book's first page, back to a cover, or stays put. */
export type Focus = { page: string } | { cover: string } | null;

export interface Step {
    open: string | null;
    focus: Focus;
}

export function step(open: string | null, event: ShelfEvent): Step {
    return event.type === "pick" ? pick(open, event.id) : close(open);
}

function pick(open: string | null, id: string): Step {
    if (open === id) {
        return close(open);
    }
    return { open: id, focus: { page: id } };
}

function close(open: string | null): Step {
    return { open: null, focus: open === null ? null : { cover: open } };
}
