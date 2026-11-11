import type { LinkViewModel } from "#/presentation/shared/design_system/link/viewmodels/LinkViewModel.ts";

/** The agencies home's first screen: the words left, the open book right. */
export interface AgencyHeroViewModel {
    readonly eyebrow: string;
    readonly title: readonly [string, string];
    readonly lead: string;
    readonly button: LinkViewModel;
    readonly down: LinkViewModel;
}
