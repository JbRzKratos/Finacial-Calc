"use client";

import { useState, useEffect, useRef } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface HelpTooltipProps {
  content: string;
}

export function HelpTooltip({ content }: HelpTooltipProps) {
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent | TouchEvent) => {
      if (btnRef.current && !btnRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const id = setTimeout(() => document.addEventListener("click", handler), 0);
    return () => {
      clearTimeout(id);
      document.removeEventListener("click", handler);
    };
  }, [open]);

  return (
    <Tooltip open={open} onOpenChange={setOpen}>
      <TooltipTrigger asChild>
        <button
          ref={btnRef}
          type="button"
          onClick={(e) => {
            e.preventDefault();
            setOpen((prev) => !prev);
          }}
          onKeyDown={(e) => {
            if (e.key === "Escape") setOpen(false);
          }}
          className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-muted text-muted-foreground text-[11px] font-bold cursor-pointer ml-1.5 align-middle shrink-0 p-0 border-0 hover:bg-muted/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Help"
        >
          ?
        </button>
      </TooltipTrigger>
      <TooltipContent
        side="top"
        align="center"
        sideOffset={8}
        className="max-w-[75vw] sm:max-w-[240px] text-sm leading-relaxed z-[100]"
      >
        {content}
      </TooltipContent>
    </Tooltip>
  );
}
