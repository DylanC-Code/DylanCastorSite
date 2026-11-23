/**
 * The red pen's hand-drawn shapes, shared by the topic plates (the lantern, the
 * check plate), in a scene's own units: a loop around a handle and an oval
 * around the moved button. Not perfect circles: the radius wanders a little and
 * the stroke overruns its start.
 */
function point(x: number, y: number, first: boolean): string {
    return `${first ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`;
}

/** A loop of radius `r` around (cx, cy), a little more than one turn. */
export function loop(cx: number, cy: number, r: number): string {
    const steps = 44;
    return Array.from({ length: steps + 1 }, (_, index) => {
        const t = index / steps;
        const angle = -1.9 + t * 1.12 * 2 * Math.PI;
        const radius = r * (1.07 - 0.11 * t + 0.035 * Math.sin(angle * 2 + 1));
        return point(
            cx + radius * Math.cos(angle),
            cy + radius * 0.94 * Math.sin(angle),
            index === 0,
        );
    }).join("");
}

/** An oval of radii rx, ry around (cx, cy), drawn the same loose way. */
export function oval(
    centre: { readonly x: number; readonly y: number },
    rx: number,
    ry: number,
): string {
    const { x: cx, y: cy } = centre;
    const steps = 52;
    return Array.from({ length: steps + 1 }, (_, index) => {
        const t = index / steps;
        const angle = -2.6 + t * 1.1 * 2 * Math.PI;
        const k = 1.06 - 0.1 * t + 0.03 * Math.sin(angle * 2 + 1);
        return point(
            cx + rx * k * Math.cos(angle),
            cy + ry * k * Math.sin(angle),
            index === 0,
        );
    }).join("");
}
