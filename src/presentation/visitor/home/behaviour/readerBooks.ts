import {
    type Focus,
    type ShelfEvent,
    step,
} from "#/presentation/visitor/home/state/readerSteps.ts";

interface Shelf {
    root: HTMLElement;
    books: HTMLElement[];
}

/**
 * The shelf of books. Without this script each cover is a link to its path;
 * here it becomes a button that opens the book. While a book is open on a wide
 * screen the other two are inert; a closed book's first page always is. The
 * marbled endpaper loads on the first open, never with the page.
 */
export function initReaderBooks(root: HTMLElement): void {
    const shelf = {
        root,
        books: [...root.querySelectorAll<HTMLElement>("[data-book]")],
    };
    for (const book of shelf.books) {
        upgradeCover(shelf, book);
    }
    root.querySelector("[data-shelf-back]")?.addEventListener("click", () => {
        send(shelf, { type: "close" });
    });
    root.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            send(shelf, { type: "close" });
        }
    });
    render(shelf, null);
}

function upgradeCover(shelf: Shelf, book: HTMLElement): void {
    const link = part(book, "cover");
    const button = document.createElement("button");
    button.type = "button";
    button.className = link.className;
    button.dataset["cover"] = "";
    button.setAttribute("aria-controls", part(book, "leaf").id);
    button.append(...link.childNodes);
    link.replaceWith(button);
    button.addEventListener("click", () => {
        send(shelf, { type: "pick", id: idOf(book) });
    });
}

function send(shelf: Shelf, event: ShelfEvent): void {
    const next = step(openOf(shelf), event);
    if (next.open !== null) {
        shelf.root.classList.add("endpaper-ready");
    }
    render(shelf, next.open);
    moveFocus(shelf, next.focus);
}

function render(shelf: Shelf, open: string | null): void {
    const { dataset } = shelf.root;
    dataset["open"] = open ?? "";
    shelf.root.classList.toggle("has-open", open !== null);
    const lockOthers = othersLocked(open);
    for (const book of shelf.books) {
        renderBook(book, idOf(book) === open, lockOthers);
    }
}

/** On wide screens the books not chosen step aside and go inert. */
function othersLocked(open: string | null): boolean {
    return open !== null && window.matchMedia("(min-width: 48rem)").matches;
}

function renderBook(
    book: HTMLElement,
    isOpen: boolean,
    lockOthers: boolean,
): void {
    book.classList.toggle("is-open", isOpen);
    book.toggleAttribute("inert", lockOthers && !isOpen);
    const cover = part(book, "cover");
    cover.setAttribute("aria-expanded", String(isOpen));
    const action = isOpen ? "close" : "open";
    cover.setAttribute(
        "aria-label",
        `${book.dataset["label"] ?? ""}: ${action} the book`,
    );
    part(book, "leaf").toggleAttribute("inert", !isOpen);
}

function moveFocus(shelf: Shelf, focus: Focus): void {
    if (focus === null) {
        return;
    }
    const [id, name]: [string, "cover" | "leaf"] =
        "page" in focus ? [focus.page, "leaf"] : [focus.cover, "cover"];
    const book = shelf.books.find((candidate) => idOf(candidate) === id);
    if (book !== undefined) {
        part(book, name).focus({ preventScroll: true });
    }
}

function openOf(shelf: Shelf): string | null {
    const open = shelf.root.dataset["open"];
    return open === undefined || open === "" ? null : open;
}

function idOf(book: HTMLElement): string {
    return book.dataset["book"] ?? "";
}

function part(book: HTMLElement, name: "cover" | "leaf"): HTMLElement {
    const element = book.querySelector<HTMLElement>(`[data-${name}]`);
    if (element === null) {
        throw new Error(`A book without its ${name}`);
    }
    return element;
}
