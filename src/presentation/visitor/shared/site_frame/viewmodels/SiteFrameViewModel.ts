import type { FloorSwitcherViewModel } from "#/presentation/visitor/shared/floor_switcher/viewmodels/FloorSwitcherViewModel.ts";
import type { SiteFooterViewModel } from "#/presentation/visitor/shared/site_frame/viewmodels/SiteFooterViewModel.ts";
import type { SiteHeaderViewModel } from "#/presentation/visitor/shared/site_frame/viewmodels/SiteHeaderViewModel.ts";

export interface SiteFrameViewModel {
    readonly header: SiteHeaderViewModel;
    readonly footer: SiteFooterViewModel;
    readonly switcher: FloorSwitcherViewModel;
}
