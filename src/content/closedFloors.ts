import closedJson from "#/content/closedFloors.json";
import { floorHalls } from "#/content/floorHalls.ts";
import { floorsContent } from "#/content/floors.ts";
import homeJson from "#/content/home.json";
import type { ClosedFloorViewModel } from "#/presentation/visitor/floor/viewmodels/ClosedFloorViewModel.ts";
import type { ClosedPathViewModel } from "#/presentation/visitor/reader_path/viewmodels/ClosedPathViewModel.ts";

/**
 * The pages not written yet, from the closed floor handoff's
 * `closedFloors.json`, kept as delivered: floors II, III, IV and All, by floor
 * id, and the engineering home. Each floor's line under its title is its line
 * on the main home (home.json), read there, never copied. The ask is floor
 * I's.
 */
type FloorJson = (typeof closedJson.floors)[number];

function pair(words: readonly string[]): readonly [string, string] {
    const [first = "", second = ""] = words;
    return [first, second];
}

/** The floor's line on the main home: its row there, or the method's. */
function introOf(floorId: string): string {
    if (floorId === "method") {
        return homeJson.floors.method.how;
    }
    const numeral = floorsContent.floors.find(
        (one) => one.id === floorId,
    )?.numeral;
    const row = homeJson.floors.rows.find((one) => one.numeral === numeral);
    if (row === undefined) {
        throw new Error(`home.json has no floor row for ${floorId}`);
    }
    return row.how;
}

/** "A question about this floor?": floor I's ask, the same on every floor. */
function floorAsk(): ClosedFloorViewModel["ask"] {
    const hall = floorHalls["storefront"];
    if (hall === undefined) {
        throw new Error("floor I has no hall");
    }
    return hall.ask;
}

function closedFloorOf(floor: FloorJson): ClosedFloorViewModel {
    return {
        head: { title: pair(floor.title), intro: introOf(floor.id) },
        sign: {
            ...floor.sign,
            right: closedJson.signRight,
            rightShort: closedJson.signRight,
        },
        card: { name: floor.cardName, later: closedJson.card },
        line: closedJson.line,
        liftLabel: closedJson.liftLabel,
        ask: floorAsk(),
    };
}

/** The floors not written yet, by floor id (floors.json). */
export const closedFloors: Readonly<Record<string, ClosedFloorViewModel>> =
    Object.fromEntries(
        closedJson.floors.map((floor) => [floor.id, closedFloorOf(floor)]),
    );

const { engineeringHome } = closedJson;

/** The engineering home, a path not written yet. */
export const closedEngineering: ClosedPathViewModel = {
    eyebrow: engineeringHome.eyebrow,
    title: pair(engineeringHome.title),
    card: { name: engineeringHome.cardName, later: closedJson.card },
};
