import { useState } from 'react';
import { MessageSquare, Send, Star } from 'lucide-react';

export function FeedbackPage() {
  const [rating, setRating] = useState(0);
  const [type, setType] = useState('general');
  const [text, setText] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = () => {
    if (!text.trim()) return;
    alert('Thank you for your feedback! We will review it shortly.');
    setText('');
    setEmail('');
    setRating(0);
  };

  return (
    <div className="animate-fade-in max-w-5xl mx-auto space-y-6">
      {/* Feedback Form */}
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 pt-6 pb-3">
          <div className="flex items-center gap-2 text-base font-semibold tracking-tight">
            <MessageSquare className="w-4 h-4 text-primary" />
            Send Feedback
          </div>
        </div>
        <div className="px-6 pb-6 space-y-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">How would you rate your experience?</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className="w-6 h-6 cursor-pointer border-none bg-transparent p-0"
                >
                  <Star
                    className={`w-6 h-6 transition-colors duration-150 ${
                      star <= rating ? 'text-warning fill-warning' : 'text-border'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium" htmlFor="feedbackType">Feedback Type</label>
            <select
              id="feedbackType"
              value={type}
              onChange={e => setType(e.target.value)}
              className="w-full h-9 rounded-md border border-input bg-transparent px-3 text-sm font-inherit cursor-pointer appearance-none bg-no-repeat bg-[right_0.5rem_center] bg-[length:1rem] pr-8"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23737373' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`
              }}
            >
              <option value="general">General Feedback</option>
              <option value="bug">Bug Report</option>
              <option value="feature">Feature Request</option>
              <option value="accuracy">Model Accuracy</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium" htmlFor="feedbackText">Your Feedback</label>
            <textarea
              id="feedbackText"
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="Tell us what you think..."
              className="w-full min-h-[100px] resize-none rounded-md border border-input bg-transparent px-3 py-2 text-sm text-foreground font-inherit focus:outline-none focus:border-ring focus:ring-1 focus:ring-ring"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium" htmlFor="feedbackEmail">Email (optional)</label>
            <input
              id="feedbackEmail"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full h-9 rounded-md border border-input bg-transparent px-3 text-sm font-inherit focus:outline-none focus:border-ring focus:ring-1 focus:ring-ring"
            />
          </div>

          <button
            onClick={handleSubmit}
            className="inline-flex items-center justify-center gap-2 h-10 px-8 rounded-md text-sm font-medium cursor-pointer transition-opacity duration-150 border-none font-inherit w-full bg-primary text-primary-foreground hover:opacity-90"
          >
            <Send className="w-4 h-4" />
            Send Feedback
          </button>
        </div>
      </div>

      {/* Community Stats */}
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 pt-6 pb-3">
          <div className="text-sm font-semibold tracking-tight">Community Stats</div>
        </div>
        <div className="px-6 pb-6">
          <div className="grid gap-4 grid-cols-3">
            <div className="rounded-xl border border-border bg-card p-4">
              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Feedback Sent</div>
              <div className="text-xl font-bold tracking-tight">48</div>
            </div>
            <div className="rounded-xl border border-border bg-card p-4">
              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Avg Rating</div>
              <div className="text-xl font-bold tracking-tight">4.6</div>
            </div>
            <div className="rounded-xl border border-border bg-card p-4">
              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Response Time</div>
              <div className="text-xl font-bold tracking-tight">&lt;24h</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
