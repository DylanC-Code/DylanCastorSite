/** One level of the house: its name and what the panel says about it. */
export interface HouseLevelViewModel {
    readonly name: string;
    readonly caption: string;
    readonly sentence: string;
    readonly points: readonly string[];
}

/** "Your store, front and back": the house, its four levels, their panels. */
export interface StoreHouseViewModel {
    readonly title: string;
    readonly titleItalic: string;
    readonly lead: string;
    /** The paper plate on the closed front, and the button that opens it. */
    readonly plate: string;
    readonly open: string;
    /** The street's two captions: above the line, under it. */
    readonly above: string;
    readonly below: string;
    /** Top to bottom: storefront, theme, apps, behind the store. */
    readonly levels: readonly HouseLevelViewModel[];
}
