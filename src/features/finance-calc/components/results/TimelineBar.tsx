interface TimelineBarProps {
  currentAge: number;
  retirementAge: number;
  lifeExpectancy: number;
}

export function TimelineBar({ currentAge, retirementAge, lifeExpectancy }: TimelineBarProps) {
  const total = lifeExpectancy - currentAge;
  const retirePct = ((retirementAge - currentAge) / total) * 100;
  return (
    <div className="mt-6 mb-2 animate-metric">
      <div className="relative h-1.5 bg-[rgba(0,0,0,0.06)] rounded-full overflow-hidden">
        <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-brand-primary to-[#FF8C38] rounded-full transition-all duration-700" style={{ width: retirePct + "%" }} />
        <div className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-brand-primary border-[3px] border-white shadow-[0_2px_8px_rgba(0,0,0,0.12)]" style={{ left: "0%" }} />
        <div className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-brand-black border-[3px] border-white shadow-[0_2px_8px_rgba(0,0,0,0.15)]" style={{ left: retirePct + "%" }} />
        <div className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-brand-gray-mid border-[3px] border-white" style={{ left: "100%" }} />
      </div>
      <div className="flex justify-between mt-2.5 text-[11px] text-brand-gray-text font-medium">
        <span>Now (Age {currentAge})</span>
        <span>Retire (Age {retirementAge})</span>
        <span>End (Age {lifeExpectancy})</span>
      </div>
    </div>
  );
}
