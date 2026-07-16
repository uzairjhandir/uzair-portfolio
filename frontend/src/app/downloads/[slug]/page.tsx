import { Metadata } from "next";
import axios from "axios";
import { DownloadDetailClient } from "./DownloadDetailClient";
import { DownloadItem } from "@/lib/query/downloads/types";

// Server-only context - talk to the internal backend directly.
const API_URL = process.env.NEXT_PUBLIC_API_URL || `${process.env.BACKEND_INTERNAL_URL || 'http://127.0.0.1:8000'}/api/v1`;

async function getDownload(slug: string): Promise<DownloadItem | null> {
  try {
    const res = await axios.get(`${API_URL}/public/downloads/${slug}`);
    return res.data.data;
  } catch {
    return null;
  }
}

async function getAllDownloads(): Promise<DownloadItem[]> {
  try {
    const res = await axios.get(`${API_URL}/public/downloads`, { params: { per_page: 100 } });
    return res.data.data || [];
  } catch {
    return [];
  }
}

export async function generateStaticParams() {
  const items = await getAllDownloads();
  return items.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const item = await getDownload(resolvedParams.slug);

  if (!item) return {};

  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://uzair.dev";
  const description = item.seo?.description || item.excerpt || '';
  const image = item.preview_image?.original_url || 'https://placehold.co/1200x630';

  return {
    title: item.seo?.title || item.title,
    description,
    alternates: { canonical: item.seo?.canonical_url || `${siteUrl}/downloads/${item.slug}` },
    openGraph: {
      title: item.seo?.title || item.title,
      description,
      type: "website",
      url: `${siteUrl}/downloads/${item.slug}`,
      images: [{ url: image, width: 1200, height: 630, alt: item.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: item.seo?.title || item.title,
      description,
      images: [image],
    },
  };
}

export default async function DownloadDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  return <DownloadDetailClient slug={resolvedParams.slug} />;
}
