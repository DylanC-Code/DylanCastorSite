/** A row of a book's contents page: a floor, and what the reader finds there. */
interface ContentsRowViewModel {
    readonly numeral: string;
    readonly floor: string;
    readonly tag: string;
}

/** A step page: one floor of the reader's path, told to that reader. */
export interface StepViewModel {
    readonly numeral: string;
    readonly floor: string;
    readonly text: string;
    /** "On this floor: …", only where a topic exists; null otherwise. */
    readonly note: string | null;
}

/** One reader's book: its cover, its contents, its steps, and its bookmark. */
export interface BookViewModel {
    readonly id: string;
    readonly for: string;
    readonly reader: string;
    /** The leather: oxblood, green or midnight. */
    readonly leather: string;
    /** The leather's light, base and dark stops. */
    readonly leatherStops: readonly string[];
    readonly href: string;
    readonly bookmark: string;
    readonly title: string;
    readonly contents: readonly ContentsRowViewModel[];
    readonly steps: readonly StepViewModel[];
}
