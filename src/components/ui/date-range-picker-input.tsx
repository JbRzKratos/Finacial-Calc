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
  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
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
  const [fromOpen, setFromOpen] = React.useState(false)
  const [toOpen, setToOpen] = React.useState(false)
  const [fromMonth, setFromMonth] = React.useState<Date | undefined>(from ?? new Date())
  const [toMonth, setToMonth] = React.useState<Date | undefined>(to ?? new Date())
  const [fromValue, setFromValue] = React.useState(formatDate(from))
  const [toValue, setToValue] = React.useState(formatDate(to))

  React.useEffect(() => {
    setFromValue(formatDate(from))
    if (from) setFromMonth(from)
  }, [from])

  React.useEffect(() => {
    setToValue(formatDate(to))
    if (to) setToMonth(to)
  }, [to])

  return (
    <div className="flex items-end gap-3">
      {/* From date */}
      <Field className="flex-1 min-w-0">
        <FieldLabel htmlFor={id ? `${id}-from` : "date-from"}>From</FieldLabel>
        <InputGroup>
          <InputGroupInput
            id={id ? `${id}-from` : "date-from"}
            value={fromValue}
            placeholder="Start date"
            onChange={(e) => {
              const date = new Date(e.target.value)
              setFromValue(e.target.value)
              if (isValidDate(date)) {
                onChange(date, to)
                setFromMonth(date)
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault()
                setFromOpen(true)
              }
            }}
          />
          <InputGroupAddon align="inline-end">
            <Popover open={fromOpen} onOpenChange={setFromOpen}>
              <PopoverTrigger asChild>
                <InputGroupButton
                  id={id ? `${id}-from-picker` : "date-from-picker"}
                  variant="ghost"
                  size="icon-xs"
                  aria-label="Select start date"
                >
                  <CalendarIcon className="size-4" />
                  <span className="sr-only">Select start date</span>
                </InputGroupButton>
              </PopoverTrigger>
              <PopoverContent
                className="calendar-popover-content"
                align="end"
                alignOffset={-8}
                sideOffset={10}
              >
                <Calendar
                  mode="single"
                  selected={from}
                  month={fromMonth}
                  onMonthChange={setFromMonth}
                  onSelect={(date) => {
                    onChange(date, to)
                    setFromValue(formatDate(date))
                    setFromOpen(false)
                  }}
                />
              </PopoverContent>
            </Popover>
          </InputGroupAddon>
        </InputGroup>
      </Field>

      {/* To date */}
      <Field className="flex-1 min-w-0">
        <FieldLabel htmlFor={id ? `${id}-to` : "date-to"}>To</FieldLabel>
        <InputGroup>
          <InputGroupInput
            id={id ? `${id}-to` : "date-to"}
            value={toValue}
            placeholder="End date"
            onChange={(e) => {
              const date = new Date(e.target.value)
              setToValue(e.target.value)
              if (isValidDate(date)) {
                onChange(from, date)
                setToMonth(date)
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault()
                setToOpen(true)
              }
            }}
          />
          <InputGroupAddon align="inline-end">
            <Popover open={toOpen} onOpenChange={setToOpen}>
              <PopoverTrigger asChild>
                <InputGroupButton
                  id={id ? `${id}-to-picker` : "date-to-picker"}
                  variant="ghost"
                  size="icon-xs"
                  aria-label="Select end date"
                >
                  <CalendarIcon className="size-4" />
                  <span className="sr-only">Select end date</span>
                </InputGroupButton>
              </PopoverTrigger>
              <PopoverContent
                className="calendar-popover-content"
                align="end"
                alignOffset={-8}
                sideOffset={10}
              >
                <Calendar
                  mode="single"
                  selected={to}
                  month={toMonth}
                  onMonthChange={setToMonth}
                  onSelect={(date) => {
                    onChange(from, date)
                    setToValue(formatDate(date))
                    setToOpen(false)
                  }}
                />
              </PopoverContent>
            </Popover>
          </InputGroupAddon>
        </InputGroup>
      </Field>
    </div>
  )
}
