import { Zap } from "lucide-react";

interface BreakingNewsTickerProps {
  headlines?: string[];
}

const BreakingNewsTicker = ({ headlines = [] }: BreakingNewsTickerProps) => {
  const displayHeadlines = headlines.length > 0 ? headlines : [
    "A carregar notícias de última hora...",
  ];

  return (
    <div className="bg-primary text-primary-foreground overflow-hidden">
      <div className="container flex items-center">
        <div className="flex items-center gap-2 py-2 pr-4 flex-shrink-0 font-semibold text-xs uppercase tracking-wider bg-primary">
          <Zap className="w-3.5 h-3.5" />
          <span>Última Hora</span>
        </div>
        <div className="overflow-hidden relative flex-1">
          <div className="flex animate-[scroll_30s_linear_infinite] whitespace-nowrap gap-12 py-2">
            {[...displayHeadlines, ...displayHeadlines].map((h, i) => (
              <span key={i} className="text-sm font-medium cursor-pointer hover:underline">
                {h}
              </span>
            ))}
          </div>
        </div>
      </div>
      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
};

export default BreakingNewsTicker;
