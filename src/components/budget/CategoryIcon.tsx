"use client";

import { getIcon } from "@/lib/budget/iconMap";

interface CategoryIconProps {
  icon: string;
  color: string;
  size?: number;
}

export function CategoryIcon({ icon, color, size = 40 }: CategoryIconProps) {
  const Icon = getIcon(icon);
  return (
    <div className="flex items-center justify-center rounded-xl shrink-0 text-white" style={{ width: size, height: size, background: `${color}20` }}>
      {Icon ? <Icon size={Math.round(size * 0.55)} /> : <span style={{ fontSize: size * 0.45 }}>{icon}</span>}
    </div>
  );
}
