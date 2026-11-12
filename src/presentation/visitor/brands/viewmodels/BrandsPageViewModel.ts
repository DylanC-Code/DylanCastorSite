import type { GuaranteeViewModel } from "#/presentation/visitor/brands/viewmodels/GuaranteeViewModel.ts";
import type { LetterSlotViewModel } from "#/presentation/visitor/brands/viewmodels/LetterSlotViewModel.ts";
import type { StartDoorViewModel } from "#/presentation/visitor/brands/viewmodels/StartDoorViewModel.ts";
import type { StoreHouseViewModel } from "#/presentation/visitor/brands/viewmodels/StoreHouseViewModel.ts";
import type { PathHeroViewModel } from "#/presentation/visitor/shared/path_hero/viewmodels/PathHeroViewModel.ts";

/** The brands home, top to bottom: hero, house, guarantee, start, ask. */
export interface BrandsPageViewModel {
    readonly hero: PathHeroViewModel;
    readonly house: StoreHouseViewModel;
    readonly guarantee: GuaranteeViewModel;
    readonly start: StartDoorViewModel;
    readonly ask: LetterSlotViewModel;
}
