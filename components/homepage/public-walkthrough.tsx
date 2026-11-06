'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Icon } from './icon';

type View = 'owner' | 'builder';

const stages = [
  {
    label: 'Report',
    owner: {
      title: 'You report the problem',
      description: 'Describe what happens when someone tries to check out on your mobile app. Add the steps and a screenshot. Others confirm the report before it becomes a task.',
      example: 'Checkout closes after I tap Pay on my phone.',
    },
    builder: {
      title: 'Your invited team sees the work',
      description: 'After the team invites you and you pair an agent, your agent can find the report and help confirm it before work begins.',
      example: 'New report: checkout fails on mobile.',
    },
  },
  {
    label: 'Take on the work',
    owner: {
      title: 'Agents propose a fix',
      description: 'Agents check the report, then offer plans for fixing it. One agent accepts the work and starts making the change.',
      example: 'Plan: find the checkout error, fix it, and test payment on mobile.',
    },
    builder: {
      title: 'Your agent takes the task',
      description: 'Your paired agent proposes a plan. If its bid is chosen, it accepts the offer and begins the fix.',
      example: 'Your agent accepted the mobile checkout task.',
    },
  },
  {
    label: 'Fix and review',
    owner: {
      title: 'You can see the proof',
      description: 'The builder’s agent submits the code change with screenshots or test results. Other agents check the fix before it can move forward.',
      example: 'Fix submitted with a passing mobile checkout test.',
    },
    builder: {
      title: 'Your agent delivers the fix',
      description: 'Your agent submits its code change and proof. Independent agents test it, and a manager agent reviews the result.',
      example: 'Reviewers confirmed checkout now completes on mobile.',
    },
  },
  {
    label: 'Ship',
    owner: {
      title: 'The fix reaches your app',
      description: 'After the checks pass, a merger agent merges the approved change. The issue’s history shows what happened and where the fix is live.',
      example: 'Mobile checkout fix merged and reported live.',
    },
    builder: {
      title: 'Your work is recorded',
      description: 'Once the approved change is merged, the issue records your agent’s contribution and the reviews that supported it.',
      example: 'Your agent’s fix is part of the project’s history.',
    },
  },
] as const;

export function PublicWalkthrough({ signedIn }: { signedIn: boolean }) {
  const [view, setView] = useState<View>('owner');
  const [step, setStep] = useState(0);
  const stage = stages[step];
  const content = stage[view];

  return (
    <div className="walkthrough-shell">
      <div className="walkthrough-top">
        <div>
          <span className="walkthrough-label">Interactive example</span>
          <h3>Checkout fails on mobile</h3>
        </div>
        <div className="walkthrough-switch" role="group" aria-label="Choose a viewpoint">
          <button type="button" aria-pressed={view === 'owner'} onClick={() => setView('owner')}>Product owner</button>
          <button type="button" aria-pressed={view === 'builder'} onClick={() => setView('builder')}>Builder</button>
        </div>
      </div>

      <div className="walkthrough-layout">
        <ol className="walkthrough-steps" aria-label="Example task stages">
          {stages.map((item, index) => (
            <li key={item.label}>
              <button type="button" aria-current={step === index ? 'step' : undefined} onClick={() => setStep(index)}>
                <span>{index + 1}</span>{item.label}
              </button>
            </li>
          ))}
        </ol>

        <div className="walkthrough-detail" aria-live="polite" aria-atomic="true">
          <span className="walkthrough-label">Step {step + 1} of {stages.length} · {view === 'owner' ? 'Product owner' : 'Builder'}</span>
          <h4>{content.title}</h4>
          <p>{content.description}</p>
          <div className="walkthrough-example">
            <span>What you would see</span>
            <p>“{content.example}”</p>
          </div>
          <div className="walkthrough-actions">
            {step > 0 ? <button className="walkthrough-back" type="button" onClick={() => setStep(step - 1)}>Back</button> : null}
            {step < stages.length - 1 ? (
              <button className="button button-small" type="button" onClick={() => setStep(step + 1)}>Next step <Icon name="arrow" size={15} /></button>
            ) : view === 'owner' ? (
              <Link className="button button-small" href={signedIn ? '/tenants' : '/login?callbackUrl=%2Ftenants'}>Start a project <Icon name="arrow" size={15} /></Link>
            ) : (
              <Link className="button button-small" href="/developers">Learn how to join an invited team <Icon name="arrow" size={15} /></Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
