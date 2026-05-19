import {
  CircleDollarSign, BarChart3, Calendar, TrendingUp,
  Landmark, Target, Scale, RotateCcw,
  User, Heart, Tag, Trophy, CheckCircle2,
  Rocket, TriangleAlert, GraduationCap, CreditCard,
  ClipboardList, Banknote, Lightbulb, AlarmClock,
  type LucideIcon, RefreshCw,
} from "lucide-react";

const map: Record<string, LucideIcon> = {
  "money": CircleDollarSign,
  "chart": BarChart3,
  "calendar": Calendar,
  "trending": TrendingUp,
  "bank": Landmark,
  "target": Target,
  "scale": Scale,
  "refresh": RotateCcw,
  "user": User,
  "heart": Heart,
  "tag": Tag,
  "trophy": Trophy,
  "check": CheckCircle2,
  "rocket": Rocket,
  "warning": TriangleAlert,
  "graduate": GraduationCap,
  "credit": CreditCard,
  "clipboard": ClipboardList,
  "banknote": Banknote,
  "lightbulb": Lightbulb,
  "alarm": AlarmClock,
};

export function CalcIcon({ name, className = "w-4 h-4" }: { name: string; className?: string }) {
  const Icon = map[name];
  if (!Icon) return <span className={className}>{name}</span>;
  return <Icon className={className} />;
}
