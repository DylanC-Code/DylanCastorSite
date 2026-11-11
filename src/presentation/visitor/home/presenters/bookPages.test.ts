import { describe, expect, it } from "vitest";

import { books } from "#/content/books.ts";
import {
    pagesOf,
    singleLeaves,
    spreadLeaves,
} from "#/presentation/visitor/home/presenters/bookPages.ts";
import type { BookViewModel } from "#/presentation/visitor/home/viewmodels/BookViewModel.ts";

function book(id: string): BookViewModel {
    const found = books.books.find((candidate) => candidate.id === id);
    if (found === undefined) {
        throw new Error(`No book ${id}`);
    }
    return found;
}

function backs(id: string): unknown[] {
    return spreadLeaves(pagesOf(book(id))).leaves.map((leaf) => leaf.back);
}

function fronts(id: string): unknown[] {
    return singleLeaves(pagesOf(book(id))).leaves.map((leaf) => leaf.front);
}

function folios(pages: ReturnType<typeof pagesOf>): number[] {
    return pages.map((page) => (page.kind === "contents" ? 1 : page.folio));
}

describe("pagesOf", () => {
    it("opens on the contents, then one page per step", () => {
        expect(folios(pagesOf(book("engineers")))).toEqual([1, 2, 3, 4, 5]);
    });
});

describe("spreadLeaves", () => {
    it("gives agencies one leaf and a fixed last page", () => {
        const { leaves, last } = spreadLeaves(pagesOf(book("agencies")));
        expect(leaves).toHaveLength(1);
        expect(last).toMatchObject({ kind: "step", folio: 3 });
    });

    it("gives engineers two leaves, steps on their backs", () => {
        expect(backs("engineers")).toMatchObject([{ folio: 2 }, { folio: 4 }]);
    });
});

describe("singleLeaves", () => {
    it("shows every page on its own, step I included", () => {
        expect(fronts("agencies")).toMatchObject([
            { kind: "contents" },
            { kind: "step", folio: 2 },
        ]);
        expect(singleLeaves(pagesOf(book("agencies"))).last).toMatchObject({
            folio: 3,
        });
    });
});
