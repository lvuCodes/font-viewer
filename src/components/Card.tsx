// Font Viewer. Copyright (C) 2026 lvuCodes. Licensed under GPL-3.0-or-later; see LICENSE.

import { useEffect, useRef, useState } from "react";
import type { Family } from "../catalog/types";
import { isColor, isVariable } from "../catalog/filtering";
import {
  ensureFontLoaded,
  ensureStylesLoaded,
  previewVariant,
  sortedStyles,
  styleLabel,
} from "../catalog/fontCss";
import { sampleForFamily } from "../catalog/languages";

interface CardProps {
  family: Family;
  language: string;
  previewText: string;
  previewSize: number;
  favorite: boolean;
  onToggleFavorite: (name: string) => void;
}

function specimenUrl(family: Family): string {
  return `https://fonts.google.com/specimen/${family.family.replaceAll(" ", "+")}`;
}

function Card({
  family,
  language,
  previewText,
  previewSize,
  favorite,
  onToggleFavorite,
}: CardProps) {
  const rootRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (visible) ensureFontLoaded(family);
  }, [visible, family]);

  useEffect(() => {
    if (expanded) ensureStylesLoaded(family);
  }, [expanded, family]);

  const { weight, italic } = previewVariant(family.variants);
  const text = previewText.trim() || sampleForFamily(family.subsets, language) || family.family;

  return (
    <article className="card" ref={rootRef}>
      <header className="card-head">
        <button
          type="button"
          className="fav-toggle"
          aria-pressed={favorite}
          aria-label={`Favorite ${family.family}`}
          onClick={() => onToggleFavorite(family.family)}
        >
          {favorite ? "♥" : "♡"}
        </button>
        <a className="card-name" href={specimenUrl(family)} target="_blank" rel="noreferrer">
          {family.family}
        </a>
        <span className="card-designers">{family.designers.join(", ")}</span>
        <span className="card-meta">
          <span className="tag">{family.category}</span>
          {isVariable(family) && <span className="tag tag-variable">Variable</span>}
          {isColor(family) && <span className="tag tag-color">Color</span>}
          {family.isNoto && <span className="tag">Noto</span>}
          {family.variants.length > 1 && (
            <button
              type="button"
              className="pill card-styles-toggle"
              aria-expanded={expanded}
              onClick={() => setExpanded(!expanded)}
            >
              {family.variants.length} styles
            </button>
          )}
        </span>
      </header>
      <p
        className="card-preview"
        style={{
          fontFamily: visible ? `"${family.family}"` : undefined,
          fontSize: `${previewSize}px`,
          fontWeight: weight,
          fontStyle: italic ? "italic" : "normal",
        }}
      >
        {text}
      </p>
      {expanded && (
        <ul className="card-styles">
          {sortedStyles(family.variants).map((style) => (
            <li key={`${style.weight}${style.italic ? "i" : ""}`}>
              <span className="card-style-label">{styleLabel(style)}</span>
              <span
                className="card-style-sample"
                style={{
                  fontFamily: `"${family.family}"`,
                  fontSize: `${previewSize}px`,
                  fontWeight: style.weight,
                  fontStyle: style.italic ? "italic" : "normal",
                }}
              >
                {text}
              </span>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}

export default Card;
