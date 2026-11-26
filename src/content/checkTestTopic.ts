import { checkPlate } from "#/content/checkPlateWords.ts";
import checkTestJson from "#/content/checkTest.json";
import { floorHalls } from "#/content/floorHalls.ts";
import { both, pair } from "#/content/topicWords.ts";
import type { CheckTestPageViewModel } from "#/presentation/visitor/check_test/viewmodels/CheckTestPageViewModel.ts";

/**
 * The topic page "Checking a test before launch" (floor I), from the check test
 * handoff's `checkTest.json`, kept as delivered. Published on 26 Nov 2026; its
 * room on floor I (line, scene, address) is read from `floor1.json`.
 */
const { head, lamps, afterLaunch, forYou, details, ask } = checkTestJson;
const [doorA = { letter: "A", word: "" }, doorB = { letter: "B", word: "" }] =
    lamps.scene.doors;
const storefront = floorHalls["storefront"];

export const checkTestPage: CheckTestPageViewModel = {
    head: {
        back: { label: head.back, href: "/shopify-cro" },
        title: pair(head.title),
        intro: head.intro,
    },
    plate: checkPlate,
    lamps: {
        title: pair(lamps.title),
        label: lamps.label,
        storeName: lamps.scene.storeName,
        doors: [doorA, doorB],
        sign: lamps.scene.sign,
    },
    afterLaunch: {
        title: pair(afterLaunch.title),
        text: both(afterLaunch.text),
        label: afterLaunch.label,
        counter: afterLaunch.scene.counter,
        calendar: afterLaunch.scene.calendar,
        leaves: afterLaunch.scene.leaves,
    },
    forYou: {
        title: pair(forYou.title),
        text: both(forYou.text),
        label: forYou.label,
        header: forYou.scene.header,
        lines: forYou.scene.lines,
        signature: forYou.scene.signature,
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
