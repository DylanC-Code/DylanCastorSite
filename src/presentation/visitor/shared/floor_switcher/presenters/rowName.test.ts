import { describe, expect, it } from "vitest";

import { floorsContent } from "#/content/floors.ts";
import {
    areaSuffix,
    rowName,
} from "#/presentation/visitor/shared/floor_switcher/presenters/rowName.ts";
import type { FloorViewModel } from "#/presentation/visitor/shared/floor_switcher/viewmodels/FloorViewModel.ts";

const { panel } = floorsContent;

function floor(id: string): FloorViewModel {
    const found = floorsContent.floors.find((candidate) => candidate.id === id);
    if (found === undefined) {
        throw new Error(`No floor ${id}`);
    }
    return found;
}

describe("rowName", () => {
    it("names a floor to go to", () => {
        expect(rowName(floor("storefront"), "application", panel.rowAria)).toBe(
            "Go to Shopify & CRO",
        );
    });

    it("names the floor you are on", () => {
        expect(
            rowName(floor("application"), "application", panel.rowAria),
        ).toBe("Development: you are here");
    });

    it("names a floor not built yet", () => {
        expect(rowName(floor("bedrock"), null, panel.rowAria)).toBe(
            "Low-level: coming later",
        );
    });
});

describe("areaSuffix", () => {
    it("keeps what the card adds after the area", () => {
        expect(areaSuffix(floor("bedrock"))).toBe(", later");
    });

    it("adds nothing when the card writes the area as is", () => {
        expect(areaSuffix(floor("storefront"))).toBe("");
    });
});
