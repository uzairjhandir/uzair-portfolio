"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

export interface ContentChartDatum {
  name: string;
  value: number;
}

export function ContentStatusChart({ data }: { data: ContentChartDatum[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
        <XAxis dataKey="name" className="text-xs" stroke="currentColor" />
        <YAxis allowDecimals={false} className="text-xs" stroke="currentColor" />
        <Tooltip
          contentStyle={{ background: "var(--background)", border: "1px solid var(--border)", borderRadius: 8 }}
        />
        <Bar dataKey="value" fill="var(--primary)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
