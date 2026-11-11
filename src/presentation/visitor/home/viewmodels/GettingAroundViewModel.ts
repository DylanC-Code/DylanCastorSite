export interface GettingAroundViewModel {
    readonly eyebrow: string;
    readonly title: string;
    readonly items: readonly {
        readonly title: string;
        readonly text: string;
    }[];
}
