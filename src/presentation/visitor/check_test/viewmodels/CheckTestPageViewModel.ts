import type {
    CheckPlateViewModel,
    Door,
} from "#/presentation/visitor/check_test/viewmodels/CheckPlateViewModel.ts";
import type { DetailsCabinetViewModel } from "#/presentation/visitor/shared/topic/viewmodels/DetailsCabinetViewModel.ts";
import type { StreetTextViewModel } from "#/presentation/visitor/shared/topic/viewmodels/StreetStopViewModel.ts";
import type { TopicAskViewModel } from "#/presentation/visitor/shared/topic/viewmodels/TopicAskViewModel.ts";
import type {
    TopicHeadViewModel,
    TopicTitle,
} from "#/presentation/visitor/shared/topic/viewmodels/TopicHeadViewModel.ts";

/** The topic page "Checking a test before launch", top to bottom. */
export interface CheckTestPageViewModel {
    readonly head: TopicHeadViewModel;
    readonly plate: CheckPlateViewModel;
    /** "Six checks. Then the doors open.": the store with its six lamps. */
    readonly lamps: {
        readonly title: TopicTitle;
        readonly label: string;
        readonly storeName: string;
        readonly doors: readonly [Door, Door];
        readonly sign: string;
    };
    /** "After launch, your customers find it.": the counter back to zero. */
    readonly afterLaunch: StreetTextViewModel & {
        readonly label: string;
        readonly counter: string;
        readonly calendar: string;
        readonly leaves: readonly string[];
    };
    /** "What it means for you.": the written note, ticked and signed. */
    readonly forYou: StreetTextViewModel & {
        readonly label: string;
        readonly header: string;
        readonly lines: readonly string[];
        readonly signature: string;
    };
    readonly details: DetailsCabinetViewModel;
    readonly ask: TopicAskViewModel;
}
