"use client";

interface CategoryIconProps {
  icon: string;
  bgColor: string;
  size?: number;
}

export function CategoryIcon({ icon, bgColor, size = 48 }: CategoryIconProps) {
  return (
    <div
      className="flex items-center justify-center rounded-xl shrink-0"
      style={{ width: size, height: size, background: bgColor, fontSize: size * 0.5 }}
    >
      {icon}
    </div>
  );
}
