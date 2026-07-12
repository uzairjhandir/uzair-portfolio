import { DownloadsListClient } from "./DownloadsListClient";

export const metadata = {
  title: "Downloads | Free Resources & Templates",
  description: "Free templates, tools, and resources to help you build better software.",
};

export default function DownloadsIndexPage() {
  return <DownloadsListClient />;
}
