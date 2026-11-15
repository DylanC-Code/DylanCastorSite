/**
 * A cinema curtain, drawn for any size (the desktop room 230 × 270, the phone
 * band 358 × 100): a rail, swags with fold lines and tassels at their joins,
 * folds alternately strong and faint with a hatched stripe in every other gap,
 * a double line where the halves meet, a scalloped hem and a fringe.
 */
export interface CurtainShape {
    readonly width: number;
    readonly height: number;
    readonly folds: number;
    readonly swags: number;
    /** How far a swag hangs below the rail. */
    readonly drop: number;
    /** The y of the scalloped hem. */
    readonly hem: number;
}

export interface CurtainPaths {
    readonly strongFolds: string;
    readonly faintFolds: string;
    /** The hatched stripes' left edges. */
    readonly stripes: readonly number[];
    readonly seam: string;
    readonly hem: string;
    readonly fringe: string;
    readonly swags: string;
    readonly swagFolds: string;
    readonly cords: string;
    readonly tassels: string;
}

const rail = 4;

function fold(x: number, index: number, hem: number): string {
    const bend = index % 2 === 0 ? -3 : 3;
    const a = 8 + (hem - 8) * 0.33;
    const b = 8 + (hem - 8) * 0.67;
    return `M${x.toFixed(1)} 8C${(x + bend).toFixed(1)} ${a.toFixed(0)} ${(x - bend).toFixed(1)} ${b.toFixed(0)} ${x.toFixed(1)} ${hem}`;
}

function foldXs(shape: CurtainShape): number[] {
    const step = (shape.width - 12) / (shape.folds - 1);
    return Array.from({ length: shape.folds }, (_, index) => 6 + index * step);
}

/** A point of a swag, `part` of its full hang below the rail. */
function sag(shape: CurtainShape, part: number): string {
    return (rail + 2 * shape.drop * part).toFixed(1);
}

function swagEdges(shape: CurtainShape): number[] {
    const width = shape.width / shape.swags;
    return Array.from({ length: shape.swags + 1 }, (_, index) => index * width);
}

function valance(
    shape: CurtainShape,
): Pick<CurtainPaths, "swags" | "swagFolds" | "cords" | "tassels"> {
    const edges = swagEdges(shape);
    const pairs = edges
        .slice(1)
        .map((b, index) => [edges[index] ?? 0, b] as const);
    const joins = edges.slice(1, -1);
    return {
        swags: pairs
            .map(
                ([a, b]) =>
                    `M${a.toFixed(1)} ${rail}Q${((a + b) / 2).toFixed(1)} ${sag(shape, 1)} ${b.toFixed(1)} ${rail}z`,
            )
            .join(""),
        swagFolds: pairs
            .map(([a, b]) => {
                const mid = ((a + b) / 2).toFixed(1);
                return `M${(a + 8).toFixed(1)} ${rail}Q${mid} ${sag(shape, 0.675)} ${(b - 8).toFixed(1)} ${rail}M${(a + 18).toFixed(1)} ${rail}Q${mid} ${sag(shape, 0.375)} ${(b - 18).toFixed(1)} ${rail}`;
            })
            .join(""),
        cords: joins.map((j) => `M${j.toFixed(1)} ${rail}v14`).join(""),
        tassels: joins
            .map((j) => `M${(j - 3.5).toFixed(1)} ${rail + 14}h7l2 12h-11z`)
            .join(""),
    };
}

/** Every path of a curtain of this shape, in its own px. */
export function curtainPaths(shape: CurtainShape): CurtainPaths {
    const xs = foldXs(shape);
    const middle = shape.width / 2;
    const scallops = Math.round((shape.width - 8) / 8);
    const ticks = Math.floor((shape.width - 22) / 4) + 1;
    return {
        strongFolds: xs
            .filter((_, index) => index % 2 === 0)
            .map((x) => fold(x, 0, shape.hem))
            .join(""),
        faintFolds: xs
            .filter((_, index) => index % 2 === 1)
            .map((x) => fold(x, 1, shape.hem))
            .join(""),
        stripes: xs
            .filter((_, index) => index % 2 === 0 && index < xs.length - 1)
            .map((x) => x + 1.5),
        seam: `M${middle - 1.5} 8V${shape.hem}M${middle + 1.5} 8V${shape.hem}`,
        hem: `M4 ${shape.hem}${"q4 6 8 0".repeat(scallops)}`,
        fringe: Array.from(
            { length: ticks },
            (_, index) => `M${6 + index * 4} ${shape.hem + 4}v4`,
        ).join(""),
        ...valance(shape),
    };
}
