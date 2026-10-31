// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { act, cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { updateLoginWorkshop } from "@/lib/login-workshop-events";
import { WorkshopScene } from "./workshop-scene";

beforeEach(() => vi.useFakeTimers());
afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe("WorkshopScene", () => {
  it("automatically moves an issue from reported to fixed", () => {
    render(<WorkshopScene />);

    expect(screen.getByText(/new bug is waiting/)).toBeInTheDocument();
    act(() => vi.advanceTimersByTime(900));
    expect(screen.getByText(/moving in to inspect/)).toBeInTheDocument();

    act(() => vi.advanceTimersByTime(1400));
    expect(screen.getByText(/repair is moving/)).toBeInTheDocument();

    act(() => vi.advanceTimersByTime(1300));
    expect(screen.getByText(/ready to ship/)).toBeInTheDocument();

    act(() => vi.advanceTimersByTime(11201));
    expect(screen.getByText(/moving in to inspect/)).toBeInTheDocument();
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
