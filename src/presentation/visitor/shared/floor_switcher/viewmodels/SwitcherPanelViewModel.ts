import type { LinkViewModel } from "#/presentation/shared/design_system/link/viewmodels/LinkViewModel.ts";

/** The words of the switcher outside the floors themselves. */
export interface SwitcherPanelViewModel {
    readonly title: string;
    readonly ariaLabel: string;
    readonly openerAriaLabel: string;
    readonly pathLink: LinkViewModel;
    /** Each row's name: `{area}` is replaced by the floor's area. */
    readonly rowAria: {
        readonly go: string;
        readonly here: string;
        readonly later: string;
    };
}
