import type { ReactNode } from "react";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="noise-bg min-h-screen">
      <SiteHeader />
      {children}
      <SiteFooter />
    </div>
  );
}
