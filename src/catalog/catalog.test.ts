// Font Viewer. Copyright (C) 2026 lvuCodes. Licensed under GPL-3.0-or-later; see LICENSE.

import { describe, expect, it } from "vitest";
import { applyFilters, groupTags, matchesFilters, sortFamilies } from "./filtering";
import { cssUrlFor, cssUrlForStyles, previewVariant, sortedStyles, styleLabel } from "./fontCss";
import { labelForSubset, sampleForFamily, SAMPLE_TEXTS } from "./languages";
import { DEFAULT_FILTERS } from "./types";
import { makeFamily } from "./fixtures";

describe("matchesFilters", () => {
  it("filters by language subset", () => {
    const f = makeFamily({ subsets: ["latin", "greek"] });
    expect(matchesFilters(f, { ...DEFAULT_FILTERS, language: "greek" })).toBe(true);
    expect(matchesFilters(f, { ...DEFAULT_FILTERS, language: "thai" })).toBe(false);
  });

  it("unions selected categories", () => {
    const serif = makeFamily({ category: "Serif" });
    expect(matchesFilters(serif, { ...DEFAULT_FILTERS, categories: ["Serif", "Display"] })).toBe(
      true,
    );
    expect(matchesFilters(serif, { ...DEFAULT_FILTERS, categories: ["Display"] })).toBe(false);
  });

  it("requires every selected tag", () => {
    const f = makeFamily({
      tags: [
        ["/Expressive/Calm", 80],
        ["/Sans/Geometric", 100],
      ],
    });
    expect(
      matchesFilters(f, { ...DEFAULT_FILTERS, tags: ["/Expressive/Calm", "/Sans/Geometric"] }),
    ).toBe(true);
    expect(
      matchesFilters(f, { ...DEFAULT_FILTERS, tags: ["/Expressive/Calm", "/Theme/Pixel"] }),
    ).toBe(false);
  });

  it("gates on variable and color technology", () => {
    const variable = makeFamily({ axes: [{ tag: "wght", min: 100, max: 900 }] });
    const color = makeFamily({ colorCapabilities: ["COLRV1"] });
    const plain = makeFamily();
    expect(matchesFilters(variable, { ...DEFAULT_FILTERS, variableOnly: true })).toBe(true);
    expect(matchesFilters(plain, { ...DEFAULT_FILTERS, variableOnly: true })).toBe(false);
    expect(matchesFilters(color, { ...DEFAULT_FILTERS, colorOnly: true })).toBe(true);
    expect(matchesFilters(plain, { ...DEFAULT_FILTERS, colorOnly: true })).toBe(false);
  });

  it("searches family names and designers case-insensitively", () => {
    const f = makeFamily({ family: "Alpha Serif", designers: ["Grace Hopper"] });
    expect(matchesFilters(f, { ...DEFAULT_FILTERS, query: "alpha" })).toBe(true);
    expect(matchesFilters(f, { ...DEFAULT_FILTERS, query: "hopper" })).toBe(true);
    expect(matchesFilters(f, { ...DEFAULT_FILTERS, query: "beta" })).toBe(false);
  });
});

describe("sortFamilies", () => {
  const a = makeFamily({
    family: "A",
    popularity: 2,
    trending: 1,
    dateAdded: "2024-05-01",
    defaultSort: 2,
  });
  const b = makeFamily({
    family: "B",
    popularity: 1,
    trending: 2,
    dateAdded: "2020-01-01",
    defaultSort: 1,
  });

  it("orders by each sort key", () => {
    expect(sortFamilies([a, b], "featured").map((f) => f.family)).toEqual(["B", "A"]);
    expect(sortFamilies([a, b], "trending").map((f) => f.family)).toEqual(["A", "B"]);
    expect(sortFamilies([b, a], "popular").map((f) => f.family)).toEqual(["B", "A"]);
    expect(sortFamilies([b, a], "newest").map((f) => f.family)).toEqual(["A", "B"]);
    expect(sortFamilies([b, a], "name").map((f) => f.family)).toEqual(["A", "B"]);
  });

  it("does not mutate its input", () => {
    const input = [a, b];
    sortFamilies(input, "name");
    expect(input.map((f) => f.family)).toEqual(["A", "B"]);
  });
});

describe("applyFilters", () => {
  it("filters then sorts", () => {
    const serif = makeFamily({ family: "Serif One", category: "Serif", defaultSort: 2 });
    const sans = makeFamily({ family: "Sans One", category: "Sans Serif", defaultSort: 1 });
    const result = applyFilters([serif, sans], { ...DEFAULT_FILTERS, categories: ["Serif"] });
    expect(result.map((f) => f.family)).toEqual(["Serif One"]);
  });
});

describe("groupTags", () => {
  it("groups paths under UI labels in the fixed order", () => {
    const groups = groupTags(["/Theme/Pixel", "/Expressive/Calm", "/Sans/Geometric"]);
    expect(groups.map((g) => g.label)).toEqual(["Feeling", "Sans Serif", "Theme"]);
    expect(groups[0].tags).toEqual([{ path: "/Expressive/Calm", label: "Calm" }]);
  });
});

describe("previewVariant / cssUrlFor", () => {
  it("prefers upright 400, then the nearest upright, then italics", () => {
    expect(previewVariant(["400", "700", "400i"])).toEqual({ weight: 400, italic: false });
    expect(previewVariant(["300", "700i"])).toEqual({ weight: 300, italic: false });
    expect(previewVariant(["500i"])).toEqual({ weight: 500, italic: true });
  });

  it("builds a css2 URL for the chosen variant", () => {
    expect(cssUrlFor(makeFamily({ family: "PT Sans", variants: ["400"] }))).toBe(
      "https://fonts.googleapis.com/css2?family=PT+Sans:wght@400&display=swap",
    );
    expect(cssUrlFor(makeFamily({ family: "Molle", variants: ["400i"] }))).toBe(
      "https://fonts.googleapis.com/css2?family=Molle:ital,wght@1,400&display=swap",
    );
  });
});

describe("sortedStyles / styleLabel / cssUrlForStyles", () => {
  it("orders styles by weight with each italic after its upright", () => {
    expect(sortedStyles(["700", "400i", "400", "100"])).toEqual([
      { weight: 100, italic: false },
      { weight: 400, italic: false },
      { weight: 400, italic: true },
      { weight: 700, italic: false },
    ]);
  });

  it("names each style by weight and italic", () => {
    expect(styleLabel({ weight: 100, italic: false })).toBe("Thin 100");
    expect(styleLabel({ weight: 600, italic: true })).toBe("SemiBold 600 Italic");
  });

  it("requests every style in one css2 URL", () => {
    expect(cssUrlForStyles(makeFamily({ family: "PT Sans", variants: ["700", "400"] }))).toBe(
      "https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&display=swap",
    );
    expect(cssUrlForStyles(makeFamily({ family: "Lora", variants: ["400", "400i", "700"] }))).toBe(
      "https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,700;1,400&display=swap",
    );
  });
});

describe("languages", () => {
  it("labels subsets, with overrides for the irregular ones", () => {
    expect(labelForSubset("latin-ext")).toBe("Latin Extended");
    expect(labelForSubset("chinese-simplified")).toBe("Chinese (Simplified)");
    expect(labelForSubset("old-turkic")).toBe("Old Turkic");
  });

  it("picks the active language sample when the family supports it", () => {
    expect(sampleForFamily(["greek", "latin"], "greek")).toBe(SAMPLE_TEXTS.greek);
    expect(sampleForFamily(["japanese", "latin"], "")).toBe(SAMPLE_TEXTS.japanese);
    expect(sampleForFamily(["tangut"], "")).toBeNull();
  });
});
