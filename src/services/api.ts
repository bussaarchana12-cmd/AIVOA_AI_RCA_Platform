import { Investigation, CapaAction } from '../types';

export const api = {
  // Analyze incident with LangGraph workflow
  analyzeIncident: async (payload: {
    method: 'text' | 'email' | 'file';
    text?: string;
    emailData?: { subject: string; body: string; sender: string; date: string };
    fileName?: string;
    groqApiKey?: string;
  }) => {
    const res = await fetch('/api/investigations/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Analysis failed' }));
      throw new Error(err.error || 'Server error during incident analysis');
    }
    return res.json();
  },

  // Save/update full investigation
  saveInvestigation: async (data: {
    investigation: Investigation;
    rca?: any;
    evidence?: any;
    capas?: CapaAction[];
  }) => {
    const res = await fetch('/api/investigations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to save investigation');
    return res.json();
  },

  // Get all investigations
  getInvestigations: async (): Promise<Investigation[]> => {
    const res = await fetch('/api/investigations');
    if (!res.ok) throw new Error('Failed to load investigations');
    return res.json();
  },

  // Get single investigation with details
  getInvestigationById: async (id: string) => {
    const res = await fetch(`/api/investigations/${id}`);
    if (!res.ok) throw new Error(`Investigation ${id} not found`);
    return res.json();
  },

  // Update single investigation
  updateInvestigation: async (id: string, updates: Partial<Investigation>) => {
    const res = await fetch(`/api/investigations/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    if (!res.ok) throw new Error('Failed to update investigation');
    return res.json();
  },

  // Update RCA
  saveRca: async (investigationId: string, rca: any) => {
    const res = await fetch(`/api/investigations/${investigationId}/rca`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(rca)
    });
    if (!res.ok) throw new Error('Failed to save RCA');
    return res.json();
  },

  // CAPA endpoints
  getCapas: async (investigationId: string): Promise<CapaAction[]> => {
    const res = await fetch(`/api/investigations/${investigationId}/capa`);
    if (!res.ok) throw new Error('Failed to load CAPA actions');
    return res.json();
  },

  saveCapa: async (investigationId: string, capa: Partial<CapaAction>) => {
    const res = await fetch(`/api/investigations/${investigationId}/capa`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(capa)
    });
    if (!res.ok) throw new Error('Failed to create CAPA');
    return res.json();
  },

  updateCapa: async (capaId: string, updates: Partial<CapaAction>) => {
    const res = await fetch(`/api/capa/${capaId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    if (!res.ok) throw new Error('Failed to update CAPA');
    return res.json();
  },

  // Dashboard metrics
  getMetrics: async () => {
    const res = await fetch('/api/dashboard/metrics');
    if (!res.ok) throw new Error('Failed to load metrics');
    return res.json();
  }
};
