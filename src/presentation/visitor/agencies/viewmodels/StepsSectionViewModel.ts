import type { LinkViewModel } from "#/presentation/shared/design_system/link/viewmodels/LinkViewModel.ts";
import type {
    AgencyStepViewModel,
    HandoverRowViewModel,
    IconLineViewModel,
} from "#/presentation/visitor/agencies/viewmodels/AgencyStepViewModel.ts";
import type { StepTicketViewModel } from "#/presentation/visitor/agencies/viewmodels/StepTicketViewModel.ts";

/** "Your first test, step by step": the head, the ticket, the five steps. */
export interface StepsSectionViewModel {
    readonly label: {
        readonly floor: string;
        readonly numeral: string;
        readonly rest: string;
    };
    readonly title: string;
    readonly ticket: StepTicketViewModel;
    readonly icons: Readonly<Record<string, string>>;
    readonly brief: AgencyStepViewModel & {
        readonly cap: string;
        readonly cards: readonly IconLineViewModel[];
    };
    readonly build: AgencyStepViewModel & {
        readonly labels: readonly [string, string];
        readonly marks: readonly [string, string];
        readonly note: string;
        readonly replay: string;
        readonly link: LinkViewModel;
        readonly page: {
            readonly name: string;
            readonly price: string;
            readonly badge: string;
            readonly buttonOriginal: string;
            readonly buttonVariant: string;
        };
    };
    readonly qa: AgencyStepViewModel & {
        readonly cap: string;
        readonly sheet: {
            readonly title: string;
            readonly tag: string;
            readonly rows: readonly HandoverRowViewModel[];
            readonly foot: string;
        };
    };
    readonly launch: AgencyStepViewModel & {
        readonly points: {
            readonly start: string;
            readonly ends: readonly [string, string];
            readonly foot: string;
        };
    };
    readonly winner: AgencyStepViewModel & {
        readonly sheet: {
            readonly title: string;
            readonly tag: string;
            readonly code: readonly string[];
            /** The same code, its long lines broken for a phone. */
            readonly phoneCode: readonly string[];
            readonly foot: string;
            readonly slip: string;
            readonly seal: string;
        };
    };
}
