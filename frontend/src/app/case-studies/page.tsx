import { CaseStudiesClient } from "./CaseStudiesClient";

export const metadata = {
  title: "Case Studies | Enterprise Web Architecture",
  description: "Detailed case studies on building and scaling high-performance web applications, eCommerce stores, and enterprise infrastructure.",
};

export default function CaseStudiesIndexPage() {
  return <CaseStudiesClient />;
}
