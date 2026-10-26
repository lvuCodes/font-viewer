// Font Viewer. Copyright (C) 2026 lvuCodes. Licensed under GPL-3.0-or-later; see LICENSE.
// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  FAVORITES_KEY,
  loadFavorites,
  pruneFavorites,
  saveFavorites,
  toggleFavorite,
} from "./favorites";
import { matchesFilters } from "./filtering";
import { DEFAULT_FILTERS } from "./types";
import { makeFamily } from "./fixtures";

afterEach(() => {
  localStorage.clear();
  vi.restoreAllMocks();
});

describe("favorites storage", () => {
  it("round-trips through localStorage", () => {
    saveFavorites(["Lora", "Inter"]);
    expect(loadFavorites()).toEqual(["Lora", "Inter"]);
  });

  it("returns an empty list for missing, corrupt, or non-array data", () => {
    expect(loadFavorites()).toEqual([]);
    localStorage.setItem(FAVORITES_KEY, "{not json");
    expect(loadFavorites()).toEqual([]);
    localStorage.setItem(FAVORITES_KEY, '{"a":1}');
    expect(loadFavorites()).toEqual([]);
  });

  it("survives blocked storage", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    expect(loadFavorites()).toEqual([]);
    expect(() => saveFavorites(["Lora"])).not.toThrow();
  });
});

describe("favorites list", () => {
  it("toggles a name in and out", () => {
    expect(toggleFavorite([], "Lora")).toEqual(["Lora"]);
    expect(toggleFavorite(["Lora", "Inter"], "Lora")).toEqual(["Inter"]);
  });

  it("drops names absent from the catalog and keeps identity when nothing changes", () => {
    const families = [makeFamily({ family: "Lora" })];
    expect(pruneFavorites(["Lora", "Gone Sans"], families)).toEqual(["Lora"]);
    const same = ["Lora"];
    expect(pruneFavorites(same, families)).toBe(same);
  });

  it("filters to favorites only when favoritesOnly is set", () => {
    const lora = makeFamily({ family: "Lora" });
    const inter = makeFamily({ family: "Inter" });
    const favs = new Set(["Lora"]);
    const filters = { ...DEFAULT_FILTERS, favoritesOnly: true };
    expect(matchesFilters(lora, filters, favs)).toBe(true);
    expect(matchesFilters(inter, filters, favs)).toBe(false);
    expect(matchesFilters(inter, DEFAULT_FILTERS, favs)).toBe(true);
  });
});
