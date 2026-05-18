interface TimelineBarProps {
  currentAge: number;
  retirementAge: number;
  lifeExpectancy: number;
}

export function TimelineBar({ currentAge, retirementAge, lifeExpectancy }: TimelineBarProps) {
  const total = lifeExpectancy - currentAge;
  const retirePct = ((retirementAge - currentAge) / total) * 100;
  return (
    <div className="mt-6 mb-2">
      <div className="relative h-1 bg-brand-gray-mid dark:bg-white/20 rounded-full">
        <div className="absolute top-0 left-0 h-1 bg-brand-primary rounded-full" style={{ width: `${retirePct}%` }} />
        <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-brand-primary border-2 border-white" style={{ left: `0%` }} />
        <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-brand-black border-2 border-white" style={{ left: `${retirePct}%` }} />
        <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-brand-gray-mid border-2 border-white" style={{ left: `100%` }} />
      </div>
      <div className="flex justify-between mt-2 text-[11px] text-brand-gray-text">
        <span>Age {currentAge}</span>
        <span>Age {retirementAge}</span>
        <span>Age {lifeExpectancy}</span>
      </div>
    </div>
  );
}
