import type { LinkViewModel } from "#/presentation/shared/design_system/link/viewmodels/LinkViewModel.ts";

/** The calling card: a name, then two lines. */
export interface CallingCardViewModel {
    readonly name: string;
    readonly lines: readonly string[];
}

/** "All floors · The method": the sentence and its link, the calling card. */
export interface MethodBandViewModel {
    /** The floor label, its first word set in Caslon ("All"). */
    readonly label: { readonly numeral: string; readonly rest: string };
    readonly sentence: string;
    readonly sentenceItalic: string;
    readonly link: LinkViewModel;
    readonly card: CallingCardViewModel;
}
