import type { LinkViewModel } from "#/presentation/shared/design_system/link/viewmodels/LinkViewModel.ts";

export interface TitlePageViewModel {
    readonly eyebrow: string;
    readonly titleLine1: string;
    readonly titleLine2Italic: string;
    readonly lead: string;
    readonly primary: LinkViewModel;
    readonly secondary: LinkViewModel;
    readonly foot: string;
}
