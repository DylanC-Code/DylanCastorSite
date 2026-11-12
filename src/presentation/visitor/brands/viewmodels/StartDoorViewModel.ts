/** "How we start": the words, the shop door with its sign, the plate. */
export interface StartDoorViewModel {
    readonly title: string;
    readonly titleItalic: string;
    readonly sentence: string;
    /** The part of the sentence set in copper italic. */
    readonly emphasis: string;
    readonly text: string;
    /** The sign on the glass: small caps, then italic. */
    readonly sign: readonly [string, string];
    /** The enamel plate: small caps, then two lines. */
    readonly plate: readonly [string, string, string];
}
