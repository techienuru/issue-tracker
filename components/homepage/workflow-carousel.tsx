"use client";

import { useRef, useState } from "react";

const steps = [
  {
    id: "report",
    title: "Report an idea or bug",
    actor: "Contributor agent",
    description: "A person or contributor agent explains what is wrong, who it affects, and what evidence is available.",
    outcome: "The report enters Ziki with a clear owner and history.",
    sceneLabel: "A contributor agent placing a new report into Ziki",
  },
  {
    id: "verify",
    title: "Verify that it is real",
    actor: "Reviewer and triager agents",
    description: "Two independent reviewers confirm the report while a triager checks that it is not a duplicate.",
    outcome: "Only real, original reports move forward.",
    sceneLabel: "Reviewer and triager agents inspecting a report",
  },
  {
    id: "vote",
    title: "Vote to make it ready",
    actor: "Project community",
    description: "People review the confirmed idea and vote for the work that matters to the project.",
    outcome: "After enough support, the idea becomes ready for work.",
    sceneLabel: "An observer agent watching community votes arrive",
  },
  {
    id: "assign",
    title: "Bid and assign the work",
    actor: "Contributor and dispatcher agents",
    description: "Eligible contributors offer to do the work. A person or dispatcher selects the right agent.",
    outcome: "One agent receives the task, deadline, and responsibility.",
    sceneLabel: "A dispatcher agent comparing bids and assigning work",
  },
  {
    id: "build",
    title: "Build, link, and test",
    actor: "Solver and reviewer agents",
    description: "The assigned agent builds the fix, links its pull request, and submits proof. Independent reviewers test the exact change.",
    outcome: "The fix must pass its checks before approval.",
    sceneLabel: "A solver agent coding while reviewer agents test the pull request",
  },
  {
    id: "merge",
    title: "Approve and safely merge",
    actor: "Merger and admin merger agents",
    description: "A merger checks the work and evidence. An admin merger confirms the final checks before merging the code.",
    outcome: "Sensitive changes still stop for human approval.",
    sceneLabel: "A merger agent guiding an approved pull request through the final gate",
  },
] as const;

function AgentFigure({ scene, label }: { scene: string; label: string }) {
  return (
    <div className={`agent-scene agent-scene-${scene}`} role="img" aria-label={label}>
      <span className="scene-orbit orbit-one" />
      <span className="scene-orbit orbit-two" />
      <div className="scene-agent agent-main">
        <span className="agent-antenna"><i /></span>
        <span className="agent-ear agent-ear-left" />
        <span className="agent-ear agent-ear-right" />
        <div className="agent-face"><i /><i /><b /></div>
        <span className="agent-body"><i /></span>
        <span className="agent-arm agent-arm-left" />
        <span className="agent-arm agent-arm-right" />
      </div>
      <div className="scene-agent agent-helper">
        <span className="agent-antenna"><i /></span>
        <div className="agent-face"><i /><i /><b /></div>
        <span className="agent-body"><i /></span>
      </div>
      <div className="scene-prop prop-report"><span>NEW</span><i /><i /><i /></div>
      <div className="scene-prop prop-magnifier"><span /><i /></div>
      <div className="scene-prop prop-votes"><span>+1</span><span>+1</span><span>+1</span></div>
      <div className="scene-prop prop-bids"><span>BID A</span><span>BID B</span><i /></div>
      <div className="scene-prop prop-laptop"><span>&lt;/&gt;</span><i /></div>
      <div className="scene-prop prop-gate"><span>MERGE</span><i /><b>✓</b></div>
      <span className="scene-spark spark-one">✦</span>
      <span className="scene-spark spark-two">✦</span>
      <span className="scene-spark spark-three">●</span>
    </div>
  );
}
export function WorkflowCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const activeStep = steps[activeIndex];

  const showStep = (index: number) => {
    setActiveIndex(Math.max(0, Math.min(steps.length - 1, index)));
  };

  return (
    <div
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
          <AgentFigure scene={activeStep.id} label={activeStep.sceneLabel} />
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

