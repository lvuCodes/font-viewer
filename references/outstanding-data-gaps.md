# Outstanding Data Gaps

Items not completed during the initial build of font-viewer (2026-07-25), with retrieval instructions for the data still needed.

## Sample Text Coverage

- **Gap:** the catalog exposes 181 language subsets, but [languages.ts](../src/catalog/languages.ts) carries natural sample strings for only ~30 major scripts. Families whose subsets have no sample (Tangut, Ogham, Deseret, Cherokee, Vai, and the rest of the long tail) fall back to rendering the family name, which is Latin text and defeats the preview for script-specific fonts.
- **Source:** the [googlefonts/lang](https://github.com/googlefonts/lang) repo — `Lib/gflanguages/data/languages/*.textproto`, one file per language, each containing a `sample_text` block with graded specimens (`masthead_full`, `styles`, `tester`, `poster_sm/md/lg`, `specimen_48/36/21/16/32`).
- **Download:** `git clone --depth 1 https://github.com/googlefonts/lang` (or a tarball of just `Lib/gflanguages/data/languages/`); drop the directory anywhere in the session folder.
- **Integration:** extend [build-data.mjs](../scripts/build-data.mjs) to parse the textprotos, map language codes to subset slugs (the metadata endpoint's per-family `languages`/`primaryLanguage` fields help here), and emit a `samples` map into [fonts.json](../public/data/fonts.json); `sampleForFamily` then reads that map ahead of the built-in fallbacks.

## Per-Instance Tag Weights

- **Gap:** the google/fonts `tags/all/families.csv` carries rows scoped to named instances (e.g. `AR One Sans,wght@700,/Expressive/Loud,23`). The build collapses these to one weight per family (max across instances) and drops tags below weight 50, so instance-level nuance is not represented.
- **Impact:** low — fonts.google.com's own filter chips operate at family granularity. Only worth revisiting if per-weight tag display is ever wanted on cards.

## Curated Filter Parity

- **Gap:** fonts.google.com surfaces a few curated collections the public endpoints do not expose as structured data: the "Brand fonts" set beyond the boolean `isBrandFont`, editorial collections/pairings, and the per-font "About" prose from specimen pages.
- **Source:** no clean public endpoint located; specimen-page scraping would be required. Deferred unless genuinely wanted.

## Feature Omissions

- Variable-axis playground (sliders per registered axis) is not built; axis tags/ranges and the axis-name registry are already in [fonts.json](../public/data/fonts.json).
