
import * as React from "react"
import { Field, FieldLabel } from "@/components/ui/field"
import { cn } from "@/lib/utils"
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday } from "date-fns"
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, X } from "lucide-react"

interface DatePickerInputProps {
  label?: string
  value: Date | undefined
  onChange: (date: Date | undefined) => void
  id?: string
  placeholder?: string
  className?: string
}

export function DatePickerInput({
  label,
  value,
  onChange,
  id,
  placeholder = "Select date",
  className
}: DatePickerInputProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const containerRef = React.useRef<HTMLDivElement>(null)

  // Calendar navigation state
  const [currentDate, setCurrentDate] = React.useState(() => value || new Date())

  // Sync navigation month with incoming value
  React.useEffect(() => {
    if (value) {
      setCurrentDate(value)
    }
  }, [value])

  // Handle click outside to close
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  // Generate days for standard 6-row (42 cells) calendar grid
  const days = React.useMemo(() => {
    const start = startOfMonth(currentDate)
    const end = endOfMonth(currentDate)
    
    // First day index (0 = Sun, 1 = Mon, etc.)
    const firstDayIndex = start.getDay()
    
    const result: { date: Date; isCurrentMonth: boolean }[] = []
    
    // Trailing days from previous month
    const prevMonth = new Date(year, month - 1, 1)
    const prevMonthEnd = endOfMonth(prevMonth).getDate()
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      result.push({
        date: new Date(year, month - 1, prevMonthEnd - i),
        isCurrentMonth: false
      })
    }

    // Days of current month
    const daysInMonth = end.getDate()
    for (let i = 1; i <= daysInMonth; i++) {
      result.push({
        date: new Date(year, month, i),
        isCurrentMonth: true
      })
    }

    // Leading days of next month to fill exactly 42 slots (6 rows)
    const remaining = 42 - result.length
    for (let i = 1; i <= remaining; i++) {
      result.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false
      })
    }

    return result
  }, [currentDate, year, month])

  const handlePrevMonth = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentDate(new Date(year, month - 1, 1))
  }

  const handleNextMonth = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentDate(new Date(year, month + 1, 1))
  }

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.stopPropagation()
    setCurrentDate(new Date(year, parseInt(e.target.value), 1))
  }

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.stopPropagation()
    setCurrentDate(new Date(parseInt(e.target.value), month, 1))
  }

  const handleDaySelect = (dayDate: Date, e: React.MouseEvent) => {
    e.stopPropagation()
    onChange(dayDate)
    setIsOpen(false)
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    onChange(undefined)
    setIsOpen(false)
  }

  const formattedValue = value ? format(value, "dd/MM/yyyy") : ""

  const monthsList = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]

  const yearsList = Array.from({ length: 21 }, (_, i) => new Date().getFullYear() - 10 + i)

  return (
    <Field className="relative">
      {label && (
        <FieldLabel htmlFor={id || "date-picker-input"} className="text-xs font-semibold text-muted-foreground mb-1.5 block">
          {label}
        </FieldLabel>
      )}
      
      <div ref={containerRef} className="relative w-full">
        {/* Trigger Button mimicking an input */}
        <button
          id={id || "date-picker-input"}
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "rounded-xl h-11 border border-border bg-background px-3 text-sm w-full flex items-center justify-between text-left text-foreground select-none relative focus:outline-none focus:ring-1 focus:ring-primary active:scale-[0.99] transition-all cursor-pointer",
            className
          )}
        >
          <span className={cn("truncate font-medium", !value && "text-muted-foreground")}>
            {formattedValue || placeholder}
          </span>
          <CalendarIcon className="w-4 h-4 text-muted-foreground shrink-0 ml-2" />
        </button>

        {/* Custom Calendar Dropdown */}
        {isOpen && (
          <div 
            className="absolute left-0 top-full mt-2 w-[285px] p-3.5 bg-white dark:bg-[#1C1C1F]/95 backdrop-blur-xl border border-black/10 dark:border-white/[0.08] rounded-2xl shadow-2xl z-[160] select-none animate-in fade-in slide-in-from-top-2 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header controls */}
            <div className="flex items-center justify-between gap-1 mb-3">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="w-7 h-7 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-1.5 min-w-0">
                {/* Custom Styled Month Select */}
                <div className="relative">
                  <select
                    value={month}
                    onChange={handleMonthChange}
                    className="bg-transparent text-xs font-bold text-foreground focus:outline-none cursor-pointer hover:text-primary transition-colors py-0.5 px-1 border-none rounded-md appearance-none"
                  >
                    {monthsList.map((m, idx) => (
                      <option key={m} value={idx} className="bg-white dark:bg-[#1C1C1F] text-foreground text-xs py-1">
                        {m.substring(0, 3)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Custom Styled Year Select */}
                <div className="relative">
                  <select
                    value={year}
                    onChange={handleYearChange}
                    className="bg-transparent text-xs font-bold text-foreground focus:outline-none cursor-pointer hover:text-primary transition-colors py-0.5 px-1 border-none rounded-md appearance-none"
                  >
                    {yearsList.map((y) => (
                      <option key={y} value={y} className="bg-white dark:bg-[#1C1C1F] text-foreground text-xs py-1">
                        {y}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-0.5">
                <button
                  type="button"
                  onClick={handleNextMonth}
                  className="w-7 h-7 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                {value && (
                  <button
                    type="button"
                    onClick={handleClear}
                    title="Clear date"
                    className="w-7 h-7 rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-500 flex items-center justify-center transition-colors ml-0.5"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Weekday Names Header */}
            <div className="grid grid-cols-7 gap-1 mb-1.5">
              {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((dayName) => (
                <span
                  key={dayName}
                  className="text-[9px] font-black text-muted-foreground/60 uppercase text-center tracking-wider py-1"
                >
                  {dayName}
                </span>
              ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-1">
              {days.map(({ date: dayDate, isCurrentMonth }, idx) => {
                const selected = value ? isSameDay(dayDate, value) : false
                const currentToday = isToday(dayDate)

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={(e) => handleDaySelect(dayDate, e)}
                    className={cn(
                      "w-8 h-8 text-[11px] font-bold rounded-lg flex items-center justify-center transition-all cursor-pointer relative",
                      isCurrentMonth 
                        ? "text-foreground hover:bg-black/5 dark:hover:bg-white/5" 
                        : "text-muted-foreground/25 hover:bg-black/5 dark:hover:bg-white/5",
                      selected && "bg-primary text-primary-foreground font-black shadow-md shadow-primary/25 hover:bg-primary active:scale-95",
                      currentToday && !selected && "border border-primary/50 text-primary"
                    )}
                  >
                    {dayDate.getDate()}
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </Field>
  )
}

