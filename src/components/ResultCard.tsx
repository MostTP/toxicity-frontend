import type { Analysis } from '../types';
import { formatTime } from '../utils';

interface ResultCardProps {
  analysis: Analysis;
}

export function ResultCard({ analysis }: ResultCardProps) {
  return (
    <div className={`rounded-lg border p-3.5 mb-2 animate-slide-in ${
      analysis.isToxic
        ? 'border-destructive/30 bg-destructive/[0.03]'
        : 'border-success/30 bg-success/[0.03]'
    }`}>
      <div className="flex items-center justify-between mb-2">
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[0.6875rem] font-semibold ${
          analysis.isToxic
            ? 'bg-destructive/10 text-destructive border border-destructive/20'
            : 'bg-success/10 text-success border border-success/20'
        }`}>
          {analysis.isToxic ? '⚠️ Toxic' : '✓ Safe'}
        </span>
        <span className="text-[0.6875rem] text-muted-foreground">{formatTime(analysis.timestamp)}</span>
      </div>
      <p className="text-[0.8125rem] leading-relaxed line-clamp-2 mb-2">{analysis.text}</p>
      <div className="flex items-center gap-2 text-[0.6875rem] text-muted-foreground">
        <span>{analysis.model.toUpperCase()}</span>
        <span className="w-[3px] h-[3px] rounded-full bg-muted-foreground/50" />
        <span>{analysis.confidence}% confidence</span>
      </div>
      <div className="h-1 rounded-full bg-muted mt-2 overflow-hidden">
        <div
          className={`h-full rounded-full transition-[width] duration-500 ${
            analysis.isToxic ? 'bg-destructive' : 'bg-success'
          }`}
          style={{ width: `${analysis.score}%` }}
        />
      </div>
    </div>
  );
}
