# presentation/shared/design_system

Night Lab, the site's design system: its stylesheets and the pieces every
screen dresses with, each added when a screen first needs it.

Accepts: `styles/` (Tailwind's entry `app.css`, the theme, the shared utilities,
and the stylesheets of pieces too large for a component's `<style>`), `marks/`
(the cipher and the marbled endpaper), and one subject per shared piece
(`link/viewmodels/LinkViewModel.ts`).

Refuses: a stylesheet anywhere else, a colour or size outside the theme, and a
piece no screen uses yet.
