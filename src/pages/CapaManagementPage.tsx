import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import {
  addCapa,
  updateCapaStatus,
  updateCapaField,
  setFilterTab,
  setCapaFilterStatus,
  setCapaFilterPriority,
  setCapaSearchQuery
} from '../store/capaSlice';
import { showToast } from '../store/uiSlice';
import { CapaAction, CapaStatus, CapaCategory, PriorityLevel } from '../types';
import {
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Search,
  Filter,
  Calendar,
  Clock,
  User,
  ArrowRight,
  FileCheck,
  AlertOctagon,
  ShieldCheck,
  Edit2,
  X,
  ExternalLink
} from 'lucide-react';

export const CapaManagementPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const capaList = useAppSelector(state => state.capa.capaList);
  const filterTab = useAppSelector(state => state.capa.filterTab);
  const filterStatus = useAppSelector(state => state.capa.filterStatus);
  const filterPriority = useAppSelector(state => state.capa.filterPriority);
  const searchQuery = useAppSelector(state => state.capa.searchQuery);
  const currentInv = useAppSelector(state => state.investigations.currentInvestigation);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedCapaForEdit, setSelectedCapaForEdit] = useState<CapaAction | null>(null);

  // New CAPA Form State
  const [newCategory, setNewCategory] = useState<CapaCategory>('Corrective Action');
  const [newDescription, setNewDescription] = useState('');
  const [newJustification, setNewJustification] = useState('');
  const [newResponsible, setNewResponsible] = useState('Engineering Maintenance Lead');
  const [newPriority, setNewPriority] = useState<PriorityLevel>('High');
  const [newTargetDate, setNewTargetDate] = useState('2026-04-20');
  const [newVerification, setNewVerification] = useState('');
  const [newEffectiveness, setNewEffectiveness] = useState('');

  const statusOptions: CapaStatus[] = [
    'Proposed',
    'Under Review',
    'Approved',
    'In Progress',
    'Completed',
    'Effectiveness Verification',
    'Closed'
  ];

  // Filtering
  const filteredCapas = capaList.filter(item => {
    const matchesTab = filterTab === 'all' || item.actionCategory === filterTab;
    const matchesStatus = filterStatus === 'all' || item.currentStatus === filterStatus;
    const matchesPriority = filterPriority === 'all' || item.priority === filterPriority;
    const matchesSearch = item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.actionDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.responsiblePerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.investigationId.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesStatus && matchesPriority && matchesSearch;
  });

  const handleCreateCapa = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDescription.trim()) return;

    const newCapa: CapaAction = {
      id: `CAPA-2026-0${capaList.length + 1}`,
      investigationId: currentInv?.id || 'INV-2026-001',
      actionCategory: newCategory,
      actionDescription: newDescription,
      scientificJustification: newJustification || 'GMP requirement to eliminate deviation root cause.',
      responsiblePerson: newResponsible,
      priority: newPriority,
      targetCompletionDate: newTargetDate,
      currentStatus: 'Proposed',
      verificationMethod: newVerification || 'Post-implementation challenge test.',
      effectivenessCheck: newEffectiveness || 'Review subsequent 3 commercial batches.',
      completionDate: null
    };

    dispatch(addCapa(newCapa));
    setNewDescription('');
    setNewJustification('');
    setIsAddModalOpen(false);
    dispatch(showToast({ text: `CAPA ${newCapa.id} proposed successfully!`, type: 'success' }));
  };

  const handleStatusChange = (id: string, newStatus: CapaStatus) => {
    dispatch(updateCapaStatus({
      id,
      status: newStatus,
      completionDate: newStatus === 'Completed' || newStatus === 'Closed' ? new Date().toISOString().split('T')[0] : null
    }));
    dispatch(showToast({ text: `Updated ${id} to ${newStatus}`, type: 'info' }));
  };

  return (
    <div className="p-8 space-y-8 max-w-[1500px] mx-auto animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              CAPA Management Workspace
            </h1>
            <span className="text-xs font-mono bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded">
              Corrective & Preventive Action Register
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Define, approve, execute, and verify scientific effectiveness of remediation actions across API manufacturing.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Create New CAPA Action</span>
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <span className="text-slate-500 text-xs font-medium block mb-1">Total CAPA Actions</span>
          <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">{capaList.length}</div>
          <span className="text-[11px] text-slate-400">Active enterprise register</span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <span className="text-blue-700 text-xs font-medium block mb-1">Corrective Actions</span>
          <div className="text-2xl font-bold text-blue-700 font-mono tabular-nums">
            {capaList.filter(c => c.actionCategory === 'Corrective Action').length}
          </div>
          <span className="text-[11px] text-slate-400">Direct non-conformance fixes</span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <span className="text-teal-700 text-xs font-medium block mb-1">Preventive Actions</span>
          <div className="text-2xl font-bold text-teal-700 font-mono tabular-nums">
            {capaList.filter(c => c.actionCategory === 'Preventive Action').length}
          </div>
          <span className="text-[11px] text-slate-400">Systemic recurrence prevention</span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <span className="text-emerald-700 text-xs font-medium block mb-1">Effectiveness Verified</span>
          <div className="text-2xl font-bold text-emerald-700 font-mono tabular-nums">
            {capaList.filter(c => c.currentStatus === 'Closed' || c.currentStatus === 'Effectiveness Verification').length}
          </div>
          <span className="text-[11px] text-slate-400">Statistical 3-batch criteria met</span>
        </div>
      </div>

      {/* Tabs and Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        {/* Category Tabs: All vs Corrective vs Preventive */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg text-xs">
          <button
            onClick={() => dispatch(setFilterTab('all'))}
            className={`px-3 py-1.5 font-semibold rounded-md transition-colors ${
              filterTab === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All CAPAs ({capaList.length})
          </button>
          <button
            onClick={() => dispatch(setFilterTab('Corrective Action'))}
            className={`px-3 py-1.5 font-semibold rounded-md transition-colors ${
              filterTab === 'Corrective Action' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Corrective Actions
          </button>
          <button
            onClick={() => dispatch(setFilterTab('Preventive Action'))}
            className={`px-3 py-1.5 font-semibold rounded-md transition-colors ${
              filterTab === 'Preventive Action' ? 'bg-white text-teal-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Preventive Actions
          </button>
        </div>

        {/* Filter controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={filterStatus}
            onChange={(e) => dispatch(setCapaFilterStatus(e.target.value))}
            className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-600"
          >
            <option value="all">All Statuses</option>
            {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
          </select>

          <select
            value={filterPriority}
            onChange={(e) => dispatch(setCapaFilterPriority(e.target.value))}
            className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-600"
          >
            <option value="all">All Priorities</option>
            <option value="High">High Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="Low">Low Priority</option>
          </select>

          <div className="relative w-48">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => dispatch(setCapaSearchQuery(e.target.value))}
              placeholder="Search actions..."
              className="w-full pl-8 pr-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>
        </div>
      </div>

      {/* CAPA Action Cards & Details Table */}
      <div className="space-y-4">
        {filteredCapas.map((capa) => {
          const isOverdue = new Date(capa.targetCompletionDate) < new Date() && capa.currentStatus !== 'Completed' && capa.currentStatus !== 'Closed';
          const isCorrective = capa.actionCategory === 'Corrective Action';

          const statusColor =
            capa.currentStatus === 'Closed' ? 'text-emerald-700 bg-emerald-50 border-emerald-200' :
            capa.currentStatus === 'Completed' ? 'text-teal-700 bg-teal-50 border-teal-200' :
            capa.currentStatus === 'In Progress' ? 'text-blue-700 bg-blue-50 border-blue-200' :
            capa.currentStatus === 'Approved' ? 'text-indigo-700 bg-indigo-50 border-indigo-200' :
            'text-amber-700 bg-amber-50 border-amber-200';

          return (
            <div
              key={capa.id}
              className={`p-5 bg-white rounded-xl border shadow-xs transition-all space-y-4 ${
                isOverdue ? 'border-red-300 ring-2 ring-red-500/10' : 'border-slate-200'
              }`}
            >
              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-bold text-blue-600">{capa.id}</span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${
                    isCorrective ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-teal-50 text-teal-700 border border-teal-200'
                  }`}>
                    {capa.actionCategory}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">Ref: {capa.investigationId}</span>
                </div>

                <div className="flex items-center gap-3">
                  {isOverdue && (
                    <span className="text-[11px] font-semibold text-red-600 flex items-center gap-1 font-mono">
                      <AlertOctagon className="w-3.5 h-3.5" /> OVERDUE
                    </span>
                  )}

                  {/* Status Dropdown */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] text-slate-400 font-medium">Status:</span>
                    <select
                      value={capa.currentStatus}
                      onChange={(e) => handleStatusChange(capa.id, e.target.value as CapaStatus)}
                      className={`text-xs font-bold px-2.5 py-1 rounded-md border focus:outline-none ${statusColor}`}
                    >
                      {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>

                  <button
                    onClick={() => setSelectedCapaForEdit(capa)}
                    className="p-1 text-slate-400 hover:text-blue-600 transition-colors"
                    title="Edit Full CAPA Details"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Action Description */}
              <div>
                <h3 className="text-xs font-bold text-slate-900 mb-1 leading-snug">{capa.actionDescription}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  <strong className="text-slate-700">Scientific Justification:</strong> {capa.scientificJustification}
                </p>
              </div>

              {/* Verification & Effectiveness */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 space-y-1">
                  <span className="text-[11px] font-semibold text-slate-700 flex items-center gap-1.5">
                    <FileCheck className="w-3.5 h-3.5 text-blue-600" />
                    <span>Verification of Implementation Method:</span>
                  </span>
                  <p className="text-[11px] text-slate-600 leading-relaxed font-mono">
                    {capa.verificationMethod}
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 space-y-1">
                  <span className="text-[11px] font-semibold text-slate-700 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                    <span>Effectiveness Check & Metric (ICH Q10):</span>
                  </span>
                  <p className="text-[11px] text-slate-600 leading-relaxed font-mono">
                    {capa.effectivenessCheck}
                  </p>
                </div>
              </div>

              {/* Meta footer */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <strong className="text-slate-700 font-medium">{capa.responsiblePerson}</strong>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Target Date: <strong className="text-slate-700 font-mono">{capa.targetCompletionDate}</strong></span>
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    capa.priority === 'High' ? 'bg-red-50 text-red-700' :
                    capa.priority === 'Medium' ? 'bg-amber-50 text-amber-700' :
                    'bg-slate-100 text-slate-600'
                  }`}>
                    {capa.priority} Priority
                  </span>
                  {capa.completionDate && (
                    <span className="font-mono text-emerald-700 text-[11px]">
                      Completed: {capa.completionDate}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Create CAPA */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-blue-600" />
                <h3 className="font-bold text-xs text-slate-900">Create Remediation Action (CAPA)</h3>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCapa} className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-700 mb-1">Action Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as CapaCategory)}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                  >
                    <option value="Corrective Action">Corrective Action (Immediate Fix)</option>
                    <option value="Preventive Action">Preventive Action (Recurrence Barrier)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-700 mb-1">Priority</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as PriorityLevel)}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-700 mb-1">Action Description</label>
                <textarea
                  rows={2}
                  required
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Describe specific engineering overhaul, SOP change, or control modification..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-700 mb-1">Scientific Justification</label>
                <textarea
                  rows={2}
                  value={newJustification}
                  onChange={(e) => setNewJustification(e.target.value)}
                  placeholder="GMP rationale explaining why this eliminates the verified root cause..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-700 mb-1">Responsible Person / Lead</label>
                  <input
                    type="text"
                    value={newResponsible}
                    onChange={(e) => setNewResponsible(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-700 mb-1">Target Completion Date</label>
                  <input
                    type="date"
                    value={newTargetDate}
                    onChange={(e) => setNewTargetDate(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-700 mb-1">Implementation Verification Protocol</label>
                <input
                  type="text"
                  value={newVerification}
                  onChange={(e) => setNewVerification(e.target.value)}
                  placeholder="e.g. IQ/OQ protocol execution and 10-cycle stroke calibration verification"
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-700 mb-1">Effectiveness Check Criteria</label>
                <input
                  type="text"
                  value={newEffectiveness}
                  onChange={(e) => setNewEffectiveness(e.target.value)}
                  placeholder="e.g. Statistical SPC tracking across next 3 commercial API validation batches"
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-xs"
                >
                  Submit Proposed CAPA
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit CAPA Modal */}
      {selectedCapaForEdit && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-xs text-slate-900">Edit CAPA {selectedCapaForEdit.id}</h3>
              <button onClick={() => setSelectedCapaForEdit(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-medium text-slate-700 mb-1">Action Description</label>
                <textarea
                  rows={2}
                  value={selectedCapaForEdit.actionDescription}
                  onChange={(e) => setSelectedCapaForEdit({ ...selectedCapaForEdit, actionDescription: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md text-slate-800"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-700 mb-1">Scientific Justification</label>
                <textarea
                  rows={2}
                  value={selectedCapaForEdit.scientificJustification}
                  onChange={(e) => setSelectedCapaForEdit({ ...selectedCapaForEdit, scientificJustification: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-700 mb-1">Responsible Person</label>
                  <input
                    type="text"
                    value={selectedCapaForEdit.responsiblePerson}
                    onChange={(e) => setSelectedCapaForEdit({ ...selectedCapaForEdit, responsiblePerson: e.target.value })}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-700 mb-1">Target Date</label>
                  <input
                    type="date"
                    value={selectedCapaForEdit.targetCompletionDate}
                    onChange={(e) => setSelectedCapaForEdit({ ...selectedCapaForEdit, targetCompletionDate: e.target.value })}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-slate-800"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => setSelectedCapaForEdit(null)}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    dispatch(updateCapaField({ id: selectedCapaForEdit.id, updates: selectedCapaForEdit }));
                    setSelectedCapaForEdit(null);
                    dispatch(showToast({ text: `Updated ${selectedCapaForEdit.id}`, type: 'success' }));
                  }}
                  className="px-4 py-1.5 font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-xs"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
