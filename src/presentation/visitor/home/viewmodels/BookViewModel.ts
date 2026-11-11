/** One reader's book: its cover, then its first page's sentence and link. */
export interface BookViewModel {
    readonly id: string;
    readonly for: string;
    readonly titleLine1: string;
    readonly titleLine2: string;
    /** The leather: oxblood, green or midnight. */
    readonly tone: string;
    readonly href: string;
    readonly cta: string;
    /** Words, and the floor numerals set apart in copper. */
    readonly sentence: readonly (string | { readonly numeral: string })[];
}
