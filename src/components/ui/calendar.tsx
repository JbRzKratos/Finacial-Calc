import * as React from "react"
import { DayPicker } from "react-day-picker"
import { cn } from "@/lib/utils"

function Calendar({
  className,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  return (
    <DayPicker
      className={cn("rdp-root", className)}
      style={
        {
          "--rdp-accent-color": "#FF6B00",
          "--rdp-accent-background-color": "rgba(255, 107, 0, 0.15)",
          "--rdp-day-height": "36px",
          "--rdp-day-width": "36px",
          "--rdp-day_button-height": "34px",
          "--rdp-day_button-width": "34px",
          "--rdp-day_button-border-radius": "8px",
          "--rdp-today-color": "#FF6B00",
          "--rdp-nav_button-height": "28px",
          "--rdp-nav_button-width": "28px",
          "--rdp-outside-opacity": "0.3",
          "--rdp-disabled-opacity": "0.3",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Calendar }
