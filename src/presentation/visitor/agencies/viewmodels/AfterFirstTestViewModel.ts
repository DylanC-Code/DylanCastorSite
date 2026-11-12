/** The monthly pass: its band, its title and two captioned cells. No number. */
export interface MonthlyPassViewModel {
    readonly band: string;
    readonly title: string;
    readonly cells: readonly (readonly [string, string])[];
}

/** "After the first test": the words left, the monthly pass right. */
export interface AfterFirstTestViewModel {
    readonly title: string;
    readonly sentence: string;
    /** The part of the sentence set in copper italic. */
    readonly emphasis: string;
    readonly text: string;
    readonly pass: MonthlyPassViewModel;
}
