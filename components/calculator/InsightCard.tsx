import { InsightData } from "@/types/calculator";
import { Card } from "@/components/ui/card";
import { CalcIcon } from "@/components/shared/CalcIcon";

interface InsightCardProps {
  insights: InsightData[];
}

export function InsightCard({ insights }: InsightCardProps) {
  if (!insights.length) return null;
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-muted-foreground">SMART INSIGHTS</h3>
      {insights.map((insight, i) => (
        <Card key={i} className="p-4">
          <div className="flex gap-3">
            <CalcIcon name={insight.icon} className="w-5 h-5 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-semibold mb-0.5">{insight.title}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{insight.description}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
