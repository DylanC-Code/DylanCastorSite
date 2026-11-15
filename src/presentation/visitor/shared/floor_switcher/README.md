# presentation/visitor/shared/floor_switcher

The piece in the corner of every visitor page that opens the floors and takes
the visitor to one. Two designs: the card (a plate opening a card), the only
one visitors see, and the shelf (small books opening a shelf of volumes), kept
for later. `<html data-switcher="shelf">` shows the shelf; without it, the
card. Only development sets it (`?switcher=shelf`).

Accepts: both designs' openers and panels, the row names (`presenters/`), the
pick sequence (`state/`, tested), and its script (`behaviour/`). The styles are
in `design_system/styles/switcher*.css` and `pageTransition.css`.

Refuses: storing anything on the visitor's device, a link to a path other than
"Find your path", and words on the openers.
