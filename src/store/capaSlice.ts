import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { CapaAction, CapaStatus, PriorityLevel, CapaCategory } from '../types';

interface CapaState {
  capaList: CapaAction[];
  filterTab: 'all' | 'Corrective Action' | 'Preventive Action';
  filterStatus: string;
  filterPriority: string;
  searchQuery: string;
  selectedCapa: CapaAction | null;
  loading: boolean;
}

const initialCapaList: CapaAction[] = [
  {
    id: "CAPA-2026-001",
    investigationId: "INV-2026-001",
    actionCategory: "Corrective Action",
    actionDescription: "Rebuild and re-calibrate cooling control valve CV-102 on Reactor R-301 with fluoropolymer high-temp seals and pneumatic actuator replacement.",
    scientificJustification: "Eliminates mechanical friction and hysteresis in glycol flow modulation, restoring thermal response time to under 4 seconds.",
    responsiblePerson: "Arthur Dent (Chief Engineering Lead)",
    priority: "High",
    targetCompletionDate: "2026-04-15",
    currentStatus: "In Progress",
    verificationMethod: "Post-overhaul 10-point stroke verification and 4-hour mock crystallization water-run temperature stability qualification (±0.5°C).",
    effectivenessCheck: "Review 3 consecutive commercial API-101 batches post-restart for temperature stability and Impurity D levels.",
    completionDate: null
  },
  {
    id: "CAPA-2026-002",
    investigationId: "INV-2026-001",
    actionCategory: "Preventive Action",
    actionDescription: "Implement automated PLC safety interlock in DeltaV DCS to immediately pause anti-solvent feed pump P-201 if crystallization slurry temperature exceeds 23.5°C for >30 seconds.",
    scientificJustification: "Prevents human latency and ensures kinetic window for Impurity D synthesis cannot be breached during unexpected utility interruptions.",
    responsiblePerson: "Ilya Sorkin (Automation Validation Engineer)",
    priority: "High",
    targetCompletionDate: "2026-04-25",
    currentStatus: "Under Review",
    verificationMethod: "IQ/OQ software change control protocol and challenge test with simulated high-temp sensor input.",
    effectivenessCheck: "Zero occurrences of uninhibited feed during thermal alarms over 12 months.",
    completionDate: null
  },
  {
    id: "CAPA-2026-003",
    investigationId: "INV-2026-001",
    actionCategory: "Preventive Action",
    actionDescription: "Revise SOP-MAINT-044 (Equipment Maintenance Scheduling & Deferrals) to mandate Quality Assurance approval and formal Quality Risk Assessment (ICH Q9) for any calibration or PM deferral on GMP-critical systems.",
    scientificJustification: "Closes organizational governance vulnerability that permitted critical utility maintenance postponement without quality impact evaluation.",
    responsiblePerson: "Dr. Samantha Wei (QA Manager)",
    priority: "Medium",
    targetCompletionDate: "2026-04-30",
    currentStatus: "Proposed",
    verificationMethod: "Quality Management System document release and mandatory training records for 100% of engineering and operations personnel.",
    effectivenessCheck: "Quarterly QA audit of all maintenance work orders for compliance with deferral approval protocol.",
    completionDate: null
  },
  {
    id: "CAPA-2026-004",
    investigationId: "INV-2026-003",
    actionCategory: "Corrective Action",
    actionDescription: "Replace spiral jet mill JM-03 sterile nitrogen intake 0.2µm PTFE hydrophobic cartridge filter and perform pre-use and post-use bubble point integrity test.",
    scientificJustification: "Cartridge filter integrity failure allows microscopic ambient spore ingress during gas expansion phase.",
    responsiblePerson: "K. Tanaka (Process Chemist)",
    priority: "High",
    targetCompletionDate: "2026-04-05",
    currentStatus: "Approved",
    verificationMethod: "Automated Palltronic Flowstar IV integrity test with documented water intrusion pressure curve.",
    effectivenessCheck: "Endotoxin testing on 5 sequential milling batches below 0.10 EU/mg.",
    completionDate: null
  }
];

const initialState: CapaState = {
  capaList: initialCapaList,
  filterTab: 'all',
  filterStatus: 'all',
  filterPriority: 'all',
  searchQuery: '',
  selectedCapa: null,
  loading: false
};

export const updateCapaAsync = createAsyncThunk(
  'capa/update',
  async (capa: CapaAction, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/capa/${capa.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(capa)
      });
      if (!res.ok) throw new Error('Failed to update CAPA');
      return await res.json();
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const capaSlice = createSlice({
  name: 'capa',
  initialState,
  reducers: {
    addCapa: (state, action: PayloadAction<CapaAction>) => {
      state.capaList.unshift(action.payload);
    },
    updateCapaStatus: (state, action: PayloadAction<{ id: string; status: CapaStatus; completionDate?: string | null }>) => {
      const item = state.capaList.find(c => c.id === action.payload.id);
      if (item) {
        item.currentStatus = action.payload.status;
        if (action.payload.status === 'Completed' || action.payload.status === 'Closed') {
          item.completionDate = action.payload.completionDate || new Date().toISOString().split('T')[0];
        } else {
          item.completionDate = null;
        }
      }
    },
    updateCapaField: (state, action: PayloadAction<{ id: string; updates: Partial<CapaAction> }>) => {
      const idx = state.capaList.findIndex(c => c.id === action.payload.id);
      if (idx >= 0) {
        state.capaList[idx] = { ...state.capaList[idx], ...action.payload.updates };
      }
    },
    setFilterTab: (state, action: PayloadAction<'all' | 'Corrective Action' | 'Preventive Action'>) => {
      state.filterTab = action.payload;
    },
    setCapaFilterStatus: (state, action: PayloadAction<string>) => {
      state.filterStatus = action.payload;
    },
    setCapaFilterPriority: (state, action: PayloadAction<string>) => {
      state.filterPriority = action.payload;
    },
    setCapaSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setSelectedCapa: (state, action: PayloadAction<CapaAction | null>) => {
      state.selectedCapa = action.payload;
    }
  }
});

export const {
  addCapa,
  updateCapaStatus,
  updateCapaField,
  setFilterTab,
  setCapaFilterStatus,
  setCapaFilterPriority,
  setCapaSearchQuery,
  setSelectedCapa
} = capaSlice.actions;

export default capaSlice.reducer;
