"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Stage = "ideas" | "working" | "delivered";
type TourTarget = "workspace" | "new-idea" | "stages" | "sample-idea";

const TOUR_KEY = "ziki-ideas-demo-tour-seen";
const tour: { target: TourTarget; title: string; detail: string }[] = [
  {
    target: "workspace",
    title: "Your project",
    detail: "This tells you which team's project you are looking at. This demo shows one sample project.",
  },
  {
    target: "new-idea",
    title: "Start with an idea",
    detail: "In the live app, you can describe a problem or improvement in plain words. This demo does not save ideas.",
  },
  {
    target: "stages",
    title: "Follow the work",
    detail: "Use these stages to see new ideas, work in progress, and completed work.",
  },
  {
    target: "sample-idea",
    title: "Open an idea",
    detail: "Each row gives you the idea, who shared it, and what happens next. Select this sample to see more.",
  },
];

const examples: Record<Stage, { title: string; number: string; by: string; note: string; state: string; detail: string }[]> = {
  ideas: [
    { title: "Make checkout easier on a phone", number: "Idea #12", by: "Amara", note: "People are reviewing this suggestion", state: "New idea", detail: "Amara noticed that the payment button is hard to find on a small screen. The team can review this idea before it becomes work for an agent." },
    { title: "Let customers download their receipts", number: "Idea #11", by: "Tobi", note: "Waiting for more feedback", state: "New idea", detail: "Tobi wants a receipt download after payment. People and agents can say whether this would be useful." },
    { title: "Show clearer delivery dates", number: "Idea #10", by: "Nana", note: "People are reviewing this suggestion", state: "New idea", detail: "Nana wants a clear delivery date on the order page. The team reviews the suggestion before work begins." },
  ],
  working: [
    { title: "Fix the payment button on mobile", number: "Issue #8", by: "Amara", note: "An agent is working on a fix", state: "In progress", detail: "The problem was confirmed, and an agent has taken the task. The team can follow its progress here." },
    { title: "Improve search results", number: "Issue #7", by: "Tobi", note: "The plan is being reviewed", state: "In progress", detail: "The team is checking the proposed plan before the agent starts the change." },
  ],
  delivered: [
    { title: "Make password reset instructions clearer", number: "Issue #6", by: "Nana", note: "The change has been reviewed", state: "Done", detail: "The agent delivered the change with proof, and reviewers checked it." },
  ],
};

const stageLabels: { id: Stage; label: string; help: string }[] = [
  { id: "ideas", label: "Ideas", help: "Suggestions people have shared" },
  { id: "working", label: "In progress", help: "Changes being worked on" },
  { id: "delivered", label: "Delivered", help: "Work that has been delivered" },
];

export function DemoIdeas() {
  const [stage, setStage] = useState<Stage>("ideas");
  const [tourStep, setTourStep] = useState<number | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [openExample, setOpenExample] = useState<string | null>(null);

  useEffect(() => {
    try {
      if (window.localStorage.getItem(TOUR_KEY) !== "yes") setTourStep(0);
    } catch {
      setTourStep(0);
    }
  }, []);

  useEffect(() => {
    if (tourStep === null) return;
    if (tour[tourStep].target === "sample-idea") setStage("ideas");
    const id = window.setTimeout(() => {
      document.getElementById(`demo-${tour[tourStep].target}`)?.scrollIntoView({
        block: "center",
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      });
    }, 50);
    return () => window.clearTimeout(id);
  }, [tourStep]);

  function finishTour() {
    setTourStep(null);
    try { window.localStorage.setItem(TOUR_KEY, "yes"); } catch { /* The tour still closes. */ }
  }

  const activeTarget = tourStep === null ? null : tour[tourStep].target;
  const focusStyle = "relative z-10 rounded-2xl ring-4 ring-zk-accent ring-offset-4 ring-offset-zk-bg";

  return (
    <main className="min-h-screen bg-zk-bg pb-64 text-zk-text sm:pb-44">
      <header className="border-b border-zk-border bg-zk-surface">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <Link href="/" className="text-xl font-extrabold tracking-tight text-zk-text">Ziki</Link>
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-zk-tint px-3 py-1 text-xs font-bold text-zk-accent">Sample page</span>
            <Link href="/login" className="text-sm font-semibold text-zk-accent underline underline-offset-4">Sign in</Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 pt-6 sm:px-6">
        <div id="demo-workspace" className={`inline-flex items-center gap-3 border border-zk-border bg-zk-surface px-4 py-2.5 text-sm ${activeTarget === "workspace" ? focusStyle : "rounded-xl"}`}>
          <span className="flex size-8 items-center justify-center rounded-lg bg-zk-tint font-bold text-zk-accent">D</span>
          <span><strong>Demo workspace</strong><span className="block text-xs text-zk-muted">Mobile Shop project</span></span>
        </div>

        <div className="mt-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Ideas for Mobile Shop</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-zk-text2">See what people want to improve and follow each idea as it moves toward a fix.</p>
          </div>
          <button
            id="demo-new-idea"
            type="button"
            onClick={() => setNotice("In the live app, this opens a form to share your idea. This demo does not save changes.")}
            className={`min-h-11 bg-zk-accent px-5 py-2.5 text-sm font-bold text-white hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zk-accent ${activeTarget === "new-idea" ? focusStyle : "rounded-xl"}`}
          >
            Add an idea
          </button>
        </div>
        {notice ? <p role="status" className="mt-4 rounded-xl border border-zk-border bg-zk-tint px-4 py-3 text-sm text-zk-text2">{notice}</p> : null}

        <nav id="demo-stages" aria-label="Work stages" className={`mt-8 grid gap-2 sm:grid-cols-3 ${activeTarget === "stages" ? focusStyle : ""}`}>
          {stageLabels.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => { setStage(item.id); setOpenExample(null); }}
              aria-current={stage === item.id ? "page" : undefined}
              className={`min-h-20 rounded-xl border px-4 py-3 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zk-accent ${stage === item.id ? "border-zk-accent bg-zk-tint" : "border-zk-border bg-zk-surface hover:border-zk-accent"}`}
            >
              <span className="block text-sm font-bold">{item.label} <span className="ml-1 text-xs font-normal text-zk-muted">{examples[item.id].length}</span></span>
              <span className="mt-1 block text-xs text-zk-text2">{item.help}</span>
            </button>
          ))}
        </nav>

        <section aria-label={`${stageLabels.find((item) => item.id === stage)?.label} examples`} className="mt-8 overflow-hidden rounded-2xl border border-zk-border bg-zk-surface">
          <div className="border-b border-zk-divider px-5 py-4 sm:px-6">
            <h2 className="text-lg font-bold">{stageLabels.find((item) => item.id === stage)?.label}</h2>
            <p className="mt-1 text-xs text-zk-muted">Examples for this tour. No data is saved.</p>
          </div>
          <ul className="divide-y divide-zk-divider">
            {examples[stage].map((item, index) => (
              <li key={item.number} id={stage === "ideas" && index === 0 ? "demo-sample-idea" : undefined} className={`px-5 py-5 sm:px-6 ${activeTarget === "sample-idea" && stage === "ideas" && index === 0 ? focusStyle : ""}`}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <button type="button" aria-expanded={openExample === item.number} onClick={() => setOpenExample(openExample === item.number ? null : item.number)} className="min-h-11 flex-1 rounded-lg text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zk-accent">
                    <span className="block text-sm font-bold leading-6 text-zk-text">{item.title}</span>
                    <span className="mt-1 block text-xs text-zk-muted">{item.number} · Shared by {item.by} · {openExample === item.number ? "Hide details" : "View details"}</span>
                  </button>
                  <span className="rounded-full bg-zk-tint px-3 py-1 text-xs font-semibold text-zk-accent">{item.state}</span>
                </div>
                <p className="mt-3 text-sm text-zk-text2">{item.note}</p>
                {openExample === item.number ? <p className="mt-3 rounded-xl bg-zk-tint p-4 text-sm leading-6 text-zk-text2">{item.detail}</p> : null}
              </li>
            ))}
          </ul>
        </section>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-sm">
          <button type="button" onClick={() => { setStage("ideas"); setTourStep(0); }} className="font-semibold text-zk-accent underline underline-offset-4">Replay tour</button>
          <Link href="/login" className="font-semibold text-zk-text2 underline underline-offset-4">Leave demo</Link>
        </div>
      </div>

      {tourStep !== null ? (
        <aside aria-label="Ideas page tour" className="fixed inset-x-3 bottom-3 z-20 rounded-2xl border border-zk-border bg-zk-surface p-5 shadow-2xl sm:inset-x-auto sm:right-6 sm:w-96">
          <p className="text-xs font-semibold text-zk-accent">Tour step {tourStep + 1} of {tour.length}</p>
          <h2 className="mt-1 text-lg font-bold">{tour[tourStep].title}</h2>
          <p className="mt-2 text-sm leading-6 text-zk-text2">{tour[tourStep].detail}</p>
          <div className="mt-4 flex items-center justify-between gap-3">
            <button type="button" onClick={finishTour} className="text-sm font-semibold text-zk-muted underline underline-offset-4">Skip tour</button>
            <div className="flex gap-2">
              {tourStep > 0 ? <button type="button" onClick={() => setTourStep(tourStep - 1)} className="min-h-10 rounded-lg border border-zk-border px-3 text-sm font-semibold">Back</button> : null}
              <button type="button" onClick={() => tourStep === tour.length - 1 ? finishTour() : setTourStep(tourStep + 1)} className="min-h-10 rounded-lg bg-zk-accent px-4 text-sm font-bold text-white">
                {tourStep === tour.length - 1 ? "Finish" : "Next"}
              </button>
            </div>
          </div>
        </aside>
      ) : null}
    </main>
  );
}
