# dylancastor_site

dylancastor.com: Dylan Castor's site, freelance Shopify & CRO engineer, with an
Engineering area beside it. Astro 7, static, Tailwind 4 themed with Night Lab, on
Cloudflare. Tooling copied from TightStack, trimmed for a site.

## The one command

`bun run check`: format (oxfmt, and Prettier for `.astro` files only), lint with
type checking (oxlint), `astro check`, knip, the tests, then the build. Nothing
merges red; the pre-push hook and CI run the same command.

## Non-negotiable

- Bun only: no Node, no npm, no pnpm. Exact versions only. Never edit `bun.lock`
  by hand. A new dependency is proposed first, with the alternative considered.
- No `any`, no `as` casts (except `as const`), no non-null `!`, no `@ts-ignore`,
  no `oxlint-disable`. Never edit a lint, format or tsconfig file to make a check
  pass.
- Files under 150 lines: split by concept.
- Names: directories `snake_case`, files `camelCase`, Astro components and
  layouts `PascalCase`. Never kebab-case in a name.
- URLs keep hyphens (`/cro/flicker-free-ab-tests`): a page is a dynamic route
  (`src/pages/cro/[slug].astro`) and its slug comes from the content's data,
  never from a file name.
- Imports across directories use `#/` with the extension
  (`#/layouts/BaseLayout.astro`), never `../`.
- Styles: Tailwind classes from Night Lab's theme (`src/styles/nightLab.css`).
  Tailwind's own colors, radii and shadows are switched off on purpose.
- Demos are vanilla TypeScript, loaded when they scroll into view. Text paints
  first; `prefers-reduced-motion` is respected.
- Conventional commits, header at most 72 characters, no scope.

## Content rules

- English only, plain and direct, no hype.
- No client names, store links or brand logos. No invented numbers, testimonials,
  uplift or client counts. No prices.
- Do not name Dylan's A/B testing app or describe its features.

## Never

- Never touch the MX, SPF, DKIM or DMARC records of dylancastor.dev: its email
  runs on Google Workspace.
- Never deploy without Dylan's OK.
