import { memo } from "react";

interface InsightBannerProps {
  title: string;
  body: string;
}

function InsightBannerInner({ title, body }: InsightBannerProps) {
  return (
    <div className="py-0 my-5 animate-metric" style={{ animationDelay: "200ms" }}>
      <p className="text-[clamp(18px,2.5vw,22px)] font-bold text-brand-black dark:text-white mb-1.5">
        {title}
      </p>
      <p className="text-[14px] text-brand-gray-text font-normal leading-relaxed">
        {body}
      </p>
    </div>
  );
}

export const InsightBanner = memo(InsightBannerInner);
