import type { FloorHallViewModel } from "#/presentation/visitor/floor/viewmodels/FloorHallViewModel.ts";

/** A closed curtain's title card: the floor's or path's name, "Coming later". */
export interface ClosedCardViewModel {
    readonly name: string;
    readonly later: string;
}

/**
 * A floor not written yet (closed floor handoff): floor I's head, sign and ask,
 * then one closed curtain across the floor with one card, and a line saying the
 * lift leads elsewhere.
 */
export interface ClosedFloorViewModel {
    readonly head: FloorHallViewModel["head"];
    readonly sign: FloorHallViewModel["sign"];
    readonly card: ClosedCardViewModel;
    /** Under the building on desktop; over the sign on a phone. */
    readonly line: { readonly desktop: string; readonly phone: string };
    /** The lift's name as a button: it opens the floors panel. */
    readonly liftLabel: string;
    readonly ask: FloorHallViewModel["ask"];
}
