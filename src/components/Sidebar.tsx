import { Shield, Sparkles, Layers, LayoutDashboard, MessageSquare } from 'lucide-react';
import type { Page } from '../types';

interface SidebarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const menuItems: { page: Page; label: string; icon: React.ReactNode }[] = [
  { page: 'analyze', label: 'Analyze', icon: <Sparkles className="w-4 h-4" /> },
  { page: 'batch', label: 'Batch', icon: <Layers className="w-4 h-4" /> },
  { page: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
  { page: 'feedback', label: 'Feedback', icon: <MessageSquare className="w-4 h-4" /> },
];

export function Sidebar({ currentPage, onNavigate, isOpen, onToggle }: SidebarProps) {
  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/40 z-[35] transition-opacity duration-200 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onToggle}
      />

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-sidebar-background border-r border-sidebar-border flex flex-col z-40 transition-transform duration-200 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-2 border-b border-sidebar-border">
          <div className="flex items-center gap-2.5 px-2 py-3">
            <div className="w-9 h-9 bg-primary text-primary-foreground rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-semibold">Toxicity Guard</div>
              <div className="text-[0.6875rem] text-muted-foreground">Multilingual NLP</div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          <div className="h-8 flex items-center px-2 text-xs font-medium text-sidebar-foreground/70">
            Workspace
          </div>
          <nav className="flex flex-col gap-1">
            {menuItems.map(item => (
              <button
                key={item.page}
                onClick={() => onNavigate(item.page)}
                className={`flex items-center gap-2 w-full px-2 py-2 rounded-md text-sm transition-all duration-150 cursor-pointer border-none bg-transparent font-inherit text-left ${
                  currentPage === item.page
                    ? 'bg-sidebar-accent font-medium'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
}
