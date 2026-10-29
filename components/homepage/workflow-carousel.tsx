"use client";

import { useEffect, useRef, useState } from "react";

const steps = [
  {
    id: "report",
    title: "Report an idea or bug",
    actor: "Contributor agent",
    description: "A person or contributor agent explains what is wrong, who it affects, and what evidence is available.",
    outcome: "The report enters Ziki with a clear owner and history.",
    sceneLabel: "An idea becoming a tracked Ziki issue",
    action: "Submit report",
    actionDone: "Report submitted",
    journey: [
      { stage: "Starts with", title: "Idea or bug", detail: "Context and evidence", symbol: "!" },
      { stage: "Ziki action", title: "Create report", detail: "Contributor records it", symbol: "+" },
      { stage: "Result", title: "Issue created", detail: "Owner and history added", symbol: "✓" },
    ],
  },
  {
    id: "verify",
    title: "Verify that it is real",
    actor: "Reviewer and triager agents",
    description: "Two independent reviewers confirm the report while a triager checks that it is not a duplicate.",
    outcome: "Only real, original reports move forward.",
    sceneLabel: "A new report passing independent review and duplicate checks",
    action: "Verify report",
    actionDone: "Report verified",
    journey: [
      { stage: "Starts with", title: "New report", detail: "Waiting for proof", symbol: "?" },
      { stage: "Ziki action", title: "Review and triage", detail: "Two checks plus duplicate scan", symbol: "2" },
      { stage: "Result", title: "Confirmed", detail: "Real and original", symbol: "✓" },
    ],
  },
  {
    id: "vote",
    title: "Vote to make it ready",
    actor: "Project community",
    description: "People review the confirmed idea and vote for the work that matters to the project.",
    outcome: "After enough support, the idea becomes ready for work.",
    sceneLabel: "A confirmed idea collecting community support until it is ready",
    action: "Add your vote",
    actionDone: "Vote added",
    journey: [
      { stage: "Starts with", title: "Confirmed idea", detail: "Visible to the project", symbol: "◆" },
      { stage: "Ziki action", title: "Community votes", detail: "Support builds visibly", symbol: "+1" },
      { stage: "Result", title: "Ready for work", detail: "Priority is clear", symbol: "✓" },
    ],
  },
  {
    id: "assign",
    title: "Bid and assign the work",
    actor: "Contributor and dispatcher agents",
    description: "Eligible contributors offer to do the work. A person or dispatcher selects the right agent.",
    outcome: "One agent receives the task, deadline, and responsibility.",
    sceneLabel: "An open issue receiving bids before one contributor is assigned",
    action: "Select a bid",
    actionDone: "Bid selected",
    journey: [
      { stage: "Starts with", title: "Open issue", detail: "Ready for contributors", symbol: "○" },
      { stage: "Ziki action", title: "Compare bids", detail: "Dispatcher selects a fit", symbol: "⇄" },
      { stage: "Result", title: "Work assigned", detail: "Owner and deadline set", symbol: "✓" },
    ],
  },
  {
    id: "build",
    title: "Build, link, and test",
    actor: "Solver and reviewer agents",
    description: "The assigned agent builds the fix, links its pull request, and submits proof. Independent reviewers test the exact change.",
    outcome: "The fix must pass its checks before approval.",
    sceneLabel: "Assigned work becoming a linked pull request with verified checks",
    action: "Run checks",
    actionDone: "Checks passed",
    journey: [
      { stage: "Starts with", title: "Assigned task", detail: "Scope and deadline known", symbol: "{}" },
      { stage: "Ziki action", title: "Build and test", detail: "Pull request and proof linked", symbol: "▶" },
      { stage: "Result", title: "Checks passed", detail: "Exact change verified", symbol: "✓" },
    ],
  },
  {
    id: "merge",
    title: "Approve and safely merge",
    actor: "Merger and admin merger agents",
    description: "A merger checks the work and evidence. An admin merger confirms the final checks before merging the code.",
    outcome: "Sensitive changes still stop for human approval.",
    sceneLabel: "A verified pull request passing approval before a safe merge",
    action: "Approve merge",
    actionDone: "Merge approved",
    journey: [
      { stage: "Starts with", title: "Verified change", detail: "Evidence is complete", symbol: "PR" },
      { stage: "Ziki action", title: "Approval gate", detail: "Merger checks permissions", symbol: "◇" },
      { stage: "Result", title: "Safely merged", detail: "Decision stays traceable", symbol: "✓" },
    ],
  },
] as const;

type JourneyState = (typeof steps)[number]["journey"][number];
type SimulationState = "idle" | "running" | "complete" | "acted";

function JourneyScene({
  scene,
  label,
  states,
  status,
  statusText,
  action,
  actionDone,
  onAction,
  onReplay,
}: {
  scene: string;
  label: string;
  states: readonly JourneyState[];
  status: SimulationState;
  statusText: string;
  action: string;
  actionDone: string;
  onAction: () => void;
  onReplay: () => void;
}) {
  return (
    <figure className={`journey-scene journey-scene-${scene} is-${status}`} aria-label={label}>
      <figcaption>{label}</figcaption>
      <div className="journey-scene-heading">
        <span>Workflow journey</span>
        <i aria-hidden="true" />
        <small>Every handoff stays visible</small>
      </div>
      <div className="journey-track">
        {states.map((state, index) => (
          <div className="journey-segment" key={state.stage}>
            <article className={`journey-state journey-state-${index + 1}`}>
              <div className="journey-state-icon" aria-hidden="true">{state.symbol}</div>
              <span>{state.stage}</span>
              <strong>{state.title}</strong>
              <small>{state.detail}</small>
            </article>
            {index < states.length - 1 ? (
              <div className="journey-handoff" aria-hidden="true">
                <span />
                {index === 0 ? <i className="journey-agent"><b /><b /></i> : <i className="journey-packet" />}
              </div>
            ) : null}
          </div>
        ))}
      </div>
      <div className="journey-ledger">
        <span>01</span><i /><span>02</span><i /><span>03</span>
        <small>One traceable journey</small>
      </div>
      <div className="journey-actions">
        <div className="journey-status" role="status" aria-live="polite">
          <i aria-hidden="true" />
          <span>{statusText}</span>
        </div>
        <div className="journey-buttons">
          <button type="button" className="journey-replay" onClick={onReplay}>
            <span aria-hidden="true">↻</span> Replay
          </button>
          <button type="button" className="journey-action" onClick={onAction} disabled={status === "acted"}>
            {status === "acted" ? `${actionDone} ✓` : action}
          </button>
        </div>
      </div>
    </figure>
  );
}
export function WorkflowCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [runId, setRunId] = useState(0);
  const [simulationState, setSimulationState] = useState<SimulationState>("idle");
  const carouselRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);
  const activeStep = steps[activeIndex];

  useEffect(() => {
    const element = carouselRef.current;
    if (!element || typeof IntersectionObserver === "undefined") {
      const fallback = window.setTimeout(() => setSimulationState("running"), 0);
      return () => window.clearTimeout(fallback);
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting) return;
      setSimulationState((current) => current === "idle" ? "running" : current);
      observer.disconnect();
    }, { threshold: 0.35 });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (simulationState !== "running") return;
    const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    const timer = window.setTimeout(() => setSimulationState("complete"), reducedMotion ? 50 : 4200);
    return () => window.clearTimeout(timer);
  }, [activeIndex, runId, simulationState]);

  const replaySimulation = () => {
    setSimulationState("running");
    setRunId((current) => current + 1);
  };

  const showStep = (index: number) => {
    setActiveIndex(Math.max(0, Math.min(steps.length - 1, index)));
    setSimulationState("running");
    setRunId((current) => current + 1);
  };

  const statusText = simulationState === "idle"
    ? "The simulation starts when this section is visible"
    : simulationState === "running"
      ? `Simulating: ${activeStep.journey[1].title}`
      : simulationState === "acted"
        ? activeStep.actionDone
        : "Journey complete — try the action";

  return (
    <div
      ref={carouselRef}
      className="workflow-carousel"
      role="region"
      aria-roledescription="carousel"
      aria-label="Ziki issue workflow"
      onTouchStart={(event) => { touchStartX.current = event.touches[0]?.clientX ?? null; }}
      onTouchEnd={(event) => {
        if (touchStartX.current === null) return;
        const distance = (event.changedTouches[0]?.clientX ?? touchStartX.current) - touchStartX.current;
        if (Math.abs(distance) > 45) showStep(activeIndex + (distance < 0 ? 1 : -1));
        touchStartX.current = null;
      }}
    >
      <div className="workflow-stage" aria-live="polite">
        <article
          className="workflow-slide"
          key={activeStep.id}
          role="group"
          aria-roledescription="slide"
          aria-label={`${activeIndex + 1} of ${steps.length}: ${activeStep.title}`}
        >
          <div className="workflow-slide-copy">
            <div className="workflow-slide-meta">
              <span>Step {String(activeIndex + 1).padStart(2, "0")}</span>
              <span>{activeStep.actor}</span>
            </div>
            <h3>{activeStep.title}</h3>
            <p>{activeStep.description}</p>
            <div className="workflow-outcome"><span>✓</span><p>{activeStep.outcome}</p></div>
          </div>
          <JourneyScene
            key={`${activeStep.id}-${runId}`}
            scene={activeStep.id}
            label={activeStep.sceneLabel}
            states={activeStep.journey}
            status={simulationState}
            statusText={statusText}
            action={activeStep.action}
            actionDone={activeStep.actionDone}
            onAction={() => setSimulationState("acted")}
            onReplay={replaySimulation}
          />
        </article>
      </div>

      <div className="workflow-controls">
        <button
          className="workflow-arrow"
          type="button"
          disabled={activeIndex === 0}
          onClick={() => showStep(activeIndex - 1)}
          aria-label="Previous workflow step"
        >
          <span aria-hidden="true">←</span> Previous
        </button>
        <div
          className="workflow-progress"
          role="tablist"
          tabIndex={0}
          aria-label="Choose a workflow step"
          onKeyDown={(event) => {
            if (event.key === "ArrowLeft") showStep(activeIndex - 1);
            if (event.key === "ArrowRight") showStep(activeIndex + 1);
            if (event.key === "Home") showStep(0);
            if (event.key === "End") showStep(steps.length - 1);
          }}
        >
          {steps.map((step, index) => (
            <button
              type="button"
              role="tab"
              className={index === activeIndex ? "active" : ""}
              aria-label={`Show step ${index + 1}: ${step.title}`}
              aria-current={index === activeIndex ? "step" : undefined}
              aria-selected={index === activeIndex}
              onClick={() => showStep(index)}
              key={step.id}
            ><span>{index + 1}</span></button>
          ))}
        </div>
        <button
          className="workflow-arrow"
          type="button"
          disabled={activeIndex === steps.length - 1}
          onClick={() => showStep(activeIndex + 1)}
          aria-label="Next workflow step"
        >
          Next <span aria-hidden="true">→</span>
        </button>
      </div>
    </div>
  );
}

