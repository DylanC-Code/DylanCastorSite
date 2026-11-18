import type { LinkViewModel } from "#/presentation/shared/design_system/link/viewmodels/LinkViewModel.ts";

/** Shown in place of a form without script: words, then the email link. */
export interface NoScriptEmailViewModel extends LinkViewModel {
    readonly before: string;
}
