import type { BookViewModel } from "#/presentation/visitor/home/viewmodels/BookViewModel.ts";

/** "For CRO agencies": the book's dedication, capitalised. */
export function forReader(book: BookViewModel): string {
    return `${book.for.charAt(0).toUpperCase()}${book.for.slice(1)} ${book.reader}`;
}

/** The cover's two lines: "CRO" / "agencies". */
export function coverLines(book: BookViewModel): [string, string] {
    const [first = "", ...rest] = book.reader.split(" ");
    return [first, rest.join(" ")];
}

/** The bookmark's lines: "Start with" / "agencies", the arrow set apart. */
export function bookmarkLines(book: BookViewModel): [string, string] {
    const words = book.bookmark.replace(/\s*→$/u, "").split(" ");
    return [words.slice(0, 2).join(" "), words.slice(2).join(" ")];
}

/** A template's `{reader}` filled with the book's reader. */
export function withReader(template: string, book: BookViewModel): string {
    return template.replace("{reader}", book.reader);
}
