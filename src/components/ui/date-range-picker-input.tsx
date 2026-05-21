"use client"

import * as React from "react"
import { CalendarIcon } from "lucide-react"

import { Calendar } from "@/components/ui/calendar"
import { Field, FieldLabel } from "@/components/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

function formatDate(date: Date | undefined) {
  if (!date) return ""
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

function isValidDate(date: Date | undefined) {
  if (!date) return false
  return !isNaN(date.getTime())
}

interface DateRangePickerInputProps {
  label?: string
  from: Date | undefined
  to: Date | undefined
  onChange: (from: Date | undefined, to: Date | undefined) => void
  id?: string
}

export function DateRangePickerInput({ label, from, to, onChange, id }: DateRangePickerInputProps) {
  const [open, setOpen] = React.useState(false)
  const [month, setMonth] = React.useState<Date | undefined>(from)
  const [inputFrom, setInputFrom] = React.useState(formatDate(from))
  const [inputTo, setInputTo] = React.useState(formatDate(to))

  React.useEffect(() => {
    setInputFrom(formatDate(from))
    setInputTo(formatDate(to))
    if (from) setMonth(from)
  }, [from, to])

  const handleSelect = (range: { from?: Date; to?: Date } | undefined) => {
    if (!range) return
    onChange(range.from, range.to)
    setInputFrom(formatDate(range.from))
    setInputTo(formatDate(range.to))
    if (range.to) setOpen(false)
  }

  return (
    <Field>
      {label && <FieldLabel>{label}</FieldLabel>}
      <div className="flex gap-2">
        <InputGroup className="flex-1">
          <InputGroupInput
            value={inputFrom}
            placeholder="From date"
            readOnly
            onClick={() => setOpen(true)}
          />
          <InputGroupAddon align="inline-end">
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <InputGroupButton
                  variant="ghost"
                  size="icon-xs"
                  aria-label="Select date"
                >
                  <CalendarIcon className="size-4" />
                </InputGroupButton>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto overflow-hidden p-0"
                align="start"
                alignOffset={-8}
                sideOffset={10}
              >
                <Calendar
                  mode="range"
                  selected={{ from, to }}
                  month={month}
                  onMonthChange={setMonth}
                  onSelect={handleSelect}
                  numberOfMonths={1}
                />
              </PopoverContent>
            </Popover>
          </InputGroupAddon>
        </InputGroup>
        <InputGroup className="flex-1">
          <InputGroupInput
            value={inputTo}
            placeholder="To date"
            readOnly
            onClick={() => setOpen(true)}
          />
          <InputGroupAddon align="inline-end">
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <InputGroupButton
                  variant="ghost"
                  size="icon-xs"
                  aria-label="Select date"
                >
                  <CalendarIcon className="size-4" />
                </InputGroupButton>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto overflow-hidden p-0"
                align="start"
                alignOffset={-8}
                sideOffset={10}
              >
                <Calendar
                  mode="range"
                  selected={{ from, to }}
                  month={month}
                  onMonthChange={setMonth}
                  onSelect={handleSelect}
                  numberOfMonths={1}
                />
              </PopoverContent>
            </Popover>
          </InputGroupAddon>
        </InputGroup>
      </div>
    </Field>
  )
}
