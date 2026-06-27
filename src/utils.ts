export function formatTime(date: Date): string {
  const diff = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  if (diff < 60) return 'Just now';
  if (diff < 3600) return Math.floor(diff / 60) + 'm ago';
  if (diff < 86400) return Math.floor(diff / 3600) + 'h ago';
  return Math.floor(diff / 86400) + 'd ago';
}

export function getModelName(m: string): string {
  const map: Record<string, string> = { svm: 'SVM', mbert: 'mBERT', cnn: 'CNN' };
  return map[m] || m;
}

export function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
