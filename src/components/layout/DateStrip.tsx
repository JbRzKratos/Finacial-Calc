
import * as React from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DateStripProps {
  selectedDate: Date | null;
  onSelectDate: (date: Date | null) => void;
}

export function DateStrip({ selectedDate, onSelectDate }: DateStripProps) {
  // Generate 7 days: 4 days before today, today, and 2 days after today
  const dates = React.useMemo(() => {
    const list: Date[] = [];
    const today = new Date();
    for (let i = -4; i <= 2; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      list.push(d);
    }
    return list;
  }, []);

  const isSameDay = (d1: Date, d2: Date) => {
    return (
      d1.getDate() === d2.getDate() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getFullYear() === d2.getFullYear()
    );
  };

  const today = new Date();

  return (
    <div className="w-full py-2">
      <ScrollArea className="w-full whitespace-nowrap pb-2">
        <div className="flex flex-nowrap space-x-2 px-1">
          {/* "All" filter pill */}
          <Button
            variant={selectedDate === null ? "default" : "ghost"}
            size="sm"
            type="button"
            onClick={() => onSelectDate(null)}
            className={cn(
              "rounded-full px-4 h-11 text-xs font-semibold uppercase tracking-wider transition-all",
              selectedDate === null
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
          >
            All
          </Button>

          {dates.map((date) => {
            const isToday = isSameDay(date, today);
            const isSelected = selectedDate ? isSameDay(date, selectedDate) : false;
            
            const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
            const dayNum = date.getDate();

            return (
              <Button
                key={date.toISOString()}
                variant={isSelected ? "default" : "ghost"}
                size="sm"
                type="button"
                onClick={() => onSelectDate(date)}
                className={cn(
                  "flex flex-col items-center justify-center rounded-full w-12 h-14 transition-all py-1",
                  isSelected
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                    : isToday
                    ? "border border-primary/40 text-primary hover:bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <span className="text-[10px] uppercase font-bold tracking-tight opacity-75">
                  {dayName}
                </span>
                <span className="text-sm font-black mt-0.5 tabular-nums">
                  {dayNum}
                </span>
              </Button>
            );
          })}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
