import { identity } from "#/content/identity.ts";

type Thing = Readonly<Record<string, unknown>>;

interface SiteGraph {
    "@context": string;
    "@graph": readonly [person: Thing, service: Thing, website: Thing];
}

/**
 * The site-wide schema.org graph: the person, the service they run and the
 * website, linked by `@id` so Google reads them as one entity.
 */
export function siteGraph(site: URL): SiteGraph {
    const personId = new URL("/#person", site).href;
    const serviceId = new URL("/#service", site).href;
    const websiteId = new URL("/#website", site).href;
    return {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Person",
                "@id": personId,
                name: identity.name,
                jobTitle: identity.jobTitle,
                url: site.href,
                address: {
                    "@type": "PostalAddress",
                    addressCountry: identity.country,
                },
                knowsAbout: identity.knowsAbout,
                sameAs: identity.sameAs,
            },
            {
                "@type": "ProfessionalService",
                "@id": serviceId,
                name: identity.name,
                description: identity.description,
                url: site.href,
                founder: { "@id": personId },
                address: {
                    "@type": "PostalAddress",
                    addressCountry: identity.country,
                },
                areaServed: identity.areaServed,
            },
            {
                "@type": "WebSite",
                "@id": websiteId,
                name: identity.name,
                url: site.href,
                inLanguage: "en",
                publisher: { "@id": personId },
            },
        ],
    };
}

/** JSON for a `<script>` tag: `<` is escaped so no text can close the tag. */
export function toScriptJson(data: unknown): string {
    return JSON.stringify(data).replaceAll("<", "\\u003c");
}
