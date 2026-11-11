/** The ticket that follows the steps: its title part, stations and stub. */
export interface StepTicketViewModel {
    readonly title: string;
    readonly route: string;
    readonly stations: readonly string[];
    readonly stub: readonly [string, string];
    readonly tabLabel: string;
    /** The stations' nav name for assistive tech. */
    readonly navLabel: string;
}
