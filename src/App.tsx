import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store, useAppSelector, useAppDispatch } from './store';
import { clearToast } from './store/uiSlice';
import { fetchDashboardMetrics, fetchInvestigations } from './store/investigationSlice';
import { Sidebar } from './components/layout/Sidebar';
import { TopNav } from './components/layout/TopNav';
import { NotificationsDrawer } from './components/common/NotificationsDrawer';

// Pages
import { DashboardPage } from './pages/DashboardPage';
import { NewInvestigationPage } from './pages/NewInvestigationPage';
import { RootCauseAnalysisPage } from './pages/RootCauseAnalysisPage';
import { EvidenceReviewPage } from './pages/EvidenceReviewPage';
import { CapaManagementPage } from './pages/CapaManagementPage';
import { InvestigationHistoryPage } from './pages/InvestigationHistoryPage';
import { AiAssistantPage } from './pages/AiAssistantPage';
import { SettingsPage } from './pages/SettingsPage';

import { CheckCircle2, AlertOctagon, Info, X } from 'lucide-react';

const MainLayout: React.FC = () => {
  const dispatch = useAppDispatch();
  const currentTab = useAppSelector(state => state.ui.currentTab);
  const toastMessage = useAppSelector(state => state.ui.toastMessage);

  useEffect(() => {
    dispatch(fetchDashboardMetrics());
    dispatch(fetchInvestigations());
  }, [dispatch]);

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        dispatch(clearToast());
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage, dispatch]);

  const renderCurrentPage = () => {
    switch (currentTab) {
      case 'dashboard':
        return <DashboardPage />;
      case 'new-investigation':
        return <NewInvestigationPage />;
      case 'ai-assistant':
        return <AiAssistantPage />;
      case 'root-cause-analysis':
        return <RootCauseAnalysisPage />;
      case 'evidence-review':
        return <EvidenceReviewPage />;
      case 'capa-management':
        return <CapaManagementPage />;
      case 'investigation-history':
        return <InvestigationHistoryPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 text-slate-900 font-sans">
      {/* Persistent Left Sidebar */}
      <Sidebar />

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Navigation */}
        <TopNav />

        {/* Dynamic Viewport */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden relative bg-slate-50/70">
          {renderCurrentPage()}
        </main>
      </div>

      {/* Slideout Notifications Drawer */}
      <NotificationsDrawer />

      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className={`px-4 py-3 rounded-xl shadow-lg border flex items-center gap-3 text-xs font-medium ${
            toastMessage.type === 'success' ? 'bg-slate-900 text-white border-slate-800' :
            toastMessage.type === 'error' ? 'bg-red-950 text-red-100 border-red-800' :
            'bg-slate-900 text-slate-100 border-slate-800'
          }`}>
            {toastMessage.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
            {toastMessage.type === 'error' && <AlertOctagon className="w-4 h-4 text-red-400 shrink-0" />}
            {toastMessage.type === 'info' && <Info className="w-4 h-4 text-blue-400 shrink-0" />}
            <span>{toastMessage.text}</span>
            <button
              onClick={() => dispatch(clearToast())}
              className="p-1 text-slate-400 hover:text-white rounded ml-2"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <Provider store={store}>
      <MainLayout />
    </Provider>
  );
}
