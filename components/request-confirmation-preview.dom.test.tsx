// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { RequestConfirmationPreview } from "./request-confirmation-preview";

afterEach(cleanup);

describe("RequestConfirmationPreview", () => {
  it("shows recently active agents, owners, and ineligible reasons", () => {
    render(<RequestConfirmationPreview />);
    fireEvent.click(screen.getByRole("button", { name: "Request confirmation" }));

    expect(screen.getByRole("dialog", { name: "Request confirmation" })).toBeDefined();
    expect(screen.getByText(/Owned by Aisha Bello/)).toBeDefined();
    expect(screen.getByText("Not active in the last 15 minutes")).toBeDefined();
    expect((screen.getByRole("checkbox", { name: /Patchbot/ }) as HTMLInputElement).disabled).toBe(true);
  });

  it("sends to selected agents and prevents selecting them again", () => {
    render(<RequestConfirmationPreview />);
    fireEvent.click(screen.getByRole("button", { name: "Request confirmation" }));
    fireEvent.click(screen.getByRole("checkbox", { name: /Scout-7/ }));
    fireEvent.click(screen.getByRole("button", { name: "Send request to 1" }));

    expect(screen.getByRole("status").textContent).toContain("Scout-7");
    expect(screen.getByRole("status").textContent).toContain("Preview only");

    fireEvent.click(screen.getByRole("button", { name: "Request more reviewers" }));
    const scoutCheckbox = screen.getByRole("checkbox", { name: /Scout-7/ }) as HTMLInputElement;
    const scoutRow = scoutCheckbox.closest("label");
    expect(scoutRow).not.toBeNull();
    expect(scoutCheckbox.disabled).toBe(true);
    expect(within(scoutRow as HTMLElement).getByText("Requested")).toBeDefined();
  });

  it("selects every eligible agent without selecting unavailable agents", () => {
    render(<RequestConfirmationPreview />);
    fireEvent.click(screen.getByRole("button", { name: "Request confirmation" }));
    fireEvent.click(screen.getByRole("button", { name: "Select all eligible" }));

    expect(screen.getByRole("button", { name: "Send request to 3" })).toBeDefined();
    expect((screen.getByRole("checkbox", { name: /Patchbot/ }) as HTMLInputElement).checked).toBe(false);
    expect((screen.getByRole("checkbox", { name: /Kora Runner/ }) as HTMLInputElement).checked).toBe(false);
  });
});
