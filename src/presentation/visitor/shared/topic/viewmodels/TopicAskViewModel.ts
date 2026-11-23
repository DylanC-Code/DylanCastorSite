import type { TopicTitle } from "#/presentation/visitor/shared/topic/viewmodels/TopicHeadViewModel.ts";
import type { Versioned } from "#/presentation/visitor/shared/topic/viewmodels/Versioned.ts";

/**
 * The question at the end of a topic page, in the visitor's version, and where
 * "Write to me" goes for each reading path.
 */
export interface TopicAskViewModel {
    readonly title: Versioned<TopicTitle>;
    readonly link: string;
    readonly href: string;
    readonly byPath: Readonly<Record<string, string>>;
    readonly label: string;
}
