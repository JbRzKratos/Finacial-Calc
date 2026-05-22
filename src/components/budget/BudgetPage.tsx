/* src/components/budget/BudgetPage.tsx */

import * as React from "react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { PageLayout } from "@/components/common/PageLayout/PageLayout";
import { useBudget } from "@/hooks/useBudget";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
// Native date input used instead of Popover+Calendar (avoids Dialog focus-trap issues)
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { CategoryBar } from "./CategoryBar";
import { formatINRFull } from "@/utils/formatters";
import { BottomNav } from "@/components/layout/BottomNav";
import { cn } from "@/lib/utils";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  Settings as SettingsIcon,
  Moon,
  Sun,
  AlertTriangle,
  Utensils,
  Coffee,
  Pizza,
  ShoppingCart,
  ShoppingBag,
  Leaf,
  Repeat,
  Tv,
  Film,
  Music,
  Gamepad2,
  Car,
  Bus,
  Train,
  Plane,
  Fuel,
  Home as HomeIcon,
  Lightbulb,
  Zap,
  Wrench,
  Hammer,
  Heart,
  Hospital,
  Pill,
  Dumbbell,
  Activity,
  Briefcase,
  DollarSign,
  CreditCard,
  Building2,
  TrendingUp,
  BookOpen,
  GraduationCap,
  Pencil,
  Gift,
  PartyPopper,
  Users,
  Smartphone,
  Laptop,
  Wifi,
  Cloud,
  Star,
  Tag,
  Calendar as CalendarIcon,
  Filter,
  X,
  Baby,
  Bike,
  PawPrint,
  Compass,
  Trophy,
  Shirt,
  Scissors,
  Key,
  Shield,
  Sparkles,
  Clapperboard,
  Wine,
  Banknote,
  Wallet,
  Headphones,
  Camera,
  Watch,
  Package
} from "lucide-react";
import { formatDateRange } from "@/utils/calculations";
import { DatePickerInput } from "@/components/ui/date-picker-input";

// Static borders matching our categories
const borderLeftClasses: Record<string, string> = {
  "#FF6B00": "border-l-[#FF6B00]",
  "#14B8A6": "border-l-[#14B8A6]",
  "#8B5CF6": "border-l-[#8B5CF6]",
  "#3B82F6": "border-l-[#3B82F6]",
  "#EF4444": "border-l-[#EF4444]",
  "#10B981": "border-l-[#10B981]",
  "#F59E0B": "border-l-[#F59E0B]",
  "#EC4899": "border-l-[#EC4899]",
  "#6366F1": "border-l-[#6366F1]"
};

// Static progress bar colors
const progressIndicatorClasses: Record<string, string> = {
  "#FF6B00": "[&>div]:bg-[#FF6B00]",
  "#14B8A6": "[&>div]:bg-[#14B8A6]",
  "#8B5CF6": "[&>div]:bg-[#8B5CF6]",
  "#3B82F6": "[&>div]:bg-[#3B82F6]",
  "#EF4444": "[&>div]:bg-[#EF4444]",
  "#10B981": "[&>div]:bg-[#10B981]",
  "#F59E0B": "[&>div]:bg-[#F59E0B]",
  "#EC4899": "[&>div]:bg-[#EC4899]",
  "#6366F1": "[&>div]:bg-[#6366F1]"
};

// Category text colors for subtle tags
const textClasses: Record<string, string> = {
  "#FF6B00": "text-[#FF6B00]",
  "#14B8A6": "text-[#14B8A6]",
  "#8B5CF6": "text-[#8B5CF6]",
  "#3B82F6": "text-[#3B82F6]",
  "#EF4444": "text-[#EF4444]",
  "#10B981": "text-[#10B981]",
  "#F59E0B": "text-[#F59E0B]",
  "#EC4899": "text-[#EC4899]",
  "#6366F1": "text-[#6366F1]"
};

const iconComponentMap: Record<string, React.ComponentType<{ className?: string; strokeWidth?: number }>> = {
  // Food & Dining
  "fork-knife": Utensils,
  "utensils": Utensils,
  "coffee": Coffee,
  "pizza": Pizza,
  "burger": Utensils,
  // Shopping & Groceries
  "shopping-cart": ShoppingCart,
  "shopping-bag": ShoppingBag,
  "grocery": Leaf,
  // Subscriptions & Entertainment
  "repeat": Repeat,
  "subscription": Tv,
  "film": Film,
  "music": Music,
  "game": Gamepad2,
  "clapperboard": Clapperboard,
  "headphones": Headphones,
  // Transport & Travel
  "car": Car,
  "bus": Bus,
  "train": Train,
  "plane": Plane,
  "fuel": Fuel,
  "bike": Bike,
  "compass": Compass,
  // Home & Utilities
  "home": HomeIcon,
  "house": HomeIcon,
  "lightbulb": Lightbulb,
  "zap": Zap,
  "wrench": Wrench,
  "tools": Hammer,
  "key": Key,
  // Health & Wellness
  "heart": Heart,
  "health": Hospital,
  "pill": Pill,
  "dumbbell": Dumbbell,
  "activity": Activity,
  "shield": Shield,
  // Finance & Work
  "briefcase": Briefcase,
  "dollar": DollarSign,
  "credit-card": CreditCard,
  "bank": Building2,
  "trending-up": TrendingUp,
  "banknote": Banknote,
  "wallet": Wallet,
  // Education
  "book": BookOpen,
  "graduation-cap": GraduationCap,
  "pencil": Pencil,
  // Gifts, Social & Lifestyle
  "gift": Gift,
  "party": PartyPopper,
  "users": Users,
  "baby": Baby,
  "paw-print": PawPrint,
  "trophy": Trophy,
  "shirt": Shirt,
  "scissors": Scissors,
  "sparkles": Sparkles,
  "wine": Wine,
  // Tech & Misc
  "smartphone": Smartphone,
  "laptop": Laptop,
  "wifi": Wifi,
  "cloud": Cloud,
  "camera": Camera,
  "watch": Watch,
  "package": Package,
  "star": Star,
  "tag": Tag,
};

function formatK(amount: number): string {
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)}L`;
  }
  if (amount >= 1000) {
    return `₹${(amount / 1000).toFixed(1)}K`;
  }
  return `₹${amount.toFixed(0)}`;
}

function parseLocalDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export default function BudgetPage() {
  const navigate = useNavigate();
  const {
    loaded,
    categories,
    transactions,
    summary,
    addTransaction,
    deleteTransaction,
    addCategory,
    deleteCategory,
    changeDateRange,
    updateCategory,
    updateTransaction
  } = useBudget();

  const [selectedMonth, setSelectedMonth] = React.useState(() => new Date().getMonth());
  const [selectedYear, setSelectedYear] = React.useState(() => new Date().getFullYear());
  const [direction, setDirection] = React.useState<"left" | "right" | null>(null);

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



  // Edit Total Budget Dialog State
  const [editBudgetOpen, setEditBudgetOpen] = React.useState(false);
  const [tempBudgetLimit, setTempBudgetLimit] = React.useState("");

  // Edit Category State
  const [editLimitOpen, setEditLimitOpen] = React.useState(false);
  const [editingCategory, setEditingCategory] = React.useState<import("@/types").BudgetCategory | null>(null);
  const [editCatName, setEditCatName] = React.useState("");
  const [tempCategoryLimit, setTempCategoryLimit] = React.useState("");
  const [editCatSubCategories, setEditCatSubCategories] = React.useState<string[]>([]);
  const [editCatSubInput, setEditCatSubInput] = React.useState("");

  // Sync edit category state when edit dialog opens
  React.useEffect(() => {
    if (editingCategory) {
      setEditCatName(editingCategory.name);
      setTempCategoryLimit(editingCategory.monthlyLimit.toString());
      setEditCatSubCategories(editingCategory.subCategories || []);
      setEditCatSubInput("");
    } else {
      setEditCatName("");
      setTempCategoryLimit("");
      setEditCatSubCategories([]);
      setEditCatSubInput("");
    }
  }, [editingCategory]);

  // Add Custom Category Dialog State
  const [newCatOpen, setNewCatOpen] = React.useState(false);
  const [newCatName, setNewCatName] = React.useState("");
  const [newCatLimit, setNewCatLimit] = React.useState("");
  const [newCatIcon, setNewCatIcon] = React.useState("tag");
  const [newCatColor, setNewCatColor] = React.useState("#FF6B00");
  const [newCatSubCategories, setNewCatSubCategories] = React.useState<string[]>([]);
  const [newCatSubInput, setNewCatSubInput] = React.useState("");

  // Add Transaction Modal State
  const [addOpen, setAddOpen] = React.useState(false);
  const [amount, setAmount] = React.useState("");
  const [note, setNote] = React.useState("");
  const [categoryId, setCategoryId] = React.useState("");
  const [subCategory, setSubCategory] = React.useState("");
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  // Settings Sheet State
  const [settingsOpen, setSettingsOpen] = React.useState(false);
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
  }, []);

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

  const handleResetAllData = () => {
    if (window.confirm("Are you absolutely sure you want to reset all app data? This will permanently delete your budget, expenses, limits, categories, and calculator history.")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  // Edit Transaction Modal State
  const [editTxnOpen, setEditTxnOpen] = React.useState(false);
  const [editingTxn, setEditingTxn] = React.useState<import("@/types").Transaction | null>(null);
  const [editAmount, setEditAmount] = React.useState("");
  const [editNote, setEditNote] = React.useState("");
  const [editCategoryId, setEditCategoryId] = React.useState("");
  const [editSubCategory, setEditSubCategory] = React.useState("");
  const [editDate, setEditDate] = React.useState<Date | undefined>(new Date());

  // Sync edit transaction state when dialog opens
  React.useEffect(() => {
    if (editingTxn) {
      setEditAmount(editingTxn.amount.toString());
      setEditNote(editingTxn.note);
      setEditCategoryId(editingTxn.categoryId);
      setEditSubCategory(editingTxn.subCategory || "");
      setEditDate(parseLocalDate(editingTxn.date));
    } else {
      setEditAmount("");
      setEditNote("");
      setEditCategoryId("");
      setEditSubCategory("");
      setEditDate(new Date());
    }
  }, [editingTxn]);

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    const limit = parseFloat(newCatLimit);
    if (!newCatName || isNaN(limit) || limit <= 0) return;
    addCategory({
      name: newCatName,
      monthlyLimit: limit,
      icon: newCatIcon,
      color: newCatColor,
      iconBg: newCatColor,
      subCategories: newCatSubCategories
    });
    setNewCatName("");
    setNewCatLimit("");
    setNewCatIcon("tag");
    setNewCatColor("#FF6B00");
    setNewCatSubCategories([]);
    setNewCatSubInput("");
    setNewCatOpen(false);
  };

  const handleSaveCategoryEdit = (e: React.FormEvent) => {
    e.preventDefault();
    const limit = parseFloat(tempCategoryLimit);
    if (editingCategory && !isNaN(limit) && limit >= 0 && editCatName) {
      updateCategory(editingCategory.id, {
        name: editCatName,
        monthlyLimit: limit,
        subCategories: editCatSubCategories
      });
      setEditLimitOpen(false);
      setEditingCategory(null);
    }
  };

  const handleEditSaveTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTxn || !editAmount || isNaN(parseFloat(editAmount)) || parseFloat(editAmount) <= 0 || !editCategoryId || !editDate) {
      return;
    }

    updateTransaction(editingTxn.id, {
      amount: parseFloat(editAmount),
      categoryId: editCategoryId,
      subCategory: editSubCategory || undefined,
      note: editNote || categories.find(c => c.id === editCategoryId)?.name || "Expense",
      date: format(editDate, "yyyy-MM-dd")
    });

    setEditingTxn(null);
    setEditTxnOpen(false);
  };

  const [tempMonth, setTempMonth] = React.useState(() => new Date().getMonth());
  const [tempYear, setTempYear] = React.useState(() => new Date().getFullYear());

  // Sync temp values when Popover opens
  React.useEffect(() => {
    if (rangePopoverOpen) {
      setTempMonth(selectedMonth);
      setTempYear(selectedYear);
    }
  }, [rangePopoverOpen, selectedMonth, selectedYear]);

  // Generate date range when month/year shifts OR custom range updates
  React.useEffect(() => {
    if (isCustomRange) {
      changeDateRange({ startDate: customStartDate, endDate: customEndDate });
    } else {
      const startDate = `${selectedYear}-${String(selectedMonth + 1).padStart(2, "0")}-01`;
      // Find last day of the month
      const lastDay = new Date(selectedYear, selectedMonth + 1, 0).getDate();
      const endDate = `${selectedYear}-${String(selectedMonth + 1).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;
      changeDateRange({ startDate, endDate });
    }
  }, [selectedMonth, selectedYear, isCustomRange, customStartDate, customEndDate, changeDateRange]);

  const handlePrevMonth = () => {
    setIsCustomRange(false);
    setDirection("left");
    setTimeout(() => {
      setSelectedMonth((prev) => {
        if (prev === 0) {
          setSelectedYear((y) => y - 1);
          return 11;
        }
        return prev - 1;
      });
      setDirection(null);
    }, 150);
  };

  const handleNextMonth = () => {
    setIsCustomRange(false);
    setDirection("right");
    setTimeout(() => {
      setSelectedMonth((prev) => {
        if (prev === 11) {
          setSelectedYear((y) => y + 1);
          return 0;
        }
        return prev + 1;
      });
      setDirection(null);
    }, 150);
  };

  const handleSaveTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0 || !categoryId || !date) {
      return;
    }

    addTransaction({
      amount: parseFloat(amount),
      categoryId,
      subCategory: subCategory || undefined,
      note: note || categories.find(c => c.id === categoryId)?.name || "Expense",
      date: format(date, "yyyy-MM-dd"),
      type: "expense"
    });

    // Reset Form
    setAmount("");
    setNote("");
    setCategoryId("");
    setSubCategory("");
    setDate(new Date());
    setAddOpen(false);
  };

  const currentMonthName = React.useMemo(() => {
    return format(new Date(selectedYear, selectedMonth, 1), "MMMM yyyy");
  }, [selectedMonth, selectedYear]);

  // Filter transactions to show selected range only (sorted descending)
  const currentTransactions = React.useMemo(() => {
    if (isCustomRange) {
      return transactions
        .filter((t) => t.date >= customStartDate && t.date <= customEndDate)
        .sort((a, b) => b.date.localeCompare(a.date));
    } else {
      const monthStr = `${selectedYear}-${String(selectedMonth + 1).padStart(2, "0")}`;
      return transactions
        .filter((t) => t.date.startsWith(monthStr))
        .sort((a, b) => b.date.localeCompare(a.date));
    }
  }, [transactions, selectedMonth, selectedYear, isCustomRange, customStartDate, customEndDate]);

  const budgetStats = React.useMemo(() => {
    const totalTxns = currentTransactions.length;
    
    // Top Category by Spent
    const categorySpends: Record<string, number> = {};
    let totalAmount = 0;
    
    currentTransactions.forEach((t) => {
      categorySpends[t.categoryId] = (categorySpends[t.categoryId] || 0) + t.amount;
      totalAmount += t.amount;
    });
    
    let topCategoryId = "";
    let maxSpend = 0;
    Object.entries(categorySpends).forEach(([catId, amount]) => {
      if (amount > maxSpend) {
        maxSpend = amount;
        topCategoryId = catId;
      }
    });
    
    const topCategory = categories.find((c) => c.id === topCategoryId);
    const topCategoryName = topCategory ? topCategory.name : "None";
    const topCategoryColor = topCategory ? topCategory.color : "";
    
    // Average Spent Amount
    const avgSpent = totalTxns > 0 ? totalAmount / totalTxns : 0;
    
    return {
      totalTxns,
      topCategoryName,
      topCategoryColor,
      avgSpent
    };
  }, [currentTransactions, categories]);

  const dateRangeText = React.useMemo(() => {
    if (!summary.dateRange) return "";
    return formatDateRange(summary.dateRange);
  }, [summary.dateRange]);

  // Calculate remaining budget
  const remainingBudget = Math.max(0, summary.totalLimit - summary.totalSpent);
  const percentLeft = summary.totalLimit > 0 ? (remainingBudget / summary.totalLimit) * 100 : 0;
  const radius = 70;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentLeft / 100) * circumference;

  if (!loaded) {
    return (
      <PageLayout noNav>
        <div className="flex flex-col items-center justify-center min-h-screen text-muted-foreground bg-noise">
          <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin mb-4" />
          <span>Loading budget...</span>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout noNav>
      <div className="flex flex-col min-h-dvh bg-noise px-4 pt-6 pb-36 max-w-lg mx-auto">
        {/* Header Rework */}
        <div className="flex items-center justify-between mb-6 pt-2">
          <Button
            variant="ghost"
            size="icon"
            type="button"
            onClick={() => navigate("/")}
            className="w-10 h-10 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-all active:scale-90"
          >
            <ChevronLeft className="w-5 h-5 text-primary" strokeWidth={2.5} />
          </Button>
          
          <h1 className="text-lg font-black text-foreground tracking-tight">
            Budgets
          </h1>

          <Button
            variant="outline"
            size="icon"
            type="button"
            onClick={() => setSettingsOpen(true)}
            className="w-10 h-10 rounded-xl bg-card border-border hover:bg-muted text-muted-foreground hover:text-primary transition-all active:scale-90"
          >
            <SettingsIcon className="w-4.5 h-4.5" />
          </Button>
        </div>

        {/* Month Selector */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <Button
            variant="ghost"
            size="icon"
            type="button"
            onClick={handlePrevMonth}
            className="w-8 h-8 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-all"
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
                <CalendarIcon className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                <span>{dateRangeText}</span>
                <span className="text-muted-foreground text-[8px] ml-0.5">▼</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent
              aria-describedby={undefined}
              className="w-[95vw] sm:w-[360px] p-4 bg-white dark:bg-[#1C1C1F] border border-border rounded-2xl shadow-2xl z-[100]"
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
                  <TabsTrigger value="month" className="text-[10px] font-black rounded-lg">MONTH & YEAR</TabsTrigger>
                  <TabsTrigger value="custom" className="text-[10px] font-black rounded-lg">CUSTOM RANGE</TabsTrigger>
                </TabsList>
                
                <TabsContent value="month" className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="budget-popover-month" className="text-xs font-semibold text-muted-foreground">Month</Label>
                      <Select
                        value={String(tempMonth)}
                        onValueChange={(val) => {
                          setTempMonth(parseInt(val));
                        }}
                      >
                        <SelectTrigger id="budget-popover-month" className="rounded-xl h-10 border-border bg-background focus:ring-primary text-xs">
                          <SelectValue placeholder="Month" />
                        </SelectTrigger>
                        <SelectContent className="bg-card border-border rounded-xl z-[110]">
                          {Array.from({ length: 12 }).map((_, i) => (
                            <SelectItem key={i} value={String(i)} className="rounded-lg text-xs">
                              {format(new Date(2020, i, 1), "MMMM")}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="budget-popover-year" className="text-xs font-semibold text-muted-foreground">Year</Label>
                      <Select
                        value={String(tempYear)}
                        onValueChange={(val) => {
                          setTempYear(parseInt(val));
                        }}
                      >
                        <SelectTrigger id="budget-popover-year" className="rounded-xl h-10 border-border bg-background focus:ring-primary text-xs">
                          <SelectValue placeholder="Year" />
                        </SelectTrigger>
                        <SelectContent className="bg-card border-border rounded-xl z-[110]">
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
                      setRangePopoverOpen(false);
                    }}
                    className="w-full h-10 rounded-xl text-primary-foreground font-bold bg-primary hover:bg-primary/90 mt-2 shadow-lg shadow-primary/20 text-xs"
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
                            setCustomStartDate(format(newDate, "yyyy-MM-dd"))
                          }
                        }}
                        id="custom-start-date"
                        className="h-10 text-xs border-border bg-background"
                      />
                    </div>
                    <div className="space-y-1.5 flex flex-col">
                      <DatePickerInput
                        label="End Date"
                        value={customEndDate ? parseLocalDate(customEndDate) : undefined}
                        onChange={(newDate) => {
                          if (newDate) {
                            setCustomEndDate(format(newDate, "yyyy-MM-dd"))
                          }
                        }}
                        id="custom-end-date"
                        className="h-10 text-xs border-border bg-background"
                      />
                    </div>
                  </div>

                  <Button
                    type="button"
                    disabled={!customStartDate || !customEndDate}
                    onClick={() => {
                      setIsCustomRange(true);
                      setRangePopoverOpen(false);
                    }}
                    className="w-full h-10 rounded-xl text-primary-foreground font-bold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 disabled:opacity-40 text-xs mt-2"
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
            className="w-8 h-8 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-all"
          >
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </Button>
        </div>

        {/* Overall Summary Gauge Section */}
        <div className="flex flex-col items-center justify-center mb-8 mt-2">
          {/* Circular Progress Gauge */}
          <div className="relative w-48 h-48 flex items-center justify-center">
            {/* SVG Progress Ring */}
            <svg className="w-full h-full transform -rotate-90">
              {/* Track */}
              <circle
                cx="96"
                cy="96"
                r={radius}
                className="stroke-muted/10 fill-none"
                strokeWidth={strokeWidth}
              />
              {/* Progress */}
              <circle
                cx="96"
                cy="96"
                r={radius}
                className="stroke-primary fill-none transition-all duration-500 ease-out"
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
              />
            </svg>
            {/* Absolute Center Content */}
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-3xl font-black text-foreground tracking-tight leading-none">
                {formatK(remainingBudget)}
              </span>
              <span className="text-[10px] font-bold text-muted-foreground/60 tracking-wider mt-1.5 uppercase">
                left this period
              </span>
            </div>
          </div>

          {/* Spent / Budget Badges */}
          <div className="flex items-center justify-center gap-2.5 mt-4">
            <div className="inline-flex items-center px-4 py-2 bg-card/60 border border-border/80 rounded-full text-xs font-bold text-muted-foreground shadow-sm">
              <span className="text-foreground font-black mr-1">{formatK(summary.totalSpent)}</span> spent
            </div>
            <Dialog open={editBudgetOpen} onOpenChange={setEditBudgetOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  type="button"
                  className="inline-flex items-center px-4 py-2 bg-card/60 border border-border/80 rounded-full text-xs font-bold text-muted-foreground shadow-sm hover:bg-muted/50 cursor-pointer active:scale-95 transition-all h-auto gap-1"
                >
                  <span className="text-foreground font-black">{formatK(summary.totalLimit)}</span> budget
                  <Pencil className="w-3 h-3 text-muted-foreground/60 shrink-0" />
                </Button>
              </DialogTrigger>
              <DialogContent aria-describedby={undefined} className="max-w-[90vw] sm:max-w-md rounded-2xl bg-card border-border">
                <DialogHeader className="text-left">
                  <DialogTitle className="text-lg font-bold flex items-center gap-2">
                    <Pencil className="w-5 h-5 text-primary" />
                    Category Budgets
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-2">
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Set limits for each individual category. The total budget is the sum of all category limits.
                  </p>
                  
                  <div className="p-3.5 bg-primary/10 border border-primary/20 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/25 text-primary shrink-0">
                        <Wallet className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-foreground">Overall Total Budget</div>
                        <div className="text-[9px] text-muted-foreground/80 mt-0.5">Sum of all category limits</div>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-sm font-black text-primary tabular-nums">
                        ₹ {summary.totalLimit.toLocaleString("en-IN")}
                      </div>
                    </div>
                  </div>

                  <ScrollArea className="h-[280px] pr-2">
                    <div className="space-y-3.5">
                      {categories.map((cat) => {
                        const IconComponent = iconComponentMap[cat.icon] || Tag;
                        return (
                          <div key={cat.id} className="flex items-center justify-between gap-3 p-3 bg-muted/30 border border-border/40 rounded-xl">
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className="w-8 h-8 rounded-lg bg-muted/65 flex items-center justify-center border border-border/40 shrink-0 animate-none">
                                <IconComponent className="w-4 h-4 text-muted-foreground" />
                              </div>
                              <label htmlFor={`limit-${cat.id}`} className="text-xs font-black text-foreground truncate cursor-pointer">{cat.name}</label>
                            </div>
                            <div className="relative w-28 shrink-0">
                              <Input
                                id={`limit-${cat.id}`}
                                name={`limit-${cat.id}`}
                                type="number"
                                value={cat.monthlyLimit}
                                onChange={(e) => {
                                  const val = parseFloat(e.target.value);
                                  if (!isNaN(val) && val >= 0) {
                                    updateCategory(cat.id, { monthlyLimit: val });
                                  }
                                }}
                                className="rounded-xl h-8 border-border bg-background focus:ring-primary pl-6 pr-2 text-xs text-right font-semibold tabular-nums"
                              />
                              <span className="absolute left-2.5 top-1.5 text-muted-foreground/75 text-[10px]">₹</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </ScrollArea>
                  <Button
                    type="button"
                    onClick={() => setEditBudgetOpen(false)}
                    className="w-full h-11 rounded-xl text-primary-foreground font-bold bg-primary hover:bg-primary/90 mt-2 shadow-lg shadow-primary/20"
                  >
                    Done
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

        </div>

        {/* Beautiful Wide Call-To-Action Button Card for Add Expense */}
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <Button
            type="button"
            onClick={() => setAddOpen(true)}
            className="w-full h-16 bg-primary hover:bg-primary/95 text-primary-foreground rounded-2xl shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/35 transition-all duration-200 active:scale-[0.99] flex items-center justify-between px-4 mt-2 mb-6"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
                <Plus className="w-5 h-5 text-primary-foreground" strokeWidth={3} />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-sm font-black tracking-tight">Add New Expense</span>
                <span className="text-[10px] text-primary-foreground/75 font-semibold mt-0.5">Quickly log a new transaction</span>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-primary-foreground/70 shrink-0" strokeWidth={2.5} />
          </Button>
          <DialogContent aria-describedby={undefined} className="max-w-[90vw] sm:max-w-md rounded-2xl bg-card border-border">
            <DialogHeader className="text-left">
              <DialogTitle className="text-lg font-bold flex items-center gap-2">
                <span className="text-base leading-none select-none text-primary" aria-hidden="true">$</span>
                Add New Expense
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSaveTransaction} className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <Label htmlFor="amount" className="text-xs font-semibold text-muted-foreground">Amount (₹)</Label>
                <div className="relative">
                  <Input
                    id="amount"
                    name="amount"
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    className="rounded-xl h-11 border-border bg-background focus:ring-primary pl-8 text-base tabular-nums"
                  />
                  <span className="absolute left-3 top-3 text-muted-foreground text-sm">₹</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="category" className="text-xs font-semibold text-muted-foreground">Category</Label>
                <Select value={categoryId} onValueChange={setCategoryId} required>
                  <SelectTrigger id="category" className="rounded-xl h-11 border-border bg-background focus:ring-primary">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border rounded-xl">
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id} className="rounded-lg">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                          <span>{cat.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {categoryId && categories.find(c => c.id === categoryId)?.subCategories?.length ? (
                <div className="space-y-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
                  <Label htmlFor="subcategory" className="text-xs font-semibold text-muted-foreground">Sub-category (Optional)</Label>
                  <Select value={subCategory} onValueChange={setSubCategory}>
                    <SelectTrigger id="subcategory" className="rounded-xl h-11 border-border bg-background focus:ring-primary text-xs">
                      <SelectValue placeholder="Select a sub-category" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border rounded-xl">
                      <SelectItem value="" className="text-xs">None</SelectItem>
                      {categories.find(c => c.id === categoryId)?.subCategories?.map((sub) => (
                        <SelectItem key={sub} value={sub} className="text-xs">
                          {sub}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ) : null}

              <div className="space-y-1.5 flex flex-col">
                <DatePickerInput
                  label="Date"
                  value={date}
                  onChange={(newDate) => setDate(newDate || new Date())}
                  id="txn-date"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="note" className="text-xs font-semibold text-muted-foreground">Note / Reference (Optional)</Label>
                <Input
                  id="note"
                  name="note"
                  placeholder="e.g. Lunch with friends"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="rounded-xl h-11 border-border bg-background focus:ring-primary"
                />
              </div>

              <Button type="submit" className="w-full h-11 rounded-xl text-primary-foreground font-bold bg-primary hover:bg-primary/90 mt-2 shadow-lg shadow-primary/20">
                Save Transaction
              </Button>
            </form>
          </DialogContent>
        </Dialog>


        {/* Period Statistics Card */}
        <div className="mb-6 bg-card/45 border border-border/80 rounded-2xl p-4 mt-2">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              Period Statistics
            </h2>
            {budgetStats.totalTxns > 0 && (
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                Active
              </span>
            )}
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-background/45 border border-border/60 rounded-xl p-2.5 flex flex-col min-w-0">
              <span className="text-[9px] text-muted-foreground font-semibold truncate">Transactions</span>
              <span className="text-base font-black text-foreground mt-1 tabular-nums truncate">
                {budgetStats.totalTxns}
              </span>
            </div>
            <div className="bg-background/45 border border-border/60 rounded-xl p-2.5 flex flex-col min-w-0">
              <span className="text-[9px] text-muted-foreground font-semibold truncate">Average Spent</span>
              <span className="text-base font-black text-foreground mt-1 tabular-nums truncate">
                {formatK(budgetStats.avgSpent)}
              </span>
            </div>
            <div className="bg-background/45 border border-border/60 rounded-xl p-2.5 flex flex-col min-w-0">
              <span className="text-[9px] text-muted-foreground font-semibold truncate">Top Category</span>
              <span 
                className="text-xs font-bold mt-1.5 truncate"
                style={{ color: budgetStats.topCategoryColor || "var(--primary)" }}
              >
                {budgetStats.topCategoryName}
              </span>
            </div>
          </div>
        </div>

        {/* Section Heading: Categories */}
        <div className="flex items-center justify-between mb-4 px-1">
          <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
            Categories
          </h3>
          <div className="flex items-center gap-2">
            <Dialog open={newCatOpen} onOpenChange={setNewCatOpen}>
              <DialogTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  type="button"
                  className="h-6 text-[10px] font-bold text-primary hover:text-primary/80 px-2 rounded-md hover:bg-primary/10"
                >
                  + Add Category
                </Button>
              </DialogTrigger>
              <DialogContent aria-describedby={undefined} className="max-w-[90vw] sm:max-w-md rounded-2xl bg-card border-border">
                <DialogHeader className="text-left">
                  <DialogTitle className="text-lg font-bold flex items-center gap-2">
                    <span className="text-base leading-none select-none text-primary" aria-hidden="true">⊕</span>
                    Add Custom Category
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSaveCategory} className="space-y-4 pt-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="cat-name" className="text-xs font-semibold text-muted-foreground">Category Name</Label>
                    <Input
                      id="cat-name"
                      name="cat-name"
                      placeholder="e.g. Gifts, Pet care"
                      value={newCatName}
                      onChange={(e) => setNewCatName(e.target.value)}
                      required
                      className="rounded-xl h-11 border-border bg-background focus:ring-primary text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="cat-limit" className="text-xs font-semibold text-muted-foreground">Monthly Limit (₹)</Label>
                    <div className="relative">
                      <Input
                        id="cat-limit"
                        name="cat-limit"
                        type="number"
                        placeholder="0.00"
                        value={newCatLimit}
                        onChange={(e) => setNewCatLimit(e.target.value)}
                        required
                        className="rounded-xl h-11 border-border bg-background focus:ring-primary pl-8 text-sm tabular-nums"
                      />
                      <span className="absolute left-3 top-3 text-muted-foreground text-sm">₹</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="cat-icon" className="text-xs font-semibold text-muted-foreground">Icon</Label>
                      <Select value={newCatIcon} onValueChange={setNewCatIcon} required>
                        <SelectTrigger id="cat-icon" className="rounded-xl h-11 border-border bg-background focus:ring-primary text-xs">
                          <SelectValue placeholder="Select icon" />
                        </SelectTrigger>
                        <SelectContent className="bg-card border-border rounded-xl">
                          <SelectItem value="utensils" className="text-xs">🍽 Food & Dining</SelectItem>
                          <SelectItem value="coffee" className="text-xs">☕ Coffee & Café</SelectItem>
                          <SelectItem value="pizza" className="text-xs">🍕 Pizza & Fast Food</SelectItem>
                          <SelectItem value="wine" className="text-xs">🍷 Drinks & Bar</SelectItem>
                          <SelectItem value="shopping-cart" className="text-xs">🛒 Shopping Cart</SelectItem>
                          <SelectItem value="shopping-bag" className="text-xs">🛍 Shopping Bag</SelectItem>
                          <SelectItem value="grocery" className="text-xs">🌿 Grocery</SelectItem>
                          <SelectItem value="shirt" className="text-xs">👕 Clothing & Fashion</SelectItem>
                          <SelectItem value="scissors" className="text-xs">✂ Salon & Grooming</SelectItem>
                          <SelectItem value="sparkles" className="text-xs">✨ Beauty & Personal Care</SelectItem>
                          <SelectItem value="repeat" className="text-xs">🔄 Recurring Bills</SelectItem>
                          <SelectItem value="subscription" className="text-xs">📺 TV & Streaming</SelectItem>
                          <SelectItem value="film" className="text-xs">🎬 Movies & Shows</SelectItem>
                          <SelectItem value="clapperboard" className="text-xs">🎥 Cinema</SelectItem>
                          <SelectItem value="music" className="text-xs">🎵 Music</SelectItem>
                          <SelectItem value="headphones" className="text-xs">🎧 Podcasts & Audio</SelectItem>
                          <SelectItem value="game" className="text-xs">🎮 Gaming</SelectItem>
                          <SelectItem value="trophy" className="text-xs">🏆 Sports & Events</SelectItem>
                          <SelectItem value="car" className="text-xs">🚗 Car & Commute</SelectItem>
                          <SelectItem value="bus" className="text-xs">🚌 Bus</SelectItem>
                          <SelectItem value="train" className="text-xs">🚂 Train</SelectItem>
                          <SelectItem value="plane" className="text-xs">✈ Travel & Flights</SelectItem>
                          <SelectItem value="bike" className="text-xs">🚲 Bike & Cycling</SelectItem>
                          <SelectItem value="fuel" className="text-xs">⛽ Fuel & Gas</SelectItem>
                          <SelectItem value="compass" className="text-xs">🧭 Trips & Holidays</SelectItem>
                          <SelectItem value="home" className="text-xs">🏠 Rent & Housing</SelectItem>
                          <SelectItem value="key" className="text-xs">🔑 Property & Lease</SelectItem>
                          <SelectItem value="lightbulb" className="text-xs">💡 Electricity</SelectItem>
                          <SelectItem value="zap" className="text-xs">⚡ Power & Energy</SelectItem>
                          <SelectItem value="wrench" className="text-xs">🔧 Repairs</SelectItem>
                          <SelectItem value="tools" className="text-xs">🔨 Tools</SelectItem>
                          <SelectItem value="heart" className="text-xs">❤ Well-being</SelectItem>
                          <SelectItem value="health" className="text-xs">🏥 Medical & Hospital</SelectItem>
                          <SelectItem value="pill" className="text-xs">💊 Medicine</SelectItem>
                          <SelectItem value="dumbbell" className="text-xs">🏋 Gym & Fitness</SelectItem>
                          <SelectItem value="activity" className="text-xs">📈 Activity</SelectItem>
                          <SelectItem value="shield" className="text-xs">🛡 Insurance</SelectItem>
                          <SelectItem value="briefcase" className="text-xs">💼 Business & Work</SelectItem>
                          <SelectItem value="dollar" className="text-xs">💵 Salary & Income</SelectItem>
                          <SelectItem value="banknote" className="text-xs">💴 Cash & Transfers</SelectItem>
                          <SelectItem value="wallet" className="text-xs">👛 Wallet & Petty Cash</SelectItem>
                          <SelectItem value="credit-card" className="text-xs">💳 Credit Card</SelectItem>
                          <SelectItem value="bank" className="text-xs">🏦 Bank Fees</SelectItem>
                          <SelectItem value="trending-up" className="text-xs">📊 Investments</SelectItem>
                          <SelectItem value="book" className="text-xs">📚 Education & Books</SelectItem>
                          <SelectItem value="graduation-cap" className="text-xs">🎓 School & College</SelectItem>
                          <SelectItem value="pencil" className="text-xs">✏ Stationery</SelectItem>
                          <SelectItem value="gift" className="text-xs">🎁 Gifts & Donations</SelectItem>
                          <SelectItem value="party" className="text-xs">🎉 Celebrations</SelectItem>
                          <SelectItem value="users" className="text-xs">👥 Social & Friends</SelectItem>
                          <SelectItem value="baby" className="text-xs">👶 Baby & Kids</SelectItem>
                          <SelectItem value="paw-print" className="text-xs">🐾 Pets</SelectItem>
                          <SelectItem value="smartphone" className="text-xs">📱 Mobile Phone</SelectItem>
                          <SelectItem value="laptop" className="text-xs">💻 Electronics & Tech</SelectItem>
                          <SelectItem value="camera" className="text-xs">📷 Photography</SelectItem>
                          <SelectItem value="watch" className="text-xs">⌚ Watch & Accessories</SelectItem>
                          <SelectItem value="wifi" className="text-xs">📶 Internet & Wifi</SelectItem>
                          <SelectItem value="cloud" className="text-xs">☁ Cloud Services</SelectItem>
                          <SelectItem value="package" className="text-xs">📦 Delivery & Logistics</SelectItem>
                          <SelectItem value="star" className="text-xs">⭐ Favorites</SelectItem>
                          <SelectItem value="tag" className="text-xs">🏷 Other / Tag</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="cat-color" className="text-xs font-semibold text-muted-foreground">Color</Label>
                      <Select value={newCatColor} onValueChange={setNewCatColor} required>
                        <SelectTrigger id="cat-color" className="rounded-xl h-11 border-border bg-background focus:ring-primary text-xs" style={{ color: newCatColor }}>
                          <SelectValue placeholder="Select color" />
                        </SelectTrigger>
                        <SelectContent className="bg-card border-border rounded-xl">
                          <SelectItem value="#FF6B00" className="text-[#FF6B00] text-xs">Orange</SelectItem>
                          <SelectItem value="#14B8A6" className="text-[#14B8A6] text-xs">Teal</SelectItem>
                          <SelectItem value="#8B5CF6" className="text-[#8B5CF6] text-xs">Purple</SelectItem>
                          <SelectItem value="#3B82F6" className="text-[#3B82F6] text-xs">Blue</SelectItem>
                          <SelectItem value="#EF4444" className="text-[#EF4444] text-xs">Red</SelectItem>
                          <SelectItem value="#10B981" className="text-[#10B981] text-xs">Green</SelectItem>
                          <SelectItem value="#F59E0B" className="text-[#F59E0B] text-xs">Yellow</SelectItem>
                          <SelectItem value="#EC4899" className="text-[#EC4899] text-xs">Pink</SelectItem>
                          <SelectItem value="#6366F1" className="text-[#6366F1] text-xs">Indigo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="new-cat-sub-input" className="text-xs font-semibold text-muted-foreground">Sub-categories (Optional)</Label>
                    <div className="flex gap-2">
                      <Input
                        id="new-cat-sub-input"
                        name="new-cat-sub-input"
                        placeholder="e.g. PC games, Cafe, Mobile spend"
                        value={newCatSubInput}
                        onChange={(e) => setNewCatSubInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            const val = newCatSubInput.trim();
                            if (val && !newCatSubCategories.includes(val)) {
                              setNewCatSubCategories(prev => [...prev, val]);
                              setNewCatSubInput("");
                            }
                          }
                        }}
                        className="rounded-xl h-10 border-border bg-background focus:ring-primary text-xs flex-1"
                      />
                      <Button
                        type="button"
                        onClick={() => {
                          const val = newCatSubInput.trim();
                          if (val && !newCatSubCategories.includes(val)) {
                            setNewCatSubCategories(prev => [...prev, val]);
                            setNewCatSubInput("");
                          }
                        }}
                        className="h-10 px-3 bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-xl text-xs font-bold"
                      >
                        Add
                      </Button>
                    </div>
                    {newCatSubCategories.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {newCatSubCategories.map((sub, idx) => (
                          <div key={idx} className="flex items-center gap-1 px-2.5 py-1 bg-muted rounded-lg text-[10px] font-bold text-muted-foreground border border-border/60">
                            <span>{sub}</span>
                            <button
                              type="button"
                              onClick={() => setNewCatSubCategories(prev => prev.filter(s => s !== sub))}
                              className="text-muted-foreground/60 hover:text-red-500 transition-colors"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <Button type="submit" className="w-full h-11 rounded-xl text-primary-foreground font-bold bg-primary hover:bg-primary/90 mt-2 shadow-lg shadow-primary/20">
                    Add Category
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
            <span className="text-[10px] font-semibold text-muted-foreground/60">
              {categories.length} active
            </span>
          </div>
        </div>

        {/* Category Cards List */}
        <div className="space-y-3 mb-6">
          {summary.categoryBreakdown.map((item) => {
            const IconComponent = iconComponentMap[item.category.icon] || Tag;

            return (
              <div 
                key={item.category.id} 
                className="flex items-center justify-between p-4 bg-card/50 border border-border/60 rounded-2xl transition-all duration-200 hover:bg-card/75"
              >
                {/* Left Side: Icon and Details */}
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-muted/60 flex items-center justify-center border border-border/40 shrink-0">
                    <IconComponent className="w-5 h-5 text-muted-foreground" strokeWidth={2} />
                  </div>
                  <div className="flex flex-col">
                    <h4 className="text-sm font-black text-foreground tracking-tight leading-tight">
                      {item.category.name}
                    </h4>
                    <span className="text-[10px] text-muted-foreground/80 font-bold mt-1 tracking-tight">
                      Limit: {formatK(item.category.monthlyLimit)} • {item.percentSpent.toFixed(0)}% spent
                    </span>
                  </div>
                </div>

                {/* Right Side: Spent Value and Actions */}
                <div className="flex items-center gap-3">
                  <span className="text-sm font-black text-green-500 tabular-nums">
                    {formatK(item.spent)}
                  </span>
                  
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      type="button"
                      onClick={() => {
                        setEditingCategory(item.category);
                        setEditLimitOpen(true);
                      }}
                      className="w-8 h-8 text-muted-foreground/50 hover:text-primary hover:bg-primary/10 rounded-xl transition-all shrink-0"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      type="button"
                      onClick={() => {
                        if (confirm(`Are you sure you want to delete the "${item.category.name}" category? This will delete all its transactions.`)) {
                          deleteCategory(item.category.id);
                        }
                      }}
                      className="w-8 h-8 text-muted-foreground/50 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all shrink-0"
                    >
                      <Trash2 className="w-4.5 h-4.5" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Edit Category Dialog */}
        <Dialog open={editLimitOpen} onOpenChange={setEditLimitOpen}>
          <DialogContent aria-describedby={undefined} className="max-w-[90vw] sm:max-w-md rounded-2xl bg-card border-border">
            <DialogHeader className="text-left">
              <DialogTitle className="text-lg font-bold flex items-center gap-2">
                <Pencil className="w-5 h-5 text-primary" />
                Edit Category
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSaveCategoryEdit} className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <Label htmlFor="category-edit-name" className="text-xs font-semibold text-muted-foreground">Category Name</Label>
                <Input
                  id="category-edit-name"
                  name="category-edit-name"
                  placeholder="e.g. Gifts, Pet care"
                  value={editCatName}
                  onChange={(e) => setEditCatName(e.target.value)}
                  required
                  className="rounded-xl h-11 border-border bg-background focus:ring-primary text-xs font-bold text-foreground"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="category-edit-limit" className="text-xs font-semibold text-muted-foreground">Monthly Limit (₹)</Label>
                <div className="relative">
                  <Input
                    id="category-edit-limit"
                    name="category-edit-limit"
                    type="number"
                    placeholder="0.00"
                    value={tempCategoryLimit}
                    onChange={(e) => setTempCategoryLimit(e.target.value)}
                    required
                    className="rounded-xl h-11 border-border bg-background focus:ring-primary pl-8 text-xs font-bold text-foreground tabular-nums"
                  />
                  <span className="absolute left-3 top-3 text-muted-foreground text-xs">₹</span>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="category-edit-sub-input" className="text-xs font-semibold text-muted-foreground">Sub-categories (Optional)</Label>
                <div className="flex gap-2">
                  <Input
                    id="category-edit-sub-input"
                    name="category-edit-sub-input"
                    placeholder="e.g. PC games, Cafe, Mobile spend"
                    value={editCatSubInput}
                    onChange={(e) => setEditCatSubInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        const val = editCatSubInput.trim();
                        if (val && !editCatSubCategories.includes(val)) {
                          setEditCatSubCategories(prev => [...prev, val]);
                          setEditCatSubInput("");
                        }
                      }
                    }}
                    className="rounded-xl h-10 border-border bg-background focus:ring-primary text-xs flex-1"
                  />
                  <Button
                    type="button"
                    onClick={() => {
                      const val = editCatSubInput.trim();
                      if (val && !editCatSubCategories.includes(val)) {
                        setEditCatSubCategories(prev => [...prev, val]);
                        setEditCatSubInput("");
                      }
                    }}
                    className="h-10 px-3 bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-xl text-xs font-bold"
                  >
                    Add
                  </Button>
                </div>
                {editCatSubCategories.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {editCatSubCategories.map((sub, idx) => (
                      <div key={idx} className="flex items-center gap-1 px-2.5 py-1 bg-muted rounded-lg text-[10px] font-bold text-muted-foreground border border-border/60">
                        <span>{sub}</span>
                        <button
                          type="button"
                          onClick={() => setEditCatSubCategories(prev => prev.filter(s => s !== sub))}
                          className="text-muted-foreground/60 hover:text-red-500 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <Button
                type="submit"
                className="w-full h-11 rounded-xl text-primary-foreground font-bold bg-primary hover:bg-primary/90 mt-2 shadow-lg shadow-primary/20"
              >
                Save Category
              </Button>
            </form>
          </DialogContent>
        </Dialog>

        {/* Edit Transaction Dialog */}
        <Dialog open={editTxnOpen} onOpenChange={setEditTxnOpen}>
          <DialogContent aria-describedby={undefined} className="max-w-[90vw] sm:max-w-md rounded-2xl bg-card border-border">
            <DialogHeader className="text-left">
              <DialogTitle className="text-lg font-bold flex items-center gap-2">
                <Pencil className="w-5 h-5 text-primary" />
                Edit Transaction
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleEditSaveTransaction} className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <Label htmlFor="edit-amount" className="text-xs font-semibold text-muted-foreground">Amount (₹)</Label>
                <div className="relative">
                  <Input
                    id="edit-amount"
                    name="edit-amount"
                    type="number"
                    placeholder="0.00"
                    value={editAmount}
                    onChange={(e) => setEditAmount(e.target.value)}
                    required
                    className="rounded-xl h-11 border-border bg-background focus:ring-primary pl-8 text-sm font-bold text-foreground tabular-nums"
                  />
                  <span className="absolute left-3 top-3 text-muted-foreground text-xs">₹</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="edit-category" className="text-xs font-semibold text-muted-foreground">Category</Label>
                <Select value={editCategoryId} onValueChange={(val) => {
                  setEditCategoryId(val);
                  setEditSubCategory("");
                }} required>
                  <SelectTrigger id="edit-category" className="rounded-xl h-11 border-border bg-background focus:ring-primary text-xs">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border rounded-xl">
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id} className="rounded-lg text-xs">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                          <span>{cat.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {editCategoryId && categories.find(c => c.id === editCategoryId)?.subCategories?.length ? (
                <div className="space-y-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
                  <Label htmlFor="edit-subcategory" className="text-xs font-semibold text-muted-foreground">Sub-category (Optional)</Label>
                  <Select value={editSubCategory} onValueChange={setEditSubCategory}>
                    <SelectTrigger id="edit-subcategory" className="rounded-xl h-11 border-border bg-background focus:ring-primary text-xs">
                      <SelectValue placeholder="Select a sub-category" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border rounded-xl">
                      <SelectItem value="" className="text-xs">None</SelectItem>
                      {categories.find(c => c.id === editCategoryId)?.subCategories?.map((sub) => (
                        <SelectItem key={sub} value={sub} className="text-xs">
                          {sub}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ) : null}

              <div className="space-y-1.5 flex flex-col">
                <DatePickerInput
                  label="Date"
                  value={editDate}
                  onChange={(newDate) => setEditDate(newDate || new Date())}
                  id="edit-txn-date"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="edit-note" className="text-xs font-semibold text-muted-foreground">Note / Reference (Optional)</Label>
                <Input
                  id="edit-note"
                  name="edit-note"
                  placeholder="e.g. Lunch with friends"
                  value={editNote}
                  onChange={(e) => setEditNote(e.target.value)}
                  className="rounded-xl h-11 border-border bg-background focus:ring-primary text-xs"
                />
              </div>

              <Button type="submit" className="w-full h-11 rounded-xl text-primary-foreground font-bold bg-primary hover:bg-primary/90 mt-2 shadow-lg shadow-primary/20">
                Save Changes
              </Button>
            </form>
          </DialogContent>
        </Dialog>


        {/* Recent Transactions List — grouped by date */}
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            Transaction History ({currentTransactions.length})
          </h3>
        </div>

        <div className="space-y-4 mb-6">
          {currentTransactions.length === 0 ? (
            <Card className="bg-card border-border rounded-2xl p-8 shadow-xl">
              <div className="flex flex-col items-center justify-center text-center text-muted-foreground">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mb-2">
                  <Wallet className="w-5 h-5 text-muted-foreground/50" />
                </div>
                <span className="text-xs font-semibold">No transactions in this range</span>
                <p className="text-[10px] text-muted-foreground mt-0.5">Expenses added in the selected period will show here.</p>
              </div>
            </Card>
          ) : (
            (() => {
              // Group transactions by date
              const groups: Record<string, typeof currentTransactions> = {};
              currentTransactions.forEach((t) => {
                if (!groups[t.date]) groups[t.date] = [];
                groups[t.date].push(t);
              });
              // Already sorted descending by date from useMemo
              const groupEntries = Object.entries(groups).sort((a, b) => b[0].localeCompare(a[0]));

              return groupEntries.map(([dateStr, txns]) => (
                <div key={dateStr} className="space-y-2">
                  {/* Date heading */}
                  <div className="flex items-center justify-between px-1">
                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">
                      {(() => {
                        try {
                          const [y, m, d] = dateStr.split("-").map(Number);
                          return format(new Date(y, m - 1, d), "dd MMM yyyy");
                        } catch { return dateStr; }
                      })()}
                    </span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold bg-primary/10 text-primary border border-primary/20">
                      {txns.length} txn{txns.length > 1 ? 's' : ''}
                    </span>
                  </div>

                  {/* Transactions for this date */}
                  <Card className="bg-card border-border rounded-2xl p-3 shadow-sm">
                    <div className="flex flex-col space-y-2">
                      {txns.map((t) => {
                        const cat = categories.find((c) => c.id === t.categoryId);
                        const IconComponent = cat ? (iconComponentMap[cat.icon] || Tag) : Tag;

                        return (
                          <div
                            key={t.id}
                            className="flex items-center justify-between p-2 rounded-xl bg-background/50 border border-border/40 hover:bg-background/80 transition-all"
                          >
                            <div className="flex items-center gap-2.5">
                              <div className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center">
                                <IconComponent className="w-4 h-4 text-muted-foreground" strokeWidth={2} />
                              </div>
                              <div className="flex flex-col">
                                <span className="text-xs font-bold text-foreground leading-none">{t.note}</span>
                                <span className="text-[9px] text-muted-foreground mt-1 font-medium">
                                  {cat?.name || "Expense"}
                                  {t.subCategory ? ` • ${t.subCategory}` : ""}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <span className="text-xs font-black text-foreground tabular-nums">
                                -{formatINRFull(t.amount)}
                              </span>
                              <div className="flex items-center gap-0.5">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  type="button"
                                  onClick={() => {
                                    setEditingTxn(t);
                                    setEditTxnOpen(true);
                                  }}
                                  className="w-7 h-7 text-muted-foreground/60 hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                                >
                                  <Pencil className="w-3.5 h-3.5" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  type="button"
                                  onClick={() => {
                                    if (confirm("Are you sure you want to delete this transaction?")) {
                                      deleteTransaction(t.id);
                                    }
                                  }}
                                  className="w-7 h-7 text-muted-foreground/60 hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </Card>
                </div>
              ));
            })()
          )}
        </div>

      </div>

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

      <BottomNav />
    </PageLayout>
  );
}

