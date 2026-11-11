/** One floor, as the switcher shows it on the card and on the shelf. */
export interface FloorViewModel {
    readonly id: string;
    readonly numeral: string;
    /** Present and true: the numeral is set in italic ("All"). */
    readonly numeralItalic?: boolean | undefined;
    readonly layer: string;
    readonly area: string;
    /** The area as the card writes it, when it differs ("Low-level, later"). */
    readonly cardArea?: string | undefined;
    /** The title on the volume's spine. */
    readonly spine: string;
    /** Present and true: not built yet, shown faded, not a link. */
    readonly comingLater?: boolean | undefined;
    readonly href: string;
    readonly shelf: {
        readonly leather: string;
        /** The leather's edge, ridge, body and deep stops. */
        readonly stops: readonly string[];
        readonly height: number;
        readonly width: number;
    };
}
