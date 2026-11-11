/** What every step shows in its left column. */
export interface AgencyStepViewModel {
    readonly n: number;
    readonly title: string;
    readonly sentence: string;
    /** The words of the sentence set in copper italic. */
    readonly emphasis: string;
    /** Step 4 only: the line under the sentence. */
    readonly fix?: string | undefined;
}

/** A card or a sheet row: a word, its icon, a line. */
export interface IconLineViewModel {
    readonly word: string;
    readonly icon: string;
    readonly text: string;
}

export interface HandoverRowViewModel {
    readonly word: string;
    readonly icon: string;
    /** A sentence, or (Events) the event names set in a monospace face. */
    readonly sample: string | readonly string[];
    /** Present on the Off switch row: draw the toggle, on. */
    readonly drawing?: string | undefined;
    /** The locked sentence this row stands for, for assistive tech. */
    readonly locked: string;
}
