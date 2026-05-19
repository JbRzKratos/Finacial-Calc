import { memo } from "react";

interface InsightBannerProps {
  title: string;
  body: string;
}

function InsightBannerInner({ title, body }: InsightBannerProps) {
  return (
    <div className="my-5 animate-metric relative rounded-2xl bg-gradient-to-br from-[rgba(255,107,0,0.03)] to-white border border-[rgba(255,107,0,0.08)] p-5 shadow-[0_1px_12px_rgba(255,107,0,0.04)]" style={{ animationDelay: "200ms" }}>
      <p className="text-[clamp(18px,2.5vw,22px)] font-bold text-brand-black mb-1.5">
        {title}
      </p>
      <p className="text-[14px] text-brand-gray-text font-normal leading-relaxed">
        {body}
      </p>
    </div>
  );
}

export const InsightBanner = memo(InsightBannerInner);
