import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import type { Page } from './types';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { AnalyzePage } from './pages/AnalyzePage';
import { BatchPage } from './pages/BatchPage';
import { DashboardPage } from './pages/DashboardPage';
import { FeedbackPage } from './pages/FeedbackPage';
import { useState } from 'react';

const validPages: Page[] = ['analyze', 'batch', 'dashboard', 'feedback'];

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Derive current page from URL, default to 'analyze'
  const currentPage: Page = validPages.includes(location.pathname.slice(1) as Page)
    ? (location.pathname.slice(1) as Page)
    : 'analyze';

  const handleNavigate = (page: Page) => {
    navigate(`/${page}`);
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
          <Routes>
            <Route path="/" element={<AnalyzePage />} />
            <Route path="/analyze" element={<AnalyzePage />} />
            <Route path="/batch" element={<BatchPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/feedback" element={<FeedbackPage />} />
            <Route path="*" element={<AnalyzePage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}