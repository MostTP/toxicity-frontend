import { StatCard } from '../components/StatCard';
import { ChartBar } from '../components/ChartBar';
import { Tag } from '../components/Tag';

const RECENT_ACTIVITY = [
  { comment: 'You are such an idiot...', model: 'mBERT', isToxic: true, confidence: '97%', time: '2m ago' },
  { comment: 'This tutorial really helped...', model: 'SVM', isToxic: false, confidence: '89%', time: '5m ago' },
  { comment: 'Shut up loser...', model: 'CNN', isToxic: true, confidence: '94%', time: '12m ago' },
  { comment: 'I disagree with your take...', model: 'mBERT', isToxic: false, confidence: '92%', time: '18m ago' },
  { comment: 'Eres un tonto...', model: 'mBERT', isToxic: true, confidence: '88%', time: '25m ago' },
];

export function DashboardPage() {
  return (
    <div className="animate-fade-in max-w-5xl mx-auto space-y-6">
      {/* Stats Grid */}
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-4">
        <StatCard label="Total Analyses" value="1,247" change="+12% from last week" isUp={true} />
        <StatCard label="Toxic Detected" value="342" change="+5% from last week" isUp={false} />
        <StatCard label="Safe Comments" value="905" change="+18% from last week" isUp={true} />
        <StatCard label="Avg Confidence" value="94.2%" change="+2.1% from last week" isUp={true} />
      </div>

      {/* Model Performance */}
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 pt-6 pb-3">
          <div className="text-sm font-semibold tracking-tight">Model Performance</div>
        </div>
        <div className="px-6 pb-6">
          <ChartBar label="SVM" value={87} color="var(--color-success)" />
          <ChartBar label="mBERT" value={94} color="var(--color-info)" />
          <ChartBar label="CNN" value={91} color="var(--color-warning)" />
        </div>
      </div>

      {/* Language Distribution */}
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 pt-6 pb-3">
          <div className="text-sm font-semibold tracking-tight">Language Distribution</div>
        </div>
        <div className="px-6 pb-6">
          <ChartBar label="English" value={62} color="var(--color-primary)" />
          <ChartBar label="Spanish" value={18} color="var(--color-primary)" />
          <ChartBar label="German" value={10} color="var(--color-primary)" />
          <ChartBar label="French" value={6} color="var(--color-primary)" />
          <ChartBar label="Other" value={4} color="var(--color-primary)" />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 pt-6 pb-3">
          <div className="text-sm font-semibold tracking-tight">Recent Activity</div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground border-b border-border">Comment</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground border-b border-border">Model</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground border-b border-border">Result</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground border-b border-border">Confidence</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground border-b border-border">Time</th>
              </tr>
            </thead>
            <tbody>
              {RECENT_ACTIVITY.map((item, i) => (
                <tr key={i} className="hover:bg-accent/50 transition-colors">
                  <td className="px-4 py-3.5 text-sm border-b border-border">{item.comment}</td>
                  <td className="px-4 py-3.5 text-sm border-b border-border">{item.model}</td>
                  <td className="px-4 py-3.5 border-b border-border">
                    <Tag variant={item.isToxic ? 'destructive' : 'success'}>
                      {item.isToxic ? 'Toxic' : 'Safe'}
                    </Tag>
                  </td>
                  <td className="px-4 py-3.5 text-sm border-b border-border">{item.confidence}</td>
                  <td className="px-4 py-3.5 text-sm text-muted-foreground border-b border-border">{item.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
