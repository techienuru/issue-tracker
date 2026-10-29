// @vitest-environment jsdom
import { afterEach, describe, expect, it } from "vitest";
import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { WorkflowCarousel } from "./workflow-carousel";

afterEach(() => cleanup());

describe("WorkflowCarousel", () => {
  it("moves through all six workflow steps with the carousel controls", () => {
    render(<WorkflowCarousel />);

    const previous = screen.getByRole("button", { name: "Previous workflow step" });
    const next = screen.getByRole("button", { name: "Next workflow step" });

    expect(screen.getByRole("group", { name: "1 of 6: Report an idea or bug" })).toBeInTheDocument();
    expect(previous).toBeDisabled();
    expect(next).toBeEnabled();

    fireEvent.click(next);
    expect(screen.getByRole("group", { name: "2 of 6: Verify that it is real" })).toBeInTheDocument();
    expect(previous).toBeEnabled();

    fireEvent.click(screen.getByRole("tab", { name: "Show step 6: Approve and safely merge" }));
    expect(screen.getByRole("group", { name: "6 of 6: Approve and safely merge" })).toBeInTheDocument();
    expect(next).toBeDisabled();
  });

  it("supports keyboard navigation and identifies the active step", () => {
    render(<WorkflowCarousel />);

    const stepPicker = screen.getByRole("tablist", { name: "Choose a workflow step" });
    fireEvent.keyDown(stepPicker, { key: "End" });
    expect(screen.getByRole("tab", { name: "Show step 6: Approve and safely merge" })).toHaveAttribute("aria-current", "step");

    fireEvent.keyDown(stepPicker, { key: "ArrowLeft" });
    expect(screen.getByRole("group", { name: "5 of 6: Build, link, and test" })).toBeInTheDocument();

    fireEvent.keyDown(stepPicker, { key: "Home" });
    expect(screen.getByRole("group", { name: "1 of 6: Report an idea or bug" })).toBeInTheDocument();
  });
});
