import type { LinkViewModel } from "#/presentation/shared/design_system/link/viewmodels/LinkViewModel.ts";

/** A title in two parts, the second set in italic. */
export type TopicTitle = readonly [string, string];

/** A topic's head: the way back to its floor, the title, the intro. */
export interface TopicHeadViewModel {
    readonly back: LinkViewModel;
    readonly title: TopicTitle;
    readonly intro: string;
}
