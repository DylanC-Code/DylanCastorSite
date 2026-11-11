import type {
    BookViewModel,
    StepViewModel,
} from "#/presentation/visitor/home/viewmodels/BookViewModel.ts";

/** A page of a book: its contents page, or one step, with its folio. */
export type BookPage =
    | { readonly kind: "contents" }
    | {
          readonly kind: "step";
          readonly step: StepViewModel;
          readonly folio: number;
      };

/** A leaf on the spine: a right page in front, the next left page behind. */
export interface Leaf {
    readonly front: BookPage;
    readonly back: BookPage | null;
}

/**
 * Every page of a book in reading order: the contents (folio 1), then each
 * step.
 */
export function pagesOf(book: BookViewModel): BookPage[] {
    return [
        { kind: "contents" },
        ...book.steps.map((step, index) => ({
            kind: "step" as const,
            step,
            folio: index + 2,
        })),
    ];
}

/**
 * Two-page spreads (768px and up): pages pair into leaves, front and back, and
 * the last right page stays fixed. Agencies: 1 leaf; engineers: 2.
 */
export function spreadLeaves(pages: readonly BookPage[]): {
    leaves: Leaf[];
    last: BookPage | undefined;
} {
    const leaves = pages.flatMap((front, index) => leafAt(pages, front, index));
    return { leaves, last: pages.length % 2 === 1 ? pages.at(-1) : undefined };
}

/** The leaf starting at an even page, if a page follows it. */
function leafAt(
    pages: readonly BookPage[],
    front: BookPage,
    index: number,
): Leaf[] {
    const back = pages[index + 1];
    return index % 2 === 0 && back !== undefined ? [{ front, back }] : [];
}

/** One page at a time (phones): each page its own leaf, blank behind. */
export function singleLeaves(pages: readonly BookPage[]): {
    leaves: Leaf[];
    last: BookPage | undefined;
} {
    return {
        leaves: pages.slice(0, -1).map((front) => ({ front, back: null })),
        last: pages.at(-1),
    };
}
