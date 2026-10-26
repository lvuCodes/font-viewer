// Font Viewer. Copyright (C) 2026 lvuCodes. Licensed under GPL-3.0-or-later; see LICENSE.
//
// Builds public/data/fonts.json from Google's own sources:
//   - https://fonts.google.com/metadata/fonts          (family metadata: subsets, axes, popularity, …)
//   - google/fonts repo tags/all/families.csv          (Feeling / Appearance / Theme / Seasonal tags)
//
// Run: node scripts/build-data.mjs
// If the network is unavailable and public/data/fonts.json already exists, the existing file is kept.

import { mkdir, writeFile, access } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "public", "data", "fonts.json");

const METADATA_URL = "https://fonts.google.com/metadata/fonts";
const TAGS_URL = "https://raw.githubusercontent.com/google/fonts/main/tags/all/families.csv";

// Tag groups surfaced in the UI; /Quality/* is Google-internal ranking noise.
const TAG_GROUPS = new Set([
  "Expressive",
  "Serif",
  "Sans",
  "Slab",
  "Script",
  "Monospace",
  "Theme",
  "Seasonal",
  "Purpose",
  "Special use",
]);
const MIN_TAG_WEIGHT = 50;

async function fetchText(url) {
  const res = await fetch(url, { signal: AbortSignal.timeout(60_000) });
  if (!res.ok) throw new Error(`${url} → HTTP ${res.status}`);
  return res.text();
}

function parseCsvLine(line) {
  const fields = [];
  let cur = "";
  let quoted = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (quoted) {
      if (ch === '"' && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else if (ch === '"') {
        quoted = false;
      } else {
        cur += ch;
      }
    } else if (ch === '"') {
      quoted = true;
    } else if (ch === ",") {
      fields.push(cur);
      cur = "";
    } else {
      cur += ch;
    }
  }
  fields.push(cur);
  return fields;
}

function parseTags(csv) {
  const byFamily = new Map();
  for (const line of csv.split("\n")) {
    if (!line.trim()) continue;
    const [family, , tagPath, weightStr] = parseCsvLine(line);
    if (!family || !tagPath?.startsWith("/")) continue;
    const group = tagPath.split("/")[1];
    if (!TAG_GROUPS.has(group)) continue;
    const weight = Number(weightStr);
    if (!Number.isFinite(weight)) continue;
    let tags = byFamily.get(family);
    if (!tags) byFamily.set(family, (tags = new Map()));
    tags.set(tagPath, Math.max(tags.get(tagPath) ?? 0, weight));
  }
  return byFamily;
}

function buildFamilies(metadata, tagsByFamily) {
  return metadata.familyMetadataList.map((f) => {
    const tags = [...(tagsByFamily.get(f.family) ?? new Map())]
      .filter(([, w]) => w >= MIN_TAG_WEIGHT)
      .sort((a, b) => b[1] - a[1])
      .map(([t, w]) => [t, w]);
    return {
      family: f.family,
      category: f.category,
      stroke: f.stroke ?? null,
      classifications: f.classifications,
      subsets: f.subsets.filter((s) => s !== "menu"),
      variants: Object.keys(f.fonts),
      axes: f.axes.map((a) => ({ tag: a.tag, min: a.min, max: a.max })),
      designers: f.designers,
      dateAdded: f.dateAdded,
      lastModified: f.lastModified,
      popularity: f.popularity,
      trending: f.trending,
      defaultSort: f.defaultSort,
      isNoto: f.isNoto,
      isOpenSource: f.isOpenSource,
      colorCapabilities: f.colorCapabilities,
      primaryScript: f.primaryScript || null,
      primaryLanguage: f.primaryLanguage || null,
      tags,
    };
  });
}

async function main() {
  let metadataText, tagsText;
  try {
    [metadataText, tagsText] = await Promise.all([fetchText(METADATA_URL), fetchText(TAGS_URL)]);
  } catch (err) {
    const exists = await access(OUT)
      .then(() => true)
      .catch(() => false);
    if (exists) {
      console.warn(`Fetch failed (${err.message}); keeping existing ${OUT}`);
      return;
    }
    throw err;
  }

  // The endpoint occasionally ships the anti-JSON-hijack prefix.
  const metadata = JSON.parse(metadataText.replace(/^\)\]\}'/, ""));
  const families = buildFamilies(metadata, parseTags(tagsText));

  const subsets = [...new Set(families.flatMap((f) => f.subsets))].sort();
  const tagList = [...new Set(families.flatMap((f) => f.tags.map(([t]) => t)))].sort();
  const axisNames = Object.fromEntries(metadata.axisRegistry.map((a) => [a.tag, a.displayName]));

  const out = {
    generatedAt: new Date().toISOString(),
    count: families.length,
    subsets,
    tagList,
    axisNames,
    families,
  };

  await mkdir(dirname(OUT), { recursive: true });
  await writeFile(OUT, JSON.stringify(out));
  console.log(
    `Wrote ${OUT}: ${families.length} families, ${subsets.length} subsets, ${tagList.length} tags`,
  );
}

await main();
