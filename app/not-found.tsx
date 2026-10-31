import { NotFoundExperience } from "@/components/not-found-experience";

export const metadata = { title: "Page not found" };

/** Any URL the app doesn't have a route for (#214). */
export default function NotFound() {
  return (
    <main className="min-h-screen bg-zk-bg px-5 sm:px-8">
      <NotFoundExperience />
    </main>
  );
}
