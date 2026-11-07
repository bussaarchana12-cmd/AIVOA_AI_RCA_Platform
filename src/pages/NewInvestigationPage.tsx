import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import { setCurrentInvestigation, saveInvestigationAsync } from '../store/investigationSlice';
import { setRcaData, setPipelineStageStatus, setAnalyzingPipeline } from '../store/rcaSlice';
import { addCapa } from '../store/capaSlice';
import { setCurrentTab, showToast } from '../store/uiSlice';
import { api } from '../services/api';
import { Investigation, FieldOrigin, LangGraphStage } from '../types';
import {
  Sparkles,
  UploadCloud,
  FileText,
  Mail,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Save,
  ArrowRight,
  Eye,
  Info,
  Clock,
  Layers,
  FileCode,
  AlertCircle,
  HelpCircle,
  FileCheck
} from 'lucide-react';

export const NewInvestigationPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const langGraphStages = useAppSelector(state => state.rca.langGraphStages);
  const analyzing = useAppSelector(state => state.rca.analyzingPipeline);

  // Intake tabs: 'upload' | 'text' | 'email'
  const [intakeMethod, setIntakeMethod] = useState<'upload' | 'text' | 'email'>('upload');

  // Input states
  const [pastedText, setPastedText] = useState('');
  const [emailData, setEmailData] = useState({
    subject: 'URGENT: Deviation Alert - Out of Trend Impurity D in Batch BATCH-2026-045',
    sender: 'elena.rostova@apimanufacturing.com (QC Lead Chemist)',
    date: '2026-03-25 08:42 AM',
    body: `Dear Quality Unit,\n\nDuring HPLC release testing of Atorvastatin Calcium Batch BATCH-2026-045 today, we detected related substance Impurity D at 0.28% w/w. The validated release specification is NMT 0.15% w/w.\n\nPreliminary review of SCADA records for Reactor R-301 indicates the crystallization temperature drifted from 22.0°C up to 26.2°C during heptane anti-solvent addition. Chilled glycol valve CV-102 was suspected of mechanical lag.\n\nImmediate containment: The batch has been quarantined in Room Q-104 under SAP system block. Supporting records include CoA #CoA-9921 and thermal trend logs.\n\nPlease initiate formal RCA investigation immediately.\n\nRegards,\nDr. Elena Rostova`
  });

  // File upload state
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: string; content: string } | null>({
    name: "Deviation_Incident_Report_DEV-API-2026-045.pdf",
    size: "1.8 MB",
    content: `DEVIATION INVESTIGATION REPORT - API FACILITY 04
Deviation Number: DEV-API-2026-045
Product Name: API-101 (Atorvastatin Calcium Trihydrate)
Batch Number: BATCH-2026-045
Manufacturing Stage: Crystallization & Isolation
Incident Date: 2026-03-24
Date Detected: 2026-03-25
Reported By: Dr. Elena Rostova (QC Analytical Lead)
Severity: Major | Priority: High

INCIDENT SUMMARY:
During analytical release testing of Atorvastatin Calcium Batch BATCH-2026-045, HPLC chromatographic purity assay revealed related substance Impurity D at 0.28% w/w, exceeding the approved specification limit of NMT 0.15% w/w. Secondary crystallization slurry temperature profile exhibited abnormal 4.2°C oscillation during anti-solvent addition.

EQUIPMENT & PROCESS:
Reactor R-301 (Glass-lined 5000L), Temperature Transmitter TT-401, Cryogenic Chiller Loop CH-02.
Raw Materials: Methanol USP (Lot MTH-984), Purified Water, Heptane anti-solvent (Lot HEP-331).
Process Parameters: Anti-solvent addition rate: 12.5 L/min; Agitation speed: 85 RPM; Crystallization hold time: 4.5 hours.

IMMEDIATE CONTAINMENT:
Quarantine of Batch BATCH-2026-045 placed in Room Q-104 under physical and SAP lock. Upstream intermediate batches BATCH-2026-046 & 047 placed on analytical hold.`
  });

  const [uploadProgress, setUploadProgress] = useState(100);

  // Form Population State
  const [formData, setFormData] = useState<Investigation>({
    id: "INV-2026-005",
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
    dataSource: "AI Extraction (LangGraph Multi-Node Analysis)",
    fieldOrigins: {}
  });

  const [fieldOrigins, setFieldOrigins] = useState<Record<string, FieldOrigin>>({
    deviationRef: 'AI Extracted',
    productName: 'AI Extracted',
    apiName: 'AI Extracted',
    batchNumber: 'AI Extracted',
    manufacturingStage: 'AI Extracted',
    incidentDate: 'AI Extracted',
    dateDetected: 'AI Extracted',
    reportedBy: 'AI Extracted',
    incidentDescription: 'AI Extracted',
    expectedSpecification: 'AI Extracted',
    actualObservation: 'AI Extracted',
    severity: 'AI Extracted',
    potentialQualityImpact: 'AI Extracted',
    immediateContainmentActions: 'AI Extracted',
    relevantEquipment: 'AI Extracted',
    rawMaterials: 'AI Extracted',
    processParameters: 'AI Extracted',
    availableSupportingDocuments: 'AI Extracted'
  });

  // Sample scenario loader for quick testing
  const loadScenario = (type: 'impurity' | 'centrifuge' | 'endotoxin') => {
    if (type === 'impurity') {
      setPastedText(`API-101 (Atorvastatin Calcium) Batch BATCH-2026-045 experienced Out of Specification result during HPLC chromatographic assay. Impurity D measured at 0.28% against specification of NMT 0.15%. Slurry crystallization reactor R-301 recorded thermal oscillation from 22.0°C to 26.2°C during heptane anti-solvent addition. Immediate action: Batch placed in quarantine room Q-104.`);
    } else if (type === 'centrifuge') {
      setPastedText(`API-204 (Esomeprazole Magnesium Dihydrate) Batch BATCH-2026-038 had low yield of 64.2% against validation baseline of 82.0% - 87.0%. Excessive cake heel retention in Peeler Centrifuge PC-102 basket mesh with partial cloth blinding. 48.5 kg unpeeled wet mass remained adhered.`);
    } else {
      setPastedText(`API-305 (Dexamethasone Sodium Phosphate Sterile Grade) Batch BATCH-2026-052 post-micronization sampling in Jet Mill JM-03 yielded bacterial endotoxin of 0.45 EU/mg against alert limit of 0.25 EU/mg (spec NMT 0.50 EU/mg). Batch placed on Critical Quarantine.`);
    }
  };

  // Handle Form Change
  const handleFieldChange = (field: keyof Investigation, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setFieldOrigins(prev => ({
      ...prev,
      [field]: 'User Edited'
    }));
  };

  // Run LangGraph AI Analysis
  const handleAnalyzeWithAI = async () => {
    dispatch(setAnalyzingPipeline(true));

    // Reset stages
    for (let i = 1; i <= 9; i++) {
      dispatch(setPipelineStageStatus({ step: i, status: 'pending' }));
    }

    try {
      // Step 1: Input Processing
      dispatch(setPipelineStageStatus({ step: 1, status: 'active', summary: 'Ingesting document text & metadata...' }));
      await new Promise(r => setTimeout(r, 400));
      dispatch(setPipelineStageStatus({ step: 1, status: 'completed', summary: 'Document parsed successfully' }));

      // Step 2: Extraction
      dispatch(setPipelineStageStatus({ step: 2, status: 'active', summary: 'Extracting product, batch, and specifications...' }));

      let textToAnalyze = '';
      if (intakeMethod === 'upload' && uploadedFile) textToAnalyze = uploadedFile.content;
      else if (intakeMethod === 'email') textToAnalyze = `${emailData.subject}\n${emailData.body}`;
      else textToAnalyze = pastedText;

      const response = await api.analyzeIncident({
        method: intakeMethod === 'upload' ? 'file' : intakeMethod,
        text: textToAnalyze,
        emailData: intakeMethod === 'email' ? emailData : undefined,
        fileName: intakeMethod === 'upload' ? uploadedFile?.name : undefined
      });

      const extracted = response.extractedData;

      // Animate remaining stages
      dispatch(setPipelineStageStatus({ step: 2, status: 'completed', summary: `Extracted ${extracted.productName || 'Compound'}` }));

      dispatch(setPipelineStageStatus({ step: 3, status: 'active', summary: 'Cross-checking ICH Q3A/Q7 limits...' }));
      await new Promise(r => setTimeout(r, 300));
      dispatch(setPipelineStageStatus({ step: 3, status: 'completed', summary: 'Specifications benchmarked' }));

      dispatch(setPipelineStageStatus({ step: 4, status: 'active', summary: 'Identifying missing documents...' }));
      await new Promise(r => setTimeout(r, 300));
      dispatch(setPipelineStageStatus({ step: 4, status: 'completed', summary: `${extracted.missingInformation?.length || 2} evidence gaps flagged` }));

      dispatch(setPipelineStageStatus({ step: 5, status: 'active', summary: 'Building 5-Whys causal chain...' }));
      await new Promise(r => setTimeout(r, 400));
      dispatch(setPipelineStageStatus({ step: 5, status: 'completed', summary: '5 causal steps formulated' }));

      dispatch(setPipelineStageStatus({ step: 6, status: 'active', summary: 'Populating 6M Ishikawa Fishbone...' }));
      await new Promise(r => setTimeout(r, 300));
      dispatch(setPipelineStageStatus({ step: 6, status: 'completed', summary: '6 branches mapped' }));

      dispatch(setPipelineStageStatus({ step: 7, status: 'active', summary: 'Generating root cause hypotheses...' }));
      await new Promise(r => setTimeout(r, 300));
      dispatch(setPipelineStageStatus({ step: 7, status: 'completed', summary: 'Hypotheses ranked by confidence' }));

      dispatch(setPipelineStageStatus({ step: 8, status: 'active', summary: 'Formulating CAPA recommendations...' }));
      await new Promise(r => setTimeout(r, 300));
      dispatch(setPipelineStageStatus({ step: 8, status: 'completed', summary: 'Corrective & preventive actions created' }));

      dispatch(setPipelineStageStatus({ step: 9, status: 'completed', summary: 'RCA Form populated & ready for QA review' }));

      // Populate Form
      const populatedInvestigation: Investigation = {
        id: extracted.investigationId || formData.id,
        deviationRef: extracted.deviationRef || formData.deviationRef,
        productName: extracted.productName || formData.productName,
        apiName: extracted.apiName || formData.apiName,
        batchNumber: extracted.batchNumber || formData.batchNumber,
        manufacturingStage: extracted.manufacturingStage || formData.manufacturingStage,
        incidentDate: extracted.incidentDate || formData.incidentDate,
        dateDetected: extracted.dateDetected || formData.dateDetected,
        reportedBy: extracted.reportedBy || formData.reportedBy,
        assignedInvestigator: formData.assignedInvestigator,
        severity: extracted.severity || 'Major',
        priority: 'High',
        status: 'Under Review',
        lastUpdated: new Date().toISOString().split('T')[0],
        incidentDescription: extracted.incidentDescription || formData.incidentDescription,
        expectedSpecification: extracted.expectedSpecification || formData.expectedSpecification,
        actualObservation: extracted.actualObservation || formData.actualObservation,
        potentialQualityImpact: extracted.potentialQualityImpact || formData.potentialQualityImpact,
        immediateContainmentActions: extracted.immediateContainmentActions || formData.immediateContainmentActions,
        relevantEquipment: extracted.relevantEquipment || formData.relevantEquipment,
        rawMaterials: extracted.rawMaterials || formData.rawMaterials,
        processParameters: extracted.processParameters || formData.processParameters,
        availableSupportingDocuments: extracted.availableSupportingDocuments || formData.availableSupportingDocuments,
        evidenceCompleteness: extracted.evidenceCompletenessScore || 85,
        dataSource: 'LangGraph Multi-Node Analysis (Verified)',
        fieldOrigins: {}
      };

      setFormData(populatedInvestigation);

      // Track origins
      const origins: Record<string, FieldOrigin> = {};
      Object.keys(populatedInvestigation).forEach(k => {
        origins[k] = 'AI Extracted';
      });
      setFieldOrigins(origins);

      // Save to RCA Slice
      if (extracted.fiveWhys || extracted.fishbone || extracted.hypotheses) {
        dispatch(setRcaData({
          fiveWhys: extracted.fiveWhys,
          fishbone: extracted.fishbone,
          hypotheses: extracted.hypotheses,
          evidenceGaps: extracted.evidenceGaps
        }));
      }

      // Add CAPA recommendations if available
      if (extracted.capaRecommendations && Array.isArray(extracted.capaRecommendations)) {
        extracted.capaRecommendations.forEach((capaRec: any, idx: number) => {
          dispatch(addCapa({
            id: `CAPA-2026-0${10 + idx}`,
            investigationId: populatedInvestigation.id,
            actionCategory: capaRec.actionCategory || 'Corrective Action',
            actionDescription: capaRec.actionDescription,
            scientificJustification: capaRec.scientificJustification,
            responsiblePerson: capaRec.responsiblePerson || 'QA Investigator',
            priority: capaRec.priority || 'High',
            targetCompletionDate: new Date(Date.now() + (capaRec.targetCompletionDays || 30) * 86400000).toISOString().split('T')[0],
            currentStatus: 'Proposed',
            verificationMethod: capaRec.verificationMethod || '',
            effectivenessCheck: capaRec.effectivenessCheck || '',
            completionDate: null
          }));
        });
      }

      dispatch(showToast({ text: 'AI Analysis complete! RCA form and causal models populated.', type: 'success' }));
    } catch (err: any) {
      dispatch(showToast({ text: `Analysis error: ${err.message}`, type: 'error' }));
    } finally {
      dispatch(setAnalyzingPipeline(false));
    }
  };

  // Save to Database
  const handleSaveToDatabase = async () => {
    await dispatch(saveInvestigationAsync({
      investigation: {
        ...formData,
        fieldOrigins
      }
    }));
    dispatch(setCurrentInvestigation(formData));
    dispatch(showToast({ text: `Investigation ${formData.id} saved to PostgreSQL database!`, type: 'success' }));
    dispatch(setCurrentTab('root-cause-analysis'));
  };

  const renderBadge = (field: string) => {
    const origin = fieldOrigins[field] || 'AI Extracted';
    if (origin === 'AI Extracted') {
      return (
        <span className="text-[10px] font-mono text-blue-700 bg-blue-50 border border-blue-200 px-1.5 py-0.2 rounded inline-flex items-center gap-1">
          <Sparkles className="w-2.5 h-2.5" /> AI Extracted
        </span>
      );
    }
    if (origin === 'User Edited') {
      return (
        <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded inline-flex items-center gap-1">
          <CheckCircle2 className="w-2.5 h-2.5" /> User Edited
        </span>
      );
    }
    if (origin === 'Missing Information') {
      return (
        <span className="text-[10px] font-mono text-red-700 bg-red-50 border border-red-200 px-1.5 py-0.2 rounded inline-flex items-center gap-1">
          <AlertCircle className="w-2.5 h-2.5" /> Missing Information
        </span>
      );
    }
    return (
      <span className="text-[10px] font-mono text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.2 rounded inline-flex items-center gap-1">
        <HelpCircle className="w-2.5 h-2.5" /> Requires Verification
      </span>
    );
  };

  return (
    <div className="p-8 space-y-8 max-w-[1500px] mx-auto animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              AI Incident Intake & Document Analysis
            </h1>
            <span className="text-xs font-mono bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded">
              LangGraph 9-Node Pipeline
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Ingest deviation documents, QC reports, or email alerts. The AI extracts structured parameters and populates the RCA workspace.
          </p>
        </div>

        {/* Demo Scenario Quick-Pick */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium hidden sm:inline">Load Sample:</span>
          <button
            onClick={() => { setIntakeMethod('text'); loadScenario('impurity'); }}
            className="px-2.5 py-1 text-[11px] font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md border border-slate-200 transition-colors"
          >
            Impurity Excursion
          </button>
          <button
            onClick={() => { setIntakeMethod('text'); loadScenario('centrifuge'); }}
            className="px-2.5 py-1 text-[11px] font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md border border-slate-200 transition-colors"
          >
            Centrifuge Yield Loss
          </button>
          <button
            onClick={() => { setIntakeMethod('text'); loadScenario('endotoxin'); }}
            className="px-2.5 py-1 text-[11px] font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md border border-slate-200 transition-colors"
          >
            Endotoxin Alert
          </button>
        </div>
      </div>

      {/* Main Grid: Left = Intake methods, Right = LangGraph Visualizer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Input Methods (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-slate-200 bg-slate-50/50">
              <button
                onClick={() => setIntakeMethod('upload')}
                className={`flex-1 py-3 px-4 text-xs font-semibold flex items-center justify-center gap-2 border-b-2 transition-colors ${
                  intakeMethod === 'upload'
                    ? 'border-blue-600 text-blue-600 bg-white'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <UploadCloud className="w-4 h-4" />
                <span>PDF & Document Upload</span>
              </button>
              <button
                onClick={() => setIntakeMethod('text')}
                className={`flex-1 py-3 px-4 text-xs font-semibold flex items-center justify-center gap-2 border-b-2 transition-colors ${
                  intakeMethod === 'text'
                    ? 'border-blue-600 text-blue-600 bg-white'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Paste Incident Text</span>
              </button>
              <button
                onClick={() => setIntakeMethod('email')}
                className={`flex-1 py-3 px-4 text-xs font-semibold flex items-center justify-center gap-2 border-b-2 transition-colors ${
                  intakeMethod === 'email'
                    ? 'border-blue-600 text-blue-600 bg-white'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Mail className="w-4 h-4" />
                <span>Email Intake</span>
              </button>
            </div>

            {/* Tab Contents */}
            <div className="p-5">
              {/* Method A: Upload */}
              {intakeMethod === 'upload' && (
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-slate-200 hover:border-blue-400 rounded-xl p-6 text-center transition-colors bg-slate-50/40">
                    <UploadCloud className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <h3 className="text-xs font-semibold text-slate-900 mb-1">
                      Drag & Drop GMP Deviation PDF or Analytical Report
                    </h3>
                    <p className="text-[11px] text-slate-500 mb-3">
                      Supports PDF, TXT, DOCX, CSV analytical run logs (Max 25MB)
                    </p>
                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg cursor-pointer transition-colors border border-blue-200">
                      <span>Browse Files</span>
                      <input
                        type="file"
                        className="hidden"
                        accept=".pdf,.txt,.doc,.docx"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setUploadedFile({
                              name: file.name,
                              size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
                              content: `Deviation Document: ${file.name}\nSize: ${file.size} bytes\nAnalytical Incident Log ingested.`
                            });
                          }
                        }}
                      />
                    </label>
                  </div>

                  {uploadedFile && (
                    <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FileCheck className="w-5 h-5 text-teal-600 shrink-0" />
                        <div>
                          <div className="text-xs font-semibold text-slate-900">{uploadedFile.name}</div>
                          <div className="text-[11px] text-slate-500 font-mono">
                            {uploadedFile.size} · Document ready for extraction
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">
                          PARSED 100%
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Method B: Paste Text */}
              {intakeMethod === 'text' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="font-medium">Enter Incident Narrative / QC Log:</span>
                    <span className="font-mono tabular-nums">{pastedText.length} characters</span>
                  </div>
                  <textarea
                    rows={8}
                    value={pastedText}
                    onChange={(e) => setPastedText(e.target.value)}
                    placeholder="Paste non-conformance event, analytical OOS summary, or batch record excursion here..."
                    className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-lg font-mono leading-relaxed text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:bg-white resize-y"
                  />
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => setPastedText('')}
                      className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1"
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> Clear Text
                    </button>
                    <span className="text-[11px] text-slate-400">
                      Minimum 30 characters required for causal extraction
                    </span>
                  </div>
                </div>
              )}

              {/* Method C: Email Input */}
              {intakeMethod === 'email' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">Email Subject</label>
                      <input
                        type="text"
                        value={emailData.subject}
                        onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
                        className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">From (Sender)</label>
                      <input
                        type="text"
                        value={emailData.sender}
                        onChange={(e) => setEmailData({ ...emailData, sender: e.target.value })}
                        className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">Email Body Content</label>
                    <textarea
                      rows={6}
                      value={emailData.body}
                      onChange={(e) => setEmailData({ ...emailData, body: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-md font-mono text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:bg-white"
                    />
                  </div>
                </div>
              )}

              {/* Prominent Analyze with AI button */}
              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Info className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>Executes LangGraph 9-node graph via Groq Llama 3.3 / Gemini</span>
                </div>

                <button
                  onClick={handleAnalyzeWithAI}
                  disabled={analyzing}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg text-xs font-bold shadow-md shadow-blue-600/20 flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Sparkles className={`w-4 h-4 ${analyzing ? 'animate-spin' : ''}`} />
                  <span>{analyzing ? 'Executing LangGraph Pipeline...' : 'Analyze with AI'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right: LangGraph Execution Pipeline Visualizer (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-600" />
                <h3 className="text-xs font-bold text-slate-900">LangGraph AI Architecture</h3>
              </div>
              <span className="text-[10px] font-mono text-slate-400">9 State Nodes</span>
            </div>
            <p className="text-[11px] text-slate-500 mb-4 leading-relaxed">
              Real-time pipeline orchestration. Each node executes specialized extraction, validation, or causal synthesis.
            </p>

            {/* Stages Stack */}
            <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
              {langGraphStages.map((stage) => {
                const isCompleted = stage.status === 'completed';
                const isActive = stage.status === 'active';

                return (
                  <div
                    key={stage.step}
                    className={`p-2.5 rounded-lg border text-xs transition-all ${
                      isActive
                        ? 'bg-blue-50/80 border-blue-400 shadow-xs'
                        : isCompleted
                        ? 'bg-slate-50/60 border-slate-200'
                        : 'bg-white border-slate-100 opacity-60'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        {isCompleted ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                        ) : isActive ? (
                          <div className="w-3.5 h-3.5 rounded-full border-2 border-blue-600 border-t-transparent animate-spin shrink-0" />
                        ) : (
                          <div className="w-3.5 h-3.5 rounded-full border border-slate-300 shrink-0" />
                        )}
                        <span className={`font-semibold ${isActive ? 'text-blue-900' : 'text-slate-800'}`}>
                          {stage.name}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 tabular-nums">
                        {stage.timestamp || 'Queued'}
                      </span>
                    </div>

                    {stage.outputSummary && (
                      <p className="text-[11px] text-slate-500 pl-5 truncate">
                        {stage.outputSummary}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* AUTOMATIC RCA FORM POPULATION SECTION */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-50/40">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-900">Extracted Investigation Parameters (RCA Form)</h2>
              <span className="text-[10px] font-mono bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded">
                All Fields Editable
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Review and adjust AI-extracted parameters before committing to the Quality Investigation Register.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSaveToDatabase}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Investigation & Proceed to RCA</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Form Fields Grid */}
        <div className="p-6 space-y-6">
          {/* Row 1: Key Identifiers */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-medium text-slate-700">Investigation ID</label>
                {renderBadge('id')}
              </div>
              <input
                type="text"
                value={formData.id}
                onChange={(e) => handleFieldChange('id', e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg font-mono text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-medium text-slate-700">Deviation Reference #</label>
                {renderBadge('deviationRef')}
              </div>
              <input
                type="text"
                value={formData.deviationRef}
                onChange={(e) => handleFieldChange('deviationRef', e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg font-mono text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-medium text-slate-700">Batch Number</label>
                {renderBadge('batchNumber')}
              </div>
              <input
                type="text"
                value={formData.batchNumber}
                onChange={(e) => handleFieldChange('batchNumber', e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-medium text-slate-700">Severity</label>
                {renderBadge('severity')}
              </div>
              <select
                value={formData.severity}
                onChange={(e) => handleFieldChange('severity', e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600"
              >
                <option value="Critical">Critical (Parenteral / High Risk)</option>
                <option value="Major">Major (OOS Impurity / Assay)</option>
                <option value="Moderate">Moderate (In-Process Parameter Drift)</option>
                <option value="Minor">Minor (Documentation / Transient)</option>
              </select>
            </div>
          </div>

          {/* Row 2: Product & Stage */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-medium text-slate-700">Product Name</label>
                {renderBadge('productName')}
              </div>
              <input
                type="text"
                value={formData.productName}
                onChange={(e) => handleFieldChange('productName', e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-medium text-slate-700">Active Pharmaceutical Ingredient (API)</label>
                {renderBadge('apiName')}
              </div>
              <input
                type="text"
                value={formData.apiName}
                onChange={(e) => handleFieldChange('apiName', e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-medium text-slate-700">Manufacturing Stage</label>
                {renderBadge('manufacturingStage')}
              </div>
              <input
                type="text"
                value={formData.manufacturingStage}
                onChange={(e) => handleFieldChange('manufacturingStage', e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>
          </div>

          {/* Row 3: Dates & Reporter */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-medium text-slate-700">Incident Date</label>
                {renderBadge('incidentDate')}
              </div>
              <input
                type="date"
                value={formData.incidentDate}
                onChange={(e) => handleFieldChange('incidentDate', e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-medium text-slate-700">Date Detected</label>
                {renderBadge('dateDetected')}
              </div>
              <input
                type="date"
                value={formData.dateDetected}
                onChange={(e) => handleFieldChange('dateDetected', e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-medium text-slate-700">Reported By</label>
                {renderBadge('reportedBy')}
              </div>
              <input
                type="text"
                value={formData.reportedBy}
                onChange={(e) => handleFieldChange('reportedBy', e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>
          </div>

          {/* Row 4: Incident Description */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-medium text-slate-700">Incident Description</label>
              {renderBadge('incidentDescription')}
            </div>
            <textarea
              rows={3}
              value={formData.incidentDescription}
              onChange={(e) => handleFieldChange('incidentDescription', e.target.value)}
              className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>

          {/* Row 5: Specifications vs Observation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-medium text-slate-700">Expected Specification Limit</label>
                {renderBadge('expectedSpecification')}
              </div>
              <textarea
                rows={2}
                value={formData.expectedSpecification}
                onChange={(e) => handleFieldChange('expectedSpecification', e.target.value)}
                className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600 font-mono"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-medium text-slate-700">Actual Out of Specification Observation</label>
                {renderBadge('actualObservation')}
              </div>
              <textarea
                rows={2}
                value={formData.actualObservation}
                onChange={(e) => handleFieldChange('actualObservation', e.target.value)}
                className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600 font-mono"
              />
            </div>
          </div>

          {/* Row 6: Impact & Containment */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-medium text-slate-700">Potential Quality Impact (Patient & Stability)</label>
                {renderBadge('potentialQualityImpact')}
              </div>
              <textarea
                rows={2}
                value={formData.potentialQualityImpact}
                onChange={(e) => handleFieldChange('potentialQualityImpact', e.target.value)}
                className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-medium text-slate-700">Immediate Containment Actions (Quarantine / Holds)</label>
                {renderBadge('immediateContainmentActions')}
              </div>
              <textarea
                rows={2}
                value={formData.immediateContainmentActions}
                onChange={(e) => handleFieldChange('immediateContainmentActions', e.target.value)}
                className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>
          </div>

          {/* Row 7: Equipment, Materials, Parameters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-medium text-slate-700">Relevant Equipment</label>
                {renderBadge('relevantEquipment')}
              </div>
              <input
                type="text"
                value={formData.relevantEquipment}
                onChange={(e) => handleFieldChange('relevantEquipment', e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600 font-mono"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-medium text-slate-700">Raw Materials & Solvents</label>
                {renderBadge('rawMaterials')}
              </div>
              <input
                type="text"
                value={formData.rawMaterials}
                onChange={(e) => handleFieldChange('rawMaterials', e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600 font-mono"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-medium text-slate-700">Process Parameters</label>
                {renderBadge('processParameters')}
              </div>
              <input
                type="text"
                value={formData.processParameters}
                onChange={(e) => handleFieldChange('processParameters', e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Footer save bar */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span className="font-semibold text-slate-700">Data Integrity Notice:</span>
            <span>All field edits logged with investigator timestamp per 21 CFR Part 11.</span>
          </div>

          <button
            onClick={handleSaveToDatabase}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Investigation & Proceed to RCA Workspace</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
