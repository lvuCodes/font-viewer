// Font Viewer. Copyright (C) 2026 lvuCodes. Licensed under GPL-3.0-or-later; see LICENSE.

import type { Filters } from "../catalog/types";
import { CATEGORIES, type TagGroup } from "../catalog/filtering";

interface FilterPanelProps {
  filters: Filters;
  tagGroups: TagGroup[];
  onChange: (next: Filters) => void;
}

function toggle(list: string[], value: string): string[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

function FilterPanel({ filters, tagGroups, onChange }: FilterPanelProps) {
  const active =
    filters.categories.length +
    filters.tags.length +
    (filters.variableOnly ? 1 : 0) +
    (filters.colorOnly ? 1 : 0);

  return (
    <aside className="filter-panel">
      <details className="filter-group" open>
        <summary className="filter-group-label">Category</summary>
        <div className="chips">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              className="chip"
              aria-pressed={filters.categories.includes(c)}
              onClick={() => onChange({ ...filters, categories: toggle(filters.categories, c) })}
            >
              {c}
            </button>
          ))}
        </div>
      </details>

      <details className="filter-group" open>
        <summary className="filter-group-label">Technology</summary>
        <div className="chips">
          <button
            type="button"
            className="chip"
            aria-pressed={filters.variableOnly}
            onClick={() => onChange({ ...filters, variableOnly: !filters.variableOnly })}
          >
            Variable
          </button>
          <button
            type="button"
            className="chip"
            aria-pressed={filters.colorOnly}
            onClick={() => onChange({ ...filters, colorOnly: !filters.colorOnly })}
          >
            Color
          </button>
        </div>
      </details>

      {tagGroups.map((group) => (
        <details className="filter-group" key={group.group} open={group.group === "Expressive"}>
          <summary className="filter-group-label">{group.label}</summary>
          <div className="chips">
            {group.tags.map((t) => (
              <button
                key={t.path}
                type="button"
                className="chip"
                aria-pressed={filters.tags.includes(t.path)}
                onClick={() => onChange({ ...filters, tags: toggle(filters.tags, t.path) })}
              >
                {t.label}
              </button>
            ))}
          </div>
        </details>
      ))}

      {active > 0 && (
        <button
          type="button"
          className="chip chip-clear"
          onClick={() =>
            onChange({
              ...filters,
              categories: [],
              tags: [],
              variableOnly: false,
              colorOnly: false,
            })
          }
        >
          Clear filters ({active})
        </button>
      )}
    </aside>
  );
}

export default FilterPanel;
