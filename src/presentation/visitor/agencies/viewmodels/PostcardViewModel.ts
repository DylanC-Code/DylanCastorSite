import type { FormErrorsViewModel } from "#/presentation/visitor/shared/message/viewmodels/FormErrorsViewModel.ts";
import type { NoScriptEmailViewModel } from "#/presentation/visitor/shared/message/viewmodels/NoScriptEmailViewModel.ts";

/**
 * The postcard: a front to turn, a writing side (a real form), and the envelope
 * it becomes once the message is really sent.
 */
export interface PostcardViewModel {
    readonly front: {
        readonly caption: string;
        readonly title: string;
        readonly titleItalic: string;
        readonly action: string;
        /** What pressing the front does, for assistive tech. */
        readonly description: string;
    };
    readonly back: {
        readonly messageLabel: string;
        readonly messagePlaceholder: string;
        readonly toLabel: string;
        readonly to: string;
        readonly replyLabel: string;
        readonly replyPlaceholder: string;
        readonly fromLabel: string;
        readonly fromPlaceholder: string;
        readonly send: string;
        readonly stamp: string;
    };
    readonly posted: { readonly caption: string; readonly again: string };
    readonly errors: FormErrorsViewModel;
    /** Where "email me directly" leads: the header's "Email me". */
    readonly emailHref: string;
    /** In the postcard's place without script: "Email me at" the address. */
    readonly noScript: NoScriptEmailViewModel;
}
