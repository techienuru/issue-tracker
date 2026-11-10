// @vitest-environment happy-dom
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { afterEach, describe, expect, it, vi } from "vitest";
import { BugLab } from "./bug-lab";

const durations = [3100, 2200, 2200, 2200, 2400, 2200, 2300, 3200];

describe("Bug Lab post office scene", () => {
  afterEach(() => {
    cleanup();
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it("plays the misdelivery, each agent's task, and a successful test without more clicks", () => {
    vi.useFakeTimers();
    vi.stubGlobal("matchMedia", () => ({ matches: false }));
    render(<BugLab />);
    expect(screen.getByRole("heading", { name: /mixed-up mail/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Start delivery/i })).toBeInTheDocument();
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Start delivery/i }));
    expect(screen.getByText(/Uh-oh. Wrong mailbox/i)).toBeInTheDocument();
    expect(screen.getByText("WRONG PERSON!")).toBeInTheDocument();

    const headings = [
      /Atlas follows the delivery trail/i,
      /The route points to Theo/i,
      /Rhea walks to the issue card/i,
      /The missing detail is pinned down/i,
      /Nova walks to the routing switch/i,
      /Now the arrow points to Maya/i,
      /watch the test envelope/i,
      /Special delivery. Right person/i,
    ];
    for (let index = 0; index < durations.length; index += 1) {
      act(() => vi.advanceTimersByTime(durations[index]));
      expect(screen.getByRole("heading", { name: headings[index] })).toBeInTheDocument();
    }

    expect(screen.getByText("RECEIVED ✓")).toBeInTheDocument();
    expect(document.querySelector(".bl-card-stamp")).toHaveTextContent(/DELIVERY\s*VERIFIED/i);
    expect(screen.queryByRole("button", { name: /Start delivery/i })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /Replay scene/i }));
    expect(screen.getByText(/Uh-oh. Wrong mailbox/i)).toBeInTheDocument();
  });

  it("shows each act with short transitions when reduced motion is requested", () => {
    vi.useFakeTimers();
    vi.stubGlobal("matchMedia", () => ({ matches: true }));
    render(<BugLab />);
    fireEvent.click(screen.getByRole("button", { name: /Start delivery/i }));
    for (let stage = 0; stage < 8; stage += 1) act(() => vi.advanceTimersByTime(2300));
    expect(screen.getByRole("heading", { name: /Special delivery. Right person/i })).toBeInTheDocument();
  });
});
