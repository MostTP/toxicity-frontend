import { Shield, PanelLeft } from 'lucide-react';
import type { Page } from '../types';

interface HeaderProps {
  currentPage: Page;
  onToggleSidebar: () => void;
}

const pageTitles: Record<Page, string> = {
  analyze: 'Analyze Comment',
  batch: 'Batch Analysis',
  dashboard: 'Dashboard',
  feedback: 'Feedback',
};

export function Header({ currentPage, onToggleSidebar }: HeaderProps) {
  return (
    <header className="bg-blue-500 sticky top-0 z-30 h-14 flex items-center gap-3 border-b border-border/60 bg-white/70 backdrop-blur-xl px-4">
      <button
        onClick={onToggleSidebar}
        className="md:hidden w-7 h-7 flex items-center justify-center rounded-md border-none bg-transparent cursor-pointer hover:bg-accent"
        aria-label="Toggle Sidebar"
      >
        <PanelLeft className="w-4 h-4" />
      </button>
      <div className="w-px h-5 bg-border" />
      <Shield className="w-4 h-4 text-primary" />
      <h1 className="text-sm font-semibold tracking-tight">{pageTitles[currentPage]}</h1>
      <div className="ml-auto hidden md:flex items-center gap-1.5 rounded-full border border-success/30 bg-success/10 px-2.5 py-0.5 text-[0.6875rem] font-medium text-success">
        <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse-custom" />
        All models online
      </div>
    </header>
  );
}
