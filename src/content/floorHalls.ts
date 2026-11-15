import floor1Json from "#/content/floor1.json";
import { floorsContent } from "#/content/floors.ts";
import type { FloorHallViewModel } from "#/presentation/visitor/floor/viewmodels/FloorHallViewModel.ts";
import type { FloorRoomViewModel } from "#/presentation/visitor/floor/viewmodels/FloorRoomViewModel.ts";

/**
 * The floors' halls, by floor id, from each floor handoff's data (floor I:
 * `floor1.json`, kept as delivered with its topic's slug). A published room's
 * link is its floor's href and its slug. Words are changed there only.
 */
type RoomJson = (typeof floor1Json.rooms)[number];

function hrefOf(floorId: string): string {
    const floor = floorsContent.floors.find((one) => one.id === floorId);
    if (floor === undefined) {
        throw new Error(`floors.json has no floor ${floorId}`);
    }
    return floor.href;
}

function roomOf(room: RoomJson, floorHref: string): FloorRoomViewModel {
    const { id, name, line } = room;
    if ("slug" in room && "scene" in room) {
        return {
            id,
            name,
            line,
            state: "open",
            scene: room.scene,
            href: `${floorHref}/${room.slug}`,
        };
    }
    return { id, name, line, state: "later" };
}

const [title = "", titleItalic = ""] = floor1Json.head.title;
const [askTitle = "", askItalic = ""] = floor1Json.ask.title;
const storefrontHref = hrefOf("storefront");

const storefront: FloorHallViewModel = {
    head: { title: [title, titleItalic], intro: floor1Json.head.intro },
    sign: { ...floor1Json.sign, rightShort: floor1Json.phone.signRight },
    building: {
        ...floor1Json.building,
        hintShort: floor1Json.phone.hint,
        showing: floor1Json.phone.showing,
        enter: floor1Json.phone.enter,
    },
    rooms: floor1Json.rooms.map((room) => roomOf(room, storefrontHref)),
    ask: {
        title: [askTitle, askItalic],
        link: floor1Json.ask.link,
        href: "/cro#slot-title",
        byPath: {
            agencies: "/agencies#have-a-test",
            brands: "/cro#slot-title",
        },
    },
};

/** The floors that have a hall; the others keep their placeholder. */
export const floorHalls: Readonly<Record<string, FloorHallViewModel>> = {
    storefront,
};
