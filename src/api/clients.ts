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

export interface RecentPrediction {
  id: string;
  model_used: string;
  confidence: number;
  label: number;
  language: string;
  source: string;
  latency_ms: number;
  created_at: string;
}

export interface PaginatedPredictions {
  total: number;
  limit: number;
  offset: number;
  predictions: RecentPrediction[];
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

export interface ModelStatsResponse {
  period: string;
  models: Record<string, {
    count: number;
    avg_confidence: number;
  }>;
}

export interface LanguageStatsResponse {
  period: string;
  total: number;
  languages: {
    language: string;
    count: number;
    percentage: number;
  }[];
}

export async function getModelStats(days: number = 7): Promise<ModelStatsResponse> {
  const res = await fetch(`${API_BASE}/admin/model-stats?days=${days}`);
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err);
  }
  return res.json();
}

export async function getLanguageStats(days: number = 7): Promise<LanguageStatsResponse> {
  const res = await fetch(`${API_BASE}/admin/language-stats?days=${days}`);
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err);
  }
  return res.json();
}

export interface PaginatedPredictions {
  total: number;
  limit: number;
  offset: number;
  predictions: RecentPrediction[];
}

export async function getRecentPredictions(limit: number = 20, offset: number = 0): Promise<PaginatedPredictions> {
  const res = await fetch(`${API_BASE}/admin/recent?limit=${limit}&offset=${offset}`);
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err);
  }
  return res.json();
}

export interface GeneralFeedbackRequest {
  rating: number;
  type: string;
  text: string;
  email?: string;
}

export interface GeneralFeedbackResponse {
  status: string;
  id: number;
  received_at: string;
}

export async function submitGeneralFeedback(request: GeneralFeedbackRequest): Promise<GeneralFeedbackResponse> {
  const res = await fetch(`${API_BASE}/admin/general-feedback`, {
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