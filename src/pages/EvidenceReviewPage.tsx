import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import { addEvidence, removeEvidence, updateEvidenceStatus, setSelectedEvidence } from '../store/evidenceSlice';
import { showToast } from '../store/uiSlice';
import { EvidenceRecord } from '../types';
import {
  FileCheck2,
  FileSpreadsheet,
  Plus,
  Trash2,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  ExternalLink,
  ShieldCheck,
  FileText,
  Clock,
  Layers,
  Sparkles,
  Eye,
  Info,
  X
} from 'lucide-react';

export const EvidenceReviewPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const evidenceList = useAppSelector(state => state.evidence.evidenceList);
  const currentInv = useAppSelector(state => state.investigations.currentInvestigation);
  const completeness = useAppSelector(state => state.evidence.completenessIndicator);
  const evidenceGaps = useAppSelector(state => state.rca.evidenceGaps);

  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedDocForPreview, setSelectedDocForPreview] = useState<EvidenceRecord | null>(null);

  // Form for adding evidence
  const [newDocName, setNewDocName] = useState('');
  const [newDocCategory, setNewDocCategory] = useState<EvidenceRecord['category']>('Laboratory Analytical Report');
  const [newDocDescription, setNewDocDescription] = useState('');
  const [newDocSize, setNewDocSize] = useState('1.5 MB');

  const filteredEvidence = evidenceList.filter(item => {
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    const matchesSearch = item.documentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocName.trim()) return;

    const newEvidence: EvidenceRecord = {
      id: `EVD-00${evidenceList.length + 1}`,
      documentName: newDocName,
      category: newDocCategory,
      date: new Date().toISOString().split('T')[0],
      description: newDocDescription || 'Uploaded supporting evidence record.',
      verificationStatus: 'Under Verification',
      fileSize: newDocSize,
      uploadedBy: 'Quality Investigator'
    };

    dispatch(addEvidence(newEvidence));
    setNewDocName('');
    setNewDocDescription('');
    setIsAddModalOpen(false);
    dispatch(showToast({ text: `Document ${newEvidence.id} attached to investigation.`, type: 'success' }));
  };

  return (
    <div className="p-8 space-y-8 max-w-[1500px] mx-auto animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Evidence Dossier & Verification Review
            </h1>
            <span className="text-xs font-mono bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded">
              Dossier: {currentInv?.id || 'INV-2026-001'}
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Audit batch manufacturing records, SCADA traces, QC analytical chromatograms, and operator interview depositions.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Evidence Record</span>
        </button>
      </div>

      {/* Completeness Indicator Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs text-slate-900">EVIDENCE DOSSIER COMPLETENESS INDEX</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                ICH Q9 RISK CRITERIA
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {completeness.documentsAvailable} of {completeness.totalDocumentsRequired} required evidence categories verified for batch {currentInv?.batchNumber}.
            </p>
          </div>

          <div className="text-right">
            <div className="text-xl font-bold text-blue-600 font-mono tabular-nums">{completeness.score}%</div>
            <div className="text-[10px] text-slate-400 font-medium">Completeness Score</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-600 to-teal-500 rounded-full transition-all"
            style={{ width: `${completeness.score}%` }}
          />
        </div>

        {/* Caveat */}
        <div className="flex items-start gap-2 pt-1 text-[11px] text-slate-500">
          <Info className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
          <span>{completeness.notice}</span>
        </div>
      </div>

      {/* AI Evidence Gap Analysis & Contradiction Detection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-xl space-y-2">
          <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Available Documentary Proof</span>
          </div>
          <p className="text-[11px] text-emerald-800 leading-relaxed">
            CoA HPLC chromatograms, crystallization SCADA thermal logs, and initial operator shift notes confirmed and verified in SAP QMS.
          </p>
        </div>

        <div className="p-4 bg-amber-50/60 border border-amber-200 rounded-xl space-y-2">
          <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
            <HelpCircle className="w-4 h-4 text-amber-600" />
            <span>Identified Evidence Gaps</span>
          </div>
          <p className="text-[11px] text-amber-800 leading-relaxed">
            Missing: Control valve actuator wear disassembly audit &amp; solvent lot HEP-331 trace metals ICP-MS confirmation.
          </p>
        </div>

        <div className="p-4 bg-purple-50/60 border border-purple-200 rounded-xl space-y-2">
          <div className="flex items-center gap-2 text-purple-900 font-bold text-xs">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span>Contradiction Screening</span>
          </div>
          <p className="text-[11px] text-purple-800 leading-relaxed">
            Zero direct contradictions flagged. SCADA thermal spike timing (14:32) correlates directly with operator pump speed records.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs">
          {[
            { id: 'all', label: 'All Evidence' },
            { id: 'Laboratory Analytical Report', label: 'Lab Reports' },
            { id: 'Batch Manufacturing Record', label: 'BMR Records' },
            { id: 'Equipment Automation Log', label: 'SCADA Logs' },
            { id: 'Maintenance Record', label: 'Maintenance' },
            { id: 'Operator Interview Notes', label: 'Interviews' },
          ].map(c => (
            <button
              key={c.id}
              onClick={() => setCategoryFilter(c.id)}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                categoryFilter === c.id
                  ? 'bg-blue-600 text-white font-semibold shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter documents..."
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:bg-white"
          />
        </div>
      </div>

      {/* Evidence Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 font-medium">Document ID</th>
                <th className="py-3 px-4 font-medium">Document Title</th>
                <th className="py-3 px-4 font-medium">Category</th>
                <th className="py-3 px-4 font-medium">Ingestion Date</th>
                <th className="py-3 px-4 font-medium">Verification Status</th>
                <th className="py-3 px-4 font-medium">Size</th>
                <th className="py-3 px-4 font-medium">Investigator</th>
                <th className="py-3 px-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEvidence.map((item) => {
                return (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/70 transition-colors"
                  >
                    <td className="py-3 px-4 font-mono font-semibold text-blue-600">
                      {item.id}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{item.documentName}</div>
                      <div className="text-[11px] text-slate-500 line-clamp-1">{item.description}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-[11px] text-slate-600 font-medium">
                        {item.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-500 tabular-nums">
                      {item.date}
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={item.verificationStatus}
                        onChange={(e) => dispatch(updateEvidenceStatus({ id: item.id, status: e.target.value }))}
                        className={`text-[11px] font-medium px-2 py-0.5 rounded border focus:outline-none ${
                          item.verificationStatus === 'Verified Fact' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                          item.verificationStatus === 'Discrepancy Flagged' ? 'bg-red-50 text-red-700 border-red-200' :
                          'bg-amber-50 text-amber-700 border-amber-200'
                        }`}
                      >
                        <option value="Verified Fact">Verified Fact</option>
                        <option value="Under Verification">Under Verification</option>
                        <option value="Pending Review">Pending Review</option>
                        <option value="Discrepancy Flagged">Discrepancy Flagged</option>
                      </select>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-400 text-[11px]">
                      {item.fileSize}
                    </td>
                    <td className="py-3 px-4 text-slate-700">
                      {item.uploadedBy}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedDocForPreview(item)}
                          className="p-1 text-slate-400 hover:text-blue-600 rounded transition-colors"
                          title="Preview Document Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => dispatch(removeEvidence(item.id))}
                          className="p-1 text-slate-400 hover:text-red-600 rounded transition-colors"
                          title="Remove Evidence"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Preview Modal */}
      {selectedDocForPreview && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                <h3 className="font-bold text-xs text-slate-900">{selectedDocForPreview.documentName}</h3>
              </div>
              <button
                onClick={() => setSelectedDocForPreview(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-md"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200 text-[11px]">
                <div>
                  <span className="text-slate-400 block font-mono">DOCUMENT ID</span>
                  <span className="font-bold text-slate-800">{selectedDocForPreview.id}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-mono">CATEGORY</span>
                  <span className="font-bold text-slate-800">{selectedDocForPreview.category}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-mono">INGESTION DATE</span>
                  <span className="font-bold text-slate-800 font-mono">{selectedDocForPreview.date}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-mono">FILE SIZE</span>
                  <span className="font-bold text-slate-800 font-mono">{selectedDocForPreview.fileSize}</span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Evidence Description & Analytical Findings
                </label>
                <p className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 leading-relaxed font-mono text-[11px]">
                  {selectedDocForPreview.description}
                </p>
              </div>

              <div className="p-3 bg-blue-50/60 border border-blue-200 rounded-lg text-[11px] text-blue-900 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span>Document verified under ALCOA+ data integrity principles for GMP compliance.</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedDocForPreview(null)}
                className="px-4 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Evidence Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-blue-600" />
                <h3 className="font-bold text-xs text-slate-900">Add Evidence Record</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-md"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddDocument} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-medium text-slate-700 mb-1">Document Name / Title</label>
                <input
                  type="text"
                  required
                  value={newDocName}
                  onChange={(e) => setNewDocName(e.target.value)}
                  placeholder="e.g. HPLC System Suitability Run Logbook #QC-2026-09"
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-700 mb-1">Evidence Category</label>
                  <select
                    value={newDocCategory}
                    onChange={(e) => setNewDocCategory(e.target.value as any)}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600"
                  >
                    <option value="Laboratory Analytical Report">Laboratory Analytical Report</option>
                    <option value="Batch Manufacturing Record">Batch Manufacturing Record (BMR)</option>
                    <option value="Equipment Automation Log">Equipment Automation Log</option>
                    <option value="Maintenance Record">Maintenance Record</option>
                    <option value="Environmental Monitoring">Environmental Monitoring</option>
                    <option value="Operator Interview Notes">Operator Interview Notes</option>
                    <option value="Other">Other GMP Document</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-700 mb-1">Simulated File Size</label>
                  <input
                    type="text"
                    value={newDocSize}
                    onChange={(e) => setNewDocSize(e.target.value)}
                    placeholder="e.g. 2.4 MB"
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-700 mb-1">
                  Findings & Technical Observation
                </label>
                <textarea
                  rows={3}
                  value={newDocDescription}
                  onChange={(e) => setNewDocDescription(e.target.value)}
                  placeholder="Summarize key analytical values, deviation correlations, or operator statements..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600"
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
                  Attach Evidence
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
