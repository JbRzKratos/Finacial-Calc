
interface TimelineBarProps {
  currentAge: number;
  retirementAge: number;
  lifeExpectancy: number;
}

export function TimelineBar({ currentAge, retirementAge, lifeExpectancy }: TimelineBarProps) {
  const total = lifeExpectancy - currentAge;
  const workingPct = ((retirementAge - currentAge) / total) * 100;
  const retiredPct = ((lifeExpectancy - retirementAge) / total) * 100;

  return (
    <div className="mt-6 animate-chart">
      <p className="text-[11px] font-semibold tracking-[0.08em] text-white/40 uppercase mb-3">Life Timeline</p>
      <div className="relative h-10 flex items-center">
        <div className="absolute inset-0 flex rounded-full overflow-hidden">
          <div
            className="bg-primary/20 border border-primary/30"
            style={{ width: workingPct + "%" }}
          />
          <div
            className="bg-white/5 border border-white/10"
            style={{ width: retiredPct + "%" }}
          />
        </div>
        <div className="relative z-10 flex w-full px-3">
          <span className="text-[10px] font-semibold text-white/60">
            {currentAge}
          </span>
          <div className="flex-1" />
          <span className="text-[10px] font-semibold text-primary">
            {retirementAge}
          </span>
          <div className="flex-1" />
          <span className="text-[10px] font-semibold text-white/40">
            {lifeExpectancy}
          </span>
        </div>
      </div>
      <div className="flex justify-between mt-1.5">
        <span className="text-[10px] text-white/30">Working phase</span>
        <span className="text-[10px] text-white/30">Retirement phase</span>
      </div>
    </div>
  );
}
