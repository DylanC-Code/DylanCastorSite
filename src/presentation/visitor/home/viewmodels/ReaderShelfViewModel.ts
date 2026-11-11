import type { BookViewModel } from "#/presentation/visitor/home/viewmodels/BookViewModel.ts";

/** The words of the books section that are not inside a book. */
interface BookLabelsViewModel {
    readonly contents: string;
    readonly back: string;
    readonly phoneHint: string;
    readonly coverFoot: string;
    /** A closed book's name: `{reader}` is replaced by the book's reader. */
    readonly openAria: string;
    readonly prevAria: string;
    readonly nextAria: string;
}

export interface ReaderShelfViewModel {
    readonly head: {
        readonly eyebrow: string;
        readonly title: string;
        readonly lead: string;
    };
    readonly labels: BookLabelsViewModel;
    readonly books: readonly BookViewModel[];
}
