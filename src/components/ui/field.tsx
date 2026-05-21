import * as React from "react"
import { cn } from "@/lib/utils"

function Field({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div data-slot="field" className={cn("flex flex-col gap-1.5", className)} {...props} />
}

function FieldLabel({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      data-slot="field-label"
      className={cn(
        "text-[10px] font-semibold tracking-[0.12em] text-white/40 uppercase",
        className
      )}
      {...props}
    />
  )
}

export { Field, FieldLabel }
