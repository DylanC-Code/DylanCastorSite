/**
 * Who the site speaks for, as search engines read it. Only true, public facts:
 * no address, no prices, no ratings.
 */
export const identity = {
    name: "Dylan Castor",
    jobTitle: "Shopify & CRO engineer",
    description:
        "Freelance engineer building Shopify A/B tests and conversion work.",
    country: "FR",
    areaServed: "Worldwide",
    knowsAbout: ["Shopify", "Conversion rate optimization", "A/B testing"],
    // Public profile URLs go here: LinkedIn, GitHub, Malt, Upwork, Shopify Partners.
    sameAs: [],
} as const;
