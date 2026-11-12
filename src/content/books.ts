import booksJson from "#/content/books.json";
import brandsJson from "#/content/brands.json";
import type { BookViewModel } from "#/presentation/visitor/home/viewmodels/BookViewModel.ts";
import type { ReaderShelfViewModel } from "#/presentation/visitor/home/viewmodels/ReaderShelfViewModel.ts";

/**
 * The three books of the home, from the books V2 handoff's `books.json`, kept
 * as delivered. The green book's words (title, chapters, pages, bookmark) come
 * from the brands handoff's `brands.json` (decided 12 Nov 2026), so the root
 * home and `/cro` show the same book. Words are corrected there only.
 */
const { title, cta, chapters } = brandsJson.book;

const brandsWords = {
    title,
    bookmark: cta,
    contents: chapters.map(({ floor, area, tag }) => ({
        numeral: floor,
        floor: area,
        tag,
    })),
    steps: chapters.map((chapter) => ({
        numeral: chapter.floor,
        floor: chapter.area,
        text: chapter.page,
        note: "topic" in chapter ? chapter.topic : null,
    })),
};

type Entry = (typeof booksJson.books)[number];

/** A book of `books.json` that carries its own words (all but the green one). */
function hasWords(entry: Entry): entry is Entry & typeof brandsWords {
    return entry.title !== undefined;
}

function bookOf(entry: Entry): BookViewModel {
    return hasWords(entry) ? entry : { ...entry, ...brandsWords };
}

export const books: ReaderShelfViewModel = {
    ...booksJson,
    books: booksJson.books.map((entry) => bookOf(entry)),
};
