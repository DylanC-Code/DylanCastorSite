import type { FloorViewModel } from "#/presentation/visitor/shared/floor_switcher/viewmodels/FloorViewModel.ts";
import type { SwitcherPanelViewModel } from "#/presentation/visitor/shared/floor_switcher/viewmodels/SwitcherPanelViewModel.ts";

/**
 * A floor's accessible name in the panel, from the handoff's templates: "Go to
 * Architecture", "Development: you are here", "Low-level: coming later".
 */
export function rowName(
    floor: FloorViewModel,
    current: string | null,
    rowAria: SwitcherPanelViewModel["rowAria"],
): string {
    return templateFor(floor, current, rowAria).replace("{area}", floor.area);
}

/** What the card adds after the area, drawn beside it: ", later". */
export function areaSuffix(floor: FloorViewModel): string {
    const written = floor.cardArea ?? floor.area;
    return written.startsWith(floor.area)
        ? written.slice(floor.area.length)
        : "";
}

function templateFor(
    floor: FloorViewModel,
    current: string | null,
    rowAria: SwitcherPanelViewModel["rowAria"],
): string {
    if (floor.comingLater === true) {
        return rowAria.later;
    }
    return floor.id === current ? rowAria.here : rowAria.go;
}
