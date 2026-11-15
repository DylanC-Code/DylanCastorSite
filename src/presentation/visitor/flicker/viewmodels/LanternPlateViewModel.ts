/**
 * A caption: runs of words, `copper` in paper copper, `link` opens the price
 * note.
 */
export interface CaptionRun {
    readonly text: string;
    readonly tone: "plain" | "copper" | "link";
}

/** The lantern plate: its words, the two ways' names, every caption. */
export interface LanternPlateViewModel {
    readonly title: string;
    readonly ways: { readonly usual: string; readonly clean: string };
    readonly captions: Readonly<Record<string, readonly CaptionRun[]>>;
    readonly left: string;
    readonly pen: { readonly flick: string; readonly cleanEnd: string };
    readonly priceNote: { readonly title: string; readonly text: string };
    readonly labels: {
        readonly scene: string;
        readonly shutter: string;
        readonly slide: string;
        readonly crank: string;
        readonly slideLetters: readonly [string, string];
    };
    readonly marks: { readonly done: string; readonly left: string };
    readonly wide: {
        readonly open: string;
        readonly close: string;
        readonly turn: string;
        readonly noTurn: string;
    };
}
