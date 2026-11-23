import type { KeyRun } from "#/presentation/visitor/shared/topic/presenters/keyRuns.ts";
import type { TopicTitle } from "#/presentation/visitor/shared/topic/viewmodels/TopicHeadViewModel.ts";
import type { Versioned } from "#/presentation/visitor/shared/topic/viewmodels/Versioned.ts";

/** A street stop: a title, a text with its key phrases, in two versions. */
export interface StreetTextViewModel {
    readonly title: TopicTitle;
    readonly text: Versioned<readonly KeyRun[]>;
}
