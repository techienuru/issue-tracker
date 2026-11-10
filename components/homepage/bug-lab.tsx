"use client";

import { useEffect, useRef, useState } from "react";
import { bugLabCss } from "./bug-lab-styles";

const scene = [
  { act: "READY TO DELIVER", title: "One message. Two mailboxes. One tiny troublemaker.", detail: "Maya has been asked to review an issue. Watch where the notification goes." },
  { act: "ACT 1 · THE MIX-UP", title: "Uh-oh. Wrong mailbox!", detail: "The bug flips the address switch. Maya's review request lands with Theo." },
  { act: "ACT 2 · ATLAS INVESTIGATES", title: "Atlas follows the delivery trail.", detail: "Atlas walks to the switch to find out why the envelope missed Maya." },
  { act: "ACT 2 · CLUE FOUND", title: "The route points to Theo.", detail: "The address says Maya, but the switch sent the notification to Theo." },
  { act: "ACT 2 · RHEA RECORDS IT", title: "Rhea walks to the issue card.", detail: "A useful bug report needs the intended recipient and the actual recipient." },
  { act: "ACT 2 · ISSUE UPDATED", title: "The missing detail is pinned down.", detail: "Rhea writes: “Review request for Maya was delivered to Theo.”" },
  { act: "ACT 3 · NOVA REPAIRS", title: "Nova walks to the routing switch.", detail: "Nova checks the route the bug changed." },
  { act: "ACT 3 · ROUTE CORRECTED", title: "Now the arrow points to Maya.", detail: "The team sends a fresh test notification through the same post office." },
  { act: "ACT 3 · TEST DELIVERY", title: "Let's watch the test envelope.", detail: "This time it should reach the person named on the address." },
  { act: "DELIVERY VERIFIED", title: "Special delivery. Right person!", detail: "Maya receives the review request. The issue is verified and the bug is caught." },
] as const;

const stageDuration = [0, 3100, 2200, 2200, 2200, 2400, 2200, 2300, 3200] as const;

function Agent({ name, color, tool }: { name: string; color: string; tool: string }) {
  return (
    <div className={`bl-agent bl-${name.toLowerCase()} bl-agent-${color}`} aria-hidden="true">
      <span className="bl-agent-tool">{tool}</span>
      <span className="bl-agent-body"><span className="bl-agent-antenna" /><span className="bl-agent-eyes"><i /><i /></span><span className="bl-agent-mouth" /></span>
      <span className="bl-agent-legs"><i /><i /></span>
      <span className="bl-agent-shadow" />
      <span className="bl-agent-name">{name}</span>
    </div>
  );
}

function Envelope({ test = false }: { test?: boolean }) {
  return (
    <div className={`bl-envelope ${test ? "bl-test-envelope" : "bl-first-envelope"}`} aria-hidden="true">
      <span className="bl-envelope-flap" />
      <span className="bl-envelope-address">TO: MAYA</span>
      <span className="bl-envelope-seal">Z</span>
    </div>
  );
}

export function BugLab() {
  const stageRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (step !== 1) return;
    const timer = window.setTimeout(() => {
      const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
      stageRef.current?.scrollIntoView?.({ behavior: reducedMotion ? "auto" : "smooth", block: "center" });
    }, 0);
    return () => window.clearTimeout(timer);
  }, [step]);

  useEffect(() => {
    if (step === 0 || step === scene.length - 1) return;
    const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const timer = window.setTimeout(() => setStep(step + 1), reducedMotion ? 2300 : stageDuration[step]);
    return () => window.clearTimeout(timer);
  }, [step]);

  const current = scene[step];
  const active = step > 0 && step < scene.length - 1;

  return (
    <section className="bl-lab" id="bug-lab" aria-labelledby="bug-lab-title">
      <style dangerouslySetInnerHTML={{ __html: bugLabCss }} />
      <div className="bl-heading">
        <span className="bl-eyebrow"><span aria-hidden="true">✳</span> A little live scene</span>
        <h2 id="bug-lab-title">The case of the <em>mixed-up mail.</em></h2>
        <p>Watch three tiny agents walk through a real issue: find the mistake, record the clue, and prove the fix.</p>
      </div>

      <div className="bl-theater" data-step={step}>
        <div className="bl-theater-bar"><span aria-hidden="true">✦ ✳ ✦</span><strong>ZIKI POST OFFICE</strong><span>SAMPLE SCENE · NO REAL NOTIFICATIONS SENT</span></div>
        <div className="bl-stage" ref={stageRef}>
          <div className="bl-sky" aria-hidden="true"><span className="bl-sun">✳</span><span className="bl-cloud bl-cloud-one" /><span className="bl-cloud bl-cloud-two" /></div>
          <div className="bl-post-office" aria-hidden="true"><span className="bl-roof">THE TEAM&apos;S POST OFFICE</span><span className="bl-window"><i /><i /><i /></span><span className="bl-door">✉</span></div>
          <div className="bl-delivery-line" aria-hidden="true"><i /><i /><i /><i /><i /></div>
          <div className="bl-floor" aria-hidden="true" />

          <div className="bl-issue-card">
            <div className="bl-card-top"><span>✳ ISSUE #1847</span><span>{step === 9 ? "VERIFIED" : "OPEN"}</span></div>
            <strong>Review request for Maya</strong>
            <p className="bl-card-placeholder">{step < 5 ? "Something went wrong with delivery…" : "Notification for Maya was delivered to Theo."}</p>
            <span className="bl-card-stamp">DELIVERY<br />VERIFIED ✓</span>
          </div>

          <div className="bl-sorter" aria-label={step >= 7 ? "Address switch points to Maya" : "Address switch points to Theo"}>
            <span className="bl-sorter-heading">ADDRESS SWITCH</span>
            <div className="bl-sorter-face"><span className="bl-sorter-arrow">➜</span><span className="bl-sorter-destination">{step >= 7 ? "MAYA" : "THEO"}</span></div>
            <span className="bl-sorter-base" />
          </div>

          <div className="bl-mailboxes">
            <div className="bl-mailbox bl-mailbox-maya"><span className="bl-mailbox-flag" /><span className="bl-mailbox-slot" /><strong>MAYA</strong><small>{step === 9 ? "RECEIVED ✓" : "WAITING…"}</small></div>
            <div className="bl-mailbox bl-mailbox-theo"><span className="bl-mailbox-flag" /><span className="bl-mailbox-slot" /><strong>THEO</strong><small>{step >= 1 && step < 9 ? "WRONG PERSON!" : "EMPTY"}</small></div>
          </div>

          <Envelope /><Envelope test />
          <div className="bl-bug" aria-hidden="true"><span className="bl-bug-antenna" /><span className="bl-bug-eyes"><i /><i /></span><span className="bl-bug-mouth" /><span className="bl-bug-legs"><i /><i /><i /><i /></span></div>
          <div className="bl-bug-jar" aria-hidden="true"><span className="bl-jar-lid" /><span className="bl-jar-glint" /><span className="bl-bug bl-jar-bug"><span className="bl-bug-antenna" /><span className="bl-bug-eyes"><i /><i /></span><span className="bl-bug-mouth" /><span className="bl-bug-legs"><i /><i /><i /><i /></span></span><small>CAUGHT!</small></div>
          <div className="bl-clue-tag">ADDRESS: MAYA<br />DELIVERED: THEO</div>
          <div className="bl-speech bl-speech-theo">This isn&apos;t for me!</div>
          <div className="bl-speech bl-speech-maya">My review request!</div>

          <Agent name="ATLAS" color="blue" tool="⌕" />
          <Agent name="RHEA" color="purple" tool="✎" />
          <Agent name="NOVA" color="peach" tool="⚒" />
          <div className="bl-confetti" aria-hidden="true"><i>✦</i><i>✳</i><i>✦</i><i>✳</i><i>✦</i><i>✳</i></div>
        </div>

        <div className="bl-story-panel">
          <div className="bl-status-line"><span className={`bl-status-dot ${active ? "bl-status-dot-live" : ""}`} /><span>{current.act}</span><span>{step === 0 ? "READY" : step === 9 ? "DONE" : `SCENE ${step} / 8`}</span></div>
          <div className="bl-story-copy" role="status" aria-live="polite" aria-atomic="true"><h3>{current.title}</h3><p>{current.detail}</p></div>
          {step === 0 && <button className="bl-big-button" type="button" onClick={() => setStep(1)}>Start delivery <span aria-hidden="true">↗</span></button>}
          {active && <div className="bl-now-playing"><span className="bl-playing-bars" aria-hidden="true"><i /><i /><i /></span> The agents are on it</div>}
          {step === 9 && <div className="bl-end-actions"><button className="bl-big-button" type="button" onClick={() => setStep(1)}>Replay scene <span aria-hidden="true">↺</span></button><a href="#product">See how Ziki works ↗</a></div>}
          <div className="bl-progress" aria-label={step === 0 ? "Scene ready" : step === 9 ? "Scene complete" : "Scene in progress"}><span className={step >= 1 ? "bl-progress-done" : ""}>1 <small>Misdelivery</small></span><span className={step >= 3 ? "bl-progress-done" : ""}>2 <small>Investigate</small></span><span className={step >= 7 ? "bl-progress-done" : ""}>3 <small>Test fix</small></span></div>
        </div>
      </div>
      <p className="bl-footnote">An illustrated sample of Ziki teamwork. No real issue or notification is changed.</p>
    </section>
  );
}
