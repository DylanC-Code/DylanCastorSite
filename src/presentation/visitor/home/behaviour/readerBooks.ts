import {
    restoreOnReturn,
    takeBookmark,
} from "#/presentation/visitor/home/behaviour/bookmarkPull.ts";
import {
    applyShelf,
    lastPage,
    moveFocus,
    readShelf,
    type ShelfView,
} from "#/presentation/visitor/home/behaviour/shelfView.ts";
import {
    type ShelfEvent,
    step,
} from "#/presentation/visitor/home/state/readerSteps.ts";

/**
 * The shelf of books. Without this script each cover is a link to its path;
 * here it becomes a button that opens the book, the arrows turn its pages,
 * Escape and the back link close it, ← and → turn too.
 */
export function initReaderBooks(root: HTMLElement): void {
    const view = {
        root,
        books: [...root.querySelectorAll<HTMLElement>("[data-book]")],
    };
    for (const book of view.books) {
        upgradeCover(view, book);
    }
    for (const hidden of root.querySelectorAll("[hidden]")) {
        hidden.removeAttribute("hidden");
    }
    bindControls(view);
    restoreOnReturn(root);
    applyShelf(view, { open: null, page: 0 });
}

function upgradeCover(view: ShelfView, book: HTMLElement): void {
    const link = book.querySelector<HTMLElement>("[data-cover]");
    if (link === null) {
        return;
    }
    const button = coverButton(link, book.dataset["label"] ?? "");
    button.addEventListener("click", () => {
        send(view, { type: "pick", id: book.dataset["book"] ?? "" });
    });
}

/** The cover link, rebuilt as a button holding the same board. */
function coverButton(link: HTMLElement, label: string): HTMLButtonElement {
    const button = document.createElement("button");
    button.type = "button";
    button.className = link.className;
    button.dataset["cover"] = "";
    button.setAttribute("aria-label", label);
    button.append(...link.childNodes);
    link.replaceWith(button);
    return button;
}

function bindControls(view: ShelfView): void {
    on(view, "[data-page-prev]", { type: "prev" });
    on(view, "[data-page-next]", { type: "next", lastPage: 0 });
    on(view, "[data-shelf-back]", { type: "close" });
    document.addEventListener("keydown", (event) => {
        keyTurn(view, event);
    });
    view.root.addEventListener("click", (event) => {
        takeBookmark(event);
    });
}

function on(view: ShelfView, selector: string, event: ShelfEvent): void {
    view.root.querySelector(selector)?.addEventListener("click", () => {
        send(view, event);
    });
}

const keys: Record<string, ShelfEvent> = {
    Escape: { type: "close" },
    ArrowLeft: { type: "prev" },
    ArrowRight: { type: "next", lastPage: 0 },
};

function keyTurn(view: ShelfView, event: KeyboardEvent): void {
    const action = keys[event.key];
    if (action !== undefined && readShelf(view.root).open !== null) {
        send(view, action);
    }
}

function send(view: ShelfView, event: ShelfEvent): void {
    const sized =
        event.type === "next" ? { ...event, lastPage: lastPage(view) } : event;
    const next = step(readShelf(view.root), sized);
    applyShelf(view, next.shelf);
    moveFocus(view, next.focus);
    if (next.followUp !== null) {
        const { after, event: following } = next.followUp;
        window.setTimeout(
            () => {
                send(view, following);
            },
            reducedMotion() ? 0 : after,
        );
    }
}

function reducedMotion(): boolean {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
