import type { LinkViewModel } from "#/presentation/shared/design_system/link/viewmodels/LinkViewModel.ts";

export interface SiteHeaderViewModel {
    readonly brand: string;
    readonly brandHref: string;
    readonly action: LinkViewModel;
}
