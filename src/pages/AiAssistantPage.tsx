import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import { addCapa } from '../store/capaSlice';
import { addFiveWhyStep, addFishboneItem, addHypothesis } from '../store/rcaSlice';
import { showToast } from '../store/uiSlice';
import { api } from '../services/api';
import {
  Bot,
  Sparkles,
  Send,
  Check,
  X,
  Edit2,
  RefreshCw,
  ShieldCheck,
  Lightbulb,
  FileQuestion,
  GitBranch,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

interface AiSuggestion {
  id: string;
  type: 'five-whys' | 'fishbone' | 'gap' | 'capa' | 'hypothesis';
  title: string;
  content: string;
  evidenceBasis: string;
  dataPayload?: any;
  status: 'pending' | 'accepted' | 'rejected';
}

export const AiAssistantPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const currentInv = useAppSelector(state => state.investigations.currentInvestigation);
  const userRole = useAppSelector(state => state.ui.userRole);

  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'capa' | 'gap' | 'five-whys' | 'fishbone'>('all');

  // Pre-generated high-value suggestions
  const [suggestions, setSuggestions] = useState<AiSuggestion[]>([
    {
      id: 'SUGG-001',
      type: 'capa',
      title: 'Automated DSC High-Temperature Interlock',
      content: 'Incorporate automated DCS interlock to freeze raw material anti-solvent dosing pumps whenever reactor parameters drift > 1.5°C from setpoint for >45 seconds.',
      evidenceBasis: 'Derived from 14-minute manual reaction lag noted during crystallization temperature spike to 26.2°C.',
      dataPayload: {
        actionCategory: 'Preventive Action',
        actionDescription: 'Automated DCS interlock freezing anti-solvent feed pump P-201 if temperature > 23.5°C for >30s.',
        scientificJustification: 'Eliminates human delay and bounds Impurity D thermal synthesis kinetics.',
        responsiblePerson: 'Automation Validation Engineer',
        priority: 'High',
        targetCompletionDate: '2026-04-25',
        verificationMethod: 'Software change control challenge test',
        effectivenessCheck: 'Zero over-temp addition events over 12 months'
      },
      status: 'pending'
    },
    {
      id: 'SUGG-002',
      type: 'gap',
      title: 'Solvent Drum Trace Metal Analysis (ICP-MS)',
      content: 'Acquire trace metal screening (Iron, Copper, Nickel) on heptane solvent Lot HEP-331 to conclusively rule out transition metal-catalyzed oxidation.',
      evidenceBasis: 'Impurity D pathway can be accelerated by ppm levels of ferric contaminants from storage drums.',
      status: 'pending'
    },
    {
      id: 'SUGG-003',
      type: 'five-whys',
      title: 'Additional Why Step: Maintenance Policy Ambiguity',
      content: 'Why was preventive maintenance permitted to run 45 days past due without an engineering stop? SOP-MAINT-044 lacked defined escalation thresholds for GMP-critical reactors.',
      evidenceBasis: 'Work Order #WO-8831 and review of current revision of SOP-MAINT-044.',
      status: 'pending'
    },
    {
      id: 'SUGG-004',
      type: 'fishbone',
      title: 'Measurement: Thermowell Dynamic Response Verification',
      content: 'Add contributing factor to Measurement category: Temperature transmitter TT-401 thermowell heat-transfer oil degradation created an 18-second sensor lag.',
      evidenceBasis: 'Post-incident calibration inspection report CAL-TT401.',
      status: 'pending'
    }
  ]);

  const handleAcceptSuggestion = (sugg: AiSuggestion) => {
    if (sugg.type === 'capa' && sugg.dataPayload) {
      dispatch(addCapa({
        ...sugg.dataPayload,
        id: `CAPA-2026-0${Math.floor(10 + Math.random() * 90)}`,
        investigationId: currentInv?.id || 'INV-2026-001',
        currentStatus: 'Proposed',
        completionDate: null
      }));
      dispatch(showToast({ text: 'CAPA recommendation accepted & added to register!', type: 'success' }));
    } else if (sugg.type === 'five-whys') {
      dispatch(addFiveWhyStep());
      dispatch(showToast({ text: 'Added suggested Why step to investigation ladder.', type: 'success' }));
    } else if (sugg.type === 'fishbone') {
      dispatch(addFishboneItem({
        category: 'measurement',
        item: {
          factor: 'Thermowell heat-transfer oil degradation causing sensor lag',
          evidence: sugg.evidenceBasis,
          type: 'Contributing Factor'
        }
      }));
      dispatch(showToast({ text: 'Added factor to Fishbone measurement branch.', type: 'success' }));
    }

    setSuggestions(prev => prev.map(s => s.id === sugg.id ? { ...s, status: 'accepted' } : s));
  };

  const handleRejectSuggestion = (id: string) => {
    setSuggestions(prev => prev.map(s => s.id === id ? { ...s, status: 'rejected' } : s));
    dispatch(showToast({ text: 'Suggestion dismissed.', type: 'info' }));
  };

  const handleCustomQuery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    try {
      const response = await api.analyzeIncident({
        method: 'text',
        text: `Active Deviation context: ${currentInv?.productName} Batch ${currentInv?.batchNumber}. ${currentInv?.incidentDescription}\n\nUser Question: ${prompt}`
      });

      const extracted = response.extractedData;

      // Create new suggestion from answer
      const newSugg: AiSuggestion = {
        id: `SUGG-00${suggestions.length + 1}`,
        type: 'capa',
        title: `AI Recommendation: ${prompt.substring(0, 40)}...`,
        content: extracted.hypotheses?.[0]?.causeDescription || extracted.incidentDescription || 'Scientific recommendation synthesized based on GMP principles.',
        evidenceBasis: `Grounded in active batch ${currentInv?.batchNumber} observations.`,
        status: 'pending'
      };

      setSuggestions(prev => [newSugg, ...prev]);
      setPrompt('');
      dispatch(showToast({ text: 'AI analysis generated recommendation.', type: 'success' }));
    } catch (err: any) {
      dispatch(showToast({ text: 'Error querying AI assistant.', type: 'error' }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-[1500px] mx-auto animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              AI Quality Intelligence Assistant
            </h1>
            <span className="text-xs font-mono bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded">
              Llama 3.3 70B / Gemini Quality Unit Co-Pilot
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Interactive causal brainstorming, evidence gap identification, and GMP-grounded CAPA formulation.
          </p>
        </div>

        <div className="text-xs text-slate-500 font-mono">
          Context: <strong className="text-slate-800">{currentInv?.batchNumber}</strong> ({currentInv?.productName.split('(')[0]})
        </div>
      </div>

      {/* Mandatory GMP Notice */}
      <div className="p-3.5 rounded-xl bg-blue-50/50 border border-blue-200 text-xs text-blue-900 flex items-start gap-2.5">
        <ShieldCheck className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
        <span>
          <strong>Advisory Principle:</strong> All assistant recommendations are suggestions only. Acceptance commits records to the formal investigation repository under the logged credentials of <em>{userRole}</em>.
        </span>
      </div>

      {/* Query Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <form onSubmit={handleCustomQuery} className="space-y-3">
          <label className="block text-xs font-bold text-slate-900">
            Ask Quality Intelligence Assistant for Causal or Remedial Insights:
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. Detect evidence gaps in current crystallization data, or propose 2 preventive CAPAs..."
              className="flex-1 px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors shrink-0"
            >
              <Sparkles className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>{loading ? 'Analyzing...' : 'Generate Guidance'}</span>
            </button>
          </div>

          {/* Quick Prompts */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-slate-500">
            <span className="font-medium text-slate-600">Quick Prompt Chips:</span>
            <button
              type="button"
              onClick={() => setPrompt('Identify remaining evidence gaps for batch ' + currentInv?.batchNumber)}
              className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            >
              Detect Evidence Gaps
            </button>
            <button
              type="button"
              onClick={() => setPrompt('Propose 2 preventive actions to eliminate maintenance deferral risk')}
              className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            >
              Propose Preventive CAPAs
            </button>
            <button
              type="button"
              onClick={() => setPrompt('What analytical tests are needed to rule out raw material contamination?')}
              className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            >
              Cross-Contamination Test Plan
            </button>
          </div>
        </form>
      </div>

      {/* Suggestions List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900">Traceable AI Recommendations & Evidentiary Rationales</h2>
          <span className="text-xs text-slate-400 font-mono">
            {suggestions.filter(s => s.status === 'pending').length} Actionable Pending
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {suggestions.map((sugg) => {
            const isAccepted = sugg.status === 'accepted';
            const isRejected = sugg.status === 'rejected';

            const badgeColor =
              sugg.type === 'capa' ? 'bg-blue-50 text-blue-700 border-blue-200' :
              sugg.type === 'gap' ? 'bg-amber-50 text-amber-700 border-amber-200' :
              sugg.type === 'five-whys' ? 'bg-purple-50 text-purple-700 border-purple-200' :
              'bg-teal-50 text-teal-700 border-teal-200';

            return (
              <div
                key={sugg.id}
                className={`p-5 bg-white rounded-xl border shadow-xs transition-all space-y-3 ${
                  isAccepted ? 'border-emerald-300 bg-emerald-50/20' :
                  isRejected ? 'border-slate-200 opacity-60 bg-slate-50/40' :
                  'border-slate-200'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-blue-600">{sugg.id}</span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase border ${badgeColor}`}>
                      {sugg.type}
                    </span>
                    <h3 className="text-xs font-bold text-slate-900">{sugg.title}</h3>
                  </div>

                  <div className="flex items-center gap-2">
                    {isAccepted ? (
                      <span className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1 font-mono">
                        <Check className="w-3.5 h-3.5" /> ACCEPTED BY INVESTIGATOR
                      </span>
                    ) : isRejected ? (
                      <span className="text-[11px] font-medium text-slate-400 font-mono">
                        REJECTED / DISMISSED
                      </span>
                    ) : (
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleAcceptSuggestion(sugg)}
                          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-semibold flex items-center gap-1 shadow-xs transition-colors"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Accept Recommendation</span>
                        </button>
                        <button
                          onClick={() => handleRejectSuggestion(sugg.id)}
                          className="px-2.5 py-1 text-slate-500 hover:bg-slate-100 rounded-md text-xs font-medium transition-colors"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed font-normal">
                  {sugg.content}
                </p>

                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-[11px] text-slate-600 flex items-start gap-2">
                  <span className="font-semibold text-slate-700 shrink-0 font-mono">Evidence Traceability:</span>
                  <span className="italic">{sugg.evidenceBasis}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
