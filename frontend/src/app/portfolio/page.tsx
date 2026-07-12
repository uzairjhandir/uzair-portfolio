import { PortfolioListClient } from "./PortfolioListClient";

export const metadata = {
  title: "Portfolio | Enterprise Web Architecture",
  description: "A collection of products and platforms built for performance, security, and long-term maintainability.",
};

export default function PortfolioIndexPage() {
  return <PortfolioListClient />;
}
