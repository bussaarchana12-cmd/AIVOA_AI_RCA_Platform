import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { FiveWhyStep, FishboneCategories, RootCauseHypothesis, LangGraphStage, VerificationStatus } from '../types';

interface RcaState {
  fiveWhys: FiveWhyStep[];
  fishbone: FishboneCategories;
  hypotheses: RootCauseHypothesis[];
  evidenceGaps: Array<{ category: string; documentNeeded: string; rationale: string }>;
  langGraphStages: LangGraphStage[];
  analyzingPipeline: boolean;
  selectedFishboneCategory: keyof FishboneCategories;
}

const defaultFiveWhys: FiveWhyStep[] = [
  {
    step: 1,
    question: "Why did Batch BATCH-2026-045 fail the purity specification for Impurity D (0.28% vs NMT 0.15%)?",
    evidence: "QC CoA #CoA-9921 HPLC chromatogram peak area retention time 14.2 min.",
    aiAnswer: "Elevated levels of related substance Impurity D formed during secondary crystallizer slurry nucleation.",
    verificationStatus: "Verified Fact",
    userNotes: "Confirmed by dual HPLC assay runs in QC Laboratory."
  },
  {
    step: 2,
    question: "Why was Impurity D formed at higher rates during crystallization?",
    evidence: "DeltaV SCADA trend log reveals 4.2°C exothermic temperature oscillation up to 26.2°C during heptane anti-solvent addition.",
    aiAnswer: "The localized reaction mixture temperature exceeded the thermal degradation threshold of 23.5°C during anti-solvent dosing.",
    verificationStatus: "Verified Fact",
    userNotes: "Kinetics study previously showed Impurity D doubling rate per +3°C above 23°C."
  },
  {
    step: 3,
    question: "Why did the slurry temperature elevate to 26.2°C rather than maintaining 22.0°C ± 1.0°C?",
    evidence: "Cryogenic Chiller valve modulation logs show chilled glycol flow valve CV-102 failed to open beyond 28% despite thermal demand signal.",
    aiAnswer: "The cooling jacket feedback loop experienced pneumatic actuator mechanical sticking.",
    verificationStatus: "Verified Fact",
    userNotes: "Actuator stem had minor grease solidification and particulate accumulation."
  },
  {
    step: 4,
    question: "Why did the cooling valve actuator stick during this manufacturing campaign?",
    evidence: "Work Order #WO-8831 indicates preventive maintenance was deferred by 45 days due to campaign scheduling pressure.",
    aiAnswer: "Preventive valve stem refurbishment and lubricant replacement exceeded the validated 180-day service interval.",
    verificationStatus: "Verified Fact",
    userNotes: "Maintenance interval extended without formal Quality Risk Assessment (QRA)."
  },
  {
    step: 5,
    question: "Why was preventive maintenance deferred without a formal Quality Risk Assessment?",
    evidence: "Standard Operating Procedure SOP-MAINT-044 did not mandate QA approval for scheduling deferrals under 60 days.",
    aiAnswer: "Procedural governance gap in engineering maintenance deferral policy allowed critical GMP utility equipment maintenance postponement without quality risk evaluation.",
    verificationStatus: "Verified Root Cause",
    userNotes: "Confirmed systemic procedural root cause requiring immediate SOP revision and change control."
  }
];

const defaultFishbone: FishboneCategories = {
  man: [
    { factor: "Operators did not manually abort anti-solvent addition when temperature crossed 24°C alarm threshold", evidence: "SCADA alarm acknowledged but feed continued for 14 minutes", type: "Contributing Factor" },
    { factor: "Shift handover communication lacked specific alert on sticky valve behavior noted on prior batch", evidence: "Shift logbook entries BMR-044 & BMR-045", type: "Contributing Factor" }
  ],
  machine: [
    { factor: "Control valve CV-102 pneumatic actuator mechanical stem binding", evidence: "Actuator disassembly bench test report", type: "Root Cause" },
    { factor: "Temperature transmitter TT-401 experienced 18-second thermal lag in thermowell oil bath", evidence: "Calibration calibration audit CAL-TT401", type: "Contributing Factor" }
  ],
  method: [
    { factor: "SOP-MAINT-044 allowed maintenance deferral without mandatory QA risk assessment sign-off", evidence: "SOP revision 3.1 section 6.2 review", type: "Root Cause" },
    { factor: "Lack of automatic feed interlock cut-off on crystallization reactor over-temperature alarm", evidence: "PLC logic review DeltaV FBD-R301", type: "Contributing Factor" }
  ],
  material: [
    { factor: "Heptane anti-solvent lot HEP-331 temperature was 24.8°C at bulk storage drum", evidence: "Warehouse ambient temperature log", type: "Contributing Factor" },
    { factor: "Intermediate API crude cake purity was normal (99.4%)", evidence: "CoA #INTR-8891 - Ruled out", type: "Confirmed Fact" }
  ],
  measurement: [
    { factor: "HPLC method system suitability passed all RSD and resolution criteria", evidence: "QC analytical run logbook #QC-HPLC-09", type: "Confirmed Fact" },
    { factor: "Thermowell sensor response time verification not included in routine 6-month calibration checklist", evidence: "CAL-TT401 procedure review", type: "Contributing Factor" }
  ],
  motherNature: [
    { factor: "Crystallization cleanroom HVAC ambient temperature elevated to 24.5°C during external heatwave", evidence: "BMS Building Management System report", type: "Contributing Factor" }
  ]
};

const defaultHypotheses: RootCauseHypothesis[] = [
  {
    id: "HYP-01",
    causeDescription: "Pneumatic valve mechanical sticking on reactor cooling jacket caused localized thermal excursion leading to Impurity D degradation.",
    supportingEvidence: "SCADA temperature trend spike, actuator bench test failure, Impurity D kinetics curve.",
    opposingEvidence: "No cooling valve alarm triggered on operator HMI.",
    missingEvidence: "Thermocouple dual sensor redundant confirmation.",
    confidenceLevel: "High (94%)",
    status: "Confirmed Root Cause",
    classification: "Root Cause"
  },
  {
    id: "HYP-02",
    causeDescription: "Raw material Heptane solvent contamination or lot-to-lot impurity catalytic reaction.",
    supportingEvidence: "New solvent drum lot HEP-331 utilized for this specific batch.",
    opposingEvidence: "GC residual solvent test passed CoA specification; re-testing confirmed clean solvent blank.",
    missingEvidence: "Trace metal ICP-MS screening on heptane lot.",
    confidenceLevel: "Low (8%)",
    status: "Disproven Hypothesis",
    classification: "Unverified Assumption"
  },
  {
    id: "HYP-03",
    causeDescription: "Procedural lack of hard interlock shutting down anti-solvent pump on high-temperature deviation.",
    supportingEvidence: "Pump continued dosing for 14 minutes during 25°C - 26.2°C temperature excursion.",
    opposingEvidence: "Batch record directed operator to notify supervisor rather than immediate manual e-stop.",
    missingEvidence: "Historical run logs for other batches in same campaign.",
    confidenceLevel: "High (89%)",
    status: "Confirmed Contributing Factor",
    classification: "Contributing Factor"
  }
];

const defaultLangGraphStages: LangGraphStage[] = [
  { step: 1, name: "Node 1: Input Ingestion & Preprocessing", status: "completed", timestamp: "Ready" },
  { step: 2, name: "Node 2: Incident Detail Extraction", status: "completed", timestamp: "Ready" },
  { step: 3, name: "Node 3: GMP Data & Specification Validation", status: "completed", timestamp: "Ready" },
  { step: 4, name: "Node 4: Evidence Gap & Document Identification", status: "completed", timestamp: "Ready" },
  { step: 5, name: "Node 5: Five Whys Causal Ladder Generation", status: "completed", timestamp: "Ready" },
  { step: 6, name: "Node 6: Ishikawa Fishbone Categorization (6M)", status: "completed", timestamp: "Ready" },
  { step: 7, name: "Node 7: Evidence-Grounded Root Cause Hypotheses", status: "completed", timestamp: "Ready" },
  { step: 8, name: "Node 8: CAPA Recommendations & Effectiveness Criteria", status: "completed", timestamp: "Ready" },
  { step: 9, name: "Node 9: Structured JSON Validation & Verification Flagging", status: "completed", timestamp: "Ready" }
];

const initialState: RcaState = {
  fiveWhys: defaultFiveWhys,
  fishbone: defaultFishbone,
  hypotheses: defaultHypotheses,
  evidenceGaps: [
    { category: "Equipment", documentNeeded: "Control valve actuator teardown & seal wear audit", rationale: "Required to scientifically prove mechanical sticking mechanism" },
    { category: "Laboratory", documentNeeded: "LC-MS structural characterization of impurity peak", rationale: "Verify exact molecular structure and degradation pathway" },
    { category: "Method", documentNeeded: "ICH Q9 Quality Risk Assessment for maintenance deferral", rationale: "Ensure regulatory compliance for procedural change control" }
  ],
  langGraphStages: defaultLangGraphStages,
  analyzingPipeline: false,
  selectedFishboneCategory: 'machine'
};

export const rcaSlice = createSlice({
  name: 'rca',
  initialState,
  reducers: {
    setRcaData: (state, action: PayloadAction<{ fiveWhys?: FiveWhyStep[]; fishbone?: FishboneCategories; hypotheses?: RootCauseHypothesis[]; evidenceGaps?: any[] }>) => {
      if (action.payload.fiveWhys) state.fiveWhys = action.payload.fiveWhys;
      if (action.payload.fishbone) state.fishbone = action.payload.fishbone;
      if (action.payload.hypotheses) state.hypotheses = action.payload.hypotheses;
      if (action.payload.evidenceGaps) state.evidenceGaps = action.payload.evidenceGaps;
    },
    updateFiveWhyStep: (state, action: PayloadAction<{ index: number; step: Partial<FiveWhyStep> }>) => {
      if (state.fiveWhys[action.payload.index]) {
        state.fiveWhys[action.payload.index] = {
          ...state.fiveWhys[action.payload.index],
          ...action.payload.step
        };
      }
    },
    addFiveWhyStep: (state) => {
      const nextNum = state.fiveWhys.length + 1;
      state.fiveWhys.push({
        step: nextNum,
        question: `Why did the condition in step ${nextNum - 1} occur?`,
        evidence: "Documentary proof pending review",
        aiAnswer: "Investigator hypothesis pending validation",
        verificationStatus: "Under Verification",
        userNotes: ""
      });
    },
    removeFiveWhyStep: (state, action: PayloadAction<number>) => {
      state.fiveWhys.splice(action.payload, 1);
      state.fiveWhys.forEach((step, idx) => {
        step.step = idx + 1;
      });
    },
    addFishboneItem: (state, action: PayloadAction<{ category: keyof FishboneCategories; item: { factor: string; evidence: string; type: any } }>) => {
      state.fishbone[action.payload.category].push(action.payload.item);
    },
    removeFishboneItem: (state, action: PayloadAction<{ category: keyof FishboneCategories; index: number }>) => {
      state.fishbone[action.payload.category].splice(action.payload.index, 1);
    },
    updateHypothesisStatus: (state, action: PayloadAction<{ id: string; status: any; classification: any }>) => {
      const hyp = state.hypotheses.find(h => h.id === action.payload.id);
      if (hyp) {
        hyp.status = action.payload.status;
        hyp.classification = action.payload.classification;
      }
    },
    addHypothesis: (state, action: PayloadAction<RootCauseHypothesis>) => {
      state.hypotheses.push(action.payload);
    },
    setSelectedFishboneCategory: (state, action: PayloadAction<keyof FishboneCategories>) => {
      state.selectedFishboneCategory = action.payload;
    },
    setPipelineStageStatus: (state, action: PayloadAction<{ step: number; status: 'pending' | 'active' | 'completed' | 'error'; summary?: string }>) => {
      const stage = state.langGraphStages.find(s => s.step === action.payload.step);
      if (stage) {
        stage.status = action.payload.status;
        if (action.payload.summary) stage.outputSummary = action.payload.summary;
        stage.timestamp = new Date().toLocaleTimeString();
      }
    },
    setAnalyzingPipeline: (state, action: PayloadAction<boolean>) => {
      state.analyzingPipeline = action.payload;
    }
  }
});

export const {
  setRcaData,
  updateFiveWhyStep,
  addFiveWhyStep,
  removeFiveWhyStep,
  addFishboneItem,
  removeFishboneItem,
  updateHypothesisStatus,
  addHypothesis,
  setSelectedFishboneCategory,
  setPipelineStageStatus,
  setAnalyzingPipeline
} = rcaSlice.actions;

export default rcaSlice.reducer;
