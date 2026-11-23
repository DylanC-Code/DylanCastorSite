import type { LanternPlateViewModel } from "#/presentation/visitor/flicker/viewmodels/LanternPlateViewModel.ts";
import type { DetailsCabinetViewModel } from "#/presentation/visitor/shared/topic/viewmodels/DetailsCabinetViewModel.ts";
import type { StreetTextViewModel } from "#/presentation/visitor/shared/topic/viewmodels/StreetStopViewModel.ts";
import type { TopicAskViewModel } from "#/presentation/visitor/shared/topic/viewmodels/TopicAskViewModel.ts";
import type {
    TopicHeadViewModel,
    TopicTitle,
} from "#/presentation/visitor/shared/topic/viewmodels/TopicHeadViewModel.ts";

/** The topic page "Flicker-free A/B tests", top to bottom. */
export interface FlickerPageViewModel {
    readonly head: TopicHeadViewModel;
    readonly plate: LanternPlateViewModel;
    readonly cue: string;
    readonly signpost: {
        readonly title: TopicTitle;
        readonly boards: TopicTitle;
        readonly captions: TopicTitle;
        readonly label: string;
    };
    readonly shop: StreetTextViewModel & {
        readonly sign: string;
        readonly label: string;
    };
    readonly workshop: StreetTextViewModel & {
        readonly plaque: TopicTitle;
        readonly hangingSign: TopicTitle;
        readonly label: string;
    };
    readonly details: DetailsCabinetViewModel;
    readonly ask: TopicAskViewModel;
}
