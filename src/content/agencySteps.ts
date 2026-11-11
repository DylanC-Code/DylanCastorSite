import stepsJson from "#/content/agencySteps.json";
import { home } from "#/content/home.ts";
import type { AgencyHeroViewModel } from "#/presentation/visitor/agencies/viewmodels/AgencyHeroViewModel.ts";
import type { StepsSectionViewModel } from "#/presentation/visitor/agencies/viewmodels/StepsSectionViewModel.ts";

/**
 * The agencies home's hero and steps, from the agencies steps handoff's
 * `steps.json`, kept as delivered. Words Dylan may still change are listed in
 * its `toCorrect`; change them there only.
 */
const [brief, build, qa, launch, winner] = stepsJson.steps;

function need<T>(value: T | null | undefined, what: string): T {
    if (value === null || value === undefined) {
        throw new Error(`steps.json has no ${what}`);
    }
    return value;
}

function pair<T>(values: readonly T[], what: string): [T, T] {
    const [first, second] = values;
    return [need(first, what), need(second, what)];
}

function common(
    step: (typeof stepsJson.steps)[number] | undefined,
    what: string,
) {
    const { n, title, sentence, emphasis } = need(step, what);
    return { n, title, sentence, emphasis };
}

const [floor = "", numeral = "", ...rest] = stepsJson.section.label.split(" ");
const sheet = need(qa?.sheet, "QA sheet");
const demo = need(build?.demo, "build demo");
const sealed = need(winner?.sheet, "winner sheet");

export const agencyHero: AgencyHeroViewModel = {
    eyebrow: stepsJson.hero.eyebrow,
    title: pair(stepsJson.hero.title, "hero title"),
    lead: stepsJson.hero.lead,
    button: { label: stepsJson.hero.button, href: home.header.action.href },
    down: { label: stepsJson.hero.down, href: "#steps" },
};

export const agencySteps: StepsSectionViewModel = {
    label: { floor, numeral, rest: rest.join(" ") },
    title: stepsJson.section.title,
    ticket: {
        ...stepsJson.ticket,
        stub: pair(stepsJson.ticket.stub, "stub"),
        navLabel: "Steps",
    },
    icons: stepsJson.icons,
    brief: {
        ...common(brief, "step 1"),
        cap: need(brief?.cap, "brief cap"),
        cards: need(brief?.cards, "cards"),
    },
    build: {
        ...common(build, "step 2"),
        ...demo,
        labels: pair(demo.labels, "demo labels"),
        marks: pair(demo.marks, "demo marks"),
        link: { label: demo.link, href: "/shopify-cro" },
    },
    qa: {
        ...common(qa, "step 3"),
        cap: need(qa?.cap, "QA cap"),
        sheet: {
            title: sheet.title,
            tag: sheet.tag,
            foot: sheet.foot,
            rows: need(sheet.rows, "handover rows").map((row) => ({
                word: row.word,
                icon: row.icon,
                sample: row.sample,
                drawing: row.drawing,
                locked: need(
                    qa?.locked?.find((line) => line.word === row.word),
                    `locked ${row.word}`,
                ).text,
            })),
        },
    },
    launch: {
        ...common(launch, "step 4"),
        fix: need(launch?.fix, "launch fix"),
        points: {
            ...need(launch?.points, "points"),
            ends: pair(need(launch?.points, "points").ends, "ends"),
        },
    },
    winner: {
        ...common(winner, "step 5"),
        sheet: {
            title: sealed.title,
            tag: sealed.tag,
            code: need(sealed.code, "theme code"),
            foot: sealed.foot,
            slip: need(sealed.slip, "slip"),
            seal: need(sealed.seal, "seal"),
        },
    },
};
