"use client";

import { getIcon } from "@/lib/budget/iconMap";

interface CategoryIconProps {
  icon: string;
  size?: number;
}

export function CategoryIcon({ icon, size = 40 }: CategoryIconProps) {
  const Icon = getIcon(icon);
  return (
    <div className="flex items-center justify-center rounded-xl shrink-0 text-white/70" style={{ width: size, height: size, background: "#1C1C1F" }}>
      {Icon ? <Icon size={Math.round(size * 0.55)} /> : <span style={{ fontSize: size * 0.45 }}>{icon}</span>}
    </div>
  );
}
