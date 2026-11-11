import { describe, expect, it } from "vitest";

import { books } from "#/content/books.ts";
import {
    bookmarkLines,
    coverLines,
    forReader,
    withReader,
} from "#/presentation/visitor/home/presenters/bookNames.ts";
import type { BookViewModel } from "#/presentation/visitor/home/viewmodels/BookViewModel.ts";

function agencies(): BookViewModel {
    const found = books.books.find((candidate) => candidate.id === "agencies");
    if (found === undefined) {
        throw new Error("No agencies book");
    }
    return found;
}

describe("book names", () => {
    it("writes the dedication", () => {
        expect(forReader(agencies())).toBe("For CRO agencies");
    });

    it("splits the cover and the bookmark into their two lines", () => {
        expect(coverLines(agencies())).toEqual(["CRO", "agencies"]);
        expect(bookmarkLines(agencies())).toEqual(["Start with", "agencies"]);
    });

    it("names a closed book from the template", () => {
        expect(withReader(books.labels.openAria, agencies())).toBe(
            "For CRO agencies: open the book",
        );
    });
});
