import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { StatCard } from '../components/StatCard';
import { ChartBar } from '../components/ChartBar';
import { Tag } from '../components/Tag';
import { getRecentPredictions, getModelStats, getLanguageStats } from '../api/clients';
import type { RecentPrediction } from '../api/clients';

interface ModelStat {
  count: number;
  avg_confidence: number;
}

interface LanguageStat {
  language: string;
  percentage: number;
}

const PAGE_SIZE = 10;

export function DashboardPage() {
  const [recent, setRecent] = useState<RecentPrediction[]>([]);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const [modelStats, setModelStats] = useState<Record<string, ModelStat>>({});
  const [languageStats, setLanguageStats] = useState<LanguageStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadPage = (newOffset: number) => {
    setLoading(true);
    Promise.all([
      getRecentPredictions(PAGE_SIZE, newOffset),
      getModelStats(7),
      getLanguageStats(7),
    ])
      .then(([recentData, modelData, langData]) => {
        setRecent(recentData.predictions || []);
        setTotal(recentData.total || 0);
        setOffset(newOffset);
        setModelStats(modelData.models || {});
        setLanguageStats(langData.languages || []);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadPage(0);
  }, []);

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    const diff = Math.floor((Date.now() - d.getTime()) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  const currentPage = Math.floor(offset / PAGE_SIZE) + 1;
  const totalPages = Math.ceil(total / PAGE_SIZE);
  const hasPrev = offset > 0;
  const hasNext = offset + PAGE_SIZE < total;

  // Calculate real stats from recent data
  const pageTotal = recent.length;
  const toxicCount = recent.filter(p => p.label === 1).length;
  const safeCount = pageTotal - toxicCount;
  const avgConfidence = pageTotal > 0
    ? Math.round((recent.reduce((sum, p) => sum + p.confidence, 0) / pageTotal) * 1000) / 10
    : 0;

  const hasData = !loading && recent.length > 0;

  const modelPerformance = [
    { name: 'SVM', value: modelStats.svm ? Math.round(modelStats.svm.avg_confidence * 100) : 0, color: 'var(--color-success)' },
    { name: 'mBERT', value: modelStats.mbert ? Math.round(modelStats.mbert.avg_confidence * 100) : 0, color: 'var(--color-info)' },
    { name: 'CNN', value: modelStats.cnn ? Math.round(modelStats.cnn.avg_confidence * 100) : 0, color: 'var(--color-warning)' },
  ];

  const langDistribution = languageStats.length > 0 
    ? languageStats.map(l => ({ label: l.language, value: l.percentage, color: 'var(--color-primary)' }))
    : [
        { label: 'English', value: 62, color: 'var(--color-primary)' },
        { label: 'Spanish', value: 18, color: 'var(--color-primary)' },
        { label: 'German', value: 10, color: 'var(--color-primary)' },
        { label: 'French', value: 6, color: 'var(--color-primary)' },
        { label: 'Other', value: 4, color: 'var(--color-primary)' },
      ];

  return (
    <div className="animate-fade-in max-w-5xl mx-auto space-y-6">
      {/* Stats Grid */}
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-4">
        <StatCard label="Total Analyses" value={hasData ? total.toString() : "0"} change="+12% from last week" isUp={true} />
        <StatCard label="Toxic Detected" value={hasData ? toxicCount.toString() : "0"} change="+5% from last week" isUp={false} />
        <StatCard label="Safe Comments" value={hasData ? safeCount.toString() : "0"} change="+18% from last week" isUp={true} />
        <StatCard label="Avg Confidence" value={hasData ? `${avgConfidence}%` : "0%"} change="+2.1% from last week" isUp={true} />
      </div>

      {/* Model Performance */}
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 pt-6 pb-3 flex items-center justify-between">
          <div className="text-sm font-semibold tracking-tight">Model Performance</div>
          {modelStats.svm && (
            <div className="text-xs text-muted-foreground">
              SVM: {modelStats.svm.count} | mBERT: {modelStats.mbert?.count || 0} | CNN: {modelStats.cnn?.count || 0}
            </div>
          )}
        </div>
        <div className="px-6 pb-6">
          {modelPerformance.map(m => (
            <ChartBar key={m.name} label={m.name} value={m.value} color={m.color} />
          ))}
        </div>
      </div>

      {/* Language Distribution */}
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 pt-6 pb-3">
          <div className="text-sm font-semibold tracking-tight">Language Distribution</div>
        </div>
        <div className="px-6 pb-6">
          {langDistribution.map(l => (
            <ChartBar key={l.label} label={l.label} value={l.value} color={l.color} />
          ))}
        </div>
      </div>

      {/* Recent Activity - Paginated */}
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 pt-6 pb-3 flex items-center justify-between">
          <div className="text-sm font-semibold tracking-tight">Recent Activity</div>
          <div className="text-xs text-muted-foreground">
            {total > 0 ? `${offset + 1}-${Math.min(offset + PAGE_SIZE, total)} of ${total}` : 'No data'}
          </div>
        </div>
        
        {error && (
          <div className="px-6 pb-2">
            <div className="rounded-md p-3 text-sm" style={{ backgroundColor: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }}>
              {error}
            </div>
          </div>
        )}
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground border-b border-border">Model</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground border-b border-border">Result</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground border-b border-border">Confidence</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground border-b border-border">Lang</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground border-b border-border">Time</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-sm text-muted-foreground">Loading...</td>
                </tr>
              ) : recent.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-sm text-muted-foreground">
                    No predictions yet — start analyzing!
                  </td>
                </tr>
              ) : (
                recent.map((item) => (
                  <tr key={item.id} className="hover:bg-accent/50 transition-colors">
                    <td className="px-4 py-3.5 text-sm border-b border-border font-medium">
                      {item.model_used.toUpperCase()}
                    </td>
                    <td className="px-4 py-3.5 border-b border-border">
                      <Tag variant={item.label === 1 ? 'destructive' : 'success'}>
                        {item.label === 1 ? 'Toxic' : 'Safe'}
                      </Tag>
                    </td>
                    <td className="px-4 py-3.5 text-sm border-b border-border">
                      {Math.round(item.confidence * 100)}%
                    </td>
                    <td className="px-4 py-3.5 text-sm border-b border-border uppercase">
                      {item.language}
                    </td>
                    <td className="px-4 py-3.5 text-sm text-muted-foreground border-b border-border">
                      {formatTime(item.created_at)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="px-6 py-4 border-t border-border flex items-center justify-between">
          <button
            onClick={() => loadPage(offset - PAGE_SIZE)}
            disabled={!hasPrev || loading}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>
          
          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>
          
          <button
            onClick={() => loadPage(offset + PAGE_SIZE)}
            disabled={!hasNext || loading}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}