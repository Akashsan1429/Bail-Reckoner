export type Role = 'PRISONER_FAMILY' | 'LAWYER' | 'NGO_ADMIN' | 'COURT_STAFF' | 'ADMIN';

export type CaseStatus = 'DRAFT' | 'EVALUATED' | 'ARCHIVED';

export type ChatRole = 'USER' | 'ASSISTANT';

export type VerdictOutcome = 'ELIGIBLE' | 'NOT_ELIGIBLE' | 'ELIGIBLE_WITH_CONDITIONS' | 'MANUAL_REVIEW';

export type RiskBand = 'LOW' | 'MEDIUM' | 'HIGH';

export interface UserDto {
  id: string;
  name: string;
  email: string;
  role: Role;
  organizationId?: string | null;
  organizationName?: string | null;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: UserDto;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role: Role;
  organizationId?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface CaseDto {
  id: string;
  caseNumber: string;
  firNumber?: string;
  policeStation?: string;
  offenceSection: string;
  offenceType?: string;
  maximumSentenceYears?: number;
  custodyStartDate?: string;
  firstTimeOffender: boolean;
  residentialStability: boolean;
  employmentStatus: string;
  dependents: number;
  previousCourtAppearances: number;
  previousAbsconding: boolean;
  witnessTampering: boolean;
  coAccused: boolean;
  evidenceType: string;
  caseStage: string;
  suretyAvailable: boolean;
  bondReady: boolean;
  identificationReady: boolean;
  status: CaseStatus;
  createdById: string;
  createdByName: string;
  organizationId?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCaseRequest {
  caseNumber: string;
  firNumber?: string;
  policeStation?: string;
  offenceSection: string;
  offenceType?: string;
  maximumSentenceYears?: number;
  custodyStartDate?: string;
  firstTimeOffender?: boolean;
  residentialStability?: boolean;
  employmentStatus?: string;
  dependents?: number;
  previousCourtAppearances?: number;
  previousAbsconding?: boolean;
  witnessTampering?: boolean;
  coAccused?: boolean;
  evidenceType?: string;
  caseStage?: string;
  suretyAvailable?: boolean;
  bondReady?: boolean;
  identificationReady?: boolean;
}

export interface UpdateCaseRequest extends Partial<CreateCaseRequest> {}

export interface CitationDto {
  law: string;
  section: string;
  source: string;
}

export interface RuleTraceEntry {
  ruleId: string;
  checkName: string;
  passed: boolean;
  details: string;
}

export interface VerdictDto {
  id: string;
  caseId: string;
  outcome: VerdictOutcome;
  riskBand: RiskBand;
  explanation: string;
  flightRiskScore: number;
  evidenceRiskScore: number;
  proceduralStatus: string;
  ruleTrace: RuleTraceEntry[];
  citations: CitationDto[];
  ruleEngineVersion: string;
  lawRepositoryVersion: string;
  evaluatedAt: string;
}

export interface LawSectionDto {
  id: string;
  lawName: string;
  sectionNumber: string;
  title: string;
  description: string;
  plainLanguageSummary: string;
  bailable: boolean;
  maximumSentenceYears: number;
  ipcEquivalent?: string;
  bnsEquivalent?: string;
  crpcEquivalent?: string;
  bnssEquivalent?: string;
  source: string;
  repositoryVersion: string;
  verifiedAt: string;
  active: boolean;
}

export interface ChatMessageRequest {
  sessionId?: string;
  caseId?: string;
  message: string;
}

export interface ChatResponse {
  sessionId: string;
  reply: string;
  citations: CitationDto[];
}

export interface ErrorResponse {
  status: number;
  error: string;
  message: string;
  details?: string[];
  timestamp: string;
}
