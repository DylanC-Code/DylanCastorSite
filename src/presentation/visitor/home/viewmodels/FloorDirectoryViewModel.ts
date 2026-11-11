import type { FloorRowViewModel } from "#/presentation/visitor/home/viewmodels/FloorRowViewModel.ts";

export interface FloorDirectoryViewModel {
    readonly eyebrow: string;
    readonly title: string;
    readonly columns: readonly string[];
    readonly rows: readonly FloorRowViewModel[];
    /** The last row, for every floor: how I build software. */
    readonly method: {
        readonly numeralItalic: string;
        readonly area: string;
        readonly how: string;
    };
}
