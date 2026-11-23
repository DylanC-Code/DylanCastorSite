import checkTestJson from "#/content/checkTest.json";
import { floorHalls } from "#/content/floorHalls.ts";
import { both, pair } from "#/content/topicWords.ts";
import type { CheckTestPageViewModel } from "#/presentation/visitor/check_test/viewmodels/CheckTestPageViewModel.ts";

/**
 * The topic page "Checking a test before launch" (floor I), from the check test
 * handoff's `checkTest.json`, kept as delivered. Its words are drafts: the page
 * is built by `bun run dev` only (decided by Dylan, 23 Nov 2026) and its room
 * stays "Coming later" until he publishes it.
 */
const { head, details, ask, floorRoom } = checkTestJson;
const storefront = floorHalls["storefront"];

export const checkTestPage: CheckTestPageViewModel = {
    head: {
        back: { label: head.back, href: "/shopify-cro" },
        title: pair(head.title),
        intro: head.intro,
    },
    details: {
        title: pair(details.title),
        hint: details.hint,
        drawers: details.drawers.map(({ label, question, answer }) => ({
            label,
            question,
            answer: both(answer),
        })),
    },
    ask: {
        title: { agency: pair(ask.title.agency), brand: pair(ask.title.brand) },
        link: ask.link,
        href: storefront?.ask.href ?? "/cro#slot-title",
        byPath: storefront?.ask.byPath ?? {},
        label: ask.label,
    },
};

/** Where the draft is shown in dev: its floor, its room, its address. */
export const checkTestDraft = {
    floorId: "storefront",
    roomId: checkTestJson.topic,
    name: floorRoom.name,
    slug: floorRoom.slug,
} as const;
