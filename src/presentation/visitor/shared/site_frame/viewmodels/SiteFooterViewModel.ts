import type { LinkViewModel } from "#/presentation/shared/design_system/link/viewmodels/LinkViewModel.ts";

export interface SiteFooterViewModel {
    /**
     * "Dylan Castor · Legal notice": the words after the dot link to the
     * notice.
     */
    readonly left: string;
    readonly legalHref: string;
    readonly right: LinkViewModel;
}
