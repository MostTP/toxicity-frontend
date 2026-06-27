export interface Analysis {
  id: number;
  text: string;
  model: string;
  source: string;
  isToxic: boolean;
  score: number;
  confidence: number;
  timestamp: Date;
}

export interface BatchResult {
  comment: string;
  isToxic: boolean;
  score: number;
  model: string;
}

export type Page = 'analyze' | 'batch' | 'dashboard' | 'feedback';
export type ModelType = 'svm' | 'mbert' | 'cnn';
