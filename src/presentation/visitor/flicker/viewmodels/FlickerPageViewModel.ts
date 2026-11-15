import type { LinkViewModel } from "#/presentation/shared/design_system/link/viewmodels/LinkViewModel.ts";
import type { KeyRun } from "#/presentation/visitor/flicker/presenters/keyRuns.ts";
import type { LanternPlateViewModel } from "#/presentation/visitor/flicker/viewmodels/LanternPlateViewModel.ts";
import type { Versioned } from "#/presentation/visitor/flicker/viewmodels/Versioned.ts";

type Title = readonly [string, string];

/** A street stop: a title, a text with its key phrases, in two versions. */
export interface StreetTextViewModel {
    readonly title: Title;
    readonly text: Versioned<readonly KeyRun[]>;
}

interface DrawerViewModel {
    readonly label: string;
    readonly question: string;
    readonly answer: Versioned<readonly KeyRun[]>;
}

/** The topic page "Flicker-free A/B tests", top to bottom. */
export interface FlickerPageViewModel {
    readonly head: {
        readonly back: LinkViewModel;
        readonly title: Title;
        readonly intro: string;
    };
    readonly plate: LanternPlateViewModel;
    readonly cue: string;
    readonly signpost: {
        readonly title: Title;
        readonly boards: Title;
        readonly captions: Title;
        readonly label: string;
    };
    readonly shop: StreetTextViewModel & {
        readonly sign: string;
        readonly label: string;
    };
    readonly workshop: StreetTextViewModel & {
        readonly plaque: Title;
        readonly hangingSign: Title;
        readonly label: string;
    };
    readonly details: {
        readonly title: Title;
        readonly hint: string;
        readonly drawers: readonly DrawerViewModel[];
    };
    readonly ask: {
        readonly title: Versioned<Title>;
        readonly link: string;
        readonly href: string;
        readonly byPath: Readonly<Record<string, string>>;
        readonly label: string;
    };
}
