import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import { setCurrentTab } from '../store/uiSlice';
import { setCurrentInvestigation, fetchDashboardMetrics, fetchInvestigations } from '../store/investigationSlice';
import { Investigation } from '../types';
import {
  ShieldAlert,
  FileText,
  AlertTriangle,
  Clock,
  CheckCircle2,
  TrendingUp,
  ArrowRight,
  Plus,
  Upload,
  ArrowUpRight,
  Activity,
  FileSpreadsheet,
  AlertOctagon,
  RefreshCw,
  Sparkles,
  Download,
  Info
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const investigations = useAppSelector(state => state.investigations.investigations);
  const metrics = useAppSelector(state => state.investigations.metrics);
  const currentInv = useAppSelector(state => state.investigations.currentInvestigation);
  const capaList = useAppSelector(state => state.capa.capaList);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    dispatch(fetchDashboardMetrics());
    dispatch(fetchInvestigations());
  }, [dispatch]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([
      dispatch(fetchDashboardMetrics()),
      dispatch(fetchInvestigations())
    ]);
    setTimeout(() => setRefreshing(false), 500);
  };

  // Calculations from data
  const total = investigations.length;
  const openCount = investigations.filter(i => i.status === 'Open' || i.status === 'In Progress').length;
  const reviewCount = investigations.filter(i => i.status === 'Under Review' || i.status === 'CAPA Execution').length;
  const completedCount = investigations.filter(i => i.status === 'Completed' || i.status === 'Closed').length;

  const pendingCapa = capaList.filter(c => c.currentStatus !== 'Completed' && c.currentStatus !== 'Closed').length;
  const overdueCapa = capaList.filter(c => {
    if (c.currentStatus === 'Completed' || c.currentStatus === 'Closed') return false;
    return new Date(c.targetCompletionDate) < new Date();
  }).length;

  // Monthly trends data
  const monthlyTrends = [
    { month: 'Oct 25', deviations: 4, capas: 3 },
    { month: 'Nov 25', deviations: 6, capas: 5 },
    { month: 'Dec 25', deviations: 3, capas: 4 },
    { month: 'Jan 26', deviations: 5, capas: 6 },
    { month: 'Feb 26', deviations: 4, capas: 4 },
    { month: 'Mar 26', deviations: total, capas: capaList.filter(c => c.currentStatus === 'Completed').length || 2 },
  ];

  const handleSelectInvestigation = (inv: Investigation) => {
    dispatch(setCurrentInvestigation(inv));
    dispatch(setCurrentTab('root-cause-analysis'));
  };

  return (
    <div className="p-8 space-y-8 max-w-[1500px] mx-auto animate-in fade-in duration-150">
      {/* Top Banner / Headline */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Quality Intelligence & Investigation Dashboard
            </h1>
            <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
              Demonstration & Validation Dataset
            </span>
          </div>
          <p className="text-xs text-slate-500 max-w-2xl">
            Real-time GMP non-conformance tracking, LangGraph-driven Root Cause Analysis, and CAPA effectiveness for Active Pharmaceutical Ingredient operations.
          </p>
        </div>

        {/* Action Toolbar */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-blue-600' : ''}`} />
            <span>Sync Records</span>
          </button>

          <a
            href="/api/download-project"
            download="AIVOA_AI_RCA_Platform.zip"
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 border border-slate-300 rounded-lg hover:bg-slate-200 transition-colors"
            title="Download full project repository in zip archive"
          >
            <Download className="w-3.5 h-3.5 text-slate-600" />
            <span>Download Project ZIP</span>
          </a>

          <button
            onClick={() => dispatch(setCurrentTab('new-investigation'))}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create New Investigation</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Total */}
        <div className="p-4 bg-white rounded-xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span className="font-medium text-slate-600">Total Deviations</span>
            <FileText className="w-4 h-4 text-slate-400" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">{total}</div>
            <div className="text-[11px] text-slate-400 mt-1">API Operations</div>
          </div>
        </div>

        {/* Open */}
        <div className="p-4 bg-white rounded-xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span className="font-medium text-blue-700">Open / Active</span>
            <Activity className="w-4 h-4 text-blue-500" />
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-700 font-mono tabular-nums">{openCount}</div>
            <div className="text-[11px] text-slate-400 mt-1">Active investigations</div>
          </div>
        </div>

        {/* Under Review */}
        <div className="p-4 bg-white rounded-xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span className="font-medium text-amber-700">Under Review</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div>
            <div className="text-2xl font-bold text-amber-700 font-mono tabular-nums">{reviewCount}</div>
            <div className="text-[11px] text-slate-400 mt-1">QA Unit evaluation</div>
          </div>
        </div>

        {/* Completed */}
        <div className="p-4 bg-white rounded-xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span className="font-medium text-emerald-700">Closed / Verified</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div>
            <div className="text-2xl font-bold text-emerald-700 font-mono tabular-nums">{completedCount}</div>
            <div className="text-[11px] text-slate-400 mt-1">RCA finalized</div>
          </div>
        </div>

        {/* Pending CAPA */}
        <div className="p-4 bg-white rounded-xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span className="font-medium text-slate-700">Pending CAPAs</span>
            <ShieldAlert className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">{pendingCapa}</div>
            <div className="text-[11px] text-slate-400 mt-1">Actions in progress</div>
          </div>
        </div>

        {/* Overdue CAPA */}
        <div className="p-4 bg-white rounded-xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span className="font-medium text-red-700">Overdue Actions</span>
            <AlertOctagon className="w-4 h-4 text-red-500" />
          </div>
          <div>
            <div className="text-2xl font-bold text-red-700 font-mono tabular-nums">{overdueCapa}</div>
            <div className="text-[11px] text-slate-400 mt-1">Requires QA escalation</div>
          </div>
        </div>
      </div>

      {/* Charts & Analytical Breakdown Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Investigation & CAPA Trends Chart */}
        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Monthly Deviation & CAPA Trends</h2>
              <p className="text-[11px] text-slate-500">Trailing 6-month GMP volume comparison</p>
            </div>
            <span className="text-[11px] font-mono text-slate-400">ICH Q10 Metric</span>
          </div>

          {/* Visual Bar Chart */}
          <div className="space-y-3 my-2">
            {monthlyTrends.map((t, idx) => {
              const maxVal = 8;
              const devPct = Math.min(100, Math.round((t.deviations / maxVal) * 100));
              const capaPct = Math.min(100, Math.round((t.capas / maxVal) * 100));

              return (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-mono text-slate-600 font-medium w-16">{t.month}</span>
                    <div className="flex items-center gap-3 text-slate-500 text-[10px]">
                      <span>Deviations: <strong className="text-slate-800 font-mono">{t.deviations}</strong></span>
                      <span>CAPA Closed: <strong className="text-emerald-700 font-mono">{t.capas}</strong></span>
                    </div>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden flex gap-0.5">
                    <div
                      style={{ width: `${devPct * 0.6}%` }}
                      className="h-full bg-blue-600 rounded-full transition-all"
                      title={`Deviations: ${t.deviations}`}
                    />
                    <div
                      style={{ width: `${capaPct * 0.4}%` }}
                      className="h-full bg-emerald-500 rounded-full transition-all"
                      title={`CAPA Completed: ${t.capas}`}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-[11px] text-slate-500">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-sm bg-blue-600" />
              <span>Deviations Logged</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" />
              <span>CAPAs Completed</span>
            </div>
          </div>
        </div>

        {/* Severity Distribution & Critical Risk Gauge */}
        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Deviation Severity Breakdown</h2>
              <p className="text-[11px] text-slate-500">Risk classification per ICH Q9</p>
            </div>
            <span className="text-xs font-mono text-slate-600">Active Register</span>
          </div>

          <div className="space-y-3.5 my-2">
            {/* Critical */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-medium text-slate-700 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-600" />
                  Critical (Direct Quality Risk)
                </span>
                <span className="font-mono text-slate-900 font-bold">1</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-red-600 rounded-full" style={{ width: '25%' }} />
              </div>
            </div>

            {/* Major */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-medium text-slate-700 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  Major (Specification / Yield Impact)
                </span>
                <span className="font-mono text-slate-900 font-bold">2</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: '50%' }} />
              </div>
            </div>

            {/* Moderate */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-medium text-slate-700 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  Moderate (Equipment / Process Drift)
                </span>
                <span className="font-mono text-slate-900 font-bold">1</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: '25%' }} />
              </div>
            </div>

            {/* Minor */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-medium text-slate-700 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-slate-400" />
                  Minor (Transient / Handled)
                </span>
                <span className="font-mono text-slate-900 font-bold">1</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-slate-400 rounded-full" style={{ width: '25%' }} />
              </div>
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200/80 text-[11px] text-amber-900 flex items-start gap-2">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
            <span>1 Critical deviation currently requires immediate sterile filter integrity confirmation.</span>
          </div>
        </div>

        {/* CAPA Progress & Health */}
        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900">CAPA Implementation Health</h2>
              <p className="text-[11px] text-slate-500">Corrective vs. Preventive Execution</p>
            </div>
            <span className="text-[10px] font-mono bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded">
              75% ON TRACK
            </span>
          </div>

          {/* Progress Breakdown */}
          <div className="space-y-4 my-2">
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-medium text-slate-700">Corrective Actions (Remedial)</span>
                <span className="font-mono text-slate-600 text-[11px]">2 of 2 in execution</span>
              </div>
              <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 rounded-full" style={{ width: '60%' }} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-medium text-slate-700">Preventive Actions (Systemic)</span>
                <span className="font-mono text-slate-600 text-[11px]">2 proposed & under review</span>
              </div>
              <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-teal-500 rounded-full" style={{ width: '40%' }} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-medium text-slate-700">Effectiveness Verification</span>
                <span className="font-mono text-slate-600 text-[11px]">1 batch monitoring complete</span>
              </div>
              <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '33%' }} />
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500">Active CAPA items</span>
            <button
              onClick={() => dispatch(setCurrentTab('capa-management'))}
              className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
            >
              <span>Manage Actions</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Action Cards Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          onClick={() => dispatch(setCurrentTab('new-investigation'))}
          className="p-4 bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-xl cursor-pointer hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 rounded-lg bg-blue-800/80 text-blue-200">
              <Sparkles className="w-4 h-4 text-teal-300" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-blue-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
          <h3 className="text-sm font-bold mb-1">AI Document & Incident Intake</h3>
          <p className="text-xs text-blue-200/80">
            Upload PDF deviation reports or paste text to trigger the 9-node LangGraph RCA pipeline.
          </p>
        </div>

        <div
          onClick={() => dispatch(setCurrentTab('root-cause-analysis'))}
          className="p-4 bg-white border border-slate-200 hover:border-blue-400 rounded-xl cursor-pointer hover:shadow-xs transition-all group"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 rounded-lg bg-slate-100 text-blue-600">
              <Activity className="w-4 h-4" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 mb-1">Explore Root Cause Analysis</h3>
          <p className="text-xs text-slate-500">
            Interact with the active 5-Whys causal ladder and the 6M Ishikawa Fishbone diagram.
          </p>
        </div>

        <div
          onClick={() => dispatch(setCurrentTab('evidence-review'))}
          className="p-4 bg-white border border-slate-200 hover:border-blue-400 rounded-xl cursor-pointer hover:shadow-xs transition-all group"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 rounded-lg bg-slate-100 text-teal-600">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600 transition-colors" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 mb-1">Review Evidence Dossier</h3>
          <p className="text-xs text-slate-500">
            Audit Certificates of Analysis, SCADA automation logs, and check evidence completeness.
          </p>
        </div>
      </div>

      {/* Recent Investigations Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Recent Investigations & Deviations</h2>
            <p className="text-xs text-slate-500">Click any row to load into the RCA workspace</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => dispatch(setCurrentTab('investigation-history'))}
              className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1"
            >
              <span>View All Records</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 font-medium">Investigation ID</th>
                <th className="py-3 px-4 font-medium">Product / API Name</th>
                <th className="py-3 px-4 font-medium">Batch Number</th>
                <th className="py-3 px-4 font-medium">Manufacturing Stage</th>
                <th className="py-3 px-4 font-medium">Severity</th>
                <th className="py-3 px-4 font-medium">Assigned Investigator</th>
                <th className="py-3 px-4 font-medium">Status</th>
                <th className="py-3 px-4 font-medium">Last Updated</th>
                <th className="py-3 px-4 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {investigations.map((inv) => {
                const isSelected = currentInv?.id === inv.id;

                const severityStyle =
                  inv.severity === 'Critical' ? 'text-red-700 bg-red-50 border-red-200' :
                  inv.severity === 'Major' ? 'text-amber-700 bg-amber-50 border-amber-200' :
                  inv.severity === 'Moderate' ? 'text-blue-700 bg-blue-50 border-blue-200' :
                  'text-slate-600 bg-slate-100 border-slate-200';

                const statusStyle =
                  inv.status === 'Under Review' ? 'text-amber-700 bg-amber-50' :
                  inv.status === 'In Progress' ? 'text-blue-700 bg-blue-50' :
                  inv.status === 'CAPA Execution' ? 'text-purple-700 bg-purple-50' :
                  'text-emerald-700 bg-emerald-50';

                return (
                  <tr
                    key={inv.id}
                    onClick={() => handleSelectInvestigation(inv)}
                    className={`hover:bg-slate-50/80 cursor-pointer transition-colors ${
                      isSelected ? 'bg-blue-50/40' : ''
                    }`}
                  >
                    <td className="py-3 px-4 font-mono font-semibold text-blue-600">
                      {inv.id}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{inv.productName.split('(')[0]}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{inv.deviationRef}</div>
                    </td>
                    <td className="py-3 px-4 font-mono font-medium text-slate-700">
                      {inv.batchNumber}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {inv.manufacturingStage}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex px-2 py-0.5 rounded text-[11px] font-medium border ${severityStyle}`}>
                        {inv.severity}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-700">
                      {inv.assignedInvestigator}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex px-2 py-0.5 rounded text-[11px] font-semibold ${statusStyle}`}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-500 tabular-nums">
                      {inv.lastUpdated}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectInvestigation(inv);
                        }}
                        className="px-2.5 py-1 text-[11px] font-medium text-blue-600 hover:text-white hover:bg-blue-600 rounded border border-blue-200 transition-colors"
                      >
                        Open RCA
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
