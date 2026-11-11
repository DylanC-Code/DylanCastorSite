import type { SiteFooterViewModel } from "#/presentation/visitor/shared/site_frame/viewmodels/SiteFooterViewModel.ts";
import type { SiteHeaderViewModel } from "#/presentation/visitor/shared/site_frame/viewmodels/SiteHeaderViewModel.ts";

export interface SiteFrameViewModel {
    readonly header: SiteHeaderViewModel;
    readonly footer: SiteFooterViewModel;
}
