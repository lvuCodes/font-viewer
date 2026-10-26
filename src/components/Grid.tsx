// Font Viewer. Copyright (C) 2026 lvuCodes. Licensed under GPL-3.0-or-later; see LICENSE.

import { useEffect, useRef, useState } from "react";
import type { Family } from "../catalog/types";
import Card from "./Card";

const PAGE_SIZE = 40;

interface GridProps {
  families: Family[];
  language: string;
  previewText: string;
  previewSize: number;
  favorites: ReadonlySet<string>;
  onToggleFavorite: (name: string) => void;
}

function Grid({
  families,
  language,
  previewText,
  previewSize,
  favorites,
  onToggleFavorite,
}: GridProps) {
  const [pages, setPages] = useState(1);
  const [lastFamilies, setLastFamilies] = useState(families);
  const sentinelRef = useRef<HTMLDivElement>(null);

  if (lastFamilies !== families) {
    setLastFamilies(families);
    setPages(1);
  }

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setPages((p) => (p * PAGE_SIZE >= families.length ? p : p + 1));
        }
      },
      { rootMargin: "600px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [families.length]);

  const shown = families.slice(0, pages * PAGE_SIZE);

  return (
    <section className="grid" aria-label="Font families">
      {shown.map((f) => (
        <Card
          key={f.family}
          family={f}
          language={language}
          previewText={previewText}
          previewSize={previewSize}
          favorite={favorites.has(f.family)}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
      {shown.length < families.length && <div className="grid-sentinel" ref={sentinelRef} />}
      {families.length === 0 && <p className="grid-empty">No families match the active filters.</p>}
    </section>
  );
}

export default Grid;
