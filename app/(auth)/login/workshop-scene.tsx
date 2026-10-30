"use client";

import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import {
  LOGIN_WORKSHOP_EVENT,
  type LoginWorkshopEventDetail,
} from "@/lib/login-workshop-events";

type WorkshopState = "reported" | "approaching" | "claimed" | "fixed" | "repairing" | "error";

const START_DELAY = 900;
const APPROACH_TIME = 1400;
const CLAIM_TIME = 1300;
const FIX_TIME = 1200;
const REPEAT_DELAY = 10000;

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
  reported: "A new bug is waiting for the agents.",
  approaching: "Agents are moving in to inspect the bug.",
  claimed: "Claimed. The repair is moving through the line.",
  fixed: "Checked, fixed, and ready to ship!",
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
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    function clearTimers() {
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
    }

    function scheduleCycle(delay = START_DELAY) {
      clearTimers();
      setState("reported");

      const approachingAt = delay;
      const claimedAt = approachingAt + APPROACH_TIME;
      const fixedAt = claimedAt + CLAIM_TIME;
      const restartAt = fixedAt + FIX_TIME + REPEAT_DELAY;

      timersRef.current = [
        setTimeout(() => setState("approaching"), approachingAt),
        setTimeout(() => setState("claimed"), claimedAt),
        setTimeout(() => setState("fixed"), fixedAt),
        setTimeout(() => scheduleCycle(0), restartAt),
      ];
    }

    const handleLoginState = (event: Event) => {
      const detail = (event as CustomEvent<LoginWorkshopEventDetail>).detail;
      if (detail?.state === "repairing" || detail?.state === "error") {
        clearTimers();
        setState(detail.state);
        if (detail.state === "error") {
          timersRef.current = [setTimeout(() => scheduleCycle(0), REPEAT_DELAY)];
        }
      }
    };

    if (initialError) {
      timersRef.current = [setTimeout(() => scheduleCycle(0), REPEAT_DELAY)];
    } else {
      scheduleCycle();
    }

    window.addEventListener(LOGIN_WORKSHOP_EVENT, handleLoginState);
    return () => {
      clearTimers();
      window.removeEventListener(LOGIN_WORKSHOP_EVENT, handleLoginState);
    };
  }, [initialError]);

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

  return (
    <section
      ref={sceneRef}
      className="ziki-workshop relative min-h-[300px] w-full max-w-[560px] flex-1"
      data-state={state}
      aria-label="Ziki agents automatically repairing an issue"
      onPointerMove={followPointer}
      onPointerLeave={resetEyes}
    >
      <div className="ziki-workshop-sign">
        <span className="ziki-workshop-sign-light" aria-hidden="true" />
        Ziki repair line
      </div>
      <div className="ziki-workshop-bench">
        <div className="ziki-workshop-track" aria-hidden="true" />
        <div className="ziki-workshop-bug" aria-hidden="true">
          {state === "fixed" ? <FixedIcon /> : <BugIcon />}
        </div>
        <div className="ziki-workshop-sparks" aria-hidden="true"><span /><span /><span /></div>
        <div className="ziki-workshop-stations">
          {stations.map((station, index) => (
            <div
              className={`ziki-workshop-station ziki-workshop-station-${index + 1}`}
              key={station.key}
              title={station.explanation}
            >
              <span className="ziki-workshop-station-icon">{stationIcons[index]}</span>
              <span>{station.label}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="ziki-workshop-bot" aria-hidden="true">
        <span className="ziki-workshop-antenna" />
        <span className="ziki-workshop-face"><i /><i /></span>
        <span className="ziki-workshop-body"><b>ZI</b></span>
        <span className="ziki-workshop-arm" />
      </div>
      <div className="ziki-workshop-agent-team" aria-hidden="true">
        {["OB", "TR", "CO"].map((label) => (
          <span className="ziki-workshop-mini-agent" key={label}>
            <i className="ziki-workshop-mini-antenna" />
            <i className="ziki-workshop-mini-face"><b /><b /></i>
            <strong>{label}</strong>
          </span>
        ))}
      </div>
      <span className="ziki-workshop-tool ziki-workshop-tool-left" aria-hidden="true">⌁</span>
      <span className="ziki-workshop-tool ziki-workshop-tool-right" aria-hidden="true">✦</span>
      <div className="ziki-workshop-status">
        <p>{statusText[state]}</p>
      </div>
    </section>
  );
}
