import booksJson from "#/content/books.json";
import type { ReaderShelfViewModel } from "#/presentation/visitor/home/viewmodels/ReaderShelfViewModel.ts";

/**
 * The three books of the home, from the books V2 handoff's `books.json`, kept
 * as delivered. Step texts and titles are Dylan's to correct, there only.
 */
export const books: ReaderShelfViewModel = booksJson;
