import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import { setCurrentInvestigation } from '../store/investigationSlice';
import { setCurrentTab, showToast } from '../store/uiSlice';
import { Investigation, SeverityLevel, InvestigationStatus } from '../types';
import {
  History,
  Search,
  Filter,
  ArrowUpDown,
  FileText,
  Calendar,
  User,
  ArrowRight,
  ExternalLink,
  ShieldAlert,
  GitBranch,
  CheckCircle2,
  Clock,
  Layers,
  ChevronRight
} from 'lucide-react';

export const InvestigationHistoryPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const investigations = useAppSelector(state => state.investigations.investigations);
  const currentInv = useAppSelector(state => state.investigations.currentInvestigation);
  const capaList = useAppSelector(state => state.capa.capaList);

  const [search, setSearch] = useState('');
  const [productFilter, setProductFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [selectedRecordForDetail, setSelectedRecordForDetail] = useState<Investigation | null>(null);

  // Products list
  const products = Array.from(new Set(investigations.map(i => i.productName.split('(')[0].trim())));

  // Filtering
  const filteredList = investigations.filter(inv => {
    const matchesSearch = inv.id.toLowerCase().includes(search.toLowerCase()) ||
                          inv.batchNumber.toLowerCase().includes(search.toLowerCase()) ||
                          inv.deviationRef.toLowerCase().includes(search.toLowerCase()) ||
                          inv.productName.toLowerCase().includes(search.toLowerCase()) ||
                          inv.incidentDescription.toLowerCase().includes(search.toLowerCase());

    const matchesProduct = productFilter === 'all' || inv.productName.includes(productFilter);
    const matchesSeverity = severityFilter === 'all' || inv.severity === severityFilter;
    const matchesStatus = statusFilter === 'all' || inv.status === statusFilter;

    return matchesSearch && matchesProduct && matchesSeverity && matchesStatus;
  }).sort((a, b) => {
    const dateA = new Date(a.incidentDate).getTime();
    const dateB = new Date(b.incidentDate).getTime();
    return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
  });

  const handleOpenInvestigation = (inv: Investigation) => {
    dispatch(setCurrentInvestigation(inv));
    dispatch(showToast({ text: `Loaded ${inv.id} into active investigation workspace.`, type: 'info' }));
    dispatch(setCurrentTab('root-cause-analysis'));
  };

  return (
    <div className="p-8 space-y-8 max-w-[1500px] mx-auto animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Investigation History & Regulatory Register
            </h1>
            <span className="text-xs font-mono bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded">
              21 CFR Part 11 Audit Trail
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Archival records of active and historical pharmaceutical deviations, Five Whys causal outputs, and CAPA effectiveness reports.
          </p>
        </div>

        <button
          onClick={() => dispatch(setCurrentTab('new-investigation'))}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors shrink-0"
        >
          <span>Initiate New Investigation</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by ID, batch, deviation, or keyword..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:bg-white"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Product Filter */}
          <select
            value={productFilter}
            onChange={(e) => setProductFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-600"
          >
            <option value="all">All Products</option>
            {products.map(p => <option key={p} value={p}>{p}</option>)}
          </select>

          {/* Severity */}
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-600"
          >
            <option value="all">All Severities</option>
            <option value="Critical">Critical</option>
            <option value="Major">Major</option>
            <option value="Moderate">Moderate</option>
            <option value="Minor">Minor</option>
          </select>

          {/* Status */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-600"
          >
            <option value="all">All Statuses</option>
            <option value="Under Review">Under Review</option>
            <option value="In Progress">In Progress</option>
            <option value="CAPA Execution">CAPA Execution</option>
            <option value="Completed">Completed</option>
            <option value="Closed">Closed</option>
          </select>

          {/* Sort */}
          <button
            onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
            className="flex items-center gap-1 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-700 font-medium transition-colors"
          >
            <ArrowUpDown className="w-3 h-3 text-slate-500" />
            <span>Date: {sortOrder === 'desc' ? 'Newest First' : 'Oldest First'}</span>
          </button>
        </div>
      </div>

      {/* Grid of Investigation History Records */}
      <div className="space-y-4">
        {filteredList.map((inv) => {
          const isSelected = currentInv?.id === inv.id;
          const relatedCapas = capaList.filter(c => c.investigationId === inv.id);

          const severityClass =
            inv.severity === 'Critical' ? 'bg-red-50 text-red-700 border-red-200' :
            inv.severity === 'Major' ? 'bg-amber-50 text-amber-700 border-amber-200' :
            inv.severity === 'Moderate' ? 'bg-blue-50 text-blue-700 border-blue-200' :
            'bg-slate-100 text-slate-600 border-slate-200';

          const statusClass =
            inv.status === 'Closed' ? 'bg-emerald-50 text-emerald-700' :
            inv.status === 'Completed' ? 'bg-teal-50 text-teal-700' :
            inv.status === 'CAPA Execution' ? 'bg-purple-50 text-purple-700' :
            'bg-amber-50 text-amber-700';

          return (
            <div
              key={inv.id}
              className={`p-5 bg-white rounded-xl border shadow-xs transition-all space-y-4 ${
                isSelected ? 'border-blue-300 ring-2 ring-blue-500/10' : 'border-slate-200'
              }`}
            >
              {/* Header row */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-mono text-xs font-bold text-blue-600">{inv.id}</span>
                  <span className="font-mono text-xs text-slate-400 font-medium">{inv.deviationRef}</span>
                  <span className="font-bold text-xs text-slate-900">{inv.productName}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${severityClass}`}>
                    {inv.severity}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${statusClass}`}>
                    {inv.status}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenInvestigation(inv)}
                    className="px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors flex items-center gap-1"
                  >
                    <span>Open in RCA Workspace</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Description & parameters */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 text-xs">
                <div className="lg:col-span-8 space-y-2">
                  <p className="text-slate-700 leading-relaxed font-normal">
                    {inv.incidentDescription}
                  </p>

                  <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100 text-[11px]">
                    <div>
                      <span className="text-slate-400 block font-mono">SPECIFICATION</span>
                      <span className="font-medium text-slate-800">{inv.expectedSpecification}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-mono">OBSERVATION</span>
                      <span className="font-medium text-slate-800">{inv.actualObservation}</span>
                    </div>
                  </div>
                </div>

                {/* Right Metadata */}
                <div className="lg:col-span-4 p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-2 text-[11px]">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Batch Number:</span>
                    <strong className="font-mono text-slate-800">{inv.batchNumber}</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Stage:</span>
                    <span className="font-medium text-slate-800">{inv.manufacturingStage}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Investigator:</span>
                    <span className="font-medium text-slate-800">{inv.assignedInvestigator}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Detected:</span>
                    <span className="font-mono text-slate-800">{inv.dateDetected}</span>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-slate-200">
                    <span className="text-slate-500">Linked CAPAs:</span>
                    <span className="font-mono font-bold text-blue-600">{relatedCapas.length} Actions</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
