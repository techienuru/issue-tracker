// @vitest-environment jsdom
import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import Homepage from "@/components/homepage/homepage";

const applyTheme = vi.hoisted(() => vi.fn());
const useTheme = vi.hoisted(() => vi.fn(() => ["light", vi.fn(), false] as const));
vi.mock("@/components/theme-toggle", () => ({ useTheme, applyThemeClient: applyTheme }));
vi.mock("next/image", () => ({ default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => React.createElement("img", props) }));
vi.mock("next/link", () => ({
  default: ({ href, children, ...props }: { href: string; children: React.ReactNode }) =>
    React.createElement("a", { href, ...props }, children),
}));

beforeEach(() => {
  useTheme.mockReturnValue(["light", vi.fn(), false]);
  vi.stubGlobal("React", React);
  vi.stubGlobal("matchMedia", vi.fn(() => ({ matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() })));
});
afterEach(() => { cleanup(); vi.clearAllMocks(); vi.unstubAllGlobals(); });

describe("Public homepage", () => {
  it("explains the complete workflow and labels sample activity", () => {
    render(<Homepage />);
    expect(screen.getByRole("heading", { level: 1 }).getAttribute("aria-label")).toBe("Move every issue forward with your agents");
    expect(screen.getByRole("heading", { name: "What is Ziki?" })).toBeTruthy();
    expect(screen.getByRole("group", { name: "1 of 6: Report an idea or bug" })).toBeTruthy();
    expect(screen.getAllByRole("tab", { name: /Show step [1-6]/ })).toHaveLength(6);
    expect(screen.getByRole("heading", { name: /Know what happened/ })).toBeTruthy();
    expect(screen.getByText("Example issue page")).toBeTruthy();
    expect(screen.queryByText("Owner-first autonomy")).toBeNull();
  });
  it("answers common questions in plain language", () => {
    const { container } = render(<Homepage />);
    expect(screen.getByRole("heading", { name: "Questions, answered plainly." })).toBeTruthy();
    for (const question of [
      "Can I use Ziki without an AI agent?",
      "Can an agent merge code without approval?",
      "How are issues verified?",
      "Who can create or manage a project?",
      "How do points work?",
      "Is Ziki free?",
    ]) {
      expect(screen.getByText(question)).toBeTruthy();
    }
    expect(container.querySelectorAll(".faq-list details")).toHaveLength(6);
  });
  it("keeps conversion links on the existing sign-in route", () => {
    render(<Homepage />);
    for (const label of ["Get started free", "Get started with Ziki", "Start contributing"]) {
      expect(screen.getByRole("link", { name: new RegExp(label) }).getAttribute("href")).toBe("/login");
    }
    expect(screen.getByRole("link", { name: "Skip to content" }).getAttribute("href")).toBe("#main-content");
  });
  it("opens the mobile menu and closes it on Escape or section selection", () => {
    render(<Homepage />);
    fireEvent.click(screen.getByRole("button", { name: "Open menu" }));
    expect(screen.getByRole("button", { name: "Close menu" }).getAttribute("aria-expanded")).toBe("true");
    fireEvent.keyDown(window, { key: "Escape" });
    expect(screen.getByRole("button", { name: "Open menu" }).getAttribute("aria-expanded")).toBe("false");
    fireEvent.click(screen.getByRole("button", { name: "Open menu" }));
    fireEvent.click(screen.getAllByRole("link", { name: "Product" })[0]);
    expect(screen.getByRole("button", { name: "Open menu" })).toBeTruthy();
  });
  it("uses the existing browser preference without a sign-in action", () => {
    render(<Homepage />);
    fireEvent.click(screen.getByRole("button", { name: "Switch to dark mode" }));
    expect(applyTheme).toHaveBeenCalledWith("dark");
  });
  it("uses Get started as the single authentication entry point in each header layout", () => {
    render(<Homepage />);
    const navigation = screen.getByRole("navigation", { name: "Main navigation" });
    expect(screen.queryByRole("link", { name: "Sign in" })).toBeNull();
    expect(within(navigation).getByRole("link", { name: "Get started" }).getAttribute("href")).toBe("/login");
    fireEvent.click(screen.getByRole("button", { name: "Open menu" }));
    fireEvent.click(within(navigation).getByRole("link", { name: "Get started" }));
    expect(screen.getByRole("button", { name: "Open menu" }).getAttribute("aria-expanded")).toBe("false");
  });
  it("simplifies the hero without removing its accessible headline or animated circle", () => {
    const { container } = render(<Homepage />);
    expect(screen.queryByText(/Agent activity preview/i)).toBeNull();
    const circle = container.querySelector(".switch-pulse");
    expect(circle).not.toBeNull();
    expect(circle?.querySelector("svg")).toBeNull();
    expect(screen.getByRole("heading", { level: 1 }).getAttribute("aria-label")).toContain("forward");
  });
  it("saves a signed-in theme through the account preference", () => {
    const setTheme = vi.fn();
    useTheme.mockReturnValue(["light", setTheme, false]);
    render(<Homepage signedIn />);
    fireEvent.click(screen.getByRole("button", { name: "Switch to dark mode" }));
    expect(setTheme).toHaveBeenCalledWith("dark");
    expect(applyTheme).not.toHaveBeenCalled();
  });
});
