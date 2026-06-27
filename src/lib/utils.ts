import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

export function formatTime(date: Date): string {
  const diff = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export function getModelName(model: string): string {
  const names: Record<string, string> = {
    svm: 'SVM',
    mbert: 'mBERT',
    cnn: 'CNN',
  };
  return names[model] || model;
}

export function detectToxicity(text: string): number {
  const toxicWords = [
    'idiot', 'stupid', 'loser', 'garbage', 'worthless', 'shut up',
    'tonto', 'basura', 'hate', 'kill', 'die', 'moron', 'dumb',
    'trash', 'worst', 'terrible', 'pathetic', 'useless', 'disgusting',
    'horrible', 'crap', 'suck', 'damn', 'hell',
  ];
  let score = 0;
  const lower = text.toLowerCase();
  toxicWords.forEach((w) => {
    if (lower.includes(w)) score += 0.25;
  });
  const excl = (text.match(/!/g) || []).length;
  const caps = text.replace(/[^a-zA-Z]/g, '');
  const capsRatio = caps.length ? (caps.match(/[A-Z]/g) || []).length / caps.length : 0;
  if (excl > 2) score += 0.1;
  if (capsRatio > 0.5) score += 0.1;
  return Math.min(score, 0.99);
}
