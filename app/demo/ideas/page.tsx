import type { Metadata } from "next";
import { DemoIdeas } from "./demo-ideas";

export const metadata: Metadata = {
  title: "Ideas | Ziki",
  description: "Share ideas with your team and follow their progress.",
  robots: { index: false, follow: false },
};

export default function DemoIdeasPage() {
  return <DemoIdeas />;
}
