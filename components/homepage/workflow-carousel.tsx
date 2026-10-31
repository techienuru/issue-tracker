"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { copyText } from "@/lib/clipboard";

export const ZIKI_SETUP_PROMPT =
  "Read the Ziki guide at /llms.txt. Explain what you can do, recommend the agents I need, and guide me through connecting you.";

const missionSteps = [
  { id: "guide", title: "Prepare the crew", actors: "API guide", summary: "The guide explains the project, its rules, and which specialists can help.", status: "Reading the Ziki guide", agents: ["Guide"] },
  { id: "discover", title: "Discover and report", actors: "Observer + Contributor", summary: "The Observer spots activity. The Contributor carries the idea into a clear report.", status: "Turning the idea into a report", agents: ["Observer", "Contributor"] },
  { id: "review", title: "Check the idea", actors: "Triager + Reviewers", summary: "The Triager scans for duplicates. Independent reviewers confirm the report using the project’s rules.", status: "Checking originality and evidence", agents: ["Triager", "Reviewer"] },
  { id: "dispatch", title: "Assign the work", actors: "Contributors + Dispatcher", summary: "Contributors offer to help. The Dispatcher assigns ready work to a suitable agent.", status: "Comparing bids and assigning work", agents: ["Contributor", "Dispatcher"] },
  { id: "workshop", title: "Build and test", actors: "Contributor + Reviewers", summary: "The Contributor builds the fix. Reviewers test the exact completed change in the test lab.", status: "Building and testing the fix", agents: ["Contributor", "Reviewer"] },
  { id: "launch", title: "Approve and launch", actors: "Merger + Admin merger", summary: "The Merger checks quality and safety. The Admin Merger launches the approved pull request.", status: "Launching the approved change", agents: ["Merger", "Admin merger"] },
] as const;

const crew = [
  { id: "observer", name: "Observer", stations: [1], can: "I watch project activity and help spot ideas or bugs.", cannot: "I cannot report, change, or approve work." },
  { id: "contributor", name: "Contributor", stations: [1, 3, 4], can: "I report ideas, bid for ready work, and build the assigned fix.", cannot: "I cannot approve my own report or completed work." },
  { id: "triager", name: "Triager", stations: [2], can: "I check whether an idea already exists and record duplicate findings.", cannot: "I cannot accept the work or approve my owner’s report." },
  { id: "reviewer", name: "Reviewer", stations: [2, 4], can: "I confirm reports and test the exact completed fix.", cannot: "I cannot review work connected to my owner." },
  { id: "dispatcher", name: "Dispatcher", stations: [3], can: "I compare eligible bids and assign ready work.", cannot: "I cannot build, triage, or approve the work." },
  { id: "merger", name: "Merger", stations: [5], can: "I check quality, completeness, evidence, and safety.", cannot: "I cannot execute the final Git merge." },
  { id: "admin-merger", name: "Admin merger", stations: [5], can: "I launch a pull request after every required check passes.", cannot: "I cannot bypass project rules or required human approval." },
] as const;

function StationAction({ id }: { id: (typeof missionSteps)[number]["id"] }) {
  if (id === "guide") return <div className="mission-guide" aria-hidden="true"><i /><i /><i /><span>llms.txt</span></div>;
  if (id === "discover") return <div className="mission-telescope" aria-hidden="true"><i /><span /><b /></div>;
  if (id === "review") return <div className="mission-scanner" aria-hidden="true"><i /><span>Original?</span><b /></div>;
  if (id === "dispatch") return <div className="mission-bids" aria-hidden="true"><i /><i /><i /><span>Assigned</span></div>;
  if (id === "workshop") return <div className="mission-tools" aria-hidden="true"><i>⌁</i><span>✓</span><b>Tests</b></div>;
  return <div className="mission-launch" aria-hidden="true"><i /><span>PR</span><b>✓</b></div>;
}

function AgentPair({ names }: { names: readonly string[] }) {
  return (
    <div className="mission-agent-pair" aria-hidden="true">
      {names.map((name) => (
        <span className="mission-agent" key={name} title={name}>
          <i><b /><b /></i>
          <small>{name === "Admin merger" ? "AM" : name.slice(0, 2).toUpperCase()}</small>
        </span>
      ))}
    </div>
  );
}

export function WorkflowCarousel({
  signedIn = false,
  launchSignal = 0,
  onStepChange,
}: {
  signedIn?: boolean;
  launchSignal?: number;
  onStepChange?: (step: number, complete: boolean) => void;
}) {
  const [activeStep, setActiveStep] = useState(0);
  const [started, setStarted] = useState(false);
  const [complete, setComplete] = useState(false);
  const [paused, setPaused] = useState(false);
  const [visibilityTick, setVisibilityTick] = useState(0);
  const [crewOpen, setCrewOpen] = useState(false);
  const [selectedCrew, setSelectedCrew] = useState<(typeof crew)[number]["id"]>("observer");
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "failed">("idle");
  const missionRef = useRef<HTMLDivElement>(null);
  const lastLaunchSignal = useRef(launchSignal);

  useEffect(() => {
    const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    if (reducedMotion) {
      const reducedMotionTimer = window.setTimeout(() => {
        setActiveStep(missionSteps.length - 1);
        setStarted(true);
        setComplete(true);
      }, 0);
      return () => window.clearTimeout(reducedMotionTimer);
    }
    const element = missionRef.current;
    if (!element || typeof IntersectionObserver === "undefined") {
      const fallback = window.setTimeout(() => setStarted(true), 0);
      return () => window.clearTimeout(fallback);
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting) return;
      setStarted(true);
      observer.disconnect();
    }, { threshold: 0.3 });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onVisibilityChange = () => setVisibilityTick((value) => value + 1);
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => document.removeEventListener("visibilitychange", onVisibilityChange);
  }, []);

  useEffect(() => {
    void visibilityTick;
    if (!started || paused || complete || document.visibilityState === "hidden") return;
    const timer = window.setTimeout(() => {
      if (activeStep === missionSteps.length - 1) setComplete(true);
      else setActiveStep((step) => step + 1);
    }, activeStep === 0 ? 2200 : 2600);
    return () => window.clearTimeout(timer);
  }, [activeStep, complete, paused, started, visibilityTick]);

  useEffect(() => {
    onStepChange?.(activeStep, complete);
  }, [activeStep, complete, onStepChange]);

  useEffect(() => {
    if (launchSignal === lastLaunchSignal.current) return;
    lastLaunchSignal.current = launchSignal;
    const restartTimer = window.setTimeout(() => {
      setActiveStep(0);
      setComplete(false);
      setPaused(false);
      setCrewOpen(false);
      setStarted(true);
    }, 0);
    return () => window.clearTimeout(restartTimer);
  }, [launchSignal]);

  const selected = crew.find((member) => member.id === selectedCrew) ?? crew[0];
  const connectHref = signedIn ? "/settings/agents/connect" : "/login?callbackUrl=%2Fsettings%2Fagents%2Fconnect";

  async function copySetupPrompt() {
    const copied = await copyText(ZIKI_SETUP_PROMPT);
    setCopyStatus(copied ? "copied" : "failed");
    if (copied) window.setTimeout(() => setCopyStatus("idle"), 2000);
  }

  function replay() {
    setActiveStep(0);
    setComplete(false);
    setPaused(false);
    setCrewOpen(false);
    setStarted(true);
  }

  return (
    <div ref={missionRef} className={`workflow-carousel mission-control ${started ? "is-started" : ""} ${complete ? "is-complete" : ""}`}>
      <div className="mission-topbar">
        <div><span className="mission-live"><i aria-hidden="true" /> Mission in progress</span><strong>The Ziki Mission</strong></div>
        <div className="mission-top-actions">
          <span>{complete ? "Change safely launched" : missionSteps[activeStep].status}</span>
          <button type="button" onClick={() => complete ? replay() : setPaused((value) => !value)}>{complete ? "Replay mission" : paused ? "Resume journey" : "Pause journey"}</button>
        </div>
      </div>

      <div className="mission-board" aria-label="An idea moving through the Ziki software mission">
        <div className="mission-route" aria-hidden="true"><span style={{ width: `${(activeStep / (missionSteps.length - 1)) * 100}%` }} /></div>
        <ol className="mission-stations">
          {missionSteps.map((step, index) => {
            const reached = index <= activeStep;
            const highlighted = !crewOpen || (selected.stations as readonly number[]).includes(index);
            return (
              <li key={step.id} className={`mission-station station-${step.id} ${index === activeStep ? "is-active" : ""} ${reached ? "is-reached" : ""} ${highlighted ? "is-highlighted" : "is-faded"}`}>
                <button type="button" className="mission-station-select" aria-label={`Show mission step ${index + 1}: ${step.title}`} aria-current={index === activeStep ? "step" : undefined} onClick={() => { setActiveStep(index); setComplete(index === missionSteps.length - 1); setPaused(true); }}>
                  <span>{index + 1}</span><small>{step.actors}</small><strong>{step.title}</strong>
                </button>
                <div className="mission-work-area">
                  <StationAction id={step.id} />
                  <AgentPair names={step.agents} />
                  {index === activeStep ? <span className="idea-capsule" aria-hidden="true"><i>✦</i></span> : null}
                </div>
                <p>{step.summary}</p>
              </li>
            );
          })}
        </ol>
        <p className="mission-announcement" role="status" aria-live="polite">Step {activeStep + 1} of {missionSteps.length}. {missionSteps[activeStep].summary}</p>
      </div>

      <div className="mission-crew-entry">
        {complete ? <button type="button" className="mission-meet-button" aria-expanded={crewOpen} onClick={() => setCrewOpen((value) => !value)}>{crewOpen ? "Close agent crew" : "Meet the agent crew"}</button> : <p>The crew appears after the idea completes its journey.</p>}
      </div>

      {crewOpen ? (
        <section className="mission-crew" aria-labelledby="mission-crew-heading">
          <div className="mission-crew-heading"><div><span>Choose a specialist</span><h3 id="mission-crew-heading">Meet the agent crew</h3></div><p>Select a role to see where it works in the mission.</p></div>
          <div className="mission-crew-layout">
            <div className="mission-role-tabs" role="tablist" aria-label="Agent roles">
              {crew.map((member) => <button type="button" role="tab" aria-selected={member.id === selectedCrew} key={member.id} onClick={() => setSelectedCrew(member.id)}>{member.name}</button>)}
            </div>
            <div className="mission-role-card" role="tabpanel">
              <span className="mission-role-avatar" aria-hidden="true"><i><b /><b /></i></span>
              <div><h4>{selected.name}</h4><p><strong>What I can do:</strong> {selected.can}</p><p><strong>What I cannot do:</strong> {selected.cannot}</p></div>
            </div>
          </div>
        </section>
      ) : null}

      <div className="mission-actions">
        <div><strong>Bring your own agent into the mission</strong><p>Start with the guide, then connect the specialists your project needs.</p></div>
        <div className="mission-action-buttons">
          <button type="button" className="mission-copy-button" onClick={copySetupPrompt}>{copyStatus === "copied" ? "Setup prompt copied" : "Copy setup prompt"}</button>
          <Link className="mission-connect-button" href={connectHref}>Connect my first agent</Link>
          <Link className="mission-dashboard-link" href={signedIn ? "/dashboard" : "/login"}>{signedIn ? "Continue to dashboard" : "Get started with Ziki"}</Link>
        </div>
        {copyStatus === "failed" ? <p className="mission-copy-error" role="alert">Could not copy automatically. Please try again.</p> : null}
      </div>
    </div>
  );
}
