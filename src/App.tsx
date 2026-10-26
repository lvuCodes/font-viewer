// Font Viewer. Copyright (C) 2026 lvuCodes. Licensed under GPL-3.0-or-later; see LICENSE.

import { useEffect, useMemo, useState } from "react";
import "./App.css";
import { BackLink, FooterCredits, ThemeSwitcher, useTheme } from "@lvucodes/ui";
import type { Catalog, Filters } from "./catalog/types";
import { DEFAULT_FILTERS } from "./catalog/types";
import { applyFilters, groupTags } from "./catalog/filtering";
import { loadFavorites, pruneFavorites, saveFavorites, toggleFavorite } from "./catalog/favorites";
import FilterPanel from "./components/FilterPanel";
import TopBar from "./components/TopBar";
import Grid from "./components/Grid";

function App() {
  const [theme, setTheme] = useTheme();
  const [catalog, setCatalog] = useState<Catalog | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [previewText, setPreviewText] = useState("");
  const [previewSize, setPreviewSize] = useState(28);
  const [favorites, setFavorites] = useState<string[]>(loadFavorites);

  useEffect(() => saveFavorites(favorites), [favorites]);

  useEffect(() => {
    let cancelled = false;
    fetch(`${import.meta.env.BASE_URL}data/fonts.json`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<Catalog>;
      })
      .then((data) => {
        if (cancelled) return;
        setCatalog(data);
        setFavorites((prev) => pruneFavorites(prev, data.families));
      })
      .catch((err: unknown) => {
        if (!cancelled) setLoadError(err instanceof Error ? err.message : String(err));
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const tagGroups = useMemo(() => groupTags(catalog?.tagList ?? []), [catalog]);
  const favoriteSet = useMemo(() => new Set(favorites), [favorites]);
  const families = useMemo(
    () => applyFilters(catalog?.families ?? [], filters, favoriteSet),
    [catalog, filters, favoriteSet],
  );

  return (
    <main className="page">
      <BackLink />

      <h1>Font Viewer</h1>
      <p className="tagline">
        Browse the Google Fonts catalog — filter by language, category, feeling, appearance, and
        technology; preview with your own text.
      </p>

      <ThemeSwitcher theme={theme} onChange={setTheme} />

      {loadError && <p className="load-error">Failed to load the font catalog: {loadError}</p>}
      {!catalog && !loadError && <p className="loading">Loading the font catalog…</p>}

      {catalog && (
        <>
          <TopBar
            filters={filters}
            subsets={catalog.subsets}
            previewText={previewText}
            previewSize={previewSize}
            resultCount={families.length}
            totalCount={catalog.count}
            favoriteCount={favorites.length}
            onFilters={setFilters}
            onPreviewText={setPreviewText}
            onPreviewSize={setPreviewSize}
          />
          <div className="viewer">
            <FilterPanel filters={filters} tagGroups={tagGroups} onChange={setFilters} />
            <Grid
              families={families}
              language={filters.language}
              previewText={previewText}
              previewSize={previewSize}
              favorites={favoriteSet}
              onToggleFavorite={(name) => setFavorites((prev) => toggleFavorite(prev, name))}
            />
          </div>
        </>
      )}

      <FooterCredits
        licenseHref="https://github.com/lvuCodes/font-viewer/blob/main/LICENSE"
        year={2026}
      />
    </main>
  );
}

export default App;
