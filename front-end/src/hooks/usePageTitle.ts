// src/hooks/usePageTitle.ts
import { useEffect } from "react";

export function usePageTitle(title: string) {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = `${title} | Portfolio CRM`;

    return () => {
      document.title = previousTitle;
    };
  }, [title]);
}
