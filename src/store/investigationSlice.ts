import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { Investigation, DashboardMetrics } from '../types';

interface InvestigationState {
  investigations: Investigation[];
  currentInvestigation: Investigation | null;
  metrics: DashboardMetrics | null;
  loading: boolean;
  analyzing: boolean;
  error: string | null;
  searchQuery: string;
  filterStatus: string;
  filterSeverity: string;
  filterProduct: string;
}

const initialInvestigation: Investigation = {
  id: "INV-2026-001",
  deviationRef: "DEV-API-2026-045",
  productName: "API-101 (Atorvastatin Calcium Trihydrate)",
  apiName: "Atorvastatin Calcium",
  batchNumber: "BATCH-2026-045",
  manufacturingStage: "Crystallization & Isolation",
  incidentDate: "2026-03-24",
  dateDetected: "2026-03-25",
  reportedBy: "Dr. Elena Rostova (QC Lead)",
  assignedInvestigator: "Marcus Vance (Senior Quality Investigator)",
  severity: "Major",
  priority: "High",
  status: "Under Review",
  lastUpdated: "2026-03-28",
  incidentDescription: "During release testing of Atorvastatin Calcium Batch BATCH-2026-045, HPLC chromatographic purity assay revealed related substance Impurity D at 0.28% w/w, exceeding the approved specification limit of NMT 0.15% w/w. Secondary crystallization slurry temperature profile exhibited abnormal 4.2°C oscillation during anti-solvent addition.",
  expectedSpecification: "Related Impurity D: NMT 0.15% w/w. Slurry crystallization temperature: 22.0°C ± 1.0°C continuously.",
  actualObservation: "Related Impurity D measured at 0.28% w/w (re-test confirmed 0.27% w/w). Anti-solvent feed vessel TT-401 experienced sensor lag and thermal swing up to 26.2°C.",
  potentialQualityImpact: "High potential impact on finished formulation shelf-life and stability profile. Potential degraded solubility kinetics in solid oral dosage form.",
  immediateContainmentActions: "Quarantine of Batch BATCH-2026-045 placed in Room Q-104 under physical and SAP lock. Upstream intermediate batches BATCH-2026-046 & 047 placed on analytical hold.",
  relevantEquipment: "Reactor R-301 (Glass-lined 5000L), Temperature Transmitter TT-401, Cryogenic Chiller Loop CH-02",
  rawMaterials: "Methanol USP (Lot MTH-984), Purified Water (Loop PW-01), Anti-solvent Heptane (Lot HEP-331)",
  processParameters: "Anti-solvent addition rate: 12.5 L/min; Agitation speed: 85 RPM; Crystallization hold time: 4.5 hours",
  availableSupportingDocuments: ["QC Certificate of Analysis #CoA-9921", "Batch Manufacturing Record BMR-API-101-045", "DeltaV SCADA Thermal Log R301-20260324", "Maintenance Calibration Record CAL-TT401"],
  evidenceCompleteness: 88,
  dataSource: "Demonstration / Synthetic Training Data"
};

const initialState: InvestigationState = {
  investigations: [initialInvestigation],
  currentInvestigation: initialInvestigation,
  metrics: null,
  loading: false,
  analyzing: false,
  error: null,
  searchQuery: '',
  filterStatus: 'all',
  filterSeverity: 'all',
  filterProduct: 'all',
};

// Async thunks
export const fetchInvestigations = createAsyncThunk(
  'investigations/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch('/api/investigations');
      if (!res.ok) throw new Error('Failed to fetch investigations');
      return await res.json();
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchDashboardMetrics = createAsyncThunk(
  'investigations/fetchMetrics',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch('/api/dashboard/metrics');
      if (!res.ok) throw new Error('Failed to fetch metrics');
      return await res.json();
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const saveInvestigationAsync = createAsyncThunk(
  'investigations/save',
  async (payload: { investigation: Investigation; rca?: any; evidence?: any; capas?: any }, { rejectWithValue }) => {
    try {
      const res = await fetch('/api/investigations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload.investigation, rca: payload.rca, evidence: payload.evidence, capas: payload.capas })
      });
      if (!res.ok) throw new Error('Failed to save investigation');
      return await res.json();
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const investigationSlice = createSlice({
  name: 'investigations',
  initialState,
  reducers: {
    setCurrentInvestigation: (state, action: PayloadAction<Investigation>) => {
      state.currentInvestigation = action.payload;
    },
    updateCurrentField: (state, action: PayloadAction<{ field: keyof Investigation; value: any }>) => {
      if (state.currentInvestigation) {
        state.currentInvestigation[action.payload.field] = action.payload.value as never;
        state.currentInvestigation.lastUpdated = new Date().toISOString().split('T')[0];
        if (!state.currentInvestigation.fieldOrigins) {
          state.currentInvestigation.fieldOrigins = {};
        }
        state.currentInvestigation.fieldOrigins[action.payload.field as string] = 'User Edited';
      }
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setFilterStatus: (state, action: PayloadAction<string>) => {
      state.filterStatus = action.payload;
    },
    setFilterSeverity: (state, action: PayloadAction<string>) => {
      state.filterSeverity = action.payload;
    },
    setFilterProduct: (state, action: PayloadAction<string>) => {
      state.filterProduct = action.payload;
    },
    setAnalyzing: (state, action: PayloadAction<boolean>) => {
      state.analyzing = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInvestigations.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchInvestigations.fulfilled, (state, action) => {
        state.loading = false;
        state.investigations = action.payload;
        if (!state.currentInvestigation && action.payload.length > 0) {
          state.currentInvestigation = action.payload[0];
        }
      })
      .addCase(fetchInvestigations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchDashboardMetrics.fulfilled, (state, action) => {
        state.metrics = action.payload;
      })
      .addCase(saveInvestigationAsync.fulfilled, (state, action) => {
        const saved = action.payload.investigation;
        const idx = state.investigations.findIndex(i => i.id === saved.id);
        if (idx >= 0) {
          state.investigations[idx] = saved;
        } else {
          state.investigations.unshift(saved);
        }
        state.currentInvestigation = saved;
      });
  }
});

export const {
  setCurrentInvestigation,
  updateCurrentField,
  setSearchQuery,
  setFilterStatus,
  setFilterSeverity,
  setFilterProduct,
  setAnalyzing
} = investigationSlice.actions;

export default investigationSlice.reducer;
