"use client";

import { PropsWithChildren } from "react";

export function ResponsiveTable({ children }: PropsWithChildren) {
  return (
    <div className="w-full overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
      <div className="min-w-[640px] sm:min-w-0">{children}</div>
    </div>
  );
}
