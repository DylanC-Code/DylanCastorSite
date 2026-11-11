# presentation/shared/document

The HTML shell every page renders in: `<html>`, `<head>`, `<body>`, the fonts,
and what search engines read in the head (title, description, canonical URL,
Open Graph, the schema.org graph).

Accepts: the shell, its head, and the presenters that write the head's values
(`canonicalUrl`, `siteGraph`), with their tests.

Refuses: anything a page shows. The header and footer are `visitor/shared/site_frame`.
