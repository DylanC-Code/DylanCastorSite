import homeJson from "#/content/home.json";
import type { ContactCardViewModel } from "#/presentation/visitor/home/viewmodels/ContactCardViewModel.ts";
import type { FloorDirectoryViewModel } from "#/presentation/visitor/home/viewmodels/FloorDirectoryViewModel.ts";
import type { GettingAroundViewModel } from "#/presentation/visitor/home/viewmodels/GettingAroundViewModel.ts";
import type { TitlePageViewModel } from "#/presentation/visitor/home/viewmodels/TitlePageViewModel.ts";
import type { SiteFooterViewModel } from "#/presentation/visitor/shared/site_frame/viewmodels/SiteFooterViewModel.ts";
import type { SiteHeaderViewModel } from "#/presentation/visitor/shared/site_frame/viewmodels/SiteHeaderViewModel.ts";

/**
 * Every word of the home, from the design handoff's `home.json`, kept as
 * delivered. Typing it against the view models checks its shape at build time.
 */
interface HomeContent {
    readonly meta: { readonly title: string; readonly description: string };
    readonly header: SiteHeaderViewModel;
    readonly hero: TitlePageViewModel;
    readonly floors: FloorDirectoryViewModel;
    readonly tips: GettingAroundViewModel;
    readonly contact: ContactCardViewModel;
    readonly footer: SiteFooterViewModel;
}

export const home: HomeContent = homeJson;
