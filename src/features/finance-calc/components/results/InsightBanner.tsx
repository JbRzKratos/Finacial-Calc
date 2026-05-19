import { memo } from "react";

interface InsightBannerProps {
  title: string;
  body: string;
}

function InsightBannerInner({ title, body }: InsightBannerProps) {
  return (
    <div className="my-5 animate-metric relative rounded-2xl bg-white border border-[rgba(0,0,0,0.06)] p-5" style={{ animationDelay: "200ms" }}>
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
