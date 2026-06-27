import { useState } from 'react';
import type { Page } from './types';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { AnalyzePage } from './pages/AnalyzePage';
import { BatchPage } from './pages/BatchPage';
import { DashboardPage } from './pages/DashboardPage';
import { FeedbackPage } from './pages/FeedbackPage';

const pages: Record<Page, React.ReactNode> = {
  analyze: <AnalyzePage />,
  batch: <BatchPage />,
  dashboard: <DashboardPage />,
  feedback: <FeedbackPage />,
};

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('analyze');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleNavigate = (page: Page) => {
    setCurrentPage(page);
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      <div className="flex-1 md:ml-64 flex flex-col min-w-0">
        <Header
          currentPage={currentPage}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />
        <main className="flex-1 p-4">
          {pages[currentPage]}
        </main>
      </div>
    </div>
  );
}
