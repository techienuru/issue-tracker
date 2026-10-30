// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { WorkflowCarousel, ZIKI_SETUP_PROMPT } from "./workflow-carousel";

beforeEach(() => {
  vi.stubGlobal("matchMedia", vi.fn(() => ({ matches: false })));
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

describe("The Ziki Mission", () => {
  it("shows six practical work areas and begins with the guide", () => {
    render(<WorkflowCarousel />);

    expect(screen.getByText("The Ziki Mission")).toBeInTheDocument();
    expect(screen.getByLabelText("An idea moving through the Ziki software mission")).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: /Show mission step/ })).toHaveLength(6);
    expect(screen.getByRole("button", { name: "Show mission step 1: Prepare the crew" })).toHaveAttribute("aria-current", "step");
    expect(screen.getByText(/The Observer spots activity/)).toBeInTheDocument();
    expect(screen.getByText(/The Merger checks quality and safety/)).toBeInTheDocument();
  });

  it("moves the idea through the mission automatically", async () => {
    vi.useFakeTimers();
    render(<WorkflowCarousel />);

    await act(async () => { vi.runOnlyPendingTimers(); });
    await act(async () => { vi.advanceTimersByTime(2200); });
    expect(screen.getByRole("button", { name: "Show mission step 2: Discover and report" })).toHaveAttribute("aria-current", "step");

    for (let step = 0; step < 5; step += 1) {
      await act(async () => { vi.advanceTimersByTime(2600); });
    }
    expect(screen.getByRole("button", { name: "Meet the agent crew" })).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("Step 6 of 6");
  });

  it("explains what each specialist can and cannot do", () => {
    render(<WorkflowCarousel />);
    fireEvent.click(screen.getByRole("button", { name: "Show mission step 6: Approve and launch" }));
    fireEvent.click(screen.getByRole("button", { name: "Meet the agent crew" }));
    fireEvent.click(screen.getByRole("tab", { name: "Triager" }));

    expect(screen.getByRole("tabpanel")).toHaveTextContent("I check whether an idea already exists");
    expect(screen.getByRole("tabpanel")).toHaveTextContent("I cannot accept the work or approve my owner’s report");
  });

  it("copies the setup prompt and continues into the existing connection flow", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText } });
    render(<WorkflowCarousel />);

    fireEvent.click(screen.getByRole("button", { name: "Copy setup prompt" }));
    await act(async () => undefined);

    expect(writeText).toHaveBeenCalledWith(ZIKI_SETUP_PROMPT);
    expect(screen.getByRole("button", { name: "Setup prompt copied" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Connect my first agent" })).toHaveAttribute(
      "href",
      "/login?callbackUrl=%2Fsettings%2Fagents%2Fconnect",
    );
  });

  it("links signed-in people directly to agent connection and the dashboard", () => {
    render(<WorkflowCarousel signedIn />);

    expect(screen.getByRole("link", { name: "Connect my first agent" })).toHaveAttribute("href", "/settings/agents/connect");
    expect(screen.getByRole("link", { name: "Continue to dashboard" })).toHaveAttribute("href", "/dashboard");
  });
});
