// Font Viewer. Copyright (C) 2026 lvuCodes. Licensed under GPL-3.0-or-later; see LICENSE.
// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";
import {
  BACK_LINK_DEFAULT_HREF,
  BACK_LINK_DEFAULT_LABEL,
  DEFAULT_THEME,
  THEMES,
} from "@lvucodes/ui";
import { makeCatalog, makeFamily } from "./catalog/fixtures";

const LICENSE_HREF = "https://github.com/lvuCodes/font-viewer/blob/main/LICENSE";

const CATALOG = makeCatalog([
  makeFamily({ family: "Alpha Sans", category: "Sans Serif", defaultSort: 1 }),
  makeFamily({
    family: "Beta Serif",
    category: "Serif",
    defaultSort: 2,
    subsets: ["latin", "greek"],
  }),
]);

class ObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
}

beforeEach(() => {
  vi.stubGlobal("IntersectionObserver", ObserverStub);
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve(CATALOG) }),
  );
});

afterEach(() => {
  cleanup();
  localStorage.clear();
  vi.unstubAllGlobals();
});

describe("App", () => {
  it("renders the back link with the package's default href and label", async () => {
    render(<App />);
    const back = screen.getByRole("link", { name: BACK_LINK_DEFAULT_LABEL });
    expect(back.getAttribute("href")).toBe(BACK_LINK_DEFAULT_HREF);
    await screen.findByText("Alpha Sans");
  });

  it("applies the theme picked from the switcher to the document element", async () => {
    render(<App />);
    const picked = THEMES.find((t) => t.id !== DEFAULT_THEME)!;
    await userEvent.click(screen.getByRole("button", { name: picked.label }));
    expect(document.documentElement.dataset.theme).toBe(picked.id);
    await screen.findByText("Alpha Sans");
  });

  it("links this repo's own licence from the footer", async () => {
    const { container } = render(<App />);
    const footer = container.querySelector("footer.credits")!;
    const hrefs = [...footer.querySelectorAll("a")].map((a) => a.getAttribute("href"));
    expect(hrefs).toContain(LICENSE_HREF);
    await screen.findByText("Alpha Sans");
  });

  it("loads the catalog and filters families by category chips", async () => {
    render(<App />);
    await screen.findByText("Alpha Sans");
    expect(screen.getByText("Beta Serif")).toBeTruthy();
    await userEvent.click(screen.getByRole("button", { name: "Serif", pressed: false }));
    expect(screen.queryByText("Alpha Sans")).toBeNull();
    expect(screen.getByText("Beta Serif")).toBeTruthy();
    expect(screen.getByText("1 / 2 families")).toBeTruthy();
  });

  it("narrows by the language dropdown", async () => {
    render(<App />);
    await screen.findByText("Alpha Sans");
    await userEvent.selectOptions(screen.getByLabelText(/Language/), "greek");
    expect(screen.queryByText("Alpha Sans")).toBeNull();
    expect(screen.getByText("Beta Serif")).toBeTruthy();
  });

  it("renders Category and Technology as collapsible groups that start open", async () => {
    const { container } = render(<App />);
    await screen.findByText("Alpha Sans");
    for (const label of ["Category", "Technology"]) {
      const summary = [...container.querySelectorAll("summary")].find(
        (s) => s.textContent === label,
      )!;
      const group = summary.parentElement as HTMLDetailsElement;
      expect(group.tagName).toBe("DETAILS");
      expect(group.open).toBe(true);
      await userEvent.click(summary);
      expect(group.open).toBe(false);
    }
  });

  it("expands a card's styles list from its styles button", async () => {
    const { container } = render(<App />);
    await screen.findByText("Alpha Sans");
    const toggle = screen.getAllByRole("button", { name: "3 styles" })[0];
    expect(toggle.getAttribute("aria-expanded")).toBe("false");
    await userEvent.click(toggle);
    expect(toggle.getAttribute("aria-expanded")).toBe("true");
    const labels = [...container.querySelectorAll(".card-style-label")].slice(0, 3);
    expect(labels.map((l) => l.textContent)).toEqual([
      "Regular 400",
      "Regular 400 Italic",
      "Bold 700",
    ]);
    await userEvent.click(toggle);
    expect(container.querySelector(".card-styles")).toBeNull();
  });

  it("shows category and technology metadata as tags, not buttons", async () => {
    render(<App />);
    await screen.findByText("Alpha Sans");
    const tag = screen.getAllByText("Sans Serif").find((el) => el.classList.contains("tag"))!;
    expect(tag.tagName).toBe("SPAN");
  });

  it("sorts by name by default", async () => {
    render(<App />);
    await screen.findByText("Alpha Sans");
    expect((screen.getByLabelText(/Sort/) as HTMLSelectElement).value).toBe("name");
  });

  it("shows no styles control on a single-style family", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve(makeCatalog([makeFamily({ family: "Gamma Mono", variants: ["400"] })])),
      }),
    );
    render(<App />);
    const name = await screen.findByText("Gamma Mono");
    const card = name.closest(".card")!;
    expect(card.querySelector(".card-styles-toggle")).toBeNull();
    expect(card.textContent).not.toMatch(/style/);
  });

  it("hearts a family, saves it, and shows only favorites from the toggle", async () => {
    render(<App />);
    await screen.findByText("Alpha Sans");
    await userEvent.click(screen.getByRole("button", { name: "Favorite Beta Serif" }));
    expect(
      screen.getByRole("button", { name: "Favorite Beta Serif" }).getAttribute("aria-pressed"),
    ).toBe("true");
    expect(JSON.parse(localStorage.getItem("fontViewer.favorites")!)).toEqual(["Beta Serif"]);
    await userEvent.click(screen.getByRole("button", { name: "♥ Favorites (1)" }));
    expect(screen.queryByText("Alpha Sans")).toBeNull();
    expect(screen.getByText("Beta Serif")).toBeTruthy();
  });

  it("restores saved favorites and drops ones missing from the catalog", async () => {
    localStorage.setItem("fontViewer.favorites", JSON.stringify(["Alpha Sans", "Gone Sans"]));
    render(<App />);
    await screen.findByText("Alpha Sans");
    expect(
      screen.getByRole("button", { name: "Favorite Alpha Sans" }).getAttribute("aria-pressed"),
    ).toBe("true");
    expect(screen.getByRole("button", { name: "♥ Favorites (1)" })).toBeTruthy();
    expect(JSON.parse(localStorage.getItem("fontViewer.favorites")!)).toEqual(["Alpha Sans"]);
  });
});
