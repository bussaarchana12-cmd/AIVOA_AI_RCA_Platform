import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { setCurrentTab, setUserRole, toggleNotifications, UserRole } from '../../store/uiSlice';
import {
  Search,
  Bell,
  ChevronRight,
  Shield,
  Calendar,
  Plus,
  Download,
  UserCheck,
  Check,
  Building2,
  X
} from 'lucide-react';

export const TopNav: React.FC = () => {
  const dispatch = useAppDispatch();
  const currentTab = useAppSelector(state => state.ui.currentTab);
  const userRole = useAppSelector(state => state.ui.userRole);
  const userName = useAppSelector(state => state.ui.userName);
  const notifications = useAppSelector(state => state.ui.notifications);
  const isNotificationsOpen = useAppSelector(state => state.ui.isNotificationsOpen);
  const currentInv = useAppSelector(state => state.investigations.currentInvestigation);

  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');

  const unreadCount = notifications.filter(n => !n.read).length;

  const tabLabels: Record<string, string> = {
    'dashboard': 'Executive Quality Dashboard',
    'new-investigation': 'AI Document & Incident Intake',
    'ai-assistant': 'Quality Intelligence Assistant',
    'root-cause-analysis': 'Root Cause Analysis (5-Whys & Fishbone)',
    'evidence-review': 'Evidence Dossier & Verification',
    'capa-management': 'CAPA Corrective & Preventive Actions',
    'investigation-history': 'Investigation History & Audit Trail',
    'settings': 'Quality System Settings & Models'
  };

  const roles: UserRole[] = [
    'Senior Quality Investigator',
    'QA Compliance Reviewer',
    'Regulatory GMP Auditor'
  ];

  return (
    <header className="h-16 bg-white border-b border-slate-200/90 flex items-center justify-between px-6 z-20 shrink-0">
      {/* Left: Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <div className="flex items-center gap-1.5 font-medium text-slate-700">
          <Building2 className="w-3.5 h-3.5 text-blue-600" />
          <span>API Facility 04</span>
        </div>
        <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
        <span className="text-slate-500 font-medium">Quality Systems</span>
        <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
        <span className="font-semibold text-slate-900">{tabLabels[currentTab] || 'Workspace'}</span>
      </div>

      {/* Middle: Live Search */}
      <div className="hidden md:flex items-center relative w-72">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={globalSearch}
          onChange={(e) => setGlobalSearch(e.target.value)}
          placeholder="Search batch, deviation, or API..."
          className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:bg-white transition-all"
        />
        {globalSearch && (
          <button onClick={() => setGlobalSearch('')} className="absolute right-2.5 text-slate-400 hover:text-slate-600">
            <X className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Right: Actions, Date, Role, Notifications */}
      <div className="flex items-center gap-3">
        {/* Date / Shift */}
        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 text-slate-600 text-xs bg-slate-100 rounded-md">
          <Calendar className="w-3.5 h-3.5 text-slate-500" />
          <span className="font-mono tabular-nums">2026-03-28</span>
          <span className="text-slate-300">|</span>
          <span className="text-[11px] font-medium text-slate-700">Shift A</span>
        </div>

        {/* Role Selector */}
        <div className="relative">
          <button
            onClick={() => setRoleMenuOpen(!roleMenuOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs text-slate-700 font-medium transition-colors"
          >
            <Shield className="w-3.5 h-3.5 text-blue-600" />
            <span className="truncate max-w-[130px] hidden sm:inline">{userRole}</span>
          </button>

          {roleMenuOpen && (
            <div className="absolute right-0 mt-1.5 w-60 bg-white rounded-lg shadow-lg border border-slate-200 py-1.5 z-50 text-xs animate-in fade-in slide-in-from-top-1">
              <div className="px-3 py-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                Switch GMP Role Context
              </div>
              {roles.map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    dispatch(setUserRole(r));
                    setRoleMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 flex items-center justify-between hover:bg-blue-50 text-slate-700 hover:text-blue-700 transition-colors"
                >
                  <span>{r}</span>
                  {userRole === r && <Check className="w-3.5 h-3.5 text-blue-600" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notifications Icon */}
        <button
          onClick={() => dispatch(toggleNotifications())}
          className="relative p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          title="Regulatory & CAPA Alerts"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-blue-600" />
          )}
        </button>

        {/* Download Project ZIP */}
        <a
          href="/api/download-project"
          download="AIVOA_AI_RCA_Platform.zip"
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap border border-slate-200"
          title="Download complete project in zip file"
        >
          <Download className="w-3.5 h-3.5 text-slate-600" />
          <span>Download ZIP</span>
        </a>

        {/* Primary CTA: New Investigation */}
        <button
          onClick={() => dispatch(setCurrentTab('new-investigation'))}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors whitespace-nowrap"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Investigation</span>
        </button>
      </div>
    </header>
  );
};
