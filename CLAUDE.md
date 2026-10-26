# font-viewer Development Rules

## Base/Feature Decomposition

The global Base/Feature vocabulary applies. In this repo:

- **Base**:
  - **Site shell**: theme system, switcher, back link, footer from `@lvucodes/ui`; no font-viewer logic.
  - **Catalog load**: fetch of [public/data/fonts.json](public/data/fonts.json), the `Catalog`/`Family` types in [src/catalog/types.ts](src/catalog/types.ts), loading/error states in [src/App.tsx](src/App.tsx).
  - **Viewer core**: [Grid](src/components/Grid.tsx) + [Card](src/components/Card.tsx) + [fontCss.ts](src/catalog/fontCss.ts), rendering family cards and lazily activating each font as it scrolls into view.
- **Features**: search, language filter, category chips, tag filters, technology toggles, sort, preview text/size, language samples, infinite scroll. A filter feature's footprint is one field on `Filters`, one guard clause in `matchesFilters` (or one `switch` case in `sortFamilies`), and one UI control.

### Rules

- The composition seam is `applyFilters` ([src/catalog/filtering.ts](src/catalog/filtering.ts)), which ANDs predicates. Add a filter feature as a new field, clause, and control, leaving every existing feature's clause and control as written.
- Removing a feature is a pure deletion of its `Filters` field, clause, control, and tests.
- Card-level features (weight/style expansion, axis playground) consume `Family` data the base already carries, live inside `Card`/child components, and stay independent of the filter layer.
- Every feature ships with tests for its clause and its control in the existing Vitest suites.

## Pending: AI Attribution and Disclosure

**Not yet set up. Do this first in the next substantive session, before other changes.** Follow the setup procedure and verification table in `~/dev/reference-material/ai-attribution-and-disclosure-spec.md`: create `.ai-attribution/config.json` with the current `HEAD` as baseline, install the machine-global pre/post-edit ledger hooks, vendor the report generator, and generate the initial `AI-USAGE.md`. Record Claude's share only through `AI-USAGE.md` and its ledger, keeping source files free of `% AI, % user` header comments (rejected; the spec records why). Once landed, replace this section with a one-line pointer to `AI-USAGE.md`.
