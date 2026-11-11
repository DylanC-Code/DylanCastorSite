import floorsJson from "#/content/floors.json";
import type { FloorSwitcherViewModel } from "#/presentation/visitor/shared/floor_switcher/viewmodels/FloorSwitcherViewModel.ts";
import type { FloorViewModel } from "#/presentation/visitor/shared/floor_switcher/viewmodels/FloorViewModel.ts";
import type { SwitcherPanelViewModel } from "#/presentation/visitor/shared/floor_switcher/viewmodels/SwitcherPanelViewModel.ts";

/**
 * The floors and the switcher's words, from the switcher handoff's
 * `floors.json`, kept as delivered (the floor pages' hrefs filled in).
 */
interface FloorsContent {
    readonly panel: SwitcherPanelViewModel;
    readonly floors: readonly FloorViewModel[];
}

export const floorsContent: FloorsContent = {
    ...floorsJson,
    panel: {
        ...floorsJson.panel,
        pathLink: {
            label: floorsJson.panel.pathLink.label,
            href: floorsJson.panel.pathLink.href,
        },
    },
};

/**
 * The switcher of a page: on a floor, that floor is current; elsewhere none.
 * Without script, the opener leads to the home's floors.
 */
export function switcherFor(current: string | null): FloorSwitcherViewModel {
    return { ...floorsContent, current, fallbackHref: "/#floors" };
}
