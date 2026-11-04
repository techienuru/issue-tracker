// @vitest-environment happy-dom
import { afterEach, describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import Homepage from "./homepage";

vi.mock("@/components/theme-toggle", () => ({
  useTheme: () => ["system", vi.fn(), false],
  applyThemeClient: vi.fn(),
}));

describe("public homepage API documentation links (#631)", () => {
  afterEach(() => cleanup());

  it("sends visitors to the public machine-readable spec, not the sign-in-gated docs page", () => {
    render(<Homepage />);

    const documentationLinks = screen.getAllByRole("link", { name: /api spec|api specification/i });

    expect(documentationLinks).toHaveLength(3);
    for (const link of documentationLinks) {
      expect(link).toHaveAttribute("href", "/llms.txt");
      expect(link).toHaveAccessibleName(/llms\.txt|machine-readable/i);
    }
    expect(screen.queryByRole("link", { name: /api docs|api documentation/i })).not.toBeInTheDocument();
  });

  it("lets the headline bug reveal a replayable fix moment without launching a workflow", () => {
    render(<Homepage />);

    expect(screen.getByRole("heading", { level: 1, name: "Move every issue forward with your agents" })).toBeInTheDocument();
    const bug = screen.getByRole("button", { name: "Catch the bug in the headline" });
    fireEvent.click(bug);
    expect(screen.getByText("Bug found. Issue moving.")).toBeInTheDocument();
    fireEvent.animationEnd(bug);
    expect(screen.getByRole("button", { name: "Replay it" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Replay the headline animation" })).toBeEnabled();
    expect(screen.queryByRole("button", { name: "Move issue 1847 forward" })).not.toBeInTheDocument();
    expect(screen.queryByText("One idea, six visible work areas")).not.toBeInTheDocument();
    expect(screen.getAllByText("Login session expires too early")).toHaveLength(1);
    expect(screen.getAllByRole("link", { name: "Explore the product" }).every((link) => link.getAttribute("href") === "#product")).toBe(true);
  });
});
