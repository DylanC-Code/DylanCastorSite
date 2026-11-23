/**
 * The two doors room, alive (check test handoff, `mount()`): every 2.9s, the
 * first after 0.5s, while the room is in view, a visitor walks in from the left
 * at 62 units a second, stops 0.6s at the signpost while its board moves, goes
 * to door A or door B in turn; the door opens on a dark doorway and the counter
 * turns by one. Reduced motion: two still figures, 005.
 */
const speed = 62;
const enter = -44;
const signpost = 12;
const pause = 600;

function replay(element: Element | null, name: string, ms: number): void {
    if (element === null) {
        return;
    }
    element.classList.remove(name);
    element.getBoundingClientRect();
    element.classList.add(name);
    window.setTimeout(() => {
        element.classList.remove(name);
    }, ms);
}

function showCount(room: SVGSVGElement, count: number): void {
    const digits = String(count % 1000).padStart(3, "0");
    room.querySelectorAll("[data-digit]").forEach((digit, index) => {
        if (digit.textContent !== digits.charAt(index)) {
            digit.replaceChildren(digits.charAt(index));
            replay(digit, "is-turned", 320);
        }
    });
}

/** A new visitor, cloned from the room's figure into its street. */
function figure(room: SVGSVGElement): Element | null {
    const clone = room.querySelector("defs [data-walker]")?.cloneNode(true);
    const walk = room.querySelector("[data-walk]");
    if (!(clone instanceof Element) || walk === null) {
        return null;
    }
    walk.append(clone);
    return clone;
}

/** A visitor standing still at x (reduced motion). */
function standing(room: SVGSVGElement, x: number): void {
    const visitor = figure(room);
    visitor?.classList.add("is-still");
    visitor?.setAttribute("transform", `translate(${x} 0)`);
}

function step(x: number, at: number, total: number): Keyframe {
    return { transform: `translateX(${x}px)`, opacity: 1, offset: at / total };
}

function walkIn(
    room: SVGSVGElement,
    door: "A" | "B",
    counted: () => void,
): void {
    const visitor = figure(room);
    const end = (door === "B" ? 204 : 114) - 1;
    const stop = ((signpost - enter) / speed) * 1000;
    const inAt = stop + pause + ((end - signpost) / speed) * 1000;
    const total = inAt + 250;
    visitor
        ?.animate(
            [
                { transform: `translateX(${enter}px)`, opacity: 0, offset: 0 },
                step(enter + 10, 250, total),
                step(signpost, stop, total),
                step(signpost, stop + pause, total),
                step(end, inAt, total),
                {
                    transform: `translateX(${end + 3}px)`,
                    opacity: 0,
                    offset: 1,
                },
            ],
            { duration: total },
        )
        .addEventListener("finish", () => {
            visitor.remove();
        });
    window.setTimeout(() => {
        replay(visitor, "is-stopped", pause);
        replay(
            room.querySelector(`[data-board="${door}"]`),
            "is-nudged",
            pause,
        );
    }, stop);
    window.setTimeout(() => {
        replay(room.querySelector(`[data-door="${door}"]`), "is-open", 1000);
        window.setTimeout(counted, 380);
    }, inAt - 380);
}

function liven(room: SVGSVGElement): void {
    const memory = { visitors: 0, count: 0, inView: false };
    new IntersectionObserver(
        ([entry]) => {
            memory.inView = entry?.isIntersecting ?? false;
        },
        { threshold: 0.2 },
    ).observe(room);
    function tick(): void {
        if (memory.inView && !document.hidden) {
            walkIn(room, memory.visitors % 2 === 1 ? "B" : "A", () => {
                memory.count += 1;
                showCount(room, memory.count);
            });
            memory.visitors += 1;
        }
    }
    window.setTimeout(tick, 500);
    window.setInterval(tick, 2900);
}

export function initTwoDoorsRooms(root: ParentNode): void {
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    for (const room of root.querySelectorAll<SVGSVGElement>(
        "[data-two-doors]",
    )) {
        if (still) {
            standing(room, signpost);
            standing(room, 150);
            showCount(room, 5);
        } else {
            liven(room);
        }
    }
}
