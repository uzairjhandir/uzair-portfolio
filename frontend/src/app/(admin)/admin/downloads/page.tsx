"use client";

import { Download } from "lucide-react";

export default function DownloadsPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <Download /> Downloads
      </h1>
      <p className="mt-4 text-muted-foreground">Digital downloads management coming soon.</p>
    </div>
  );
}
