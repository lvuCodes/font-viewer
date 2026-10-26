// Font Viewer. Copyright (C) 2026 lvuCodes. Licensed under GPL-3.0-or-later; see LICENSE.

export interface FamilyAxis {
  tag: string;
  min: number;
  max: number;
}

export type FamilyTag = [path: string, weight: number];

export interface Family {
  family: string;
  category: string;
  stroke: string | null;
  classifications: string[];
  subsets: string[];
  variants: string[];
  axes: FamilyAxis[];
  designers: string[];
  dateAdded: string;
  lastModified: string;
  popularity: number;
  trending: number;
  defaultSort: number;
  isNoto: boolean;
  isOpenSource: boolean;
  colorCapabilities: string[];
  primaryScript: string | null;
  primaryLanguage: string | null;
  tags: FamilyTag[];
}

export interface Catalog {
  generatedAt: string;
  count: number;
  subsets: string[];
  tagList: string[];
  axisNames: Record<string, string>;
  families: Family[];
}

export type SortId = "featured" | "trending" | "popular" | "newest" | "name";

export interface Filters {
  query: string;
  language: string;
  categories: string[];
  tags: string[];
  variableOnly: boolean;
  colorOnly: boolean;
  favoritesOnly: boolean;
  sort: SortId;
}

export const DEFAULT_FILTERS: Filters = {
  query: "",
  language: "",
  categories: [],
  tags: [],
  variableOnly: false,
  colorOnly: false,
  favoritesOnly: false,
  sort: "name",
};
