/** A text in two versions: for a visitor from the agencies or the brands home. */
export interface Versioned<T> {
    readonly agency: T;
    readonly brand: T;
}
