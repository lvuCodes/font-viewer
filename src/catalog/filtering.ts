// Font Viewer. Copyright (C) 2026 lvuCodes. Licensed under GPL-3.0-or-later; see LICENSE.

import type { Family, Filters, SortId } from "./types";

export const CATEGORIES = ["Serif", "Sans Serif", "Display", "Handwriting", "Monospace"];

export const SORTS: { id: SortId; label: string }[] = [
  { id: "featured", label: "Featured" },
  { id: "trending", label: "Trending" },
  { id: "popular", label: "Most popular" },
  { id: "newest", label: "Newest" },
  { id: "name", label: "Name" },
];

export function isVariable(family: Family): boolean {
  return family.axes.length > 0;
}

export function isColor(family: Family): boolean {
  return family.colorCapabilities.length > 0;
}

const NO_FAVORITES: ReadonlySet<string> = new Set();

export function matchesFilters(
  family: Family,
  filters: Filters,
  favorites: ReadonlySet<string> = NO_FAVORITES,
): boolean {
  if (filters.language && !family.subsets.includes(filters.language)) return false;
  if (filters.categories.length > 0 && !filters.categories.includes(family.category)) return false;
  if (filters.variableOnly && !isVariable(family)) return false;
  if (filters.colorOnly && !isColor(family)) return false;
  if (filters.favoritesOnly && !favorites.has(family.family)) return false;
  if (filters.tags.length > 0) {
    const own = new Set(family.tags.map(([path]) => path));
    if (!filters.tags.every((t) => own.has(t))) return false;
  }
  const query = filters.query.trim().toLowerCase();
  if (query) {
    const haystack = `${family.family} ${family.designers.join(" ")}`.toLowerCase();
    if (!haystack.includes(query)) return false;
  }
  return true;
}

export function sortFamilies(families: Family[], sort: SortId): Family[] {
  const sorted = [...families];
  switch (sort) {
    case "trending":
      sorted.sort((a, b) => a.trending - b.trending);
      break;
    case "popular":
      sorted.sort((a, b) => a.popularity - b.popularity);
      break;
    case "newest":
      sorted.sort((a, b) => b.dateAdded.localeCompare(a.dateAdded));
      break;
    case "name":
      sorted.sort((a, b) => a.family.localeCompare(b.family));
      break;
    default:
      sorted.sort((a, b) => a.defaultSort - b.defaultSort);
  }
  return sorted;
}

export function applyFilters(
  families: Family[],
  filters: Filters,
  favorites: ReadonlySet<string> = NO_FAVORITES,
): Family[] {
  return sortFamilies(
    families.filter((f) => matchesFilters(f, filters, favorites)),
    filters.sort,
  );
}

export interface TagGroup {
  group: string;
  label: string;
  tags: { path: string; label: string }[];
}

const TAG_GROUP_LABELS: Record<string, string> = {
  Expressive: "Feeling",
  Serif: "Serif",
  Sans: "Sans Serif",
  Slab: "Slab",
  Script: "Calligraphy",
  Monospace: "Monospace",
  Theme: "Theme",
  Seasonal: "Seasonal",
  Purpose: "Purpose",
  "Special use": "Special Use",
};

const TAG_GROUP_ORDER = Object.keys(TAG_GROUP_LABELS);

export function groupTags(tagList: string[]): TagGroup[] {
  const byGroup = new Map<string, { path: string; label: string }[]>();
  for (const path of tagList) {
    const [, group, ...rest] = path.split("/");
    const label = rest.join("/");
    if (!byGroup.has(group)) byGroup.set(group, []);
    byGroup.get(group)!.push({ path, label });
  }
  return TAG_GROUP_ORDER.filter((g) => byGroup.has(g)).map((g) => ({
    group: g,
    label: TAG_GROUP_LABELS[g],
    tags: byGroup.get(g)!.sort((a, b) => a.label.localeCompare(b.label)),
  }));
}
