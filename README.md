# font-viewer

A Google Fonts catalog browser for the lvucodes.github.io family, built from [site-template](https://github.com/lvuCodes/site-template) on Vite + React 19 + TypeScript with **[@lvucodes/ui](https://www.npmjs.com/package/@lvucodes/ui)** providing the theme system, switcher, back link, and footer credits. The full catalog (1,900+ families) is browsable with the same filter surface fonts.google.com offers: every language subset, the five categories, the Feeling / Appearance / Theme / Seasonal / Purpose / Special Use tag sets, variable- and color-font technology toggles, name/designer search, and Featured / Trending / Most popular / Newest / Name sorting. Fonts load lazily from `fonts.googleapis.com` as their cards scroll into view; nothing is bundled.

## Data

[public/data/fonts.json](public/data/fonts.json) is a generated snapshot merged from two Google sources:

- `https://fonts.google.com/metadata/fonts` — per-family metadata: subsets (the language filter), category, classifications, variants, variable axes, color capabilities, designers, popularity / trending / featured ranks, dates.
- The [google/fonts](https://github.com/google/fonts) repo `tags/all/families.csv` — the tag taxonomy behind the Feeling (Expressive), Appearance (Serif / Sans / Slab / Calligraphy / Monospace), Theme, Seasonal, Purpose, and Special Use filters. Tags with a weight below 50 are dropped; `/Quality/*` (Google-internal ranking) is excluded.

Regenerate with:

```sh
node scripts/build-data.mjs
```

The script fetches both sources live; when offline it keeps the existing snapshot.

Filter semantics: categories union (any selected category matches), tags intersect (a family must carry every selected tag), and the language, technology, and search filters all AND together.

Preview text resolution per card: the typed preview text, else the sample for the active language filter, else the first sample matching the family's subsets, else the family name. Sample coverage spans the ~30 highest-traffic scripts ([src/catalog/languages.ts](src/catalog/languages.ts)); the remaining subsets fall back rather than render tofu-prone text.

## Usage

- `npm install` — install dependencies and wire the pre-push hook (`prepare` sets `core.hooksPath`).
- `npm run dev` — start the Vite dev server and open the site.

## Included Tooling

| Item             | Definition                                                                                                                                                                                               |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm run verify` | The full local gate set: `lint` (ESLint + stylelint), `format:check` (Prettier), `test` (Vitest), and `build`.                                                                                           |
| Pre-push hook    | [.githooks/pre-push](.githooks/pre-push) runs `npm run verify` before every push; installed by the `prepare` script.                                                                                     |
| Reusable CI      | [.github/workflows/ci.yml](.github/workflows/ci.yml) calls `lvuCodes/terminal-themes/.github/workflows/site-ci.yml@main`, which runs `verify` and the iPhone SE Playwright smoke gate (`npm run smoke`). |
| Deploy workflow  | [.github/workflows/deploy-pages.yml](.github/workflows/deploy-pages.yml) builds and publishes to GitHub Pages, scoped to the `main` branch.                                                              |

## Branch Flow

`dev` is the default working branch; CI runs there on every push and pull request. `main` is deploy-only: a linear fast-forward from `dev` — gated on `verify` and the SE smoke suite being green — that triggers the Pages deploy.

## License

GNU General Public License v3.0 or later — see [LICENSE](LICENSE). Copyright © 2026 lvuCodes. `@lvucodes/ui` is published under GPL-3.0-or-later, so this site is licensed GPL-3.0-or-later and makes its source available. The font files themselves are served by Google Fonts under their own (open) licenses; the catalog metadata snapshot derives from Google's public endpoints.
