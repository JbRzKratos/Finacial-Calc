"use client";

interface DonutChartProps {
  data: { label: string; value: number; color: string }[];
  size?: number;
  strokeWidth?: number;
}

export function DonutChart({ data, size = 180, strokeWidth = 32 }: DonutChartProps) {
  const cx = size / 2;
  const cy = size / 2;
  const r = (size - strokeWidth) / 2;
  const total = data.reduce((s, d) => s + d.value, 0);
  if (total === 0) {
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#262626" strokeWidth={strokeWidth} />
        <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central" fill="#a3a3a3" fontSize="13" fontWeight="600">
          No data
        </text>
      </svg>
    );
  }

  let offset = 0;
  const circumference = 2 * Math.PI * r;
  const segments = data.map((d) => {
    const fraction = d.value / total;
    const len = fraction * circumference;
    const seg = { ...d, length: len, offset, fraction };
    offset += len;
    return seg;
  });

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#262626" strokeWidth={strokeWidth} />
      {segments.map((seg) => (
        <circle
          key={seg.label}
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke={seg.color}
          strokeWidth={strokeWidth}
          strokeDasharray={`${seg.length} ${circumference - seg.length}`}
          strokeDashoffset={-seg.offset}
          strokeLinecap="round"
          className="transition-all duration-500"
        />
      ))}
      <text
        x={cx}
        y={cy - 8}
        textAnchor="middle"
        dominantBaseline="central"
        fill="#f5f5f5"
        fontSize="22"
        fontWeight="700"
        style={{ transform: "rotate(90deg)", transformOrigin: `${cx}px ${cy}px` }}
      >
        {Math.round(total).toLocaleString("en-IN")}
      </text>
      <text
        x={cx}
        y={cy + 14}
        textAnchor="middle"
        dominantBaseline="central"
        fill="#a3a3a3"
        fontSize="11"
        fontWeight="500"
        style={{ transform: "rotate(90deg)", transformOrigin: `${cx}px ${cy}px` }}
      >
        Total spent
      </text>
    </svg>
  );
}
