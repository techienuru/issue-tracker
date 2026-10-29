import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { BASE_PATH } from "@/lib/base-path";
import { REPORT_FORM_URL } from "@/lib/report-form";
import { WorkshopScene } from "./workshop-scene";
import "./auth-split-frame.css";

function brandAsset(file: string) {
  return BASE_PATH ? `${BASE_PATH}/brand/${file}` : `/brand/${file}`;
}

function CheckIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#8FC9FF"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function BrandPanel({ loginError = false }: { loginError?: boolean }) {
  return (
    <section
      aria-label="About Ziki"
      className="relative flex w-full flex-col gap-7 overflow-hidden bg-deep-ocean px-8 py-8 text-white sm:px-14 sm:py-12 lg:min-h-[min(100vh,720px)] lg:flex-[1_1_560px] lg:gap-10"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(143,201,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(143,201,255,0.06) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-[120px] -right-40 size-[520px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(57,120,246,0.35), rgba(57,120,246,0) 65%)",
        }}
      />

      <div className="relative flex items-center justify-between gap-4">
        <Image
          src={brandAsset("ziki-logo-dark.png")}
          alt="Ziki"
          width={120}
          height={40}
          className="h-10 w-[120px] object-contain"
          unoptimized
          priority
        />
        <Link
          href="/"
          className="inline-flex min-h-10 items-center gap-1.5 text-sm font-semibold text-[#C9D6EF] hover:underline"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to homepage
        </Link>
      </div>

      <div className="relative flex max-w-[520px] flex-col gap-[18px]">
        <span className="inline-flex items-center gap-2 self-start rounded-full border border-[#263B63] bg-[rgba(38,59,99,0.55)] px-3 py-1.5 text-[13px] font-semibold text-[#C9D6EF]">
          <span className="size-[7px] rounded-full bg-sky-tint" aria-hidden="true" />
          Issue tracking for teams and their AI agents
        </span>
        <h1 className="text-[clamp(34px,3.6vw,50px)] leading-[1.08] font-extrabold tracking-[-0.03em]">
          Bugs come in.
          <br />
          <span className="text-sky-tint">Better software goes out.</span>
        </h1>
      </div>

      <WorkshopScene initialError={loginError} />

      <div className="relative flex flex-wrap gap-6 text-sm text-[#C9D6EF]">
        {["Report", "Vote", "Track", "Earn points"].map((label) => (
          <span key={label} className="inline-flex items-center gap-2">
            <CheckIcon />
            {label}
          </span>
        ))}
      </div>
    </section>
  );
}

function AuthCardMark() {
  return (
    <span className="flex size-[52px] items-center justify-center overflow-hidden rounded-2xl bg-deep-ocean">
      <Image
        src={brandAsset("ziki-mark.png")}
        alt=""
        width={30}
        height={26}
        className="h-[26px] w-[30px] object-contain"
        unoptimized
        priority
      />
    </span>
  );
}

function AgentDocsCallout() {
  return (
    <div className="flex gap-3.5 rounded-[18px] bg-zk-tint p-[18px]">
      <span className="flex size-[38px] shrink-0 items-center justify-center rounded-xl bg-electric-blue-strong text-white">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <rect x="4" y="8" width="16" height="12" rx="2" />
          <path d="M12 4v4" />
          <path d="M9 14h.01" />
          <path d="M15 14h.01" />
        </svg>
      </span>
      <div className="flex min-w-0 flex-col gap-2">
        <span className="text-sm font-bold text-zk-text">
          Looking for agent API docs or LLM specs?
        </span>
        <span className="text-[13px] leading-[1.55] text-zk-text2">
          Agents work through API keys and the live event feed. Read the machine-readable
          spec or the platform overview.
        </span>
        <div className="flex flex-wrap gap-x-4 gap-y-2 text-[13px] font-bold">
          <Link
            href="/llms.txt"
            className="inline-flex min-h-7 max-w-full flex-wrap items-center gap-1 font-mono text-zk-text underline decoration-zk-border underline-offset-2 hover:text-zk-accent hover:decoration-zk-text"
          >
            /llms.txt spec
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
          <Link
            href="/"
            className="inline-flex min-h-7 items-center text-zk-text hover:underline"
          >
            Public homepage
          </Link>
        </div>
      </div>
    </div>
  );
}

function AuthFooter() {
  return (
    <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-[13px] text-zk-muted">
      <span>© {new Date().getFullYear()} Ziki</span>
      {REPORT_FORM_URL ? (
        <a
          href={REPORT_FORM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-zk-muted hover:underline"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
            <path d="M4 22v-7" />
          </svg>
          Report an issue
        </a>
      ) : null}
      <Link href="/docs" className="text-zk-muted hover:underline">
        Help
      </Link>
    </div>
  );
}

/**
 * Split auth chrome from Login.dc.html: navy brand panel + surface card.
 * Shared by login, forgot/reset password, and join. Signup still redirects.
 */
export function AuthSplitFrame({
  children,
  panelLabel = "Sign in",
  showAgentDocs = false,
  title,
  description,
  mark = true,
  loginError = false,
}: {
  children: ReactNode;
  panelLabel?: string;
  showAgentDocs?: boolean;
  title: string;
  description?: ReactNode;
  mark?: boolean;
  loginError?: boolean;
}) {
  return (
    <div className="zk-motion ziki-auth-frame flex min-h-screen flex-col bg-zk-bg text-zk-text lg:flex-row">
      <BrandPanel loginError={loginError} />
      <section
        aria-label={panelLabel}
        className="relative flex w-full flex-col items-center justify-center gap-7 px-6 py-10 sm:px-8 lg:flex-[1_1_480px]"
      >
        <div className="absolute top-6 right-6">
          <ThemeToggle />
        </div>

        <div className="ziki-auth-card-in flex w-full max-w-[440px] flex-col gap-6 rounded-3xl border border-zk-border bg-zk-surface p-7 shadow-[0_30px_70px_rgba(11,23,51,0.10)] sm:p-9">
          <div className="flex flex-col gap-3.5">
            {mark ? <AuthCardMark /> : null}
            <h2 className="text-[28px] font-extrabold tracking-[-0.02em] text-zk-text">
              {title}
            </h2>
            {description ? (
              <div className="text-[15px] leading-relaxed text-zk-muted">{description}</div>
            ) : null}
          </div>
          {children}
          {showAgentDocs ? (
            <>
              <div className="flex items-center gap-3 text-xs font-bold tracking-[0.06em] text-zk-muted uppercase">
                <span className="h-px flex-1 bg-zk-border" />
                For AI agents
                <span className="h-px flex-1 bg-zk-border" />
              </div>
              <AgentDocsCallout />
            </>
          ) : null}
        </div>

        <AuthFooter />
      </section>
    </div>
  );
}

export function AuthLegalNote() {
  return (
    <p className="text-center text-xs leading-relaxed text-zk-muted">
      By continuing, you agree to Ziki&apos;s{" "}
      <span className="font-semibold text-zk-accent">Terms</span> and{" "}
      <span className="font-semibold text-zk-accent">Privacy Policy</span>.
    </p>
  );
}
