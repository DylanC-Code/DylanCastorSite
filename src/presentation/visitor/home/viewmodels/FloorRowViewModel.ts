/** One floor of the directory board. */
export interface FloorRowViewModel {
    readonly numeral: string;
    readonly area: string;
    readonly layer: string;
    readonly how: string;
    /** Present and true: the floor is shown faded, not built yet. */
    readonly comingLater?: boolean | undefined;
}
