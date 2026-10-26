// Font Viewer. Copyright (C) 2026 lvuCodes. Licensed under GPL-3.0-or-later; see LICENSE.

import type { Family } from "./types";

export const FAVORITES_KEY = "fontViewer.favorites";

export function loadFavorites(): string[] {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(FAVORITES_KEY) ?? "[]");
    return Array.isArray(parsed) ? parsed.filter((v): v is string => typeof v === "string") : [];
  } catch {
    return [];
  }
}

export function saveFavorites(favorites: string[]): void {
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  } catch {
    // Storage blocked (private window, quota); favorites stay in memory for this visit.
  }
}

export function pruneFavorites(favorites: string[], families: Family[]): string[] {
  const live = new Set(families.map((f) => f.family));
  const kept = favorites.filter((name) => live.has(name));
  return kept.length === favorites.length ? favorites : kept;
}

export function toggleFavorite(favorites: string[], name: string): string[] {
  return favorites.includes(name) ? favorites.filter((n) => n !== name) : [...favorites, name];
}
