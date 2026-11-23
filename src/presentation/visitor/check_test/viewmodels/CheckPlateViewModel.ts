import type { MarkId } from "#/presentation/visitor/check_test/state/plateState.ts";
import type { KeyRun } from "#/presentation/visitor/shared/topic/presenters/keyRuns.ts";
import type { TopicTitle } from "#/presentation/visitor/shared/topic/viewmodels/TopicHeadViewModel.ts";

/** One of the six marks, and the ticket it opens. */
export interface PlateMarkViewModel {
    readonly number: number;
    readonly id: MarkId;
    readonly check: string;
    readonly markLabel: string;
    /** The fault, its key words in red. */
    readonly fault: readonly KeyRun[];
    /** How it is checked, its key words in bold. */
    readonly howICheck: readonly KeyRun[];
}

/** A door of the store: its letter and its word. */
export interface Door {
    readonly letter: string;
    readonly word: string;
}

/** The words written on the sheet itself. */
export interface SheetWordsViewModel {
    readonly label: string;
    readonly sides: { readonly store: string; readonly test: string };
    readonly store: {
        readonly desktop: string;
        readonly phone: string;
        readonly storeName: string;
        readonly product: string;
        readonly price: string;
        readonly stock: string;
        readonly button: string;
        readonly cartCount: string;
    };
    readonly street: {
        readonly entrance: TopicTitle;
        readonly storeName: string;
        readonly doors: readonly [Door, Door];
        readonly signpost: TopicTitle;
        readonly counter: string;
        readonly lever: {
            readonly label: string;
            readonly on: string;
            readonly off: string;
        };
        readonly countedTwice: string;
    };
    readonly stamp: string;
    readonly marks: readonly PlateMarkViewModel[];
}

/** The check plate: its line, the sheet, the sentence, the tickets. */
export interface CheckPlateViewModel {
    readonly instruction: { readonly desktop: string; readonly phone: string };
    /** "{seen} of 6". */
    readonly counter: string;
    readonly startAgain: string;
    readonly sheet: SheetWordsViewModel;
    readonly sentence: {
        readonly start: string;
        readonly end: readonly KeyRun[];
    };
    readonly ticket: {
        readonly checkLabel: string;
        readonly close: string;
        readonly seeCorrected: string;
    };
}
