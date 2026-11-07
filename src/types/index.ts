export type SeverityLevel = 'Critical' | 'Major' | 'Moderate' | 'Minor';
export type PriorityLevel = 'High' | 'Medium' | 'Low';
export type InvestigationStatus = 'Open' | 'In Progress' | 'Under Review' | 'CAPA Execution' | 'Completed' | 'Closed';

export type VerificationStatus =
  | 'Verified Fact'
  | 'Potential Cause'
  | 'Verified Root Cause'
  | 'Proposed Root Cause'
  | 'Under Verification'
  | 'Unverified Assumption'
  | 'Ruled Out';

export type FieldOrigin = 'AI Extracted' | 'User Edited' | 'Missing Information' | 'Requires Verification';

export interface Investigation {
  id: string;
  deviationRef: string;
  productName: string;
  apiName: string;
  batchNumber: string;
  manufacturingStage: string;
  incidentDate: string;
  dateDetected: string;
  reportedBy: string;
  assignedInvestigator: string;
  severity: SeverityLevel;
  priority: PriorityLevel;
  status: InvestigationStatus;
  lastUpdated: string;
  incidentDescription: string;
  expectedSpecification: string;
  actualObservation: string;
  potentialQualityImpact: string;
  immediateContainmentActions: string;
  relevantEquipment: string;
  rawMaterials: string;
  processParameters: string;
  availableSupportingDocuments: string[];
  evidenceCompleteness: number;
  dataSource?: string;
  fieldOrigins?: Record<string, FieldOrigin>;
}

export interface FiveWhyStep {
  step: number;
  question: string;
  evidence: string;
  aiAnswer: string;
  userNotes?: string;
  verificationStatus: VerificationStatus;
}

export interface FishboneItem {
  factor: string;
  evidence: string;
  type: 'Root Cause' | 'Contributing Factor' | 'Ruled Out' | 'Confirmed Fact' | 'Potential Cause';
}

export interface FishboneCategories {
  man: FishboneItem[];
  machine: FishboneItem[];
  method: FishboneItem[];
  material: FishboneItem[];
  measurement: FishboneItem[];
  motherNature: FishboneItem[];
}

export interface RootCauseHypothesis {
  id: string;
  causeDescription: string;
  supportingEvidence: string;
  opposingEvidence: string;
  missingEvidence: string;
  confidenceLevel: string;
  status: 'Confirmed Root Cause' | 'Potential Root Cause' | 'Disproven Hypothesis' | 'Confirmed Contributing Factor';
  classification: 'Root Cause' | 'Contributing Factor' | 'Unverified Assumption';
}

export interface EvidenceRecord {
  id: string;
  documentName: string;
  category: 'Laboratory Analytical Report' | 'Batch Manufacturing Record' | 'Equipment Automation Log' | 'Maintenance Record' | 'Environmental Monitoring' | 'Operator Interview Notes' | 'Other';
  date: string;
  description: string;
  verificationStatus: 'Verified Fact' | 'Under Verification' | 'Pending Review' | 'Discrepancy Flagged';
  fileSize: string;
  uploadedBy: string;
}

export interface EvidenceGap {
  category: string;
  documentNeeded: string;
  rationale: string;
}

export type CapaCategory = 'Corrective Action' | 'Preventive Action';
export type CapaStatus = 'Proposed' | 'Under Review' | 'Approved' | 'In Progress' | 'Completed' | 'Effectiveness Verification' | 'Closed';

export interface CapaAction {
  id: string;
  investigationId: string;
  actionCategory: CapaCategory;
  actionDescription: string;
  scientificJustification: string;
  responsiblePerson: string;
  priority: PriorityLevel;
  targetCompletionDate: string;
  currentStatus: CapaStatus;
  verificationMethod: string;
  effectivenessCheck: string;
  completionDate: string | null;
}

export interface LangGraphStage {
  step: number;
  name: string;
  status: 'pending' | 'active' | 'completed' | 'error';
  timestamp?: string;
  outputSummary?: string;
}

export interface DashboardMetrics {
  totalInvestigations: number;
  openInvestigations: number;
  underReviewInvestigations: number;
  completedInvestigations: number;
  pendingCapaActions: number;
  overdueCapaActions: number;
  severityDistribution: Record<SeverityLevel, number>;
  statusDistribution: Record<string, number>;
  monthlyTrends: Array<{ month: string; deviations: number; capasCompleted: number }>;
  recentInvestigations: Investigation[];
}
