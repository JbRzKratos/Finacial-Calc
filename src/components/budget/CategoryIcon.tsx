"use client";

interface CategoryIconProps {
  icon: string;
  color: string;
  size?: number;
}

export function CategoryIcon({ icon, color, size = 40 }: CategoryIconProps) {
  return (
    <div className="flex items-center justify-center rounded-xl shrink-0" style={{ width: size, height: size, background: `${color}20`, fontSize: size * 0.45 }}>
      {icon}
    </div>
  );
}
