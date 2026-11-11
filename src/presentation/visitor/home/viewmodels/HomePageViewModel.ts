import type { ContactCardViewModel } from "#/presentation/visitor/home/viewmodels/ContactCardViewModel.ts";
import type { FloorDirectoryViewModel } from "#/presentation/visitor/home/viewmodels/FloorDirectoryViewModel.ts";
import type { GettingAroundViewModel } from "#/presentation/visitor/home/viewmodels/GettingAroundViewModel.ts";
import type { ReaderShelfViewModel } from "#/presentation/visitor/home/viewmodels/ReaderShelfViewModel.ts";
import type { TitlePageViewModel } from "#/presentation/visitor/home/viewmodels/TitlePageViewModel.ts";

/** The home, section by section: each child receives its own part, whole. */
export interface HomePageViewModel {
    readonly titlePage: TitlePageViewModel;
    readonly floorDirectory: FloorDirectoryViewModel;
    readonly readerShelf: ReaderShelfViewModel;
    readonly gettingAround: GettingAroundViewModel;
    readonly contactCard: ContactCardViewModel;
}
