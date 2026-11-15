import type { ClosedCardViewModel } from "#/presentation/visitor/floor/viewmodels/ClosedFloorViewModel.ts";

/**
 * A reading path not written yet (the engineering home): its eyebrow, its
 * book's title (the second part in italic), and one closed curtain.
 */
export interface ClosedPathViewModel {
    readonly eyebrow: string;
    readonly title: readonly [string, string];
    readonly card: ClosedCardViewModel;
}
