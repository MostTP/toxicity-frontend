interface ChartBarProps {
  label: string;
  value: number;
  color: string;
}

export function ChartBar({ label, value, color }: ChartBarProps) {
  return (
    <div className="flex items-center gap-3 mb-3">
      <div className="w-20 text-xs text-muted-foreground shrink-0">{label}</div>
      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-[width] duration-500"
          style={{ width: `${value}%`, backgroundColor: color }}
        />
      </div>
      <div className="w-10 text-xs font-semibold text-right shrink-0">{value}%</div>
    </div>
  );
}
