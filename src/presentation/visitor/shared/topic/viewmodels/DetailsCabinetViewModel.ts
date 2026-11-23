import type { KeyRun } from "#/presentation/visitor/shared/topic/presenters/keyRuns.ts";
import type { TopicTitle } from "#/presentation/visitor/shared/topic/viewmodels/TopicHeadViewModel.ts";
import type { Versioned } from "#/presentation/visitor/shared/topic/viewmodels/Versioned.ts";

interface DrawerViewModel {
    readonly label: string;
    readonly question: string;
    readonly answer: Versioned<readonly KeyRun[]>;
}

/** "The details, if you want them": any number of drawers, each a note. */
export interface DetailsCabinetViewModel {
    readonly title: TopicTitle;
    readonly hint: string;
    readonly drawers: readonly DrawerViewModel[];
}
