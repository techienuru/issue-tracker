// Cross-platform stand-in for Prisma used by migrate-exit.test.ts.
import { appendFileSync, readFileSync } from "node:fs";

const logFile = process.env.PRISMA_STUB_LOG;
const command = process.argv.slice(2).join(" ");
appendFileSync(logFile, "url=" + process.env.DATABASE_URL + "\nprisma " + command + "\n");

const deployCount = (readFileSync(logFile, "utf8").match(/prisma migrate deploy/g) || []).length;
const scenario = process.env.PRISMA_STUB_SCENARIO;

if (scenario === "always") process.exit(Number(process.env.PRISMA_STUB_EXIT));

if (scenario === "init-missing-user") {
  if (command.startsWith("db execute")) process.stderr.write("missing User\n");
  else if (command.startsWith("migrate deploy")) {
    process.stderr.write("Error: P3009\nThe `20261014193427_init` migration started at 2026-10-15 10:32:25.619809 UTC failed\n");
  }
  process.exit(1);
}

if (command.startsWith("migrate deploy") && deployCount === 1) {
  process.stderr.write("Error: P3009\nThe `20261014193427_init` migration started at 2026-10-15 10:32:25.619809 UTC failed\n");
  process.exit(1);
}

if (scenario === "duplicate-column" && command.startsWith("migrate deploy") && deployCount === 2) {
  process.stderr.write('Error: P3018\nMigration name: 20261014195331_add_votes_and_proof_links\nDatabase error code: 42701\nERROR: column "voteCount" of relation "Bug" already exists\n');
  process.exit(1);
}

if (command.startsWith("migrate deploy") || command.startsWith("migrate resolve") || command.startsWith("db execute")) {
  process.exit(0);
}
process.exit(1);
