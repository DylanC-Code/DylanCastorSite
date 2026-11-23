/**
 * The computed lines of the check page's three engravings, in copper on the
 * dark ground (1000 wide, the ground at y 300): the hatched ground, a lamp's
 * rays, and where the calendar leaves of "After launch" lie in their heap.
 */
function round(value: number): number {
    return Math.round(value * 10) / 10;
}

/** The ground line from x0 to x1, and its hatching. */
export function groundOf(
    x0: number,
    x1: number,
): { line: string; hatch: string } {
    const count = Math.floor((x1 - x0 - 10) / 14);
    const hatch = Array.from(
        { length: Math.max(0, count) },
        (_, index) => `M${x0 + 10 + index * 14} 304l-7 9`,
    ).join("");
    return { line: `M${x0} 300H${x1}`, hatch };
}

/** Five short rays over a lamp centred at (x, 27). */
export function lampRays(x: number): string {
    return [-150, -120, -90, -60, -30]
        .map((degrees) => {
            const angle = (degrees * Math.PI) / 180;
            const [cos, sin] = [Math.cos(angle), Math.sin(angle)];
            return `M${round(x + 17 * cos)} ${round(27 + 17 * sin)}L${round(x + 23 * cos)} ${round(27 + 23 * sin)}`;
        })
        .join("");
}

/** The six fallen leaves: three, then two, then one; x, y and turn. */
export const leafHeap: readonly (readonly [number, number, number])[] = [
    [556, 272, -12],
    [602, 273, 9],
    [648, 272, -6],
    [580, 240, 13],
    [627, 240, -10],
    [604, 208, 5],
];
