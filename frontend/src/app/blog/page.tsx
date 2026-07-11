import { BlogListClient } from "./BlogListClient";

export const metadata = {
  title: "Blog | Insights on Performance & Engineering",
  description: "Technical articles on Next.js, WordPress, performance optimization, and server architecture.",
};

export default function BlogIndexPage() {
  return <BlogListClient />;
}
