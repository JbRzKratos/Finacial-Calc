"use client";

interface InsightBannerProps {
  title: string;
  body: string;
}

export function InsightBanner({ title, body }: InsightBannerProps) {
  return (
    <div className="calc-card !p-4 mt-4 animate-banner-reveal relative overflow-hidden">
      <div className="flex gap-3 items-start">
        <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center shrink-0 mt-0.5">
          <span className="text-sm">💡</span>
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-white/85 mb-1">{title}</h4>
          <p className="text-xs text-white/50 leading-relaxed">{body}</p>
        </div>
      </div>
    </div>
  );
}
