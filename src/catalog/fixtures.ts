// Font Viewer. Copyright (C) 2026 lvuCodes. Licensed under GPL-3.0-or-later; see LICENSE.

import type { Catalog, Family } from "./types";

export function makeFamily(overrides: Partial<Family> = {}): Family {
  return {
    family: "Test Sans",
    category: "Sans Serif",
    stroke: "Sans Serif",
    classifications: [],
    subsets: ["latin", "latin-ext"],
    variants: ["400", "400i", "700"],
    axes: [],
    designers: ["Ada Example"],
    dateAdded: "2020-01-01",
    lastModified: "2024-01-01",
    popularity: 10,
    trending: 10,
    defaultSort: 10,
    isNoto: false,
    isOpenSource: true,
    colorCapabilities: [],
    primaryScript: null,
    primaryLanguage: null,
    tags: [],
    ...overrides,
  };
}

export function makeCatalog(families: Family[]): Catalog {
  const subsets = [...new Set(families.flatMap((f) => f.subsets))].sort();
  const tagList = [...new Set(families.flatMap((f) => f.tags.map(([t]) => t)))].sort();
  return {
    generatedAt: "2026-01-01T00:00:00.000Z",
    count: families.length,
    subsets,
    tagList,
    axisNames: {},
    families,
  };
}
