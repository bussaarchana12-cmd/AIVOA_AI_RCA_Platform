import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import {
  updateFiveWhyStep,
  addFiveWhyStep,
  removeFiveWhyStep,
  addFishboneItem,
  removeFishboneItem,
  updateHypothesisStatus,
  addHypothesis
} from '../store/rcaSlice';
import { setCurrentTab, showToast } from '../store/uiSlice';
import { VerificationStatus, FishboneCategories, RootCauseHypothesis } from '../types';
import {
  GitBranch,
  ListOrdered,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  FileText,
  Save,
  ArrowRight,
  ShieldCheck,
  Edit3,
  Bot,
  UserCheck,
  ChevronDown,
  Info,
  AlertOctagon,
  Sparkles
} from 'lucide-react';

export const RootCauseAnalysisPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const currentInv = useAppSelector(state => state.investigations.currentInvestigation);
  const fiveWhys = useAppSelector(state => state.rca.fiveWhys);
  const fishbone = useAppSelector(state => state.rca.fishbone);
  const hypotheses = useAppSelector(state => state.rca.hypotheses);
  const userRole = useAppSelector(state => state.ui.userRole);

  const [activeSubTab, setActiveSubTab] = useState<'five-whys' | 'fishbone' | 'hypotheses'>('five-whys');

  // New Fishbone factor modal state
  const [newFactorCategory, setNewFactorCategory] = useState<keyof FishboneCategories>('machine');
  const [newFactorText, setNewFactorText] = useState('');
  const [newFactorEvidence, setNewFactorEvidence] = useState('');
  const [newFactorType, setNewFactorType] = useState<'Contributing Factor' | 'Root Cause' | 'Ruled Out' | 'Confirmed Fact' | 'Potential Cause'>('Contributing Factor');
  const [isAddingFactor, setIsAddingFactor] = useState(false);

  // Verification status options
  const verificationOptions: VerificationStatus[] = [
    'Verified Fact',
    'Potential Cause',
    'Verified Root Cause',
    'Proposed Root Cause',
    'Under Verification',
    'Unverified Assumption',
    'Ruled Out'
  ];

  const handleAddFishbone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFactorText.trim()) return;

    dispatch(addFishboneItem({
      category: newFactorCategory,
      item: {
        factor: newFactorText,
        evidence: newFactorEvidence || 'Documentary evidence pending verification',
        type: newFactorType
      }
    }));

    setNewFactorText('');
    setNewFactorEvidence('');
    setIsAddingFactor(false);
    dispatch(showToast({ text: `Added new factor to ${newFactorCategory.toUpperCase()} branch`, type: 'success' }));
  };

  return (
    <div className="p-8 space-y-8 max-w-[1500px] mx-auto animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Root Cause Analysis (RCA) Workspace
            </h1>
            <span className="text-xs font-mono bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded">
              Active: {currentInv?.id || 'INV-2026-001'}
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Causal investigation tools: 5-Whys recursive ladder, 6M Ishikawa Fishbone, and hypothesis evidence evaluation.
          </p>
        </div>

        {/* RCA Module Switcher */}
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
          <button
            onClick={() => setActiveSubTab('five-whys')}
            className={`px-3 py-1.5 font-semibold rounded-md transition-all ${
              activeSubTab === 'five-whys'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            1. Five Whys Ladder
          </button>
          <button
            onClick={() => setActiveSubTab('fishbone')}
            className={`px-3 py-1.5 font-semibold rounded-md transition-all ${
              activeSubTab === 'fishbone'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            2. 6M Fishbone Diagram
          </button>
          <button
            onClick={() => setActiveSubTab('hypotheses')}
            className={`px-3 py-1.5 font-semibold rounded-md transition-all ${
              activeSubTab === 'hypotheses'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            3. Root Cause Hypotheses
          </button>
        </div>
      </div>

      {/* Mandatory GMP Regulatory Notice */}
      <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 text-xs text-blue-900 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold text-blue-950">GMP Causal Verification Principle (ICH Q9 / 21 CFR Part 211):</span>
          <p className="text-blue-800 leading-relaxed">
            AI-generated causal paths represent hypothesis suggestions only. The Quality Unit must verify each link with objective documentary evidence (laboratory chromatography, SCADA automation logs, or calibration certificates) before root cause confirmation.
          </p>
        </div>
      </div>

      {/* MODULE A: FIVE WHYS LADDER */}
      {activeSubTab === 'five-whys' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Five Whys Causal Ladder</h2>
              <p className="text-xs text-slate-500">
                Connected logical steps linking the initial deviation symptom to the fundamental systemic vulnerability.
              </p>
            </div>

            <button
              onClick={() => dispatch(addFiveWhyStep())}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold shadow-xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5 text-blue-600" />
              <span>Add Why Step</span>
            </button>
          </div>

          {/* 5-Whys Connected Cards Chain */}
          <div className="space-y-4">
            {fiveWhys.map((step, idx) => {
              const isRoot = step.step === fiveWhys.length;

              return (
                <div
                  key={step.step}
                  className={`relative p-5 bg-white rounded-xl border transition-all ${
                    isRoot
                      ? 'border-blue-300 ring-2 ring-blue-500/10 shadow-sm'
                      : 'border-slate-200 shadow-xs'
                  }`}
                >
                  {/* Step Connector Line */}
                  {idx < fiveWhys.length - 1 && (
                    <div className="absolute left-7 -bottom-4 w-0.5 h-4 bg-blue-300 z-10" />
                  )}

                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                        isRoot ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-100 text-slate-700'
                      }`}>
                        W{step.step}
                      </div>
                      <div>
                        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                          {isRoot ? 'FINAL STEP (SYSTEMIC ROOT CAUSE)' : `CAUSAL LINKAGE #${step.step}`}
                        </span>
                        <h3 className="text-xs font-bold text-slate-900">Why Step #{step.step}</h3>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={step.verificationStatus}
                        onChange={(e) => dispatch(updateFiveWhyStep({
                          index: idx,
                          step: { verificationStatus: e.target.value as VerificationStatus }
                        }))}
                        className={`text-[11px] font-medium px-2 py-1 rounded border focus:outline-none ${
                          step.verificationStatus.includes('Root') ? 'bg-purple-50 text-purple-700 border-purple-200' :
                          step.verificationStatus.includes('Verified') ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                          'bg-amber-50 text-amber-700 border-amber-200'
                        }`}
                      >
                        {verificationOptions.map(v => (
                          <option key={v} value={v}>{v}</option>
                        ))}
                      </select>

                      {fiveWhys.length > 2 && (
                        <button
                          onClick={() => dispatch(removeFiveWhyStep(idx))}
                          className="p-1 text-slate-400 hover:text-red-600 rounded transition-colors"
                          title="Remove Step"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    {/* Question */}
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">Investigation Question:</label>
                      <input
                        type="text"
                        value={step.question}
                        onChange={(e) => dispatch(updateFiveWhyStep({ index: idx, step: { question: e.target.value } }))}
                        className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-medium focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600"
                      />
                    </div>

                    {/* AI Answer & Evidence */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                          <Bot className="w-3 h-3 text-blue-600" />
                          <span>AI Causal Answer:</span>
                        </label>
                        <textarea
                          rows={2}
                          value={step.aiAnswer}
                          onChange={(e) => dispatch(updateFiveWhyStep({ index: idx, step: { aiAnswer: e.target.value } }))}
                          className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600 leading-relaxed"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                          <FileText className="w-3 h-3 text-teal-600" />
                          <span>Corroborating Evidence / Document:</span>
                        </label>
                        <textarea
                          rows={2}
                          value={step.evidence}
                          onChange={(e) => dispatch(updateFiveWhyStep({ index: idx, step: { evidence: e.target.value } }))}
                          className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600 font-mono text-[11px] leading-relaxed"
                        />
                      </div>
                    </div>

                    {/* User Notes */}
                    <div>
                      <label className="block text-[11px] font-medium text-slate-500 mb-1 flex items-center gap-1">
                        <Edit3 className="w-3 h-3" />
                        <span>Investigator Review Notes:</span>
                      </label>
                      <input
                        type="text"
                        value={step.userNotes || ''}
                        onChange={(e) => dispatch(updateFiveWhyStep({ index: idx, step: { userNotes: e.target.value } }))}
                        placeholder="Add QA reviewer notes or verification audit findings..."
                        className="w-full px-3 py-1 text-xs bg-white border border-slate-200 rounded-md text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-600"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            <span className="text-xs text-slate-500 font-medium">
              5-Whys ladder ready for CAPA translation
            </span>
            <button
              onClick={() => setActiveSubTab('fishbone')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors"
            >
              <span>Proceed to 6M Fishbone</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* MODULE B: 6M ISHIKAWA FISHBONE DIAGRAM */}
      {activeSubTab === 'fishbone' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Ishikawa 6M Fishbone Diagram</h2>
              <p className="text-xs text-slate-500">
                Systematic analysis across Man, Machine, Method, Material, Measurement, and Mother Nature.
              </p>
            </div>

            <button
              onClick={() => setIsAddingFactor(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Causal Factor</span>
            </button>
          </div>

          {/* Fishbone Central Diagram Layout */}
          <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-lg border border-slate-800 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <GitBranch className="w-4 h-4 text-teal-400" />
                <span className="font-bold text-xs uppercase tracking-wider text-slate-200">
                  FISHBONE MATRIX (6M PHARMACEUTICAL BRANCHES)
                </span>
              </div>
              <div className="text-xs font-mono bg-blue-900/60 text-blue-200 px-2.5 py-1 rounded border border-blue-700">
                DEVIATION: {currentInv?.incidentDescription?.substring(0, 70) || 'Related Impurity D Excursion'}...
              </div>
            </div>

            {/* 6 Categories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Category 1: Man (Personnel) */}
              <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-700/80 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-400" />
                    <span className="font-bold text-xs text-slate-100">Man (Personnel)</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 tabular-nums">
                    {fishbone.man.length} factors
                  </span>
                </div>
                <div className="space-y-2">
                  {fishbone.man.map((item, i) => (
                    <div key={i} className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-700/60 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-semibold ${
                          item.type === 'Root Cause' ? 'bg-red-950 text-red-300 border border-red-800' :
                          item.type === 'Ruled Out' ? 'bg-slate-800 text-slate-400' :
                          'bg-amber-950 text-amber-300 border border-amber-800'
                        }`}>
                          {item.type}
                        </span>
                        <button
                          onClick={() => dispatch(removeFishboneItem({ category: 'man', index: i }))}
                          className="text-slate-500 hover:text-red-400"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                      <p className="text-slate-200 font-medium leading-snug">{item.factor}</p>
                      <p className="text-[11px] text-slate-400 italic">Ev: {item.evidence}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Category 2: Machine (Equipment) */}
              <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-700/80 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                    <span className="font-bold text-xs text-slate-100">Machine (Equipment)</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 tabular-nums">
                    {fishbone.machine.length} factors
                  </span>
                </div>
                <div className="space-y-2">
                  {fishbone.machine.map((item, i) => (
                    <div key={i} className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-700/60 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-semibold ${
                          item.type === 'Root Cause' ? 'bg-red-950 text-red-300 border border-red-800' :
                          item.type === 'Ruled Out' ? 'bg-slate-800 text-slate-400' :
                          'bg-amber-950 text-amber-300 border border-amber-800'
                        }`}>
                          {item.type}
                        </span>
                        <button
                          onClick={() => dispatch(removeFishboneItem({ category: 'machine', index: i }))}
                          className="text-slate-500 hover:text-red-400"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                      <p className="text-slate-200 font-medium leading-snug">{item.factor}</p>
                      <p className="text-[11px] text-slate-400 italic">Ev: {item.evidence}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Category 3: Method (Procedure) */}
              <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-700/80 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-400" />
                    <span className="font-bold text-xs text-slate-100">Method (Procedure)</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 tabular-nums">
                    {fishbone.method.length} factors
                  </span>
                </div>
                <div className="space-y-2">
                  {fishbone.method.map((item, i) => (
                    <div key={i} className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-700/60 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-semibold ${
                          item.type === 'Root Cause' ? 'bg-red-950 text-red-300 border border-red-800' :
                          item.type === 'Ruled Out' ? 'bg-slate-800 text-slate-400' :
                          'bg-amber-950 text-amber-300 border border-amber-800'
                        }`}>
                          {item.type}
                        </span>
                        <button
                          onClick={() => dispatch(removeFishboneItem({ category: 'method', index: i }))}
                          className="text-slate-500 hover:text-red-400"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                      <p className="text-slate-200 font-medium leading-snug">{item.factor}</p>
                      <p className="text-[11px] text-slate-400 italic">Ev: {item.evidence}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Category 4: Material (Raw Materials) */}
              <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-700/80 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-teal-400" />
                    <span className="font-bold text-xs text-slate-100">Material (Raw Materials)</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 tabular-nums">
                    {fishbone.material.length} factors
                  </span>
                </div>
                <div className="space-y-2">
                  {fishbone.material.map((item, i) => (
                    <div key={i} className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-700/60 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-semibold ${
                          item.type === 'Root Cause' ? 'bg-red-950 text-red-300 border border-red-800' :
                          item.type === 'Ruled Out' ? 'bg-slate-800 text-slate-400' :
                          'bg-amber-950 text-amber-300 border border-amber-800'
                        }`}>
                          {item.type}
                        </span>
                        <button
                          onClick={() => dispatch(removeFishboneItem({ category: 'material', index: i }))}
                          className="text-slate-500 hover:text-red-400"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                      <p className="text-slate-200 font-medium leading-snug">{item.factor}</p>
                      <p className="text-[11px] text-slate-400 italic">Ev: {item.evidence}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Category 5: Measurement (Testing) */}
              <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-700/80 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                    <span className="font-bold text-xs text-slate-100">Measurement (QC Assay)</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 tabular-nums">
                    {fishbone.measurement.length} factors
                  </span>
                </div>
                <div className="space-y-2">
                  {fishbone.measurement.map((item, i) => (
                    <div key={i} className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-700/60 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-semibold ${
                          item.type === 'Root Cause' ? 'bg-red-950 text-red-300 border border-red-800' :
                          item.type === 'Ruled Out' ? 'bg-slate-800 text-slate-400' :
                          'bg-amber-950 text-amber-300 border border-amber-800'
                        }`}>
                          {item.type}
                        </span>
                        <button
                          onClick={() => dispatch(removeFishboneItem({ category: 'measurement', index: i }))}
                          className="text-slate-500 hover:text-red-400"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                      <p className="text-slate-200 font-medium leading-snug">{item.factor}</p>
                      <p className="text-[11px] text-slate-400 italic">Ev: {item.evidence}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Category 6: Mother Nature (Environment) */}
              <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-700/80 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                    <span className="font-bold text-xs text-slate-100">Mother Nature (Environment)</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 tabular-nums">
                    {fishbone.motherNature.length} factors
                  </span>
                </div>
                <div className="space-y-2">
                  {fishbone.motherNature.map((item, i) => (
                    <div key={i} className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-700/60 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-semibold ${
                          item.type === 'Root Cause' ? 'bg-red-950 text-red-300 border border-red-800' :
                          item.type === 'Ruled Out' ? 'bg-slate-800 text-slate-400' :
                          'bg-amber-950 text-amber-300 border border-amber-800'
                        }`}>
                          {item.type}
                        </span>
                        <button
                          onClick={() => dispatch(removeFishboneItem({ category: 'motherNature', index: i }))}
                          className="text-slate-500 hover:text-red-400"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                      <p className="text-slate-200 font-medium leading-snug">{item.factor}</p>
                      <p className="text-[11px] text-slate-400 italic">Ev: {item.evidence}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Add Factor Modal */}
          {isAddingFactor && (
            <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-md animate-in fade-in space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-900">Add New Fishbone Causal Factor</h3>
                <button onClick={() => setIsAddingFactor(false)} className="text-slate-400 hover:text-slate-600 text-xs font-medium">Cancel</button>
              </div>

              <form onSubmit={handleAddFishbone} className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-700 mb-1">Target 6M Category</label>
                    <select
                      value={newFactorCategory}
                      onChange={(e) => setNewFactorCategory(e.target.value as keyof FishboneCategories)}
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                    >
                      <option value="man">Man (Personnel / Human Factor)</option>
                      <option value="machine">Machine (Equipment / Automation)</option>
                      <option value="method">Method (SOP / Procedure)</option>
                      <option value="material">Material (Raw Materials / Solvent)</option>
                      <option value="measurement">Measurement (Testing / Analytical)</option>
                      <option value="motherNature">Mother Nature (Environment / Cleanroom)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-700 mb-1">Factor Classification</label>
                    <select
                      value={newFactorType}
                      onChange={(e) => setNewFactorType(e.target.value as any)}
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                    >
                      <option value="Contributing Factor">Contributing Factor</option>
                      <option value="Root Cause">Root Cause</option>
                      <option value="Confirmed Fact">Confirmed Fact</option>
                      <option value="Ruled Out">Ruled Out</option>
                      <option value="Potential Cause">Potential Cause</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-700 mb-1">Factor Description</label>
                  <input
                    type="text"
                    required
                    value={newFactorText}
                    onChange={(e) => setNewFactorText(e.target.value)}
                    placeholder="e.g. Valve CV-102 pneumatic actuator mechanical stem binding"
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-700 mb-1">Evidence Reference</label>
                  <input
                    type="text"
                    value={newFactorEvidence}
                    onChange={(e) => setNewFactorEvidence(e.target.value)}
                    placeholder="e.g. Actuator bench test report #TR-881"
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingFactor(false)}
                    className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-xs"
                  >
                    Add Factor
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {/* MODULE C: ROOT CAUSE HYPOTHESES MATRIX */}
      {activeSubTab === 'hypotheses' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Root Cause Hypotheses Matrix</h2>
              <p className="text-xs text-slate-500">
                Detailed evidentiary appraisal: Supporting facts, contradictory evidence, and confidence scores.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="font-medium text-slate-500">Classification Guide:</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-50 text-purple-700 border border-purple-200">
                Root Cause
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-50 text-amber-700 border border-amber-200">
                Contributing Factor
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-100 text-slate-600 border border-slate-200">
                Unverified Assumption
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {hypotheses.map((hyp) => {
              const isConfirmed = hyp.status === 'Confirmed Root Cause';
              const isDisproven = hyp.status === 'Disproven Hypothesis';

              return (
                <div
                  key={hyp.id}
                  className={`p-5 bg-white rounded-xl border shadow-xs space-y-4 ${
                    isConfirmed ? 'border-purple-300 ring-2 ring-purple-500/10' :
                    isDisproven ? 'border-slate-200 opacity-70 bg-slate-50/50' :
                    'border-slate-200'
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-bold text-blue-600">{hyp.id}</span>
                      <h3 className="text-xs font-bold text-slate-900">{hyp.causeDescription}</h3>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-slate-500">Confidence: <strong className="text-slate-800">{hyp.confidenceLevel}</strong></span>
                      <select
                        value={hyp.status}
                        onChange={(e) => dispatch(updateHypothesisStatus({
                          id: hyp.id,
                          status: e.target.value as any,
                          classification: hyp.classification
                        }))}
                        className={`text-xs font-medium px-2 py-1 rounded border focus:outline-none ${
                          hyp.status === 'Confirmed Root Cause' ? 'bg-purple-50 text-purple-700 border-purple-300 font-bold' :
                          hyp.status === 'Disproven Hypothesis' ? 'bg-slate-100 text-slate-500 border-slate-300' :
                          'bg-blue-50 text-blue-700 border-blue-200'
                        }`}
                      >
                        <option value="Potential Root Cause">Potential Root Cause</option>
                        <option value="Confirmed Root Cause">Confirmed Root Cause (QA Signed)</option>
                        <option value="Confirmed Contributing Factor">Confirmed Contributing Factor</option>
                        <option value="Disproven Hypothesis">Disproven Hypothesis</option>
                      </select>
                    </div>
                  </div>

                  {/* Evidence Breakdown Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div className="p-3 rounded-lg bg-emerald-50/60 border border-emerald-200/80 space-y-1">
                      <div className="flex items-center gap-1.5 text-emerald-800 font-semibold text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Supporting Evidence:</span>
                      </div>
                      <p className="text-slate-700 leading-relaxed text-[11px]">
                        {hyp.supportingEvidence}
                      </p>
                    </div>

                    <div className="p-3 rounded-lg bg-red-50/60 border border-red-200/80 space-y-1">
                      <div className="flex items-center gap-1.5 text-red-800 font-semibold text-[11px]">
                        <AlertOctagon className="w-3.5 h-3.5 text-red-600 shrink-0" />
                        <span>Contradictory / Opposing Evidence:</span>
                      </div>
                      <p className="text-slate-700 leading-relaxed text-[11px]">
                        {hyp.opposingEvidence || 'None observed in available test records.'}
                      </p>
                    </div>

                    <div className="p-3 rounded-lg bg-amber-50/60 border border-amber-200/80 space-y-1">
                      <div className="flex items-center gap-1.5 text-amber-800 font-semibold text-[11px]">
                        <HelpCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span>Missing Evidence Required:</span>
                      </div>
                      <p className="text-slate-700 leading-relaxed text-[11px]">
                        {hyp.missingEvidence || 'All analytical test parameters verified.'}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            <span className="text-xs text-slate-500 font-medium">
              Hypotheses evaluated against available batch evidence
            </span>
            <button
              onClick={() => dispatch(setCurrentTab('capa-management'))}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors"
            >
              <span>Translate Root Cause into CAPAs</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
