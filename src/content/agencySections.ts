import sectionsJson from "#/content/agencySections.json";
import { agencyHero, agencySteps } from "#/content/agencySteps.ts";
import { floorsContent } from "#/content/floors.ts";
import { dataLine } from "#/content/formWords.ts";
import { home } from "#/content/home.ts";
import type { AfterFirstTestViewModel } from "#/presentation/visitor/agencies/viewmodels/AfterFirstTestViewModel.ts";
import type { AgencySectionsViewModel } from "#/presentation/visitor/agencies/viewmodels/AgencySectionsViewModel.ts";
import type { ClosingAskViewModel } from "#/presentation/visitor/agencies/viewmodels/ClosingAskViewModel.ts";
import type { MethodBandViewModel } from "#/presentation/visitor/agencies/viewmodels/MethodBandViewModel.ts";
import type { UnderYourNameViewModel } from "#/presentation/visitor/agencies/viewmodels/UnderYourNameViewModel.ts";

/**
 * The agencies home's last four sections, from the part 2 handoff's
 * `sections.json`, kept as delivered (plus the form's two error sentences).
 * Words Dylan may still change are listed in its `toCorrect`.
 */
const { underYourName, afterTheFirstTest, method, ask, icons } = sectionsJson;
const methodFloor = floorsContent.floors.find((floor) => floor.id === "method");
const [plainBefore = "", plainLabel = ""] = ask.plain;
const emailHref = home.header.action.href;

if (methodFloor === undefined) {
    throw new Error("floors.json has no method floor");
}

const underYourNameSection: UnderYourNameViewModel = {
    title: underYourName.title,
    labelUnder: underYourName.labelUnder,
    labelOver: underYourName.labelOver,
    terms: underYourName.terms.map(({ icon, title, text }) => ({
        icon,
        title,
        text,
    })),
    icons,
};

const afterFirstTestSection: AfterFirstTestViewModel = {
    ...afterTheFirstTest,
    pass: {
        ...afterTheFirstTest.pass,
        cells: afterTheFirstTest.pass.cells.map(
            ([caption = "", value = ""]) => [caption, value] as const,
        ),
    },
};

const methodSection: MethodBandViewModel = {
    label: {
        numeral: method.labelNumeral,
        rest: method.label.slice(method.labelNumeral.length).trim(),
    },
    sentence: method.sentence,
    sentenceItalic: method.sentenceItalic,
    link: { label: method.link, href: methodFloor.href },
    card: method.card,
};

const closingAskSection: ClosingAskViewModel = {
    title: ask.title,
    titleItalic: ask.titleItalic,
    text: ask.text,
    postcard: {
        front: {
            caption: ask.front.caption,
            title: ask.front.title,
            titleItalic: ask.front.titleItalic,
            action: ask.front.action,
            description: ask.front.ariaLabel,
        },
        back: ask.back,
        posted: ask.posted,
        errors: ask.errors,
        emailHref,
        emailLabel: plainLabel,
    },
    plain: { before: plainBefore, label: plainLabel },
    dataLine,
};

const agencySections: AgencySectionsViewModel = {
    underYourName: underYourNameSection,
    afterFirstTest: afterFirstTestSection,
    method: methodSection,
    ask: closingAskSection,
};

/** Everything the agencies home shows, but the book it shares with the home. */
export const agenciesPage = {
    hero: agencyHero,
    steps: agencySteps,
    sections: agencySections,
} as const;
