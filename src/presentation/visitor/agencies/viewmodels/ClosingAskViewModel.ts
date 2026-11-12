import type { PostcardViewModel } from "#/presentation/visitor/agencies/viewmodels/PostcardViewModel.ts";

/** "Have a test to build?": the words, the postcard, the plain email line. */
export interface ClosingAskViewModel {
    readonly title: string;
    readonly titleItalic: string;
    readonly text: string;
    readonly postcard: PostcardViewModel;
    /** "Or" then the email link ("email me directly"). */
    readonly plain: { readonly before: string; readonly label: string };
}
