import { useRef, useState } from 'react';
import { Layers, Upload, FileText } from 'lucide-react';
import type { ModelType } from '../types';
import { getModelName } from '../utils';
import { Tag } from '../components/Tag';
import { predictBatch } from '../api/clients';

const selectBgStyle = {
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23737373' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 0.5rem center',
  backgroundSize: '1rem',
};

export function BatchPage() {
  const [model, setModel] = useState<ModelType>('mbert');
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState(0);
  const [total, setTotal] = useState(0);
  const [current, setCurrent] = useState(0);
  const [results, setResults] = useState<{ comment: string; isToxic: boolean; score: number; model: string }[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

 const handleFileChange = (input: React.ChangeEvent<HTMLInputElement>) => {
  const selected = input.currentTarget.files?.[0];
  if (selected) {
    setFile(selected);
    setError('');
  }
};

  const parseFile = async (f: File): Promise<string[]> => {
    const content = await f.text();
    if (f.name.endsWith('.json')) {
      const data = JSON.parse(content);
      return Array.isArray(data) ? data.map((item: { text?: string }) => item.text || '').filter(Boolean) : [];
    }
    return content.split('\n').map(line => line.split(',')[0]?.trim()).filter(Boolean);
  };

  const handleProcess = async () => {
    if (!file) return;
    setIsProcessing(true);
    setError('');
    setProgress(0);
    setCurrent(0);

    try {
      const texts = await parseFile(file);
      setTotal(texts.length);

      const progressInterval = setInterval(() => {
        setProgress(p => Math.min(p + 10, 90));
      }, 200);

      const response = await predictBatch({
        texts,
        model: model === 'mbert' ? 'auto' : model,
      });

      clearInterval(progressInterval);
      setProgress(100);
      setCurrent(response.total_processed);

      setResults(response.results.map((r, i) => ({
        comment: texts[i] || '',
        isToxic: r.toxic,
        score: Math.round(r.confidence * 100),
        model: r.model_used,
      })));
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="animate-fade-in max-w-5xl mx-auto space-y-6">
      {/* Upload Card */}
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 pt-6 pb-3">
          <div className="flex items-center gap-2 text-base font-semibold tracking-tight">
            <Layers className="w-4 h-4 text-primary" />
            Batch Analysis
          </div>
        </div>
        <div className="px-6 pb-6 space-y-4">
          {error && (
            <div className="rounded-md p-3 text-sm" style={{ backgroundColor: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }}>
              {error}
            </div>
          )}

          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-border rounded-xl p-10 text-center transition-all duration-150 cursor-pointer hover:border-primary hover:bg-accent"
          >
            <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <div className="text-sm font-medium mb-1">
              {file ? file.name : 'Upload a CSV or JSON file'}
            </div>
            <div className="text-xs text-muted-foreground">
              {file ? 'Click to change file' : 'Drag & drop or click to browse. Max 10MB.'}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept=".csv,.json"
              onChange={handleFileChange}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Model</label>
            <select
              value={model}
              onChange={e => setModel(e.target.value as ModelType)}
              className="w-full h-9 rounded-md border border-input bg-transparent px-3 text-sm font-inherit cursor-pointer appearance-none pr-8 focus:outline-none focus:border-ring focus:ring-1 focus:ring-ring"
              style={selectBgStyle}
            >
              <option value="svm">SVM (Fast)</option>
              <option value="mbert">mBERT (Balanced)</option>
              <option value="cnn">CNN (Deep)</option>
            </select>
          </div>

          <button
            onClick={handleProcess}
            disabled={isProcessing || !file}
            className="inline-flex items-center justify-center gap-2 h-10 px-8 rounded-md text-sm font-medium cursor-pointer transition-opacity duration-150 border-none font-inherit w-full bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Layers className="w-4 h-4" />
            {isProcessing ? 'Processing...' : 'Analyze Batch'}
          </button>

          {isProcessing && (
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Processing...</span>
                <span className="text-sm text-muted-foreground">{current} / {total}</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-[width] duration-300 bg-primary"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {results.length > 0 && (
            <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden mt-4">
              <div className="px-6 pt-6 pb-3">
                <div className="text-sm font-semibold tracking-tight">Batch Results</div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground border-b border-border">Comment</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground border-b border-border">Result</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground border-b border-border">Score</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground border-b border-border">Model</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((r, i) => (
                      <tr key={i} className="hover:bg-accent/50 transition-colors">
                        <td className="px-4 py-3.5 text-sm border-b border-border">
                          {r.comment.length > 40 ? r.comment.substring(0, 40) + '...' : r.comment}
                        </td>
                        <td className="px-4 py-3.5 border-b border-border">
                          <Tag variant={r.isToxic ? 'destructive' : 'success'}>
                            {r.isToxic ? 'Toxic' : 'Safe'}
                          </Tag>
                        </td>
                        <td className="px-4 py-3.5 text-sm border-b border-border">{r.score}%</td>
                        <td className="px-4 py-3.5 text-sm border-b border-border">{getModelName(r.model)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Supported Formats */}
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 pt-6 pb-3">
          <div className="text-sm font-semibold tracking-tight">Supported Formats</div>
        </div>
        <div className="px-6 pb-6 space-y-3">
          <div className="flex items-center gap-3 p-3 rounded-lg border border-border">
            <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center text-success">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="font-medium text-sm">CSV</div>
              <div className="text-xs text-muted-foreground">One comment per row, first column</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg border border-border">
            <div className="w-10 h-10 rounded-lg bg-info/10 flex items-center justify-center text-info">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="font-medium text-sm">JSON</div>
              <div className="text-xs text-muted-foreground">Array of objects with "text" field</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}