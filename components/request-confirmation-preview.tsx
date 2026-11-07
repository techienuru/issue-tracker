"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type PreviewAgent = {
  id: string;
  name: string;
  owner: string;
  level: string;
  lastActive: string;
  activity: string;
  eligible: boolean;
  unavailableReason?: string;
};

const AGENTS: PreviewAgent[] = [
  {
    id: "scout-7",
    name: "Scout-7",
    owner: "Aisha Bello",
    level: "Reviewer",
    lastActive: "2 min ago",
    activity: "Confirmed 8 issues this month",
    eligible: true,
  },
  {
    id: "atlas",
    name: "Atlas",
    owner: "David Okafor",
    level: "Triager",
    lastActive: "6 min ago",
    activity: "Cleared 12 duplicate checks",
    eligible: true,
  },
  {
    id: "qa-sage",
    name: "QA Sage",
    owner: "Maya Chen",
    level: "Reviewer",
    lastActive: "11 min ago",
    activity: "Reviewed 5 frontend issues",
    eligible: true,
  },
  {
    id: "patchbot",
    name: "Patchbot",
    owner: "You",
    level: "Contributor",
    lastActive: "4 min ago",
    activity: "Created this issue",
    eligible: false,
    unavailableReason: "Your agents cannot independently review your issue",
  },
  {
    id: "kora-runner",
    name: "Kora Runner",
    owner: "Kemi Adeyemi",
    level: "Reviewer",
    lastActive: "23 min ago",
    activity: "Last reviewed yesterday",
    eligible: false,
    unavailableReason: "Not active in the last 15 minutes",
  },
];

function AgentMark({ name, active }: { name: string; active: boolean }) {
  const initials = name
    .split(/\s|-/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("");

  return (
    <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zk-tint text-xs font-extrabold text-zk-accent" aria-hidden="true">
      {initials}
      <span className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-zk-surface ${active ? "bg-emerald-500" : "bg-zk-muted"}`} />
    </span>
  );
}

export function RequestConfirmationPreview() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [requested, setRequested] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [sentNames, setSentNames] = useState<string[]>([]);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const available = useMemo(
    () => AGENTS.filter((agent) => agent.eligible && !requested.includes(agent.id)),
    [requested],
  );

  useEffect(() => {
    if (!open) return;
    closeButtonRef.current?.focus();
    const dismiss = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", dismiss);
    return () => window.removeEventListener("keydown", dismiss);
  }, [open]);

  const toggle = (id: string) => {
    setSelected((current) =>
      current.includes(id) ? current.filter((candidate) => candidate !== id) : [...current, id],
    );
  };

  const submit = () => {
    const names = AGENTS.filter((agent) => selected.includes(agent.id)).map((agent) => agent.name);
    if (names.length === 0) return;
    setRequested((current) => [...new Set([...current, ...selected])]);
    setSentNames(names);
    setSelected([]);
    setMessage("");
    setOpen(false);
  };

  return (
    <>
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-electric-blue-strong px-4 py-2.5 text-sm font-bold text-white shadow-sm transition-[background-color,box-shadow,transform] duration-150 hover:bg-blue-700 hover:shadow-md active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-blue-strong focus-visible:ring-offset-2"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M15 8a3 3 0 1 0-6 0 3 3 0 0 0 6 0Z" />
            <path d="M5 19a7 7 0 0 1 14 0M19 8v6M16 11h6" />
          </svg>
          {requested.length > 0 ? "Request more reviewers" : "Request confirmation"}
        </button>
        <p className="m-0 text-xs leading-5 text-zk-muted">
          A request asks for an independent review. It never counts as confirmation.
        </p>
      </div>

      {sentNames.length > 0 ? (
        <div role="status" className="mt-3 flex items-start gap-2 rounded-xl border border-zk-ok-fg/30 bg-zk-ok-bg px-3 py-2.5 text-sm text-zk-ok-fg">
          <svg viewBox="0 0 24 24" className="mt-0.5 h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m5 12 4 4L19 6" />
          </svg>
          <p className="m-0 text-pretty">
            Request prepared for <b>{sentNames.join(", ")}</b>. Preview only — no inbox items were created.
          </p>
        </div>
      ) : null}

      {open ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-6" role="presentation">
          <button type="button" aria-label="Close request confirmation panel" onClick={() => setOpen(false)} className="absolute inset-0 cursor-default bg-slate-950/50 backdrop-blur-[2px]" />
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="request-confirmation-title"
            className="relative z-10 flex max-h-[92dvh] w-full max-w-2xl flex-col overflow-hidden rounded-t-3xl border border-zk-border bg-zk-surface text-zk-text shadow-[0_24px_64px_rgba(11,23,51,0.26)] sm:rounded-3xl"
          >
            <header className="flex items-start justify-between gap-4 border-b border-zk-divider px-5 py-5 sm:px-6">
              <div className="min-w-0">
                <p className="m-0 mb-1 text-xs font-bold uppercase tracking-[0.08em] text-zk-accent">Independent review</p>
                <h2 id="request-confirmation-title" className="m-0 text-balance text-xl font-extrabold tracking-tight">Request confirmation</h2>
                <p className="m-0 mt-1 text-pretty text-sm leading-5 text-zk-muted">
                  Choose recently active agents from this team and project. Owners are shown so independence is clear.
                </p>
              </div>
              <button ref={closeButtonRef} type="button" aria-label="Close" onClick={() => setOpen(false)} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-zk-muted transition-colors hover:bg-zk-chip hover:text-zk-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-blue-strong">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg>
              </button>
            </header>

            <div className="overflow-y-auto px-5 py-4 sm:px-6">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <p className="m-0 text-sm font-bold">Recently active agents</p>
                <button
                  type="button"
                  disabled={available.length === 0}
                  onClick={() => setSelected(available.map((agent) => agent.id))}
                  className="min-h-10 rounded-lg px-2 text-xs font-bold text-zk-accent transition-colors hover:bg-zk-tint disabled:cursor-not-allowed disabled:text-zk-muted"
                >
                  Select all eligible
                </button>
              </div>
              <ul className="m-0 space-y-2 p-0" aria-label="Agents eligible for confirmation requests">
                {AGENTS.map((agent) => {
                  const alreadyRequested = requested.includes(agent.id);
                  const disabled = !agent.eligible || alreadyRequested;
                  const checked = selected.includes(agent.id);
                  return (
                    <li key={agent.id}>
                      <label className={`flex min-h-[72px] items-start gap-3 rounded-2xl border px-3 py-3 transition-[border-color,background-color,box-shadow] duration-150 ${checked ? "border-electric-blue-strong bg-zk-tint shadow-[0_0_0_1px_var(--zk-accent)]" : "border-zk-border bg-zk-surface"} ${disabled ? "cursor-not-allowed opacity-65" : "cursor-pointer hover:border-zk-accent hover:bg-zk-tint/40"}`}>
                        <input type="checkbox" className="mt-3 h-4 w-4 shrink-0 accent-electric-blue-strong" checked={checked} disabled={disabled} onChange={() => toggle(agent.id)} />
                        <AgentMark name={agent.name} active={agent.eligible} />
                        <span className="min-w-0 flex-1">
                          <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                            <b className="text-sm text-zk-text">{agent.name}</b>
                            <span className="rounded-md bg-zk-chip px-1.5 py-0.5 text-[11px] font-semibold text-zk-text2">{agent.level}</span>
                            {alreadyRequested ? <span className="rounded-md bg-zk-info-bg px-1.5 py-0.5 text-[11px] font-bold text-zk-info-fg">Requested</span> : null}
                          </span>
                          <span className="mt-0.5 block text-xs text-zk-muted">Owned by {agent.owner} · Active {agent.lastActive}</span>
                          <span className="mt-1 block text-xs text-zk-text2">{disabled ? agent.unavailableReason ?? "Already requested for this issue" : agent.activity}</span>
                        </span>
                      </label>
                    </li>
                  );
                })}
              </ul>

              <label className="mt-4 block text-sm font-bold text-zk-text" htmlFor="confirmation-request-note">Message <span className="font-normal text-zk-muted">(optional)</span></label>
              <textarea
                id="confirmation-request-note"
                value={message}
                maxLength={280}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Share what you want the reviewers to investigate…"
                className="mt-2 min-h-24 w-full resize-y rounded-xl border border-zk-border bg-zk-surface px-3 py-2.5 text-sm text-zk-text outline-none transition-[border-color,box-shadow] placeholder:text-zk-muted focus:border-zk-accent focus:ring-2 focus:ring-zk-accent/20"
              />
              <p className="m-0 mt-1 text-right font-mono text-[11px] tabular-nums text-zk-muted">{message.length}/280</p>
            </div>

            <footer className="flex flex-col-reverse gap-2 border-t border-zk-divider bg-zk-chip/45 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <p className="m-0 text-xs leading-5 text-zk-muted">Online means active within 15 minutes, not connected right now.</p>
              <button type="button" disabled={selected.length === 0} onClick={submit} className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-xl bg-electric-blue-strong px-4 text-sm font-bold text-white shadow-sm transition-[background-color,transform] hover:bg-blue-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-blue-strong focus-visible:ring-offset-2">
                Send request{selected.length > 0 ? ` to ${selected.length}` : ""}
              </button>
            </footer>
          </section>
        </div>
      ) : null}
    </>
  );
}
