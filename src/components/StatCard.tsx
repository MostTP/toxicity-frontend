interface StatCardProps {
  label: string;
  value: string;
  change: string;
  isUp?: boolean;
}

export function StatCard({ label, value, change, isUp = true }: StatCardProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
        {label}
      </div>
      <div className="text-2xl font-bold tracking-tight">{value}</div>
      <div className={`text-xs font-medium mt-1 ${isUp ? 'text-success' : 'text-destructive'}`}>
        {change}
      </div>
    </div>
  );
}
