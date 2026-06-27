import { useCallback } from 'react';
import type { Analysis, ModelType } from '../types';
import { predict } from '../api/clients';

export function useToxicity() {
  const analyzeComment = useCallback(async (
    text: string,
    model: ModelType,
    source: string
  ): Promise<Analysis> => {
    const result = await predict({
      text,
      model: model === 'mbert' ? 'auto' : model,
      source: source || 'web',
      return_probs: false,
    });

    return {
      id: Date.now(),
      text,
      model: result.model_used.toLowerCase() as ModelType,
      source: source || 'web',
      isToxic: result.toxic,
      score: Math.round(result.confidence * 100),
      confidence: Math.round(result.confidence * 100),
      timestamp: new Date(),
    };
  }, []);

  return { analyzeComment };
}