'use client';

import dynamic from 'next/dynamic';

// CommandPalette is only ever shown on Cmd/Ctrl+K — no reason to ship it
// in the initial bundle for every page load. `next/dynamic` with
// `ssr: false` requires a Client Component boundary, which is why this
// is a separate file from the (Server Component) root layout.
const CommandPalette = dynamic(
  () => import('./CommandPalette').then((mod) => mod.CommandPalette),
  { ssr: false }
);

export function LazyCommandPalette() {
  return <CommandPalette />;
}
