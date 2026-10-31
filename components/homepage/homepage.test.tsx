// @vitest-environment happy-dom
import { afterEach, describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
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

  it("lets a visitor launch the issue journey from the hero", async () => {
    render(<Homepage />);

    expect(screen.getByRole("button", { name: "Move issue 1847 forward" })).toBeInTheDocument();
    const trigger = screen.getByRole("button", { name: "Move an issue forward" });
    fireEvent.click(trigger);

    await waitFor(() => expect(screen.getByRole("button", { name: "Replay the journey" })).toBeInTheDocument());
    expect(screen.getAllByText("Login session expires too early")).toHaveLength(2);
  });
});
