import type { LinkViewModel } from "#/presentation/shared/design_system/link/viewmodels/LinkViewModel.ts";

export interface ContactCardViewModel {
    readonly eyebrow: string;
    readonly titleStart: string;
    readonly titleItalic: string;
    readonly text: string;
    readonly button: LinkViewModel;
}
