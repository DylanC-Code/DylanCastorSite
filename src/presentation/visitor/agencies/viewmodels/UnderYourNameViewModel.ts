/** A name label: its small-caps caption and the name, set in italic. */
export interface NameLabelViewModel {
    readonly caption: string;
    readonly name: string;
}

/** One of the six terms: its icon's name, a title and a line. */
export interface TermViewModel {
    readonly icon: string;
    readonly title: string;
    readonly text: string;
}

/** "Under your name": the two labels, then the six terms of the work. */
export interface UnderYourNameViewModel {
    readonly title: string;
    /** "Built by", the label underneath, almost covered once the other lands. */
    readonly labelUnder: NameLabelViewModel;
    /** "Delivered by", the label laid over it. */
    readonly labelOver: NameLabelViewModel;
    readonly terms: readonly TermViewModel[];
    readonly icons: Readonly<Record<string, string>>;
}
