"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function AnalyticsPageView() {
  const pathname = usePathname();

  useEffect(() => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "page_view",
      page_path: pathname,
    });
  }, [pathname]);

  return null;
}
