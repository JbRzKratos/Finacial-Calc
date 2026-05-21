import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

function InputGroup({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="input-group"
      className={cn(
        "flex items-center rounded-xl bg-white/[0.06] border border-white/[0.1] focus-within:border-orange-500/50 focus-within:ring-1 focus-within:ring-orange-500/10 transition-all overflow-hidden",
        className
      )}
      {...props}
    />
  )
}

function InputGroupAddon({
  className,
  align = "inline-start",
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { align?: "inline-start" | "inline-end" }) {
  return (
    <div
      data-slot="input-group-addon"
      className={cn(
        "flex items-center shrink-0",
        align === "inline-start" && "order-first",
        align === "inline-end" && "order-last",
        className
      )}
      {...props}
    />
  )
}

function InputGroupInput({
  className,
  ...props
}: React.ComponentProps<typeof Input>) {
  return (
    <Input
      data-slot="input-group-input"
      className={cn(
        "border-0 bg-transparent rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 h-10 text-white/80 placeholder:text-white/25 text-sm font-medium text-center",
        className
      )}
      {...props}
    />
  )
}

function InputGroupButton({
  className,
  size = "icon-xs",
  variant = "ghost",
  ...props
}: React.ComponentProps<typeof Button>) {
  return (
    <Button
      data-slot="input-group-button"
      variant={variant}
      size={size}
      className={cn("rounded-none h-10 w-10 text-white/40 hover:text-white hover:bg-white/[0.08]", className)}
      {...props}
    />
  )
}

export { InputGroup, InputGroupAddon, InputGroupInput, InputGroupButton }
