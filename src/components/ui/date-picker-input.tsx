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
    month: "long",
    year: "numeric",
  })
}

function isValidDate(date: Date | undefined) {
  if (!date) return false
  return !isNaN(date.getTime())
}

interface DatePickerInputProps {
  label?: string
  value: Date | undefined
  onChange: (date: Date | undefined) => void
  id?: string
  placeholder?: string
}

export function DatePickerInput({ label, value, onChange, id, placeholder = "Select date" }: DatePickerInputProps) {
  const [open, setOpen] = React.useState(false)
  const [month, setMonth] = React.useState<Date | undefined>(value)
  const [inputValue, setInputValue] = React.useState(formatDate(value))

  React.useEffect(() => {
    setInputValue(formatDate(value))
    if (value) setMonth(value)
  }, [value])

  return (
    <Field>
      {label && <FieldLabel htmlFor={id || "date-picker-input"}>{label}</FieldLabel>}
      <InputGroup>
        <InputGroupInput
          id={id || "date-picker-input"}
          value={inputValue}
          placeholder={placeholder}
          onChange={(e) => {
            const date = new Date(e.target.value)
            setInputValue(e.target.value)
            if (isValidDate(date)) {
              onChange(date)
              setMonth(date)
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault()
              setOpen(true)
            }
          }}
        />
        <InputGroupAddon align="inline-end">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <InputGroupButton
                id={id ? `${id}-picker` : "date-picker"}
                variant="ghost"
                size="icon-xs"
                aria-label="Select date"
              >
                <CalendarIcon className="size-4" />
                <span className="sr-only">Select date</span>
              </InputGroupButton>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto overflow-hidden p-0"
              align="end"
              alignOffset={-8}
              sideOffset={10}
            >
              <Calendar
                mode="single"
                selected={value}
                month={month}
                onMonthChange={setMonth}
                onSelect={(date) => {
                  onChange(date)
                  setInputValue(formatDate(date))
                  setOpen(false)
                }}
              />
            </PopoverContent>
          </Popover>
        </InputGroupAddon>
      </InputGroup>
    </Field>
  )
}
