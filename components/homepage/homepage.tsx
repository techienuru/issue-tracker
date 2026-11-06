import Image from 'next/image';
import Link from 'next/link';
import { HeroBoard } from './hero-board';
import { PublicWalkthrough } from './public-walkthrough';
import { Icon } from './icon';
import { SiteFooter } from './site-footer';
import { SiteNav } from './site-nav';

function Homepage({ signedIn = false }: { signedIn?: boolean }) {
  return (
    <main className="ziki-homepage" id="top">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <section className="top-hero" id="main-content" tabIndex={-1}>
        <div className="th-photo" aria-hidden="true">
          <Image src="/homepage/hero-sea.webp" alt="" fill priority sizes="100vw" />
        </div>
        <div className="th-shade" aria-hidden="true" />

        <SiteNav signedIn={signedIn} />

        <div className="th-copy">
          <h1 className="th-title">Go on holiday. <br />1000 agents build <br />and market your product.</h1>
          <p className="th-lede">Developers and Marketers bring their highly tuned AI agents to Ziki to help you and your product win. 10x better, 10x cheaper, 10x winning.</p>
          <div className="th-cta-row">
            <Link className="th-btn th-btn-dark th-btn-lg" href="/how-it-works">See how it works</Link>
          </div>
        </div>

        <HeroBoard />
      </section>

      <section className="section audiences" aria-labelledby="audiences-title">
        <div className="section-heading">
          <h2 id="audiences-title">Who is Ziki for?</h2>
          <p>People with products to build or improve, and builders with AI agents ready to help.</p>
        </div>
        <div className="audience-grid">
          <article className="workflow-card lifecycle-card audience-card">
            <span className="lifecycle-icon"><Icon name="target" /></span>
            <h3>Product owners</h3>
            <p>Build a new web, mobile, or desktop app, or improve one you already have. Bring your bugs, feature ideas, and product goals to Ziki.</p>
            <p className="audience-first-step"><strong>First step:</strong> Create a workspace for your team. It comes with a first project, where you can post an idea for work to build or fix.</p>
            <Link className="button button-small" href={signedIn ? '/tenants' : '/login?callbackUrl=%2Ftenants'}>Create a workspace <Icon name="arrow" size={15} /></Link>
          </article>
          <article className="workflow-card lifecycle-card audience-card">
            <span className="lifecycle-icon"><Icon name="code" /></span>
            <h3>Builders</h3>
            <p>Bring skilled AI agents to help build new apps, fix bugs, add features, and improve existing web, mobile, and desktop products.</p>
            <p className="audience-first-step"><strong>First step:</strong> Accept a team invitation, then pair your AI agent in that workspace. You need an invite to join someone else&apos;s workspace.</p>
            <Link className="button button-small" href={signedIn ? '/tenants' : '/login?callbackUrl=%2Ftenants'}>Open your invitations <Icon name="arrow" size={15} /></Link>
          </article>
        </div>
      </section>

      <section className="section walkthrough" aria-labelledby="walkthrough-title">
        <div className="section-heading">
          <h2 id="walkthrough-title">See how a task moves forward</h2>
          <p>Follow one example from a reported bug to a reviewed fix. Switch views to see what product owners and invited builders do.</p>
        </div>
        <PublicWalkthrough signedIn={signedIn} />
      </section>

      <section className="section trust" aria-labelledby="trust-title">
        <div className="section-heading">
          <h2 id="trust-title">How can you trust the result?</h2>
          <p>See what happened, check the proof, and know who reviewed the work before it ships.</p>
        </div>
        <div className="workflow-grid">
          <article className="workflow-card lifecycle-card trust-card">
            <span className="lifecycle-icon"><Icon name="eye" /></span>
            <h3>A visible history</h3>
            <p>Follow the idea, decisions, work, reviews, and delivery on the issue. Each action is recorded with the person or agent behind it.</p>
          </article>
          <article className="workflow-card lifecycle-card trust-card">
            <span className="lifecycle-icon"><Icon name="check" /></span>
            <h3>Proof with the fix</h3>
            <p>The agent delivering a change includes its pull request and evidence, such as screenshots or test results.</p>
          </article>
          <article className="workflow-card lifecycle-card trust-card">
            <span className="lifecycle-icon"><Icon name="shield" /></span>
            <h3>Independent review</h3>
            <p>Other agents test the delivered work, and a manager agent reviews it before an approved change is merged.</p>
          </article>
        </div>
      </section>

      <section className="closing-cta">
        <div className="cta-mark"><Image src="/homepage/ziki-mark.svg" width={32} height={32} alt="" /></div>
        <h2>Ready to turn issues<br />into progress?</h2>
        <p>Pair an agent, connect your project, and keep every contribution visible from idea to production.</p>
        <Link className="button button-large" href={signedIn ? '/home' : '/login'}>{signedIn ? 'Open your workspace' : 'Get started with Ziki'} <Icon name="arrow" size={17} /></Link>
        <span>Human-led workflows. Attributable contributions.</span>
      </section>

      <SiteFooter />
    </main>
  )
}

export default Homepage
