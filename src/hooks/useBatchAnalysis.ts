import { useState, useCallback } from 'react';
import type { BatchResult, ModelType } from '../types';
import { predictBatch } from '../api/clients';

export function useBatchAnalysis() {
  const [progress, setProgress] = useState(0);
  const [total, setTotal] = useState(0);
  const [current, setCurrent] = useState(0);
  const [results, setResults] = useState<BatchResult[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const processBatch = useCallback(async (texts: string[], model: ModelType) => {
    setIsProcessing(true);
    setResults([]);
    setTotal(texts.length);
    setCurrent(0);
    setProgress(0);

    try {
      const response = await predictBatch({
        texts,
        model: model === 'mbert' ? 'auto' : model,
      });

      setResults(response.results.map((r, i) => ({
        comment: texts[i] || '',
        isToxic: r.toxic,
        score: Math.round(r.confidence * 100),
        model: r.model_used,
      })));

      setCurrent(response.total_processed);
      setProgress(100);
    } catch (err) {
      console.error('Batch failed:', err);
      alert('Batch analysis failed: ' + (err as Error).message);
    } finally {
      setIsProcessing(false);
    }
  }, []);

  return { progress, total, current, results, isProcessing, processBatch };
}