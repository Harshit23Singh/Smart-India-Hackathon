"use client";

interface Indicator {
  name: string;
  score: number; // 0 to 100
  isHighRisk: boolean;
}

interface ExplainableAIProps {
  indicators: Indicator[];
}

export default function ExplainableAI({ indicators }: ExplainableAIProps) {
  return (
    <div className="skeuo-card p-6">
      <h3 className="text-lg font-semibold text-foreground mb-2">Why was this voice flagged?</h3>
      <p className="text-sm text-foreground/50 mb-6">Explainable AI indicators contributing to the final risk score.</p>
      
      <div className="space-y-5 skeuo-inset rounded-xl p-4">
        {indicators.map((ind, idx) => (
          <div key={idx}>
            <div className="flex justify-between items-end mb-2">
              <span className="text-sm font-medium text-foreground/80">{ind.name}</span>
              <span className="text-sm font-mono font-bold text-foreground">{ind.score}%</span>
            </div>
            
            <div className="h-3 w-full skeuo-inset rounded-sm overflow-hidden">
            <div
                className="h-full rounded-sm transition-all duration-1000"
                style={{
                  width: `${ind.score}%`,
                  backgroundColor: ind.isHighRisk
                    ? ind.score > 80 ? 'var(--color-danger)' : ind.score > 50 ? 'var(--color-warning)' : 'var(--color-success)'
                    : ind.score > 80 ? 'var(--color-success)' : ind.score > 50 ? 'var(--color-warning)' : 'var(--color-danger)',
                  boxShadow: `0 0 8px currentColor`,
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
