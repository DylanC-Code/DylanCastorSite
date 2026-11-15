import type { LinkViewModel } from "#/presentation/shared/design_system/link/viewmodels/LinkViewModel.ts";
import type { LegalRun } from "#/presentation/visitor/legal/presenters/legalRuns.ts";

/** Who publishes the site, one item per line; email and phone are links too. */
export interface IdentityViewModel {
    readonly name: string;
    readonly street: string;
    readonly city: string;
    readonly siret: string;
    readonly email: string;
    readonly phone: string;
    readonly phoneHref: string;
}

/** A section: its id (an anchor), its title, its paragraphs or the identity. */
export interface LegalSectionViewModel {
    readonly id: string;
    readonly title: readonly [string, string];
    readonly blocks: readonly (readonly LegalRun[] | "identity")[];
}

/** The legal notice in one language. */
export interface LegalNoticeViewModel {
    readonly lang: "en" | "fr";
    readonly href: string;
    /** The same notice in the other language. */
    readonly other: LinkViewModel & { readonly lang: "en" | "fr" };
    readonly title: string;
    readonly updated: string;
    readonly identity: IdentityViewModel;
    readonly sections: readonly LegalSectionViewModel[];
    /** The footer's link on this page ("Legal notice", "Mentions légales"). */
    readonly footerLink: string;
}
