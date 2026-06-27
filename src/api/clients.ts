const API_BASE = import.meta.env.VITE_API_URL || '/api';

export interface PredictRequest {
  text: string;
  model?: string;
  source?: string;
  language?: string;
  thread_id?: string;
  return_probs?: boolean;
}

export interface PredictResponse {
  request_id: string;
  toxic: boolean;
  confidence: number;
  probabilities: Record<string, number>;
  model_used: string;
  inference_time_ms: number;
  threshold: number;
  language: string;
  cached: boolean;
}

export interface BatchPredictRequest {
  texts: string[];
  model?: string;
  source?: string;
  language?: string;
}

export interface BatchPredictResponse {
  results: PredictResponse[];
  total_processed: number;
  avg_latency_ms: number;
}

export async function predict(request: PredictRequest): Promise<PredictResponse> {
  const res = await fetch(`${API_BASE}/predict`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err);
  }
  return res.json();
}

export async function predictBatch(request: BatchPredictRequest): Promise<BatchPredictResponse> {
  const res = await fetch(`${API_BASE}/predict/batch`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err);
  }
  return res.json();
}