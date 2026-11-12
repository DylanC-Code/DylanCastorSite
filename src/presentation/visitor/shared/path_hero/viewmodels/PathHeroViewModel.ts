import type { LinkViewModel } from "#/presentation/shared/design_system/link/viewmodels/LinkViewModel.ts";

/** A reading path home's first screen: the words left, its open book right. */
export interface PathHeroViewModel {
    readonly eyebrow: string;
    readonly title: readonly [string, string];
    readonly lead: string;
    readonly button: LinkViewModel;
    readonly down: LinkViewModel;
    /**
     * On a phone, the link under the button (a long link) rather than beside
     * it.
     */
    readonly stackedActions: boolean;
}
