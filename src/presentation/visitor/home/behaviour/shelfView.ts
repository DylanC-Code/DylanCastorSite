import type {
    Focus,
    Shelf,
} from "#/presentation/visitor/home/state/readerSteps.ts";

export interface ShelfView {
    root: HTMLElement;
    books: HTMLElement[];
}

/** Two-page spreads from 768px; one page at a time below. */
function sheetsShown(): "spread" | "single" {
    return window.matchMedia("(min-width: 48rem)").matches
        ? "spread"
        : "single";
}

export function readShelf(root: HTMLElement): Shelf {
    const open = root.dataset["open"] ?? "";
    return {
        open: open === "" ? null : open,
        page: Number(root.dataset["page"] ?? 0),
    };
}

/** The last page a book can turn to, in the layout on screen now. */
export function lastPage(view: ShelfView): number {
    const book = bookOf(view, readShelf(view.root).open);
    if (book === undefined) {
        return 0;
    }
    return book.querySelectorAll(`[data-sheets="${sheetsShown()}"] [data-leaf]`)
        .length;
}

/** Puts the page in the shelf's state: open book, turned leaves, controls. */
export function applyShelf(view: ShelfView, shelf: Shelf): void {
    const { dataset } = view.root;
    dataset["open"] = shelf.open ?? "";
    dataset["page"] = String(shelf.page);
    view.root.classList.toggle("has-open", shelf.open !== null);
    for (const book of view.books) {
        applyBook(book, shelf);
    }
    applyControls(view, shelf);
}

function applyControls(view: ShelfView, shelf: Shelf): void {
    const open = shelf.open !== null;
    control(part(view.root, "[data-page-prev]"), open && shelf.page > 0);
    control(
        part(view.root, "[data-page-next]"),
        open && shelf.page < lastPage(view),
    );
    control(part(view.root, "[data-shelf-back]"), open);
    for (const bookmark of view.root.querySelectorAll<HTMLElement>(
        "[data-bookmark]",
    )) {
        control(bookmark, bookmark.dataset["bookmark"] === shelf.open);
    }
}

function applyBook(book: HTMLElement, shelf: Shelf): void {
    const isOpen = book.dataset["book"] === shelf.open;
    book.classList.toggle("is-open", isOpen);
    book.toggleAttribute("inert", shelf.open !== null && !isOpen);
    const cover = part(book, "[data-cover]");
    cover.setAttribute("aria-expanded", String(isOpen));
    cover.toggleAttribute("inert", isOpen);
    for (const leaf of book.querySelectorAll<HTMLElement>("[data-leaf]")) {
        leaf.classList.toggle(
            "is-turned",
            isOpen && Number(leaf.dataset["leaf"]) < shelf.page,
        );
    }
}

/** Shows or hides a control: hidden ones fade and leave the tab order. */
function control(element: HTMLElement, shown: boolean): void {
    element.classList.toggle("is-shown", shown);
    element.toggleAttribute("inert", !shown);
}

export function moveFocus(view: ShelfView, focus: Focus): void {
    if (focus === null) {
        return;
    }
    focusTarget(view, focus)?.focus({ preventScroll: true });
}

function focusTarget(
    view: ShelfView,
    focus: NonNullable<Focus>,
): HTMLElement | null {
    const id = "contents" in focus ? focus.contents : focus.cover;
    const book = bookOf(view, id);
    if (book === undefined) {
        return null;
    }
    const selector =
        "contents" in focus
            ? `[data-sheets="${sheetsShown()}"] [data-contents]`
            : "[data-cover]";
    return book.querySelector<HTMLElement>(selector);
}

function bookOf(view: ShelfView, id: string | null): HTMLElement | undefined {
    return view.books.find((book) => book.dataset["book"] === id);
}

function part(root: HTMLElement, selector: string): HTMLElement {
    const element = root.querySelector<HTMLElement>(selector);
    if (element === null) {
        throw new Error(`The shelf has no ${selector}`);
    }
    return element;
}
