import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { EvidenceRecord } from '../types';

interface EvidenceState {
  evidenceList: EvidenceRecord[];
  filterCategory: string;
  searchFilter: string;
  selectedEvidence: EvidenceRecord | null;
  completenessIndicator: {
    score: number;
    totalDocumentsRequired: number;
    documentsAvailable: number;
    gapsIdentified: number;
    notice: string;
  };
}

const initialEvidenceList: EvidenceRecord[] = [
  {
    id: "EVD-001",
    documentName: "QC Certificate of Analysis #CoA-9921",
    category: "Laboratory Analytical Report",
    date: "2026-03-25",
    description: "HPLC purity chromatogram showing Impurity D at 0.28% w/w with peak retention at 14.2 minutes.",
    verificationStatus: "Verified Fact",
    fileSize: "1.4 MB",
    uploadedBy: "Dr. Elena Rostova"
  },
  {
    id: "EVD-002",
    documentName: "Batch Manufacturing Record BMR-API-101-045",
    category: "Batch Manufacturing Record",
    date: "2026-03-24",
    description: "Official production batch record pages 42-58 detailing crystallization anti-solvent addition and operator sign-offs.",
    verificationStatus: "Verified Fact",
    fileSize: "8.2 MB",
    uploadedBy: "Marcus Vance"
  },
  {
    id: "EVD-003",
    documentName: "DeltaV SCADA Thermal Log R301-20260324",
    category: "Equipment Automation Log",
    date: "2026-03-24",
    description: "Continuous 1-second temperature and chilled glycol valve modulation trace demonstrating 4.2°C oscillation.",
    verificationStatus: "Verified Fact",
    fileSize: "4.5 MB",
    uploadedBy: "SCADA System Integration"
  },
  {
    id: "EVD-004",
    documentName: "Preventive Maintenance Calibration Record CAL-TT401",
    category: "Maintenance Record",
    date: "2026-03-26",
    description: "Post-incident calibration and valve actuator mechanical stroke inspection findings confirming stem adhesion.",
    verificationStatus: "Verified Fact",
    fileSize: "2.1 MB",
    uploadedBy: "Engineering Maintenance"
  },
  {
    id: "EVD-005",
    documentName: "Shift Operator Interview Notes - Shift B",
    category: "Operator Interview Notes",
    date: "2026-03-26",
    description: "Structured witness interview with primary crystallizer operator regarding alert acknowledgment and feed pump action.",
    verificationStatus: "Under Verification",
    fileSize: "420 KB",
    uploadedBy: "Marcus Vance"
  }
];

const initialState: EvidenceState = {
  evidenceList: initialEvidenceList,
  filterCategory: 'all',
  searchFilter: '',
  selectedEvidence: null,
  completenessIndicator: {
    score: 88,
    totalDocumentsRequired: 8,
    documentsAvailable: 5,
    gapsIdentified: 3,
    notice: "Completeness indicator measures document checklist coverage per ICH Q9. It is not regulatory proof of scientific closure."
  }
};

export const evidenceSlice = createSlice({
  name: 'evidence',
  initialState,
  reducers: {
    addEvidence: (state, action: PayloadAction<EvidenceRecord>) => {
      state.evidenceList.unshift(action.payload);
      state.completenessIndicator.documentsAvailable = state.evidenceList.length;
      state.completenessIndicator.score = Math.min(100, Math.round((state.evidenceList.length / state.completenessIndicator.totalDocumentsRequired) * 100));
    },
    removeEvidence: (state, action: PayloadAction<string>) => {
      state.evidenceList = state.evidenceList.filter(e => e.id !== action.payload);
    },
    updateEvidenceStatus: (state, action: PayloadAction<{ id: string; status: any }>) => {
      const item = state.evidenceList.find(e => e.id === action.payload.id);
      if (item) {
        item.verificationStatus = action.payload.status;
      }
    },
    setEvidenceFilterCategory: (state, action: PayloadAction<string>) => {
      state.filterCategory = action.payload;
    },
    setEvidenceSearch: (state, action: PayloadAction<string>) => {
      state.searchFilter = action.payload;
    },
    setSelectedEvidence: (state, action: PayloadAction<EvidenceRecord | null>) => {
      state.selectedEvidence = action.payload;
    }
  }
});

export const {
  addEvidence,
  removeEvidence,
  updateEvidenceStatus,
  setEvidenceFilterCategory,
  setEvidenceSearch,
  setSelectedEvidence
} = evidenceSlice.actions;

export default evidenceSlice.reducer;
