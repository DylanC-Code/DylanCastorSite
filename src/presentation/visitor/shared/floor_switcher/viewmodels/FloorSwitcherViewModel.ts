import type { FloorViewModel } from "#/presentation/visitor/shared/floor_switcher/viewmodels/FloorViewModel.ts";
import type { SwitcherPanelViewModel } from "#/presentation/visitor/shared/floor_switcher/viewmodels/SwitcherPanelViewModel.ts";

export interface FloorSwitcherViewModel {
    readonly panel: SwitcherPanelViewModel;
    readonly floors: readonly FloorViewModel[];
    /** The floor this page is on; null on a page that is no floor. */
    readonly current: string | null;
    /** Where the opener leads without JavaScript: the home's floors. */
    readonly fallbackHref: string;
}
