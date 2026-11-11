import { describe, expect, it } from "vitest";

import { siteGraph, toScriptJson } from "#/seo/jsonLd.ts";

const site = new URL("https://dylancastor.com");

describe("siteGraph", () => {
    it("links the service and the website to the person", () => {
        const [person, service, website] = siteGraph(site)["@graph"];
        expect(person["@id"]).toBe("https://dylancastor.com/#person");
        expect(service["founder"]).toEqual({ "@id": person["@id"] });
        expect(website["publisher"]).toEqual({ "@id": person["@id"] });
    });

    it("gives a country, never a street address", () => {
        const [person] = siteGraph(site)["@graph"];
        expect(person["address"]).toEqual({
            "@type": "PostalAddress",
            addressCountry: "FR",
        });
    });
});

describe("toScriptJson", () => {
    it("cannot close its script tag", () => {
        expect(toScriptJson({ text: "</script>" })).not.toContain("</");
    });
});
