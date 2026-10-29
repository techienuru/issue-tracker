"use client";

import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import {
  LOGIN_WORKSHOP_EVENT,
  type LoginWorkshopEventDetail,
} from "@/lib/login-workshop-events";

type WorkshopState = "reported" | "claimed" | "fixed" | "repairing" | "error";

const stations = [
  {
    key: "reported" as const,
    label: "Reported",
    explanation: "The issue has been logged and is ready for review.",
  },
  {
    key: "claimed" as const,
    label: "Claimed",
    explanation: "A teammate or agent has picked up the issue.",
  },
  {
    key: "fixed" as const,
    label: "Fixed",
    explanation: "The repair has been checked and is ready to ship.",
  },
];

const statusText: Record<WorkshopState, string> = {
  reported: "Tap the bug to send it down the repair line.",
  claimed: "Claimed. Tap again and Ziki will finish the repair.",
  fixed: "Ready to ship!",
  repairing: "Ziki is checking your sign-in…",
  error: "That one needs another look. Check your sign-in details.",
};

function BugIcon() {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path d="M11 10.5 8 7.5M21 10.5l3-3M9 16H5M27 16h-4M9.5 22 6 25M22.5 22l3.5 3" />
      <rect x="10" y="9" width="12" height="16" rx="6" />
      <path d="M10 16h12M16 9v16" />
    </svg>
  );
}

function ClaimedIcon() {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path d="M8 24h16M10 24v-9a6 6 0 0 1 12 0v9M13 15h6M16 12v6" />
    </svg>
  );
}

function FixedIcon() {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <circle cx="16" cy="16" r="10" />
      <path d="m11.5 16 3 3 6-7" />
    </svg>
  );
}

const stationIcons = [<BugIcon key="bug" />, <ClaimedIcon key="claimed" />, <FixedIcon key="fixed" />];

export function WorkshopScene({ initialError = false }: { initialError?: boolean }) {
  const [state, setState] = useState<WorkshopState>(initialError ? "error" : "reported");
  const sceneRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleLoginState = (event: Event) => {
      const detail = (event as CustomEvent<LoginWorkshopEventDetail>).detail;
      if (detail?.state === "repairing" || detail?.state === "error") {
        setState(detail.state);
      }
    };
    window.addEventListener(LOGIN_WORKSHOP_EVENT, handleLoginState);
    return () => window.removeEventListener(LOGIN_WORKSHOP_EVENT, handleLoginState);
  }, []);

  function advanceRepair() {
    setState((current) => {
      if (current === "reported" || current === "error") return "claimed";
      if (current === "claimed") return "fixed";
      if (current === "fixed") return "reported";
      return current;
    });
  }

  function followPointer(event: ReactPointerEvent<HTMLElement>) {
    const reducedMotion =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (event.pointerType !== "mouse" || reducedMotion) {
      return;
    }
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = Math.max(-3, Math.min(3, ((event.clientX - bounds.left) / bounds.width - 0.5) * 6));
    const y = Math.max(-2, Math.min(2, ((event.clientY - bounds.top) / bounds.height - 0.5) * 4));
    sceneRef.current?.style.setProperty("--ziki-eye-x", `${x.toFixed(1)}px`);
    sceneRef.current?.style.setProperty("--ziki-eye-y", `${y.toFixed(1)}px`);
  }

  function resetEyes() {
    sceneRef.current?.style.setProperty("--ziki-eye-x", "0px");
    sceneRef.current?.style.setProperty("--ziki-eye-y", "0px");
  }

  const bugLabel =
    state === "fixed"
      ? "Repair another issue"
      : state === "claimed"
        ? "Finish repairing the issue"
        : "Move the reported issue to claimed";

  return (
    <section
      ref={sceneRef}
      className="ziki-workshop relative min-h-[300px] w-full max-w-[560px] flex-1"
      data-state={state}
      aria-label="Interactive Ziki repair line"
      onPointerMove={followPointer}
      onPointerLeave={resetEyes}
    >
      <div className="ziki-workshop-sign">
        <span className="ziki-workshop-sign-light" aria-hidden="true" />
        Ziki repair line
      </div>
      <div className="ziki-workshop-bench">
        <div className="ziki-workshop-track" aria-hidden="true" />
        <button
          type="button"
          className="ziki-workshop-bug"
          onClick={advanceRepair}
          aria-label={bugLabel}
          disabled={state === "repairing"}
        >
          {state === "fixed" ? <FixedIcon /> : <BugIcon />}
        </button>
        <div className="ziki-workshop-sparks" aria-hidden="true"><span /><span /><span /></div>
        <div className="ziki-workshop-stations">
          {stations.map((station, index) => (
            <button
              type="button"
              className={`ziki-workshop-station ziki-workshop-station-${index + 1}`}
              data-tip={station.explanation}
              key={station.key}
              onClick={() => setState(station.key)}
              aria-label={`${station.label}: ${station.explanation}`}
              aria-pressed={state === station.key}
              disabled={state === "repairing"}
            >
              <span className="ziki-workshop-station-icon">{stationIcons[index]}</span>
              <span>{station.label}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="ziki-workshop-bot" aria-hidden="true">
        <span className="ziki-workshop-antenna" />
        <span className="ziki-workshop-face"><i /><i /></span>
        <span className="ziki-workshop-body"><b>ZI</b></span>
        <span className="ziki-workshop-arm" />
      </div>
      <span className="ziki-workshop-tool ziki-workshop-tool-left" aria-hidden="true">⌁</span>
      <span className="ziki-workshop-tool ziki-workshop-tool-right" aria-hidden="true">✦</span>
      <div className="ziki-workshop-status">
        <p aria-live="polite">{statusText[state]}</p>
        {state === "fixed" ? (
          <button type="button" onClick={() => setState("reported")}>Repair another</button>
        ) : null}
      </div>
    </section>
  );
}
