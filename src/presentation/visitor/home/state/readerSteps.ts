/**
 * The shelf of books as a state machine: which book is open, at which page,
 * where focus goes, and what follows after a pause. Closing on a later page
 * turns the leaves back first; picking another book closes this one first.
 */
export interface Shelf {
    readonly open: string | null;
    readonly page: number;
}

export type ShelfEvent =
    | { readonly type: "pick"; readonly id: string }
    | { readonly type: "close" }
    | { readonly type: "next"; readonly lastPage: number }
    | { readonly type: "prev" };

/** Focus goes to a book's contents, back to a cover, or stays put. */
export type Focus =
    | { readonly contents: string }
    | { readonly cover: string }
    | null;

export interface Step {
    readonly shelf: Shelf;
    readonly focus: Focus;
    /** What happens next, once the motion has played. */
    readonly followUp: {
        readonly after: number;
        readonly event: ShelfEvent;
    } | null;
}

export const turnBackPause = 950;
export const switchPause = 1800;

const closed: Shelf = { open: null, page: 0 };

export function step(shelf: Shelf, event: ShelfEvent): Step {
    if (event.type === "pick") {
        return pick(shelf, event.id);
    }
    if (event.type === "close") {
        return close(shelf);
    }
    return { shelf: turn(shelf, event), focus: null, followUp: null };
}

function pick(shelf: Shelf, id: string): Step {
    if (shelf.open === null) {
        return {
            shelf: { open: id, page: 0 },
            focus: { contents: id },
            followUp: null,
        };
    }
    if (shelf.open === id) {
        return close(shelf);
    }
    return {
        ...close(shelf),
        followUp: { after: switchPause, event: { type: "pick", id } },
    };
}

function close(shelf: Shelf): Step {
    if (shelf.open === null) {
        return { shelf, focus: null, followUp: null };
    }
    if (shelf.page > 0) {
        return {
            shelf: { open: shelf.open, page: 0 },
            focus: null,
            followUp: { after: turnBackPause, event: { type: "close" } },
        };
    }
    return { shelf: closed, focus: { cover: shelf.open }, followUp: null };
}

function turn(
    shelf: Shelf,
    event: Extract<ShelfEvent, { type: "next" | "prev" }>,
): Shelf {
    if (shelf.open === null) {
        return shelf;
    }
    const page =
        event.type === "next"
            ? Math.min(shelf.page + 1, event.lastPage)
            : Math.max(shelf.page - 1, 0);
    return { ...shelf, page };
}
