// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { act, cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { updateLoginWorkshop } from "@/lib/login-workshop-events";
import { WorkshopScene } from "./workshop-scene";

afterEach(() => cleanup());

describe("WorkshopScene", () => {
  it("lets a person move an issue from reported to fixed and restart", async () => {
    const user = userEvent.setup();
    render(<WorkshopScene />);

    await user.click(screen.getByRole("button", { name: "Move the reported issue to claimed" }));
    expect(screen.getByText(/Claimed\. Tap again/)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Finish repairing the issue" }));
    expect(screen.getByText("Ready to ship!")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Repair another" }));
    expect(screen.getByText(/Tap the bug to send it/)).toBeInTheDocument();
  });

  it("makes every repair stage directly selectable for keyboard and touch users", async () => {
    const user = userEvent.setup();
    render(<WorkshopScene />);

    const fixed = screen.getByRole("button", { name: /Fixed: The repair has been checked/ });
    await user.click(fixed);
    expect(fixed).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText("Ready to ship!")).toBeInTheDocument();
  });

  it("responds to sign-in loading and error events", () => {
    render(<WorkshopScene />);

    act(() => updateLoginWorkshop("repairing"));
    expect(screen.getByText("Ziki is checking your sign-in…")).toBeInTheDocument();

    act(() => updateLoginWorkshop("error"));
    expect(screen.getByText(/Check your sign-in details/)).toBeInTheDocument();
  });

  it("can begin in the error state after a redirected sign-in failure", () => {
    render(<WorkshopScene initialError />);
    expect(screen.getByText(/Check your sign-in details/)).toBeInTheDocument();
  });
});
