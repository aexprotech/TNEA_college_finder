import React from "react";

export function Badge({ children }: { children: React.ReactNode }) {
  return <span className="inline-block px-2 py-1 text-xs font-semibold bg-gray-200 rounded">{children}</span>;
} 