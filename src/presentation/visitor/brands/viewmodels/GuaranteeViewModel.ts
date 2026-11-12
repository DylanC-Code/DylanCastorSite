/** A run of the letter's text; `marked` runs are underlined in copper. */
export interface LetterRunViewModel {
    readonly text: string;
    readonly marked: boolean;
}

/** "On your store, my rules": the guarantee letter, signed and sealed. */
export interface GuaranteeViewModel {
    readonly title: string;
    readonly titleItalic: string;
    readonly lead: string;
    readonly over: string;
    readonly heading: string;
    readonly letter: readonly LetterRunViewModel[];
    readonly signedLabel: string;
    readonly signed: string;
    readonly seal: string;
}
