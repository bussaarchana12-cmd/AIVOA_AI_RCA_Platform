import React from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { setCurrentTab, ActiveNavTab } from '../../store/uiSlice';
import {
  LayoutDashboard,
  FilePlus2,
  Bot,
  GitBranch,
  FileCheck2,
  ShieldAlert,
  History,
  Settings,
  Microscope,
  CheckCircle2,
  FileText
} from 'lucide-react';

interface NavItem {
  id: ActiveNavTab;
  label: string;
  icon: React.ElementType;
  badge?: string | number;
}

export const Sidebar: React.FC = () => {
  const dispatch = useAppDispatch();
  const currentTab = useAppSelector(state => state.ui.currentTab);
  const userRole = useAppSelector(state => state.ui.userRole);
  const pendingCapa = useAppSelector(state => state.capa.capaList.filter(c => c.currentStatus !== 'Completed' && c.currentStatus !== 'Closed').length);
  const currentInv = useAppSelector(state => state.investigations.currentInvestigation);

  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'new-investigation', label: 'New Investigation', icon: FilePlus2, badge: 'AI' },
    { id: 'ai-assistant', label: 'AI Investigation Assistant', icon: Bot },
    { id: 'root-cause-analysis', label: 'Root Cause Analysis', icon: GitBranch },
    { id: 'evidence-review', label: 'Evidence Review', icon: FileCheck2 },
    { id: 'capa-management', label: 'CAPA Management', icon: ShieldAlert, badge: pendingCapa > 0 ? pendingCapa : undefined },
    { id: 'investigation-history', label: 'Investigation History', icon: History },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-72 bg-slate-900 border-r border-slate-800 flex flex-col h-screen select-none shrink-0 text-slate-300">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-blue-700 via-blue-600 to-teal-400 flex items-center justify-center text-white shadow-md shadow-blue-900/30">
            <Microscope className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg text-white tracking-tight">AIVOA.AI</span>
              <span className="text-[10px] uppercase font-mono tracking-wider px-1.5 py-0.5 rounded bg-blue-900/50 text-blue-300 border border-blue-700/50">
                GMP v2.6
              </span>
            </div>
            <p className="text-[11px] text-slate-400 truncate max-w-[170px] mt-0.5">
              Quality Intelligence Platform
            </p>
          </div>
        </div>

        {/* Current Active Deviation Context */}
        {currentInv && (
          <div className="mt-4 p-2.5 rounded-md bg-slate-800/60 border border-slate-700/60">
            <div className="flex items-center justify-between text-[11px] mb-1">
              <span className="text-slate-400 font-mono">ACTIVE DEVIATION</span>
              <span className={`px-1.5 py-0.2 rounded text-[10px] font-semibold ${
                currentInv.severity === 'Critical' ? 'bg-red-950 text-red-300 border border-red-800' :
                currentInv.severity === 'Major' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                'bg-blue-950 text-blue-300 border border-blue-800'
              }`}>
                {currentInv.severity}
              </span>
            </div>
            <div className="text-xs font-semibold text-slate-200 truncate">{currentInv.batchNumber}</div>
            <div className="text-[11px] text-slate-400 truncate">{currentInv.productName.split('(')[0]}</div>
          </div>
        )}
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-400">
          Core Modules
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => dispatch(setCurrentTab(item.id))}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all group ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20 font-semibold'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/70'
              }`}
            >
              <div className="flex items-center gap-3 truncate">
                <Icon className={`w-4 h-4 shrink-0 transition-colors ${
                  isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
                }`} />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold tabular-nums shrink-0 ${
                  isActive
                    ? 'bg-blue-800 text-blue-100'
                    : 'bg-slate-800 text-slate-300 border border-slate-700'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Compliance Footer */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/40 text-[11px]">
        <div className="flex items-center gap-2 text-slate-400 mb-2">
          <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0" />
          <span className="font-semibold text-slate-300">ICH Q7 / Q9 / Q10</span>
        </div>
        <p className="text-[10px] text-slate-400 leading-relaxed">
          Human verification mandatory. AI outputs are advisory hypotheses.
        </p>
        <div className="mt-2.5 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-400 font-mono">
          <span>ROLE:</span>
          <span className="text-slate-300 truncate max-w-[160px]">{userRole}</span>
        </div>
      </div>
    </aside>
  );
};
