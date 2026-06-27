import { useState, useCallback } from 'react';
import { Sparkles, CheckCircle, AlertTriangle } from 'lucide-react';
import type { Analysis, ModelType } from '../types';
import { useToxicity } from '../hooks/useToxicity';
import { ResultCard } from '../components/ResultCard';
import { AnalyzingOverlay } from '../components/AnalyzingOverlay';
import { predict } from '../api/clients';


const SAMPLES = {
  safe1: "This tutorial really helped me understand the concept, thanks for sharing!",
  safe2: "I disagree with your take, but I appreciate the thoughtful write-up.",
  safe3: "¡Excelente trabajo, sigue así!",
  toxic1: "You are such an idiot, nobody cares about your stupid opinion.",
  toxic2: "Shut up loser, this is garbage content from a worthless creator.",
  toxic3: "Eres un tonto, deja de publicar basura aquí.",
};

export function AnalyzePage() {
  const [comment, setComment] = useState('');
  const [model, setModel] = useState<ModelType>('mbert');
  const [source, setSource] = useState('');
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { analyzeComment } = useToxicity();

  const charCount = comment.length;

  // Inside component:
  const [error, setError] = useState('');

  const handleAnalyze = useCallback(async () => {
    const text = comment.trim();
    if (!text) return;
    setIsAnalyzing(true);
    setError('');
    try {
      const result = await predict({
        text,
        model: model === 'mbert' ? 'auto' : model,
        source: source || 'web',
        return_probs: false,
      });

      const analysis: Analysis = {
        id: Date.now(),
        text,
        model: result.model_used.toLowerCase() as ModelType,
        source: source || 'web',
        isToxic: result.toxic,
        score: Math.round(result.confidence * 100),
        confidence: Math.round(result.confidence * 100),
        timestamp: new Date(),
      };

      setAnalyses(prev => [analysis, ...prev].slice(0, 20));
      setComment('');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsAnalyzing(false);
    }
  }, [comment, model, source]);

  const handleSetSample = useCallback((id: keyof typeof SAMPLES) => {
    setComment(SAMPLES[id]);
  }, []);

  return (
    <div className="animate-fade-in">
      <div className="max-w-5xl mx-auto grid gap-6 lg:grid-cols-[3fr_2fr]">
        <div className="space-y-6">
          {/* Analysis Card */}
          <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 pt-6 pb-3">
              <div className="flex items-center gap-2 text-base font-semibold tracking-tight">
                <Sparkles className="w-4 h-4 text-primary" />
                New analysis
              </div>
            </div>
            {error && (
              <div className="rounded-md p-3 text-sm" style={{ backgroundColor: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }}>
                {error}
              </div>
            )}
            <div className="px-6 pb-6 space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium" htmlFor="comment">Comment</label>
                <textarea
                  id="comment"
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  placeholder="Paste any comment in any language…"
                  className="w-full min-h-[140px] resize-none rounded-md border border-input bg-transparent px-3 py-2 text-sm text-foreground font-inherit focus:outline-none focus:border-ring focus:ring-1 focus:ring-ring"
                />
                <div className="flex justify-between text-[0.6875rem] text-muted-foreground">
                  <span>{charCount} {charCount === 1 ? 'character' : 'characters'}</span>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium">Model</label>
                  <select
                    value={model}
                    onChange={e => setModel(e.target.value as ModelType)}
                    className="w-full h-9 rounded-md border border-input bg-transparent px-3 text-sm font-inherit cursor-pointer appearance-none bg-no-repeat bg-[right_0.5rem_center] bg-[length:1rem] pr-8"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23737373' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`
                    }}
                  >
                    <option value="svm">SVM (Fast)</option>
                    <option value="mbert">mBERT (Balanced)</option>
                    <option value="cnn">CNN (Deep)</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium" htmlFor="source">Source (optional)</label>
                  <input
                    id="source"
                    value={source}
                    onChange={e => setSource(e.target.value)}
                    placeholder="reddit, discord, youtube…"
                    className="w-full h-9 rounded-md border border-input bg-transparent px-3 text-sm font-inherit focus:outline-none focus:border-ring focus:ring-1 focus:ring-ring"
                  />
                </div>
              </div>

              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing || !comment.trim()}
                className="inline-flex items-center justify-center gap-2 h-10 px-8 rounded-md text-sm font-medium cursor-pointer transition-opacity duration-150 border-none font-inherit w-full bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Sparkles className="w-4 h-4" />
                Analyze
              </button>
            </div>
          </div>

          {/* Samples Card */}
          <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 pt-6 pb-3">
              <div className="text-sm font-semibold tracking-tight">Try a sample</div>
            </div>
            <div className="px-6 pb-6">
              <div className="grid gap-3 sm:grid-cols-2">
                {Object.entries(SAMPLES).map(([id, text]) => {
                  const isSafe = id.startsWith('safe');
                  return (
                    <button
                      key={id}
                      onClick={() => handleSetSample(id as keyof typeof SAMPLES)}
                      className={`rounded-lg border p-3 text-left cursor-pointer transition-all duration-150 bg-transparent font-inherit text-inherit w-full hover:scale-[1.01] hover:shadow-sm ${isSafe
                          ? 'border-success/30 bg-success/[0.05]'
                          : 'border-destructive/30 bg-destructive/[0.05]'
                        }`}
                    >
                      <div className={`flex items-center gap-1.5 text-[0.625rem] font-semibold uppercase tracking-wider mb-1.5 ${isSafe ? 'text-success' : 'text-destructive'
                        }`}>
                        {isSafe ? <CheckCircle className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                        {isSafe ? 'Safe example' : 'Toxic example'}
                      </div>
                      <p className="text-sm text-foreground/80 line-clamp-3 leading-relaxed">{text}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:sticky lg:top-20 self-start">
          <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 pt-6 pb-3">
              <div className="text-sm font-semibold tracking-tight">Recent analyses</div>
            </div>
            <div className="px-6 pb-6">
              <div className="max-h-[600px] overflow-y-auto pr-1">
                {analyses.length === 0 ? (
                  <p className="text-center py-8 text-sm text-muted-foreground">
                    No analyses yet — start above.
                  </p>
                ) : (
                  analyses.map(a => <ResultCard key={a.id} analysis={a} />)
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <AnalyzingOverlay isActive={isAnalyzing} />
    </div>
  );
}
