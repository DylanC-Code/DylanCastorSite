/** The note's form: its labels, placeholders and button. */
export interface NoteFieldsViewModel {
    readonly messageLabel: string;
    readonly messagePlaceholder: string;
    readonly replyLabel: string;
    readonly replyPlaceholder: string;
    readonly fromLabel: string;
    readonly fromPlaceholder: string;
    readonly send: string;
}

/** "Have a task for your store?": the words and the door's letter slot. */
export interface LetterSlotViewModel {
    readonly title: string;
    readonly titleItalic: string;
    readonly text: string;
    /** "Or" then the email link ("email me directly"). */
    readonly plain: { readonly before: string; readonly label: string };
    readonly emailHref: string;
    readonly fields: NoteFieldsViewModel;
    /** The word engraved on the flap. */
    readonly flap: string;
    /** What the small letter says ("To Dylan Castor"). */
    readonly letter: string;
    /** The card once sent: small caps, then two lines. */
    readonly sent: readonly [string, string, string];
    readonly again: string;
    readonly errors: { readonly replyTo: string; readonly failed: string };
}
