# presentation/shared/reveal

Entrances on scroll: a group marked `data-reveal` plays its entrance once, at 25%
in view. Text paints first: only groups still below the fold wait, and nothing
waits when the visitor prefers reduced motion. The motion itself is CSS, in
`design_system/styles/utilities.css`.

Accepts: the one observer that marks groups as seen.

Refuses: a section's own motion (it lives with the section) and any library.
