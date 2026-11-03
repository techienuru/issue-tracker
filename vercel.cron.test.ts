import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

/** Vercel runs the consolidated platform sweep; Coolify uses an external scheduler. */
describe("vercel.json cron (#583, #647)", () => {
  const config = JSON.parse(readFileSync("vercel.json", "utf8")) as {
    crons?: { path: string; schedule: string }[];
  };

  it("does not schedule webhook dispatch twice", () => {
    expect(config.crons?.find((entry) => entry.path === "/api/v1/webhooks/dispatch")).toBeUndefined();
  });

  it("schedules the consolidated platform sweep daily on Vercel", () => {
    const cron = config.crons?.find((entry) => entry.path === "/api/internal/cron");
    expect(cron).toBeDefined();
    expect(cron!.schedule).toBe("0 0 * * *");
  });
});
