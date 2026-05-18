import {
  CircleDollarSign, BarChart3, Calendar, TrendingUp,
  Landmark, Target, Scale, RotateCcw,
  User, Heart, Tag, Trophy, CheckCircle2,
  Rocket, TriangleAlert, GraduationCap, CreditCard,
  ClipboardList, Banknote, Lightbulb, AlarmClock,
  type LucideIcon, RefreshCw,
} from "lucide-react";

const map: Record<string, LucideIcon> = {
  "💰": CircleDollarSign,
  "📊": BarChart3,
  "📅": Calendar,
  "📈": TrendingUp,
  "🏦": Landmark,
  "🏛️": Landmark,
  "🎯": Target,
  "⚖️": Scale,
  "🔁": RotateCcw,
  "🔄": RefreshCw,
  "👤": User,
  "❤️": Heart,
  "🏷️": Tag,
  "🏆": Trophy,
  "✅": CheckCircle2,
  "🚀": Rocket,
  "⚠️": TriangleAlert,
  "🎓": GraduationCap,
  "💳": CreditCard,
  "📋": ClipboardList,
  "💵": Banknote,
  "💸": CircleDollarSign,
  "💡": Lightbulb,
  "⏰": AlarmClock,
};

export function CalcIcon({ name, className = "w-4 h-4" }: { name: string; className?: string }) {
  const Icon = map[name];
  if (!Icon) return <span className={className}>{name}</span>;
  return <Icon className={className} />;
}
