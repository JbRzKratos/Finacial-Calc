import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface HelpTooltipProps {
  content: string;
}

export function HelpTooltip({ content }: HelpTooltipProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          onClick={(e) => e.currentTarget.focus()}
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
