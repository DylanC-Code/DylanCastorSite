# presentation/visitor/shared/path_hero

The first screen of a reading path's home (`/agencies`, `/cro`): the eyebrow,
the two-line title, the lead, the button and the link down; beside it, that
path's book from the root home, opened once on its contents.

Accepts: a `PathHeroViewModel` and the path's `BookViewModel` (with the books'
labels).

Refuses: any path's own sections, and a book of its own: it reuses the root
home's `ReaderBook`, inert.
