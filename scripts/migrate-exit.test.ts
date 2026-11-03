import { spawnSync } from "node:child_process";
import { chmodSync, cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";

/**
 * Runs scripts/migrate.mjs against a stand-in `prisma` binary, so the exit
 * code can be checked without a database (#580).
 */
type StubScenario = "always" | "init-then-success" | "init-missing-user" | "duplicate-column";
const dirs: string[] = [];

function runFixture(scenario: StubScenario, env: Record<string, string | undefined>, exitCode = 0) {
  const dir = mkdtempSync(join(tmpdir(), "migrate-exit-"));
  dirs.push(dir);
  mkdirSync(join(dir, "scripts"));
  cpSync("scripts/migrate.mjs", join(dir, "scripts/migrate.mjs"));
  cpSync("scripts/migration-database-url.mjs", join(dir, "scripts/migration-database-url.mjs"));
  cpSync("scripts/prisma-stub.test.mjs", join(dir, "scripts/prisma-stub.test.mjs"));
  mkdirSync(join(dir, "node_modules", ".bin"), { recursive: true });

  const stub = join(dir, "scripts", "prisma-stub.test.mjs");
  const prisma = join(dir, "node_modules", ".bin", process.platform === "win32" ? "prisma.cmd" : "prisma");
  const runner = process.platform === "win32"
    ? ["@echo off", '"' + process.execPath + '" "' + stub + '" %*', "exit /b %errorlevel%", ""].join("\r\n")
    : ["#!/bin/sh", 'exec "' + process.execPath + '" "' + stub + '" "$@"', ""].join("\n");
  writeFileSync(prisma, runner);
  if (process.platform !== "win32") chmodSync(prisma, 0o755);

  const callsFile = join(dir, "calls.log");
  const result = spawnSync(process.execPath, ["scripts/migrate.mjs"], {
    cwd: dir,
    // The stub gets only test inputs, never the parent's database URL.
    env: {
      PATH: process.env.PATH,
      PRISMA_STUB_LOG: callsFile,
      PRISMA_STUB_SCENARIO: scenario,
      PRISMA_STUB_EXIT: String(exitCode),
      ...env,
    } as unknown as NodeJS.ProcessEnv,
    encoding: "utf8",
  });
  const calls = (() => {
    try {
      return readFileSync(callsFile, "utf8");
    } catch {
      return "";
    }
  })();
  return { status: result.status, output: result.stdout + result.stderr, calls };
}

function run(prismaExitCode: number, env: Record<string, string | undefined>) {
  return runFixture("always", env, prismaExitCode);
}

function runStub(scenario: Exclude<StubScenario, "always">, env: Record<string, string | undefined>) {
  return runFixture(scenario, env);
}

afterEach(() => {
  for (const dir of dirs.splice(0)) rmSync(dir, { recursive: true, force: true });
});

const DB = "postgresql://u:p@localhost:5432/db";

describe("scripts/migrate.mjs exit code (#580)", () => {
  it("exits 0 when migrations apply", () => {
    const { status, calls } = run(0, { NODE_ENV: "production", DATABASE_URL: DB });
    expect(status).toBe(0);
    expect(calls).toContain("prisma migrate deploy");
  });

  it("exits non-zero in production when migrations still fail after every repair", () => {
    const { status, output } = run(1, { NODE_ENV: "production", DATABASE_URL: DB });
    expect(status).toBe(1);
    expect(output).toContain("Not starting the server");
  });

  it("can be told to start anyway during an incident", () => {
    const { status } = run(1, { NODE_ENV: "production", DATABASE_URL: DB, ALLOW_START_WITH_FAILED_MIGRATION: "true" });
    expect(status).toBe(0);
  });

  it("only warns outside production", () => {
    const { status, output } = run(1, { NODE_ENV: "development", DATABASE_URL: DB });
    expect(status).toBe(0);
    expect(output).toContain("Continuing outside production");
  });

  it("refuses to start in production with no DATABASE_URL (#220)", () => {
    const { status, calls } = run(0, { NODE_ENV: "production" });
    expect(status).toBe(1);
    expect(calls).toBe("");
  });

  it("migrates through the direct Neon host when DATABASE_URL is pooled", () => {
    const pooled =
      "postgresql://user:secret-pooler@ep-example-pooler.c-7.us-east-2.aws.neon.tech/neondb?sslmode=require";
    const { status, calls, output } = run(0, { NODE_ENV: "production", DATABASE_URL: pooled });
    expect(status).toBe(0);
    expect(calls).toContain("ep-example.c-7.us-east-2.aws.neon.tech");
    expect(calls).not.toContain("ep-example-pooler");
    expect(output).toContain("direct connection");
  });

  it("records the failed init migration as applied when User already exists", () => {
    const { status, calls, output } = runStub("init-then-success", {
      NODE_ENV: "production",
      DATABASE_URL: DB,
    });
    expect(status).toBe(0);
    expect(calls).toContain("migrate resolve --applied 20261014193427_init");
    expect(output).toContain("User already exists");
  });

  it("does not mark init applied when the User table is missing", () => {
    const { status, calls } = runStub("init-missing-user", {
      NODE_ENV: "production",
      DATABASE_URL: DB,
    });
    expect(status).toBe(1);
    expect(calls).not.toContain("migrate resolve");
  });

  it("records a later migration applied when its objects already exist", () => {
    const { status, calls } = runStub("duplicate-column", {
      NODE_ENV: "production",
      DATABASE_URL: DB,
    });
    expect(status).toBe(0);
    expect(calls).toContain("migrate resolve --applied 20261014193427_init");
    expect(calls).toContain("migrate resolve --applied 20261014195331_add_votes_and_proof_links");
  });

  it("the Dockerfile only starts the server when the script succeeds", () => {
    const dockerfile = readFileSync("Dockerfile", "utf8");
    expect(dockerfile).toMatch(/node scripts\/migrate\.mjs && (pnpm run start|node server\.js)/);
    expect(dockerfile).not.toContain("migrate.mjs || true");
  });
});
