import { Zap } from "lucide-react";

interface BreakingNewsItem {
  id: string;
  title: string;
}

interface BreakingNewsTickerProps {
  headlines?: BreakingNewsItem[];
  speed?: number; // Speed in seconds
  onHeadlineClick?: (id: string) => void;
}

const BreakingNewsTicker = ({
  headlines = [],
  speed = 30,
  onHeadlineClick
}: BreakingNewsTickerProps) => {
  const displayHeadlines = headlines.length > 0 ? headlines : [
    { id: "", title: "A carregar notícias de última hora..." },
  ];

  return (
    <div className="bg-primary text-primary-foreground overflow-hidden">
      <div className="container flex items-center">
        <div className="flex items-center gap-2 py-2 pr-4 flex-shrink-0 font-semibold text-xs uppercase tracking-wider bg-primary">
          <Zap className="w-3.5 h-3.5" />
          <span>Última Hora</span>
        </div>
        <div className="overflow-hidden relative flex-1">
          <div
            className="flex w-max animate-scroll whitespace-nowrap gap-12 py-2"
            style={{
              animationDuration: `${speed}s`,
              animationName: 'scroll',
              animationIterationCount: 'infinite',
              animationTimingFunction: 'linear'
            }}
          >
            {[...displayHeadlines, ...displayHeadlines].map((h, i) => (
              <span
                key={i}
                className="text-sm font-medium cursor-pointer hover:underline pr-4"
                onClick={() => h.id && onHeadlineClick?.(h.id)}
              >
                {h.title}
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
