// Font Viewer. Copyright (C) 2026 lvuCodes. Licensed under GPL-3.0-or-later; see LICENSE.

import type { Family } from "./types";

export interface Style {
  weight: number;
  italic: boolean;
}

const WEIGHT_NAMES: Record<number, string> = {
  100: "Thin",
  200: "ExtraLight",
  300: "Light",
  400: "Regular",
  500: "Medium",
  600: "SemiBold",
  700: "Bold",
  800: "ExtraBold",
  900: "Black",
};

export function parseVariant(variant: string): Style {
  return { weight: Number.parseInt(variant, 10) || 400, italic: variant.endsWith("i") };
}

export function styleLabel({ weight, italic }: Style): string {
  const name = WEIGHT_NAMES[weight] ?? "Weight";
  return `${name} ${weight}${italic ? " Italic" : ""}`;
}

export function sortedStyles(variants: string[]): Style[] {
  return variants
    .map(parseVariant)
    .sort((a, b) => a.weight - b.weight || Number(a.italic) - Number(b.italic));
}

// Pick the variant to preview: 400 upright when present, else the upright
// nearest to 400, else the first italic.
export function previewVariant(variants: string[]): Style {
  const parsed = variants.map(parseVariant);
  const uprights = parsed.filter((v) => !v.italic);
  const pool = uprights.length > 0 ? uprights : parsed;
  pool.sort((a, b) => Math.abs(a.weight - 400) - Math.abs(b.weight - 400));
  return pool[0] ?? { weight: 400, italic: false };
}

function css2Url(family: Family, styles: Style[]): string {
  const name = family.family.replaceAll(" ", "+");
  const spec = styles.some((s) => s.italic)
    ? `ital,wght@${styles
        .map((s) => [Number(s.italic), s.weight])
        .sort((a, b) => a[0] - b[0] || a[1] - b[1])
        .map(([i, w]) => `${i},${w}`)
        .join(";")}`
    : `wght@${styles.map((s) => s.weight).join(";")}`;
  return `https://fonts.googleapis.com/css2?family=${name}:${spec}&display=swap`;
}

export function cssUrlFor(family: Family): string {
  return css2Url(family, [previewVariant(family.variants)]);
}

export function cssUrlForStyles(family: Family): string {
  return css2Url(family, sortedStyles(family.variants));
}

const requested = new Set<string>();

function loadStylesheet(href: string): void {
  if (requested.has(href)) return;
  requested.add(href);
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = href;
  document.head.appendChild(link);
}

export function ensureFontLoaded(family: Family): void {
  loadStylesheet(cssUrlFor(family));
}

export function ensureStylesLoaded(family: Family): void {
  loadStylesheet(cssUrlForStyles(family));
}
