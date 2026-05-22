/* src/pages/Home.tsx */

import * as React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PageLayout } from "@/components/common/PageLayout/PageLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DateStrip } from "@/components/layout/DateStrip";
import { BottomNav } from "@/components/layout/BottomNav";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Clock, Settings as SettingsIcon, Trash2, Moon, Sun, AlertTriangle, ChevronLeft, ChevronRight, Calendar as CalendarIcon, X } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatDateRange } from "@/utils/calculations";
import { DatePickerInput } from "@/components/ui/date-picker-input";

// Lazy-loaded calculators — load only when user opens that calculator
const SIPPage = React.lazy(() => import("@/components/calculators/SIPCalculator/SIPCalculator"));
const EMIPage = React.lazy(() => import("@/components/calculators/LoanCalculator/LoanCalculator"));
const FDPage = React.lazy(() => import("@/components/calculators/FDCalculator/FDCalculator"));
const CAGRPage = React.lazy(() => import("@/components/calculators/CAGRCalculator/CAGRCalculator"));
const RetirementPage = React.lazy(() => import("@/components/calculators/RetirementCalculator/RetirementCalculator"));
const TaxPage = React.lazy(() => import("@/components/calculators/TaxCalculator/TaxCalculator"));
const LoanVsInvestPage = React.lazy(() => import("@/components/calculators/MutualFundCalculator/MutualFundCalculator"));
const NormalPage = React.lazy(() => import("@/components/calculators/NormalCalculator/NormalCalculator"));

interface CalculatorTool {
  id: string;
  name: string;
  description: string;
  iconSymbol: string;
  borderTopClass: string;
  textClass: string;
}

interface HistoryEntry {
  id: string;
  calcId: string;
  result: string;
  inputsSummary?: string;
  timestamp: string;
  dateStr: string;
  timestampMillis: number;
}

const tools: CalculatorTool[] = [
  {
    id: "sip",
    name: "SIP Calculator",
    description: "Systematic Investment Plan growth",
    iconSymbol: "₿",
    borderTopClass: "border-t-primary",
    textClass: "text-primary",
  },
  {
    id: "emi",
    name: "EMI Calculator",
    description: "Loan and monthly installment plans",
    iconSymbol: "#",
    borderTopClass: "border-t-primary",
    textClass: "text-primary",
  },
  {
    id: "fd",
    name: "FD Calculator",
    description: "Fixed Deposit maturity earnings",
    iconSymbol: "↑",
    borderTopClass: "border-t-primary",
    textClass: "text-primary",
  },
  {
    id: "cagr",
    name: "CAGR Calculator",
    description: "Compound Annual Growth Rate",
    iconSymbol: "%",
    borderTopClass: "border-t-primary",
    textClass: "text-primary",
  },
  {
    id: "retirement",
    name: "Retirement Planner",
    description: "Target corpus and annuity estimator",
    iconSymbol: "◷",
    borderTopClass: "border-t-primary",
    textClass: "text-primary",
  },
  {
    id: "tax",
    name: "Tax Calculator",
    description: "Old vs New regime calculator",
    iconSymbol: "#",
    borderTopClass: "border-t-primary",
    textClass: "text-primary",
  },
  {
    id: "loanvsinvest",
    name: "Mutual Fund vs Loan",
    description: "Loan prepayment vs SIP investment",
    iconSymbol: "#",
    borderTopClass: "border-t-primary",
    textClass: "text-primary",
  },
  {
    id: "normal",
    name: "Normal Calculator",
    description: "Standard arithmetic calculations",
    iconSymbol: "+-",
    borderTopClass: "border-t-primary",
    textClass: "text-primary",
  },
];

function parseLocalDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function Home() {
  const { calcId } = useParams();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(null);
  const [lastUsedData, setLastUsedData] = React.useState<Record<string, { result: string; timestamp: string; dateStr: string }>>({});
  const [historyList, setHistoryList] = React.useState<HistoryEntry[]>([]);
  const [historyOpen, setHistoryOpen] = React.useState(false);
  const [settingsOpen, setSettingsOpen] = React.useState(false);

  // Date Range Popover State
  const [rangePopoverOpen, setRangePopoverOpen] = React.useState(false);
  const [isCustomRange, setIsCustomRange] = React.useState(false);
  const [customStartDate, setCustomStartDate] = React.useState(() => {
    const today = new Date();
    return format(new Date(today.getFullYear(), today.getMonth(), 1), "yyyy-MM-dd");
  });
  const [customEndDate, setCustomEndDate] = React.useState(() => {
    const today = new Date();
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    return format(new Date(today.getFullYear(), today.getMonth(), lastDay), "yyyy-MM-dd");
  });
  const [selectedMonth, setSelectedMonth] = React.useState(() => new Date().getMonth());
  const [selectedYear, setSelectedYear] = React.useState(() => new Date().getFullYear());
  const [tempMonth, setTempMonth] = React.useState(() => new Date().getMonth());
  const [tempYear, setTempYear] = React.useState(() => new Date().getFullYear());

  // Sync temp values when Popover opens
  React.useEffect(() => {
    if (rangePopoverOpen) {
      setTempMonth(selectedMonth);
      setTempYear(selectedYear);
    }
  }, [rangePopoverOpen, selectedMonth, selectedYear]);

  const [isDarkMode, setIsDarkMode] = React.useState(() => {
    return !document.documentElement.classList.contains("light");
  });

  React.useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light") {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
      document.documentElement.setAttribute("data-theme", "light");
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.remove("light");
      document.documentElement.classList.add("dark");
      document.documentElement.setAttribute("data-theme", "dark");
      setIsDarkMode(true);
    }
  }, []); // runs once on mount

  const handleToggleTheme = (checked: boolean) => {
    if (checked) {
      document.documentElement.classList.remove("light");
      document.documentElement.classList.add("dark");
      document.documentElement.setAttribute("data-theme", "dark");
      setIsDarkMode(true);
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
      document.documentElement.setAttribute("data-theme", "light");
      setIsDarkMode(false);
      localStorage.setItem("theme", "light");
    }
  };

  const handleClearHistory = () => {
    try {
      localStorage.removeItem("calc_last_used");
      localStorage.removeItem("calc_history_list");
      setLastUsedData({});
      setHistoryList([]);
      setHistoryOpen(false);
    } catch {
      // silent
    }
  };

  const handleResetAllData = () => {
    try {
      localStorage.clear();
      setLastUsedData({});
      setHistoryList([]);
      window.location.reload();
    } catch {
      // silent
    }
  };

  const loadUsage = React.useCallback(() => {
    try {
      const rawLast = localStorage.getItem("calc_last_used");
      if (rawLast) {
        setLastUsedData(JSON.parse(rawLast));
      } else {
        setLastUsedData({});
      }
      const rawList = localStorage.getItem("calc_history_list") || "[]";
      setHistoryList(JSON.parse(rawList));
    } catch {
      // silent
    }
  }, []);

  React.useEffect(() => {
    loadUsage();
  }, [calcId, loadUsage]);

  const handleCardClick = (id: string) => {
    navigate(`/calculator/${id}`);
  };

  const activeRange = React.useMemo(() => {
    if (isCustomRange) {
      return { startDate: customStartDate, endDate: customEndDate };
    }
    const startDate = `${selectedYear}-${String(selectedMonth + 1).padStart(2, "0")}-01`;
    const lastDay = new Date(selectedYear, selectedMonth + 1, 0).getDate();
    const endDate = `${selectedYear}-${String(selectedMonth + 1).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;
    return { startDate, endDate };
  }, [isCustomRange, customStartDate, customEndDate, selectedMonth, selectedYear]);

  const effectiveRange = React.useMemo(() => {
    if (selectedDate) {
      const dateStr = format(selectedDate, "yyyy-MM-dd");
      return { startDate: dateStr, endDate: dateStr };
    }
    return activeRange;
  }, [selectedDate, activeRange]);

  const dateRangeText = React.useMemo(() => {
    if (selectedDate) {
      return format(selectedDate, "dd MMM yyyy");
    }
    return formatDateRange(activeRange);
  }, [selectedDate, activeRange]);

  const handlePrevMonth = () => {
    setSelectedDate(null);
    setIsCustomRange(false);
    setSelectedMonth((prev) => {
      if (prev === 0) {
        setSelectedYear((y) => y - 1);
        return 11;
      }
      return prev - 1;
    });
  };

  const handleNextMonth = () => {
    setSelectedDate(null);
    setIsCustomRange(false);
    setSelectedMonth((prev) => {
      if (prev === 11) {
        setSelectedYear((y) => y + 1);
        return 0;
      }
      return prev + 1;
    });
  };

  const filteredHistory = React.useMemo(() => {
    return historyList.filter((item) => {
      return item.dateStr >= effectiveRange.startDate && item.dateStr <= effectiveRange.endDate;
    });
  }, [historyList, effectiveRange]);

  const chronologicalHistory = React.useMemo(() => {
    return [...filteredHistory].reverse();
  }, [filteredHistory]);

  const formatDateStr = React.useCallback((dateStr: string) => {
    try {
      const [y, m, d] = dateStr.split("-").map(Number);
      return format(new Date(y, m - 1, d), "dd MMM yyyy");
    } catch {
      return dateStr;
    }
  }, []);

  const groupedHistory = React.useMemo(() => {
    const groups: Record<string, typeof chronologicalHistory> = {};
    chronologicalHistory.forEach((item) => {
      const date = item.dateStr;
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(item);
    });
    return Object.entries(groups).sort((a, b) => b[0].localeCompare(a[0]));
  }, [chronologicalHistory]);

  const overallToolStats = React.useMemo(() => {
    const stats: Record<string, { count: number; latestResult: string | null; latestTimestamp: string | null; latestDateStr: string | null }> = {};

    tools.forEach((tool) => {
      stats[tool.id] = { count: 0, latestResult: null, latestTimestamp: null, latestDateStr: null };
    });

    historyList.forEach((item) => {
      if (stats[item.calcId]) {
        stats[item.calcId].count += 1;
        stats[item.calcId].latestResult = item.result;
        stats[item.calcId].latestTimestamp = item.timestamp;
        stats[item.calcId].latestDateStr = item.dateStr;
      }
    });

    return stats;
  }, [historyList]);

  const toolStats = React.useMemo(() => {
    const stats: Record<string, { count: number; latestResult: string | null; latestTimestamp: string | null; latestDateStr: string | null }> = {};

    tools.forEach((tool) => {
      stats[tool.id] = { count: 0, latestResult: null, latestTimestamp: null, latestDateStr: null };
    });

    filteredHistory.forEach((item) => {
      if (stats[item.calcId]) {
        stats[item.calcId].count += 1;
        stats[item.calcId].latestResult = item.result;
        stats[item.calcId].latestTimestamp = item.timestamp;
        stats[item.calcId].latestDateStr = item.dateStr;
      }
    });

    return stats;
  }, [filteredHistory]);

  const statsSummary = React.useMemo(() => {
    const total = filteredHistory.length;
    const uniqueTools = new Set(filteredHistory.map((item) => item.calcId));
    const uniqueCount = uniqueTools.size;

    let mostUsedToolName = "None";
    let maxCount = 0;
    Object.entries(toolStats).forEach(([calcId, data]) => {
      if (data.count > maxCount) {
        maxCount = data.count;
        const tool = tools.find((t) => t.id === calcId);
        if (tool) mostUsedToolName = tool.name;
      }
    });

    let lastRunText = "No calculations yet";
    if (filteredHistory.length > 0) {
      const lastItem = filteredHistory[filteredHistory.length - 1];
      const tool = tools.find((t) => t.id === lastItem.calcId);
      if (tool) {
        lastRunText = `${tool.name} (${lastItem.timestamp})`;
      }
    }

    return { total, uniqueCount, mostUsedToolName, lastRunText };
  }, [filteredHistory, toolStats]);

  // Suppress unused variable warning — overallToolStats used for future per-card stats display
  void overallToolStats;
  void lastUsedData;

  return (
    <PageLayout noNav>
      <div className="flex flex-col min-h-dvh bg-noise px-4 pt-6 pb-36 max-w-lg mx-auto">

        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground">
              Your Calculators
            </h1>
            <p className="text-xs text-muted-foreground mt-1">
              Choose a financial tool to run numbers and plan goals
            </p>
          </div>
          <div className="flex gap-2 mt-1">
            <Button
              variant="outline"
              size="icon"
              type="button"
              onClick={() => setHistoryOpen(true)}
              className="w-10 h-10 rounded-xl bg-card border-border hover:bg-muted text-muted-foreground hover:text-primary transition-all active:scale-95"
            >
              <Clock className="w-4.5 h-4.5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              type="button"
              onClick={() => setSettingsOpen(true)}
              className="w-10 h-10 rounded-xl bg-card border-border hover:bg-muted text-muted-foreground hover:text-primary transition-all active:scale-95"
            >
              <SettingsIcon className="w-4.5 h-4.5" />
            </Button>
          </div>
        </div>

        {/* Calculator Grid */}
        <div className="grid grid-cols-2 gap-3 mt-4">
          {tools.map((tool) => (
            <Card
              key={tool.id}
              onClick={() => handleCardClick(tool.id)}
              className={cn(
                "relative border rounded-3xl p-4 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col justify-between min-h-[145px] active:scale-95 bg-card border-border border-t-2 hover:bg-muted/50",
                tool.borderTopClass
              )}
            >
              <div className="flex items-start justify-between">
                <div className="w-9 h-9 rounded-2xl bg-black/10 dark:bg-black/35 flex items-center justify-center border border-border">
                  <span className={cn("text-base leading-none select-none", tool.textClass)} aria-hidden="true">{tool.iconSymbol}</span>
                </div>
              </div>

              <div className="mt-4">
                <h3 className="text-sm font-black text-foreground tracking-tight leading-tight">
                  {tool.name}
                </h3>
                <p className="text-[10px] text-muted-foreground font-medium mt-2 line-clamp-2 leading-relaxed">
                  {tool.description}
                </p>
              </div>
            </Card>
          ))}
        </div>

        {/* Unified Bottom Sheet for Calculator Overlays */}
        <Sheet
          open={!!calcId}
          onOpenChange={(open) => {
            if (!open) navigate("/");
          }}
        >
          <SheetContent
            side="bottom"
            aria-describedby={undefined}
            className="h-[88dvh] rounded-t-3xl border-t border-border bg-background p-0 overflow-hidden duration-300 flex flex-col"
          >
            {/* Fixed Top Grabber Bar */}
            <div className="relative w-full h-12 flex items-center justify-center border-b border-border/10 shrink-0 bg-background/95 backdrop-blur-sm z-10">
              <div className="w-12 h-1.5 bg-muted rounded-full" />
            </div>

            {/* Scrollable Content Wrapper */}
            <div className="flex-1 overflow-y-auto px-4 pt-4 pb-28">
              <React.Suspense fallback={<div className="flex items-center justify-center h-40 text-muted-foreground text-sm">Loading...</div>}>
                {calcId === "sip" && <SIPPage />}
                {calcId === "emi" && <EMIPage />}
                {calcId === "fd" && <FDPage />}
                {calcId === "cagr" && <CAGRPage />}
                {calcId === "retirement" && <RetirementPage />}
                {calcId === "tax" && <TaxPage />}
                {calcId === "loanvsinvest" && <LoanVsInvestPage />}
                {calcId === "normal" && <NormalPage />}
              </React.Suspense>
            </div>
          </SheetContent>
        </Sheet>

        {/* History Sheet */}
        <Sheet open={historyOpen} onOpenChange={setHistoryOpen}>
          <SheetContent
            side="right"
            className="w-full max-w-md bg-background border-l border-border px-5 pb-6 overflow-y-auto duration-300 z-[160]"
          >
            <SheetHeader className="text-left mb-4">
              <SheetTitle className="text-xl font-bold flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                Calculation History
              </SheetTitle>
              <SheetDescription className="text-xs text-muted-foreground">
                Your recently performed calculations on this device.
              </SheetDescription>
            </SheetHeader>

            {/* Range selection and stats inside the History sheet */}
            {historyList.length > 0 && (
              <div className="space-y-4 mb-6">
                {/* Month / Range Selector */}
                <div className="flex items-center justify-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    type="button"
                    onClick={handlePrevMonth}
                    className="w-8 h-8 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-all shrink-0"
                  >
                    <ChevronLeft className="w-4 h-4 text-muted-foreground" />
                  </Button>

                  <Popover open={rangePopoverOpen} onOpenChange={setRangePopoverOpen} modal={false}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        type="button"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 h-8 bg-card/65 border border-border/80 rounded-full text-xs font-black text-foreground hover:bg-muted/50 transition-all select-none"
                      >
                        <CalendarIcon className="w-4 h-4 text-muted-foreground shrink-0" />
                        <span>{dateRangeText}</span>
                        <span className="text-muted-foreground text-[8px] ml-0.5">▼</span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      aria-describedby={undefined}
                      className="w-[95vw] sm:w-[360px] p-4 bg-white dark:bg-[#1C1C1F] border border-border rounded-2xl shadow-2xl z-[170]"
                      onInteractOutside={(e) => e.preventDefault()}
                      onPointerDownOutside={(e) => e.preventDefault()}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                          <h4 className="text-sm font-bold text-foreground">Select Date Range</h4>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          type="button"
                          onClick={() => setRangePopoverOpen(false)}
                          className="w-7 h-7 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>

                      <Tabs defaultValue={isCustomRange ? "custom" : "month"} className="w-full">
                        <TabsList className="grid w-full grid-cols-2 bg-muted/50 border border-border/20 rounded-xl p-1 h-9 mb-4">
                          <TabsTrigger value="month" className="text-[10px] font-black rounded-lg">MONTH &amp; YEAR</TabsTrigger>
                          <TabsTrigger value="custom" className="text-[10px] font-black rounded-lg">CUSTOM RANGE</TabsTrigger>
                        </TabsList>

                        <TabsContent value="month" className="space-y-4">
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                              <Label htmlFor="history-popover-month" className="text-xs font-semibold text-muted-foreground">Month</Label>
                              <Select
                                value={String(tempMonth)}
                                onValueChange={(val) => setTempMonth(parseInt(val))}
                              >
                                <SelectTrigger id="history-popover-month" className="rounded-xl h-10 border-border bg-background focus:ring-primary text-xs">
                                  <SelectValue placeholder="Month" />
                                </SelectTrigger>
                                <SelectContent className="bg-card border-border rounded-xl z-[180]">
                                  {Array.from({ length: 12 }).map((_, i) => (
                                    <SelectItem key={i} value={String(i)} className="rounded-lg text-xs">
                                      {format(new Date(2020, i, 1), "MMMM")}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-1.5">
                              <Label htmlFor="history-popover-year" className="text-xs font-semibold text-muted-foreground">Year</Label>
                              <Select
                                value={String(tempYear)}
                                onValueChange={(val) => setTempYear(parseInt(val))}
                              >
                                <SelectTrigger id="history-popover-year" className="rounded-xl h-10 border-border bg-background focus:ring-primary text-xs">
                                  <SelectValue placeholder="Year" />
                                </SelectTrigger>
                                <SelectContent className="bg-card border-border rounded-xl z-[180]">
                                  {Array.from({ length: 10 }).map((_, i) => {
                                    const y = new Date().getFullYear() - 5 + i;
                                    return (
                                      <SelectItem key={y} value={String(y)} className="rounded-lg text-xs">
                                        {y}
                                      </SelectItem>
                                    );
                                  })}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <Button
                            type="button"
                            onClick={() => {
                              setSelectedMonth(tempMonth);
                              setSelectedYear(tempYear);
                              setIsCustomRange(false);
                              setSelectedDate(null);
                              setRangePopoverOpen(false);
                            }}
                             className="w-full h-10 rounded-xl text-primary-foreground font-bold bg-primary hover:bg-primary/90 mt-2 shadow-md text-xs"
                          >
                            Apply Month Filter
                          </Button>
                        </TabsContent>

                        <TabsContent value="custom" className="space-y-4 pt-2">
                          <div className="space-y-3">
                            <div className="space-y-1.5 flex flex-col">
                              <DatePickerInput
                                label="Start Date"
                                value={customStartDate ? parseLocalDate(customStartDate) : undefined}
                                onChange={(newDate) => {
                                  if (newDate) {
                                    setCustomStartDate(format(newDate, "yyyy-MM-dd"));
                                  }
                                }}
                                id="history-custom-start-date"
                                className="h-10 text-xs border-border bg-background"
                              />
                            </div>
                            <div className="space-y-1.5 flex flex-col">
                              <DatePickerInput
                                label="End Date"
                                value={customEndDate ? parseLocalDate(customEndDate) : undefined}
                                onChange={(newDate) => {
                                  if (newDate) {
                                    setCustomEndDate(format(newDate, "yyyy-MM-dd"));
                                  }
                                }}
                                id="history-custom-end-date"
                                className="h-10 text-xs border-border bg-background"
                              />
                            </div>
                          </div>

                          <Button
                            type="button"
                            disabled={!customStartDate || !customEndDate}
                            onClick={() => {
                              setIsCustomRange(true);
                              setSelectedDate(null);
                              setRangePopoverOpen(false);
                            }}
                             className="w-full h-10 rounded-xl text-primary-foreground font-bold bg-primary hover:bg-primary/90 shadow-md disabled:opacity-40 text-xs mt-2"
                          >
                            Apply Custom Range
                          </Button>
                        </TabsContent>
                      </Tabs>
                    </PopoverContent>
                  </Popover>

                  <Button
                    variant="ghost"
                    size="icon"
                    type="button"
                    onClick={handleNextMonth}
                    className="w-8 h-8 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-all shrink-0"
                  >
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </Button>
                </div>

                {/* Date Strip Filter */}
                <DateStrip selectedDate={selectedDate} onSelectDate={setSelectedDate} />

                {/* Calculator Usage Stats Dashboard Card */}
                <div className="bg-card/45 border border-border/80 rounded-2xl p-4 mt-3">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                      Calculator Usage Stats
                    </h2>
                    {statsSummary.total > 0 && (
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                        Active
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="bg-background/45 border border-border/60 rounded-xl p-3 flex flex-col">
                      <span className="text-[10px] text-muted-foreground font-semibold">Calculations Run</span>
                      <span className="text-xl font-black text-foreground mt-1 tabular-nums">
                        {statsSummary.total}
                      </span>
                    </div>
                    <div className="bg-background/45 border border-border/60 rounded-xl p-3 flex flex-col">
                      <span className="text-[10px] text-muted-foreground font-semibold">Unique Tools Used</span>
                      <span className="text-xl font-black text-foreground mt-1 tabular-nums">
                        {statsSummary.uniqueCount} <span className="text-xs text-muted-foreground font-normal">/ {tools.length}</span>
                      </span>
                    </div>
                    <div className="bg-background/45 border border-border/60 rounded-xl p-3 flex flex-col col-span-2">
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex flex-col min-w-0 flex-1">
                          <span className="text-[10px] text-muted-foreground font-semibold">Most Used Calculator</span>
                          <span className="text-xs font-bold text-primary mt-1 truncate">
                            {statsSummary.mostUsedToolName}
                          </span>
                        </div>
                        <div className="flex flex-col items-end text-right min-w-0 flex-1">
                          <span className="text-[10px] text-muted-foreground font-semibold">Last Calculation Run</span>
                          <span className="text-[10px] font-bold text-foreground mt-1 truncate">
                            {statsSummary.lastRunText}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-4 flex-1">
              {historyList.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center text-muted-foreground">
                  <Clock className="w-10 h-10 text-muted-foreground/30 mb-3" />
                  <h3 className="text-sm font-semibold">No calculations yet</h3>
                  <p className="text-xs text-muted-foreground mt-1 max-w-xs leading-relaxed">
                    Values will appear here once you run and calculate any plan.
                  </p>
                </div>
              ) : chronologicalHistory.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center text-muted-foreground">
                  <Clock className="w-10 h-10 text-muted-foreground/30 mb-3" />
                  <h3 className="text-sm font-semibold">No calculations in range</h3>
                  <p className="text-xs text-muted-foreground mt-1 max-w-xs leading-relaxed">
                    No calculations were performed within the selected range ({dateRangeText}).
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {groupedHistory.map(([dateStr, items]) => (
                    <div key={dateStr} className="space-y-2">
                      <div className="flex items-center justify-between px-1">
                        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">
                          {formatDateStr(dateStr)}
                        </span>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold bg-primary/10 text-primary border border-primary/20">
                          {items.length} calculation{items.length > 1 ? "s" : ""}
                        </span>
                      </div>
                      <div className="space-y-2.5">
                        {items.map((item) => {
                          const tool = tools.find((t) => t.id === item.calcId);
                          if (!tool) return null;
                          return (
                            <Card
                              key={item.id}
                              onClick={() => {
                                setHistoryOpen(false);
                                navigate(`/calculator/${item.calcId}`);
                              }}
                              className="bg-card border border-border rounded-2xl p-4 transition-all duration-300 hover:bg-muted/50 cursor-pointer flex items-center justify-between group active:scale-[0.98]"
                            >
                              <div className="flex flex-col min-w-0 flex-1 mr-2">
                                <span className="text-sm font-bold text-foreground group-hover:text-primary transition-colors truncate">
                                  {tool.name}
                                </span>
                                {item.inputsSummary && (
                                  <span className="text-[10px] text-muted-foreground/80 mt-0.5 italic line-clamp-2">
                                    {item.inputsSummary}
                                  </span>
                                )}
                                <span className="text-[9px] text-muted-foreground mt-1 font-medium">
                                  at {item.timestamp}
                                </span>
                              </div>
                              <div className="text-right shrink-0">
                                <span className="text-sm font-black text-primary tabular-nums">
                                  {item.result}
                                </span>
                              </div>
                            </Card>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {historyList.length > 0 && (
              <Button
                variant="destructive"
                type="button"
                onClick={handleClearHistory}
                className="w-full h-11 rounded-xl text-xs font-bold gap-2 mt-8"
              >
                <Trash2 className="w-4 h-4" />
                Clear History
              </Button>
            )}
          </SheetContent>
        </Sheet>

        {/* Settings Sheet */}
        <Sheet open={settingsOpen} onOpenChange={setSettingsOpen}>
          <SheetContent
            side="right"
            className="w-full max-w-md bg-background border-l border-border px-5 pb-6 overflow-y-auto duration-300 z-[160]"
          >
            <SheetHeader className="text-left mb-6">
              <SheetTitle className="text-xl font-bold flex items-center gap-2">
                <SettingsIcon className="w-5 h-5 text-primary" />
                Settings
              </SheetTitle>
              <SheetDescription className="text-xs text-muted-foreground">
                Configure preferences and application options.
              </SheetDescription>
            </SheetHeader>

            <div className="space-y-6">
              {/* Theme Settings */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Appearance</h3>
                <Card className="bg-card border-border rounded-2xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {isDarkMode ? (
                      <Moon className="w-5 h-5 text-primary" />
                    ) : (
                      <Sun className="w-5 h-5 text-primary" />
                    )}
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-foreground">Dark Mode</span>
                      <span className="text-[10px] text-muted-foreground mt-0.5">Toggle dark and light backgrounds</span>
                    </div>
                  </div>
                  <Switch
                    checked={isDarkMode}
                    onCheckedChange={handleToggleTheme}
                  />
                </Card>
              </div>

              {/* Data Management */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Data Management</h3>
                <Card className="bg-card border-border rounded-2xl p-4 space-y-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-destructive mt-0.5" />
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-foreground">Reset Storage</span>
                      <span className="text-[10px] text-muted-foreground mt-1 leading-relaxed">
                        This deletes all your local budget categories, expenses, limits, and calculator history. This action is permanent.
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    type="button"
                    onClick={handleResetAllData}
                    className="w-full h-10 border-destructive/35 hover:bg-destructive hover:text-destructive-foreground rounded-xl text-xs font-bold text-destructive"
                  >
                    Reset App Data
                  </Button>
                </Card>
              </div>

              {/* About */}
              <div className="space-y-3 pt-6 border-t border-border/50">
                <div className="text-center text-muted-foreground">
                  <p className="text-xs font-bold text-foreground">FinCalc Pro</p>
                  <p className="text-[10px] mt-1">Version 1.0.0 • Developed with visual excellence</p>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>

      </div>
      <BottomNav />
    </PageLayout>
  );
}
