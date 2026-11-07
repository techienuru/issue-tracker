import type { Metadata } from "next";
import Link from "next/link";
import { RequestConfirmationPreview } from "@/components/request-confirmation-preview";

export const metadata: Metadata = {
  title: "Request confirmation preview",
  description: "A public frontend preview of Ziki's request confirmation flow.",
  robots: { index: false, follow: false },
};

function Icon({ children }: { children: React.ReactNode }) {
  return <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{children}</svg>;
}

export default function PingAnAgentPreviewPage() {
  return (
    <div data-app-shell="" className="min-h-screen bg-zk-bg text-zk-text">
      <header className="sticky top-0 z-20 border-b border-white/10 bg-deep-ocean text-white shadow-sm">
        <div className="mx-auto flex h-16 max-w-[1440px] items-center gap-5 px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2 text-lg font-extrabold tracking-tight">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-electric-blue-strong text-sm">Z</span>
            Ziki
          </Link>
          <nav className="hidden items-center gap-1 text-sm text-slate-300 md:flex" aria-label="Preview navigation">
            <span className="rounded-lg px-3 py-2">Overview</span>
            <span className="rounded-lg bg-white/10 px-3 py-2 font-semibold text-white">Issues</span>
            <span className="rounded-lg px-3 py-2">Workers</span>
            <span className="rounded-lg px-3 py-2">Activity</span>
          </nav>
          <span className="ml-auto rounded-full border border-sky-tint/30 bg-white/10 px-3 py-1 text-xs font-bold text-sky-100">Public UI preview</span>
        </div>
      </header>

      <main id="main-content" className="mx-auto w-full max-w-[1180px] px-3 py-5 sm:px-6 sm:py-8">
        <nav aria-label="Breadcrumb" className="mb-5 flex flex-wrap items-center gap-2 text-sm text-zk-muted">
          <span>Team Zendor</span><span aria-hidden="true">/</span><span>Ziki Issues</span><span aria-hidden="true">/</span><span className="font-mono">#1284</span>
        </nav>

        <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div className="min-w-0 space-y-5">
            <article className="overflow-hidden rounded-2xl border border-zk-border bg-zk-surface shadow-[0_1px_2px_rgba(11,23,51,0.04)]">
              <div className="border-b border-zk-divider px-4 py-5 sm:px-6">
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <span className="rounded-lg bg-zk-warn-bg px-2.5 py-1 text-xs font-bold text-zk-warn-fg">Requires confirmation</span>
                  <span className="rounded-lg bg-zk-chip px-2.5 py-1 text-xs font-semibold text-zk-text2">Feature</span>
                  <span className="rounded-lg bg-zk-bad-bg px-2.5 py-1 text-xs font-semibold text-zk-bad-fg">High priority</span>
                </div>
                <h1 className="m-0 text-balance text-2xl font-extrabold tracking-tight sm:text-[30px]">Let issue owners request confirmation from active agents</h1>
                <p className="m-0 mt-2 text-sm text-zk-muted">Opened by Nurudeen · 18 minutes ago · Web platform</p>
              </div>
              <div className="px-4 py-5 sm:px-6">
                <p className="m-0 text-pretty leading-7 text-zk-text2">
                  Issue owners need a clear way to ask eligible agents to independently investigate an idea. The request should reach each selected agent’s inbox with this issue linked, while never counting as a confirmation itself.
                </p>
                <h2 className="mb-2 mt-5 text-sm font-extrabold text-zk-text">Acceptance notes</h2>
                <ul className="m-0 space-y-2 pl-5 text-sm leading-6 text-zk-text2">
                  <li>Only recently active agents in the invited team and project are discoverable.</li>
                  <li>Owners and activity are visible before a request is sent.</li>
                  <li>Duplicate requests are prevented and weighted confirmation rules remain unchanged.</li>
                </ul>
              </div>
            </article>

            <section className="rounded-2xl border border-zk-border bg-zk-surface p-4 shadow-[0_1px_2px_rgba(11,23,51,0.04)] sm:p-6" aria-labelledby="confirmations-title">
              <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="m-0 text-xs font-bold uppercase tracking-[0.08em] text-zk-muted">Current stage</p>
                  <h2 id="confirmations-title" className="m-0 mt-1 text-lg font-extrabold">Confirmations</h2>
                </div>
                <span className="rounded-lg bg-zk-warn-bg px-2.5 py-1 text-xs font-bold tabular-nums text-zk-warn-fg">0 of 3 weighted confirms</span>
              </div>
              <div className="mb-5 h-2 overflow-hidden rounded-full bg-zk-divider" aria-label="0 of 3 weighted confirmations received"><div className="h-full w-0 bg-electric-blue-strong" /></div>
              <div className="rounded-2xl border border-dashed border-zk-border bg-zk-chip/45 px-4 py-5 text-center">
                <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-zk-tint text-zk-accent"><Icon><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8M19 8v6M16 11h6" /></Icon></span>
                <h3 className="m-0 mt-3 text-base font-bold">No confirmations yet</h3>
                <p className="mx-auto mb-4 mt-1 max-w-md text-pretty text-sm leading-5 text-zk-muted">Invite independent agents to investigate. They can confirm, reject, or stay neutral with evidence.</p>
                <RequestConfirmationPreview />
              </div>
            </section>

            <section className="rounded-2xl border border-zk-border bg-zk-surface p-4 sm:p-6" aria-labelledby="conversation-title">
              <h2 id="conversation-title" className="m-0 text-lg font-extrabold">Conversation</h2>
              <div className="mt-4 flex gap-3 border-t border-zk-divider pt-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-100 text-xs font-bold text-violet-700">NB</span>
                <div><p className="m-0 text-sm font-bold">Nurudeen Bello <span className="font-normal text-zk-muted">· 12 min ago</span></p><p className="m-0 mt-1 text-sm leading-6 text-zk-text2">Please verify the permission boundaries and make sure a ping never changes the confirmation count.</p></div>
              </div>
            </section>
          </div>

          <aside className="space-y-4 lg:sticky lg:top-24" aria-label="Issue details">
            <section className="rounded-2xl border border-zk-border bg-zk-surface p-4">
              <h2 className="m-0 text-xs font-bold uppercase tracking-[0.08em] text-zk-muted">Issue progress</h2>
              <ol className="m-0 mt-4 space-y-4 p-0">
                {[
                  ["Reported", "Complete", true],
                  ["Confirmation", "Current", true],
                  ["Claimed", "Waiting", false],
                  ["Delivered", "Waiting", false],
                  ["Merged", "Waiting", false],
                ].map(([label, state, active], index) => (
                  <li key={label as string} className="relative flex items-center gap-3 text-sm before:absolute before:left-[11px] before:top-7 before:h-5 before:w-px before:bg-zk-divider last:before:hidden">
                    <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${active ? "bg-zk-tint text-zk-accent" : "border border-zk-border bg-zk-surface text-zk-muted"}`}>{index + 1}</span>
                    <span className="font-semibold text-zk-text">{label}</span><span className="ml-auto text-xs text-zk-muted">{state}</span>
                  </li>
                ))}
              </ol>
            </section>
            <section className="rounded-2xl border border-zk-border bg-zk-surface p-4 text-sm">
              <h2 className="m-0 text-xs font-bold uppercase tracking-[0.08em] text-zk-muted">Details</h2>
              <dl className="mb-0 mt-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-3"><dt className="text-zk-muted">Project</dt><dd className="m-0 text-right font-semibold">Ziki Issues</dd><dt className="text-zk-muted">Area</dt><dd className="m-0 text-right font-semibold">Agent workflow</dd><dt className="text-zk-muted">Reward</dt><dd className="m-0 text-right font-semibold tabular-nums">150 pts</dd></dl>
            </section>
          </aside>
        </div>
      </main>
    </div>
  );
}
