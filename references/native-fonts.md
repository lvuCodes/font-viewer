Native system and application fonts vary by operating system and default rendering choices. Modern systems use specialized UI typefaces designed for high legibility across screens.

### Operating System Native Fonts

| Operating System         | Default UI / System Font                | Serif Equivalent | Monospace Font        |
| ------------------------ | --------------------------------------- | ---------------- | --------------------- |
| **macOS / iOS**          | **San Francisco** (SF Pro / SF Compact) | New York, Times  | SF Mono, Menlo        |
| **Windows**              | **Segoe UI**                            | Times New Roman  | Consolas, Courier New |
| **Linux (Ubuntu)**       | **Ubuntu**                              | Liberation Serif | Ubuntu Mono           |
| **Linux (GNOME/Fedora)** | **Cantarell**                           | DejaVu Serif     | DejaVu Sans Mono      |
| **Android**              | **Roboto**                              | Noto Serif       | Roboto Mono           |

---

### Browser Default & Fallback Fonts

Browsers themselves don't usually ship with unique proprietary font families for standard text rendering; instead, they inherit or map generic CSS font families (`sans-serif`, `serif`, `monospace`) to the host operating system's native defaults.

* **Google Chrome / Microsoft Edge:**
* On Windows, defaults to **Arial** (`sans-serif`), **Times New Roman** (`serif`), and **Courier New** / **Consolas** (`monospace`).
* On macOS, maps to **Helvetica** or **San Francisco** variants.


* **Apple Safari:**
* Relies natively on Apple's system fonts (**San Francisco** for UI/sans-serif, **New York** for serif, and **SF Mono**).


* **Mozilla Firefox:**
* Dynamically queries the underlying OS font engine, defaulting to system sans-serif fonts like **Segoe UI** (Windows), **San Francisco** (macOS), or **DejaVu Sans** (Linux) unless overridden in preferences.

---

### San Francisco High Legibility (macOS)

SF Pro carries optional stylistic sets, listed by CoreText on macOS 26.7.1: Straight-sided six and nine, Open four, Vertically centered colon, Open currencies, **High legibility (`ss06`)**, **One storey a (`ss07`)**, Calculator. `ss06` gives a serifed `I`, a tailed `l`, and a slashed `0`. `ss07` gives a one-storey `a`.

![SF Mono, SF Rounded, SF default, SF with ss06, SF with ss06 and ss07, and Atkinson Hyperlegible references](sf-comparison.png)

| Context | Method | Coverage |
| --- | --- | --- |
| **System UI** (menus, Finder, System Settings, Chrome toolbar) | Replace `/System/Library/Fonts/SFNS.ttf` after disabling SIP and the sealed system volume from Recovery | Unavailable without compromising the OS, reverted by every update |
| **Accessibility Reader** | Command-Escape > More Customization > Font: System Font > High Legibility Characters | Reader window only |
| **Web pages (Chrome)** | Chrome QoL > Theme Override > San Francisco Hyperlegible choices | Pages and the extension's own pages |
| **Any CSS** | `font-family: system-ui;` with `font-feature-settings: "ss06", "ss07";` | Text that renders in SF, verified in Chrome |
| **Any app with a font picker** | Installed font **SF Pro Hyperlegible** (`~/Library/Fonts`) | Picker-driven apps |
| **Mail, TextEdit** | Default fonts set to `SFProHyperlegible-Regular` | New messages and documents |
| **TextEdit, Notes, Pages** | Format > Font > Show Fonts > gear > Typography > Alternative Stylistic Sets | Per selection |
| **Bold Text** (`EnhancedTextLegibilityEnabled`) | Siri or `defaults` | Weight only, letter shapes unchanged |

#### SF Pro Hyperlegible Build

- **Source:** `/Library/Fonts/SF-Pro.ttf` and `SF-Pro-Italic.ttf` (variable fonts from Apple's SF Pro download).
- **Script:** [freeze-sf-features.py](file:///Users/mizuneko/dev/reference-material/sf-hyperlegible/freeze-sf-features.py), run as `python3 -I freeze-sf-features.py <src.ttf> <dst.ttf>`.
- **Mechanism:** the `ss06` and `ss07` single-substitution lookups are applied to the `cmap`, so the alternates become the default glyphs. Family and PostScript names (name IDs 1, 3, 4, 6, 16, 18, 21, 25) become `SF Pro Hyperlegible` / `SFProHyperlegible`.
- **Named instances:** their PostScript name IDs are cleared, since renamed instance names stop Chrome from loading the font and unrenamed ones would clash with SF Pro.
- **Upkeep:** rebuild after a macOS or SF Pro update replaces the source files.
- **License:** Apple's SF license limits modification, so the build is for personal use only.
