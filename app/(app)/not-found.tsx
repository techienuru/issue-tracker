import { NotFoundExperience } from "@/components/not-found-experience";

/**
 * Shown when a signed-in page calls notFound() and its segment has no
 * not-found.tsx of its own (#214). Pages for one kind of thing (issues,
 * people, projects, agents, redesigns, escalations) name it in their own
 * not-found.tsx; this one stays general so it never names the wrong thing.
 */
export default function AppNotFound() {
  return <NotFoundExperience />;
}
