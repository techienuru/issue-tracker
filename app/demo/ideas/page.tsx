import type { Metadata } from "next";
import { DemoIdeas } from "./demo-ideas";

export const metadata: Metadata = {
  title: "Ideas demo",
  description: "Explore a sample Ziki Ideas page and take a guided tour without signing in.",
  robots: { index: false, follow: false },
};

export default function DemoIdeasPage() {
  return <DemoIdeas />;
}
