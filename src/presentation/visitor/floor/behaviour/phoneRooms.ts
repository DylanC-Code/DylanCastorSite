import {
    jump,
    nearestToMiddle,
} from "#/presentation/visitor/floor/state/phoneRooms.ts";

/** The open room's height on a phone, and the visitor's (1.4 times). */
const roomHeight = 420;
const visitorHeight = 157;

interface Rooms {
    visitor: HTMLElement;
    lit: readonly HTMLElement[];
}

function reduced(): boolean {
    return matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Where the visitor stands in room `index`: on its floor, in px down the list. */
function floorOf(rooms: Rooms, index: number): number {
    const room = rooms.lit[index];
    return room === undefined ? 0 : room.offsetTop + roomHeight - visitorHeight;
}

function frame(y: number, offset: number, easing: string): Keyframe {
    return { transform: `translateY(${y}px)`, offset, easing };
}

/** The jump's keyframes, as the phone handoff's (no turn, no stretch). */
function jumpSteps(from: number, to: number): Keyframe[] {
    if (to > from) {
        return [
            frame(from, 0, "cubic-bezier(.2,.7,.4,1)"),
            frame(from - 22, 0.22, "cubic-bezier(.55,0,.9,.6)"),
            frame(to, 0.86, "ease-out"),
            frame(to - 6, 0.93, "ease-in"),
            frame(to, 1, "linear"),
        ];
    }
    return [
        frame(from, 0, "ease-out"),
        frame(from + 4, 0.1, "cubic-bezier(.2,.8,.3,1)"),
        frame(to - 16, 0.8, "ease-in"),
        frame(to, 1, "linear"),
    ];
}

/** A room's curtain once room `open` opens and room `before` closes. */
function curtainOf(place: number, open: number, before: number): string {
    if (place === open) {
        return "open";
    }
    return place === before ? "closing" : "closed";
}

function setCurtain(room: HTMLElement, state: string): void {
    const { dataset } = room;
    dataset["curtain"] = state;
}

/** Opens room `index`, closes room `before`, and sends the visitor there. */
function openRoom(rooms: Rooms, before: number, index: number): void {
    rooms.lit.forEach((room, place) => {
        setCurtain(room, curtainOf(place, index, before));
    });
    const from = floorOf(rooms, before);
    const to = floorOf(rooms, index);
    rooms.visitor.style.setProperty("--visitor-y", `${to}px`);
    if (!reduced()) {
        const plan = jump(before, index);
        rooms.visitor.animate(jumpSteps(from, to), {
            duration: plan.duration,
            delay: plan.delay,
            fill: "backwards",
        });
    }
}

/** The first published room shown open at load, the visitor on its floor. */
function start(rooms: Rooms): void {
    rooms.lit.forEach((room, place) => {
        setCurtain(room, place === 0 ? "shown" : "closed");
    });
    rooms.visitor.style.setProperty("--visitor-y", `${floorOf(rooms, 0)}px`);
}

/** Opens the room nearest the middle whenever a room crosses a threshold. */
function follow(rooms: Rooms): void {
    let open = 0;
    const observer = new IntersectionObserver(
        () => {
            const spans = rooms.lit.map((room) => room.getBoundingClientRect());
            const next = nearestToMiddle(spans, innerHeight);
            if (next !== open) {
                openRoom(rooms, open, next);
                open = next;
            }
        },
        { threshold: [0, 0.25, 0.5, 0.75, 1] },
    );
    for (const room of rooms.lit) {
        observer.observe(room);
    }
}

/**
 * Below 1164px: exactly one published room is open, the one nearest the middle
 * of the screen (the first at load); the visitor jumps to it. An observer on
 * the rooms, not a scroll handler, decides. Without this script every published
 * room is shown open.
 */
export function initPhoneRooms(hall: HTMLElement, floor: HTMLElement): void {
    const visitor = floor.querySelector<HTMLElement>("[data-visitor]");
    const lit = [...floor.querySelectorAll<HTMLElement>("[data-lit]")];
    if (visitor === null || lit.length === 0) {
        return;
    }
    const rooms: Rooms = { visitor, lit };
    start(rooms);
    const { dataset } = hall;
    dataset["live"] = "";
    follow(rooms);
}
