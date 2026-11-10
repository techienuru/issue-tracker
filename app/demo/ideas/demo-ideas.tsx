"use client";

import { useEffect, useState } from "react";
import { ZikiMark } from "@/components/ziki-mark";

type Stage = "ideas" | "working" | "delivered";
type Target = "workspace" | "nav" | "account" | "new-idea" | "stages" | "idea" | "agents";

const TOUR_KEY = "ziki-ideas-tour-seen";
const tour: { target: Target; title: string; detail: string }[] = [
  { target: "workspace", title: "Your workspace", detail: "This shows which team and project you are viewing. Use it to switch to another project." },
  { target: "nav", title: "Move around Ziki", detail: "These links take you to your project, marketing, security, other projects, and conversations." },
  { target: "account", title: "Your account and updates", detail: "Open your profile for settings. The envelope shows messages and requests that need your attention." },
  { target: "new-idea", title: "Share an idea", detail: "Describe a problem or improvement in plain words. Other agents can review it and decide what to work on." },
  { target: "stages", title: "See what is happening", detail: "Switch between new ideas, work in progress, and completed changes." },
  { target: "idea", title: "Open an idea", detail: "Each row shows who shared the idea and its current status. Select a row to read more." },
  { target: "agents", title: "Follow your agents", detail: "This bar shows what your AI agents are working on and whether they need your attention." },
];

const examples: Record<Stage, { title: string; number: string; by: string; date: string; note: string; state: string; detail: string }[]> = {
  ideas: [
    { title: "Make checkout easier on a phone", number: "Idea #12", by: "Amara N.", date: "2 days ago", note: "People are reviewing this idea", state: "New idea", detail: "The payment button is hard to find on a small screen. The team is reviewing this suggestion." },
    { title: "Let customers download their receipts", number: "Idea #11", by: "Tobi A.", date: "4 days ago", note: "Waiting for more feedback", state: "New idea", detail: "Customers would be able to download a receipt after completing a payment." },
    { title: "Show clearer delivery dates", number: "Idea #10", by: "Nana K.", date: "1 week ago", note: "People are reviewing this idea", state: "New idea", detail: "Show an estimated delivery date on the order page." },
  ],
  working: [
    { title: "Fix the payment button on mobile", number: "Issue #8", by: "Amara N.", date: "Updated today", note: "An agent is working on a fix", state: "In progress", detail: "The problem was confirmed and an agent is working on the change." },
    { title: "Improve search results", number: "Issue #7", by: "Tobi A.", date: "Updated yesterday", note: "The plan is being reviewed", state: "In progress", detail: "The team is checking the proposed plan before work starts." },
  ],
  delivered: [
    { title: "Make password reset instructions clearer", number: "Issue #6", by: "Nana K.", date: "Updated 3 days ago", note: "The change has been reviewed", state: "Done", detail: "The change was delivered with proof and checked by reviewers." },
  ],
};

const stages: { id: Stage; label: string; help: string }[] = [
  { id: "ideas", label: "Ideas", help: "Suggestions shared by your team" },
  { id: "working", label: "In progress", help: "Changes currently being worked on" },
  { id: "delivered", label: "Done", help: "Changes that have been completed" },
];

function Icon({ name }: { name: "app" | "marketing" | "security" | "discover" | "forum" | "mail" | "bell" | "wallet" }) {
  const paths: Record<typeof name, React.ReactNode> = {
    app: <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" /></>,
    marketing: <><path d="M3 11v2a1 1 0 0 0 1 1h2l5 4V6L6 10H4a1 1 0 0 0-1 1Z" /><path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13" /></>,
    security: <><path d="M12 3 4 6v6c0 4.5 3.4 8.3 8 9 4.6-.7 8-4.5 8-9V6l-8-3Z" /><path d="m9 12 2 2 4-4" /></>,
    discover: <><circle cx="12" cy="12" r="9" /><path d="m15.5 8.5-2 5-5 2 2-5 5-2Z" /></>,
    forum: <><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></>,
    mail: <><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" /><path d="M10 21h4" /></>,
    wallet: <><path d="M19 7V5a2 2 0 0 0-2-2H5a2 2 0 0 0 0 4h14a2 2 0 0 1 2 2v3" /><path d="M3 5v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-3" /><path d="M21 12h-4a2 2 0 0 0 0 4h4z" /></>,
  };
  return <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

function Header({ target, focusStyle }: { target: Target | null; focusStyle: string }) {
  const nav = [{ label: "Your App", icon: "app" }, { label: "Marketing", icon: "marketing" }, { label: "Security", icon: "security" }, { label: "Discover", icon: "discover" }, { label: "Forum", icon: "forum" }] as const;
  return (
    <header className="relative z-30 border-b border-zk-border bg-zk-surface shadow-[0_1px_3px_rgba(0,0,0,0.04)] lg:sticky lg:top-0">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-3 gap-y-2 px-4 py-3 max-sm:flex-nowrap max-sm:gap-x-2 max-sm:py-2 sm:px-6">
        <div id="tour-workspace" className={`flex min-w-0 items-center gap-2 rounded-xl ${target === "workspace" ? focusStyle : ""}`}>
          <a href="/demo/ideas" aria-label="Ziki" className="shrink-0 rounded-full"><ZikiMark className="h-8 w-auto text-zk-text max-sm:h-7" /></a>
          <span className="h-[18px] w-px shrink-0 bg-zk-border max-sm:hidden" />
          <button type="button" className="flex min-w-0 items-center gap-2 rounded-xl px-2 py-1.5 text-left hover:bg-zk-chip">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-zk-tint text-sm font-bold text-zk-accent">M</span>
            <span className="min-w-0"><span className="block truncate text-xs font-semibold text-zk-text">Mobile Shop</span><span className="block truncate text-[11px] text-zk-muted">Web project</span></span>
            <span className="text-xs text-zk-muted">⌄</span>
          </button>
        </div>
        <nav id="tour-nav" aria-label="Main navigation" className={`flex items-center max-lg:fixed max-lg:inset-x-0 max-lg:bottom-0 max-lg:z-40 max-lg:justify-around max-lg:border-t max-lg:border-zk-border max-lg:bg-zk-surface max-lg:px-2 max-lg:pt-1.5 max-lg:pb-[max(0.375rem,env(safe-area-inset-bottom))] lg:ml-4 lg:gap-1 ${target === "nav" ? focusStyle : ""}`}>
          {nav.map((item, index) => <button type="button" key={item.label} className={`inline-flex shrink-0 items-center whitespace-nowrap font-medium max-lg:min-w-16 max-lg:flex-1 max-lg:flex-col max-lg:gap-0.5 max-lg:rounded-xl max-lg:py-1.5 max-lg:text-[11px] lg:h-9 lg:gap-2 lg:rounded-full lg:px-2.5 lg:text-[13px] ${index === 0 ? "text-zk-accent lg:bg-zk-tint" : "text-zk-text2 hover:text-zk-text lg:hover:bg-zk-chip"}`}><span className={`flex items-center justify-center max-lg:h-7 max-lg:w-12 max-lg:rounded-full ${index === 0 ? "max-lg:bg-zk-tint" : ""}`}><Icon name={item.icon} /></span>{item.label}</button>)}
        </nav>
        <div className="ml-auto flex shrink-0 items-center justify-end gap-2 max-sm:gap-1.5">
          <div className="inline-flex h-10 items-center gap-1 rounded-full border border-zk-border bg-zk-surface p-1 max-sm:hidden"><span className="rounded-full px-2.5 py-1 text-sm font-bold text-zk-text">$24.50</span><button type="button" className="rounded-full bg-electric-blue-strong px-3 py-1.5 text-xs font-bold text-white">Withdraw</button></div>
          <div id="tour-account" className={`flex items-center gap-1 rounded-full ${target === "account" ? focusStyle : ""}`}><button type="button" aria-label="Account menu for Amara Nwosu" className="inline-flex h-11 items-center gap-2 rounded-full border border-zk-border bg-zk-surface py-[5px] pl-[5px] pr-3 text-[13px] font-medium text-zk-text max-sm:border-0 max-sm:p-0"><span className="flex size-8 items-center justify-center rounded-full bg-[#e8d8ce] text-xs font-bold text-[#5d3e31]">AN</span><span className="max-w-32 truncate max-sm:hidden">Amara Nwosu</span><span className="text-xs text-zk-muted max-sm:hidden">⌄</span></button><button type="button" aria-label="Inbox, 2 unread" className="relative inline-flex size-9 items-center justify-center rounded-full text-zk-text hover:bg-zk-chip"><Icon name="mail" /><span className="absolute right-1 top-1 size-2 rounded-full bg-red-500" /></button><button type="button" aria-label="Notifications" className="inline-flex size-9 items-center justify-center rounded-full text-zk-text hover:bg-zk-chip"><Icon name="bell" /></button></div>
        </div>
      </div>
    </header>
  );
}

function AgentBar({ target, focusStyle }: { target: Target | null; focusStyle: string }) {
  return <div id="tour-agents" className={`fixed inset-x-0 bottom-0 z-20 hidden h-[72px] border-t border-zk-border bg-zk-surface lg:block ${target === "agents" ? focusStyle : ""}`}><div className="mx-auto flex h-full max-w-7xl items-end gap-7 px-8 pb-2"><button type="button" className="mb-1 rounded-full border border-zk-border bg-zk-surface px-4 py-2 text-xs font-semibold shadow-sm">Agents　⌃</button>{[{ name: "Kola", status: "Working", mark: "K" }, { name: "Mira", status: "Waiting for review", mark: "M" }, { name: "Tunde", status: "Idle", mark: "T" }].map((agent) => <div key={agent.name} className="flex items-end gap-2"><span className="flex size-9 items-center justify-center rounded-full border-2 border-white bg-zk-tint text-xs font-bold text-zk-accent shadow">{agent.mark}</span><span className="mb-0.5"><span className="block text-xs font-semibold text-zk-text">{agent.name}</span><span className="block text-[10px] text-zk-muted">{agent.status}</span></span></div>)}</div></div>;
}

export function DemoIdeas() {
  const [stage, setStage] = useState<Stage>("ideas");
  const [tourStep, setTourStep] = useState<number | null>(null);
  const [openExample, setOpenExample] = useState<string | null>(null);
  const [notice, setNotice] = useState(false);

  useEffect(() => {
    try { if (window.localStorage.getItem(TOUR_KEY) !== "yes") setTourStep(0); }
    catch { setTourStep(0); }
  }, []);

  useEffect(() => {
    if (tourStep === null) return;
    const id = window.setTimeout(() => document.getElementById(`tour-${tour[tourStep].target}`)?.scrollIntoView({ block: "center", behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" }), 50);
    return () => window.clearTimeout(id);
  }, [tourStep]);

  function finishTour() {
    setTourStep(null);
    try { window.localStorage.setItem(TOUR_KEY, "yes"); } catch { /* The tour can still close. */ }
  }

  function replayTour() {
    setStage("ideas");
    setTourStep(0);
  }

  const target = tourStep === null ? null : tour[tourStep].target;
  const focusStyle = "relative z-10 rounded-2xl ring-4 ring-zk-accent ring-offset-4 ring-offset-zk-bg";
  const selected = stages.find((item) => item.id === stage)!;

  return (
    <div className="min-h-screen bg-zk-bg pb-24 text-zk-text lg:pb-24">
      <Header target={target} focusStyle={focusStyle} />
      <main className="mx-auto max-w-7xl px-4 pb-24 pt-6 max-sm:px-3 sm:px-6 sm:pt-8 lg:pb-28">
        <div className="mb-6 flex items-center gap-2 text-xs text-zk-muted"><span>Mobile Shop</span><span aria-hidden="true">/</span><span className="font-semibold text-zk-text">Ideas</span></div>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Ideas</h1>
              <span className="group relative inline-flex">
                <button type="button" onClick={replayTour} aria-label="Take the tour again" className="flex size-7 items-center justify-center rounded-full border border-zk-border text-sm font-bold text-zk-text2 hover:bg-zk-chip focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-electric-blue">?</button>
                <span role="tooltip" className="pointer-events-none absolute left-1/2 top-full z-30 mt-2 hidden -translate-x-1/2 whitespace-nowrap rounded-lg bg-zk-text px-3 py-2 text-xs font-semibold text-white shadow-lg group-hover:block group-focus-within:block">Take the tour again</span>
              </span>
            </div>
            <p className="mt-1.5 max-w-2xl text-sm leading-6 text-zk-text2">Share what could be better and follow the ideas your team is considering.</p>
          </div>
          <button id="tour-new-idea" type="button" onClick={() => setNotice(true)} className={`min-h-11 rounded-xl bg-electric-blue-strong px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-slate focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-electric-blue ${target === "new-idea" ? focusStyle : ""}`}>Add idea</button>
        </div>
        {notice ? <p role="status" className="mt-4 rounded-xl border border-zk-border bg-zk-surface px-4 py-3 text-sm text-zk-text2">Describe what you want improved, then share it with your team.</p> : null}
        <nav id="tour-stages" aria-label="Idea status filters" className={`mt-6 flex flex-wrap gap-2 ${target === "stages" ? focusStyle : ""}`}>
          {stages.map((item) => <button key={item.id} type="button" onClick={() => { setStage(item.id); setOpenExample(null); }} aria-current={stage === item.id ? "page" : undefined} className={`min-h-10 rounded-full border px-4 py-2 text-sm font-semibold ${stage === item.id ? "border-zk-accent bg-zk-tint text-zk-accent" : "border-zk-border bg-zk-surface text-zk-text2 hover:border-zk-accent"}`}>{item.label}<span className="ml-2 text-xs font-normal">{examples[item.id].length}</span></button>)}
        </nav>
        <section className="mt-4 overflow-hidden rounded-2xl border border-zk-border bg-zk-surface">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zk-divider px-4 py-3 sm:px-5"><div><h2 className="text-base font-bold">{selected.label}</h2><p className="mt-0.5 text-xs text-zk-muted">{selected.help}</p></div><button type="button" className="rounded-lg border border-zk-border px-3 py-2 text-xs font-semibold text-zk-text2">Sort: Recently updated　⌄</button></div>
          <ul className="divide-y divide-zk-divider">
            {examples[stage].map((item, index) => <li key={item.number} id={stage === "ideas" && index === 0 ? "tour-idea" : undefined} className={`px-4 py-4 sm:px-5 ${target === "idea" && index === 0 ? focusStyle : ""}`}>
              <div className="flex items-start gap-3"><button type="button" aria-label="Support this idea" className="flex min-w-11 flex-col items-center rounded-xl border border-zk-border bg-zk-bg px-2 py-1.5 text-xs font-bold text-zk-text2">↑<span>8</span></button><div className="min-w-0 flex-1"><button type="button" aria-expanded={openExample === item.number} onClick={() => setOpenExample(openExample === item.number ? null : item.number)} className="min-h-10 rounded-md text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-electric-blue"><span className="block text-sm font-bold leading-6 text-zk-text">{item.title}</span><span className="mt-1 block text-xs text-zk-muted">{item.number} · Shared by {item.by} · {item.date}</span></button><p className="mt-2 text-sm text-zk-text2">{item.note}</p>{openExample === item.number ? <p className="mt-3 rounded-xl bg-zk-bg p-4 text-sm leading-6 text-zk-text2">{item.detail}</p> : null}</div><span className="shrink-0 rounded-full bg-zk-tint px-3 py-1 text-xs font-semibold text-zk-accent">{item.state}</span></div>
            </li>)}
          </ul>
        </section>
      </main>
      <AgentBar target={target} focusStyle={focusStyle} />
      {tourStep !== null ? <aside aria-label="Ideas page tour" className="fixed inset-x-3 bottom-20 z-50 rounded-2xl border border-zk-border bg-zk-surface p-5 shadow-2xl sm:inset-x-auto sm:right-6 sm:w-96 lg:bottom-24"><p className="text-xs font-semibold text-zk-accent">Step {tourStep + 1} of {tour.length}</p><h2 className="mt-1 text-lg font-bold">{tour[tourStep].title}</h2><p className="mt-2 text-sm leading-6 text-zk-text2">{tour[tourStep].detail}</p><div className="mt-4 flex items-center justify-between gap-3"><button type="button" onClick={finishTour} className="text-sm font-semibold text-zk-muted underline underline-offset-4">Skip tour</button><div className="flex gap-2">{tourStep > 0 ? <button type="button" onClick={() => setTourStep(tourStep - 1)} className="min-h-10 rounded-lg border border-zk-border px-3 text-sm font-semibold">Back</button> : null}<button type="button" onClick={() => tourStep === tour.length - 1 ? finishTour() : setTourStep(tourStep + 1)} className="min-h-10 rounded-lg bg-electric-blue-strong px-4 text-sm font-bold text-white">{tourStep === tour.length - 1 ? "Finish" : "Next"}</button></div></div></aside> : null}
    </div>
  );
}
