# presentation/visitor/shared/floor_switcher

The piece in the corner of every visitor page that opens the floors and takes
the visitor to one, in the two designs under test: the card (a plate opening a
card) and the shelf (small books opening a shelf of volumes). `<html
data-switcher>` shows one; the edge sets it per visit, card by default.

Accepts: both designs' openers and panels, the row names (`presenters/`), the
pick sequence (`state/`, tested), and its script (`behaviour/`). The styles are
in `design_system/styles/switcher*.css` and `pageTransition.css`.

Refuses: storing anything on the visitor's device, a link to a path other than
"Find your path", and words on the openers.
