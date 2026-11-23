import type { CheckPlateViewModel } from "#/presentation/visitor/check_test/viewmodels/CheckPlateViewModel.ts";
import type { DetailsCabinetViewModel } from "#/presentation/visitor/shared/topic/viewmodels/DetailsCabinetViewModel.ts";
import type { TopicAskViewModel } from "#/presentation/visitor/shared/topic/viewmodels/TopicAskViewModel.ts";
import type { TopicHeadViewModel } from "#/presentation/visitor/shared/topic/viewmodels/TopicHeadViewModel.ts";

/** The topic page "Checking a test before launch", top to bottom. */
export interface CheckTestPageViewModel {
    readonly head: TopicHeadViewModel;
    readonly plate: CheckPlateViewModel;
    readonly details: DetailsCabinetViewModel;
    readonly ask: TopicAskViewModel;
}
