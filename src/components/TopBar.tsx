// Font Viewer. Copyright (C) 2026 lvuCodes. Licensed under GPL-3.0-or-later; see LICENSE.

import type { Filters } from "../catalog/types";
import { SORTS } from "../catalog/filtering";
import { labelForSubset } from "../catalog/languages";

interface TopBarProps {
  filters: Filters;
  subsets: string[];
  previewText: string;
  previewSize: number;
  resultCount: number;
  totalCount: number;
  favoriteCount: number;
  onFilters: (next: Filters) => void;
  onPreviewText: (text: string) => void;
  onPreviewSize: (size: number) => void;
}

function TopBar({
  filters,
  subsets,
  previewText,
  previewSize,
  resultCount,
  totalCount,
  favoriteCount,
  onFilters,
  onPreviewText,
  onPreviewSize,
}: TopBarProps) {
  return (
    <div className="topbar">
      <div className="topbar-row">
        <input
          className="search"
          type="search"
          placeholder="Search fonts or designers"
          value={filters.query}
          onChange={(e) => onFilters({ ...filters, query: e.target.value })}
        />
        <label className="control">
          Language
          <select
            value={filters.language}
            onChange={(e) => onFilters({ ...filters, language: e.target.value })}
          >
            <option value="">All languages</option>
            {subsets.map((s) => (
              <option key={s} value={s}>
                {labelForSubset(s)}
              </option>
            ))}
          </select>
        </label>
        <label className="control">
          Sort
          <select
            value={filters.sort}
            onChange={(e) => onFilters({ ...filters, sort: e.target.value as Filters["sort"] })}
          >
            {SORTS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          className="pill favorites-toggle"
          aria-pressed={filters.favoritesOnly}
          onClick={() => onFilters({ ...filters, favoritesOnly: !filters.favoritesOnly })}
        >
          ♥ Favorites ({favoriteCount})
        </button>
        <span className="result-count">
          {resultCount} / {totalCount} families
        </span>
      </div>
      <div className="topbar-row">
        <input
          className="preview-input"
          type="text"
          placeholder="Type a preview text (empty = language sample)"
          value={previewText}
          onChange={(e) => onPreviewText(e.target.value)}
        />
        <label className="control control-size">
          {previewSize}px
          <input
            type="range"
            min={8}
            max={112}
            step={1}
            value={previewSize}
            onChange={(e) => onPreviewSize(Number(e.target.value))}
          />
        </label>
      </div>
    </div>
  );
}

export default TopBar;
