# dylancastor_site

dylancastor.com: Dylan Castor's site, freelance Shopify & CRO engineer, with an
Engineering area beside it. Astro 7, static, Tailwind 4 themed with Night Lab.
Hosted in Dylan's own k3s cluster (servers in France) behind Cloudflare; this
repo builds the site's container image, the cluster's configuration lives in
his infrastructure repo. Tooling copied from TightStack, trimmed for a site.

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
  (`#/content/home.ts`), never `../`.
- Styles: Tailwind classes from Night Lab's theme
  (`src/presentation/shared/design_system/styles/theme.css`). Tailwind's own
  colors, radii and shadows are switched off on purpose. All CSS lives in that
  `styles/` folder, or scoped in a component's `<style>`.
- Demos are vanilla TypeScript, loaded when they scroll into view. Text paints
  first; `prefers-reduced-motion` is respected.
- Conventional commits, header at most 72 characters, no scope.

## Layout of `src/`

The presentation follows TightStack's: public → screen → role.

- `pages/`: Astro's router. A route reads `content/` and places components,
  handing each its view model; it writes no markup.
- `content/`: the words and facts the pages show (`home.json` from the design
  handoff, `identity.ts`), typed against the view models.
- `presentation/shared/`: what every page uses (`document/`, `design_system/`,
  `reveal/`). `presentation/visitor/`: the visitor's screens (`home/`,
  `reader_path/`, `floor/`, `agencies/`) and `visitor/shared/` (`site_frame/`,
  `floor_switcher/`).
- Every file sits in a role folder: `ui/` (components), `viewmodels/` (readonly
  data a component shows, one file per component), `presenters/` (code that
  turns data into what is shown), `state/` (pure local state), `behaviour/`
  (vanilla scripts run in the browser). No `components/`, `utils/`, `hooks/`.
- A component never reads `content/`: its parent passes its view model, whole.
- The one piece that runs outside the browser, the form Worker, is layered as
  TightStack's apps are: `domain/message/` (what a message is, the robot
  checks: pure), `infrastructure/message/cloudflare_email/` (the mail for
  Cloudflare's send API), `interfaces/form_worker/` (the Worker's HTTP entry,
  deployed by `wrangler.jsonc` at the root). The pages may import `domain/`;
  nothing in `domain/` imports anything else.
- Each shared subject has a README: what it accepts and what it refuses.

## Content rules

- English only, plain and direct, no hype. One exception: the French legal
  notice (`/mentions-legales`), beside its English twin.
- No client names, store links or brand logos. No invented numbers, testimonials,
  uplift or client counts. No prices.
- Do not name Dylan's A/B testing app or describe its features.

## Never

- Never touch the MX, SPF, DKIM or DMARC records of dylancastor.dev: its email
  runs on Google Workspace.
- Never deploy without Dylan's OK.
