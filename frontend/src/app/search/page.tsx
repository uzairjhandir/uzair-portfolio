import { Suspense } from "react";
import { SearchClient } from "./SearchClient";

export const metadata = {
  title: "Search",
  description: "Search across blog posts, portfolio projects, case studies, and downloads.",
};

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <SearchClient />
    </Suspense>
  );
}
