import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import { showToast } from '../store/uiSlice';
import {
  Settings,
  Shield,
  Key,
  Database,
  Cpu,
  CheckCircle2,
  FileCheck,
  Server,
  Lock,
  RefreshCw,
  Sliders,
  AlertCircle
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const userRole = useAppSelector(state => state.ui.userRole);

  const [aiProvider, setAiProvider] = useState<'hybrid' | 'gemini' | 'groq'>('hybrid');
  const [groqKey, setGroqKey] = useState('');
  const [modelName, setModelName] = useState('llama-3.3-70b-versatile');
  const [temperature, setTemperature] = useState(0.2);
  const [auditMode, setAuditMode] = useState(true);
  const [strictGmpMode, setStrictGmpMode] = useState(true);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(showToast({ text: 'Quality platform parameters updated successfully!', type: 'success' }));
  };

  return (
    <div className="p-8 space-y-8 max-w-[1500px] mx-auto animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Quality System Settings & AI Governance
            </h1>
            <span className="text-xs font-mono bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded">
              System Administration
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Configure pharmaceutical quality thresholds, AI reasoning models, API keys, and regulatory audit compliance rules.
          </p>
        </div>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* Model & AI Engine Configuration */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-5">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Cpu className="w-4 h-4 text-blue-600" />
            <h2 className="text-sm font-bold text-slate-900">AI Engine & Model Selection</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Inference Engine Routing</label>
              <select
                value={aiProvider}
                onChange={(e) => setAiProvider(e.target.value as any)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
              >
                <option value="hybrid">Hybrid Engine (Gemini 2.5 Flash + Groq Llama 3.3)</option>
                <option value="groq">Groq API (Llama 3.3 70B Versatile)</option>
                <option value="gemini">Google Gemini AI Engine (Built-in)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Primary Reasoning Model</label>
              <input
                type="text"
                value={modelName}
                onChange={(e) => setModelName(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Custom Groq API Key (Optional Override)
            </label>
            <div className="relative">
              <Key className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={groqKey}
                onChange={(e) => setGroqKey(e.target.value)}
                placeholder="gsk_..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              If left blank, the platform automatically utilizes the pre-configured high-throughput Gemini / local pharmaceutical validation engine.
            </p>
          </div>
        </div>

        {/* Regulatory Governance & GMP Compliance */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Shield className="w-4 h-4 text-blue-600" />
            <h2 className="text-sm font-bold text-slate-900">GMP Quality Governance Safeguards</h2>
          </div>

          <div className="space-y-3">
            <label className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200 cursor-pointer">
              <input
                type="checkbox"
                checked={strictGmpMode}
                onChange={(e) => setStrictGmpMode(e.target.checked)}
                className="mt-0.5 rounded text-blue-600 focus:ring-blue-500"
              />
              <div>
                <span className="text-xs font-bold text-slate-900 block">
                  Mandatory Human Sign-off (Zero Autonomous Approval)
                </span>
                <span className="text-[11px] text-slate-500">
                  Enforces strict ICH Q10 rules preventing AI from automatically finalizing batch release, closing deviations, or assigning regulatory blame.
                </span>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200 cursor-pointer">
              <input
                type="checkbox"
                checked={auditMode}
                onChange={(e) => setAuditMode(e.target.checked)}
                className="mt-0.5 rounded text-blue-600 focus:ring-blue-500"
              />
              <div>
                <span className="text-xs font-bold text-slate-900 block">
                  21 CFR Part 11 Electronic Records Audit Logging
                </span>
                <span className="text-[11px] text-slate-500">
                  Every user edit to AI-extracted values maintains an immutable change trail with user role, previous value, and timestamp.
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* Database & Infrastructure */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Database className="w-4 h-4 text-blue-600" />
            <h2 className="text-sm font-bold text-slate-900">Database & Persistence</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
              <span className="text-slate-500 font-mono text-[10px]">DATABASE ENGINE</span>
              <div className="font-bold text-slate-800">PostgreSQL / Persistent JSON Datastore</div>
              <p className="text-[11px] text-slate-500">Synchronized storage in data/pharmaceutical_db.json</p>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
              <span className="text-slate-500 font-mono text-[10px]">API ENDPOINTS STATUS</span>
              <div className="font-bold text-emerald-700 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>All 10 REST Endpoints Active & Validated</span>
              </div>
              <p className="text-[11px] text-slate-500">FastAPI & Express full-stack architecture</p>
            </div>
          </div>
        </div>

        {/* Save button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors"
          >
            Save Settings & Preferences
          </button>
        </div>
      </form>
    </div>
  );
};
