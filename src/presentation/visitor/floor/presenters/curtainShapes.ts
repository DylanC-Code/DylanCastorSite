import type { CurtainShape } from "#/presentation/visitor/floor/presenters/curtainPaths.ts";

/** A room's curtain on desktop (230 × 270); on a phone, enlarged 1.56 times. */
export const roomCurtain: CurtainShape = {
    width: 230,
    height: 270,
    folds: 15,
    swags: 3,
    drop: 20,
    hem: 261,
};

/** A room not published, on a phone: a short band (358 × 100). */
export const bandCurtain: CurtainShape = {
    width: 358,
    height: 100,
    folds: 29,
    swags: 5,
    drop: 16,
    hem: 90,
};
