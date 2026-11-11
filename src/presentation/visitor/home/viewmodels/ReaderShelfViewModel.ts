import type { BookViewModel } from "#/presentation/visitor/home/viewmodels/BookViewModel.ts";

export interface ReaderShelfViewModel {
    readonly eyebrow: string;
    readonly title: string;
    readonly lead: string;
    readonly back: string;
    readonly books: readonly BookViewModel[];
    /** The name stamped at the foot of every cover. */
    readonly coverFoot: string;
    /** "For", before the reader's name on the first page. */
    readonly pageEyebrowPrefix: string;
}
