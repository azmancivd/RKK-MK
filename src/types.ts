// Types for RKK-MK (Sistem Manajemen Rencana Keselamatan Konstruksi Pengawasan / MK)
// Sesuai Permen PUPR No. 10 Tahun 2021 Lampiran D.1 & D.4

export type UserRole =
  | 'SUPER_ADMIN'
  | 'COMPANY_ADMIN'
  | 'TEAM_LEADER'
  | 'SAFETY_ENGINEER'
  | 'INSPECTOR_ENGINEER'
  | 'QUALITY_ENGINEER'
  | 'QUANTITY_ENGINEER'
  | 'USER_CLIENT';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  companyId: string;
  avatarUrl?: string;
  phoneNumber?: string;
  position?: string;
  createdAt: string;
}

export interface Company {
  id: string;
  name: string;
  businessEntity: string; // PT, CV, KSO, Firma
  nib: string;
  address: string;
  province: string;
  regency: string;
  district: string;
  phone: string;
  email: string;
  website?: string;
  directorName: string;
  authorizedRepName: string;
  logoUrl?: string;
  signatureUrl?: string;
  stampUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export type ProjectStatus = 'PLANNING' | 'ACTIVE' | 'ON_HOLD' | 'COMPLETED' | 'ARCHIVED';

export interface Project {
  id: string;
  companyId: string;
  packageTitle: string; // Nama Paket Pekerjaan
  projectName: string; // Nama Pekerjaan
  location: string;
  province: string;
  regency: string;
  district: string;
  village?: string;
  fundingSource: string; // APBN, APBD, Loan, BUMN, Swasta
  budgetYear: string;
  contractNumber: string;
  contractDate: string;
  contractValue: number; // Nilai kontrak dlm rupiah
  startDate: string;
  endDate: string;
  executionPeriodDays: number; // Masa pelaksanaan (hari kalender)
  maintenancePeriodDays?: number; // Masa pemeliharaan
  status: ProjectStatus;

  // Pengguna Jasa
  clientInstitution: string;
  clientOfficerName: string;
  clientOfficerPosition: string;
  clientOfficerNip?: string;
  clientOfficerPhone?: string;

  // PPK
  ppkName: string;
  ppkNip?: string;
  ppkPosition?: string;
  ppkPhone?: string;

  // Penyedia Jasa Kontraktor Pelaksana
  contractorName: string;
  contractorDirector: string;
  contractorPhone?: string;
  contractorAddress?: string;

  // Konsultan Supervisi / MK
  consultantName: string;
  teamLeaderName: string;
  consultantPhone?: string;

  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export type RKKStatus =
  | 'DRAFT'
  | 'IN_REVIEW'
  | 'REVISION_REQUIRED'
  | 'APPROVED_INTERNAL'
  | 'SUBMITTED'
  | 'APPROVED'
  | 'FINAL';

export interface RKKDocument {
  id: string;
  projectId: string;
  documentNumber: string;
  rkkNumber: string;
  version: string; // e.g. "Rev.00", "Rev.01"
  date: string;
  status: RKKStatus;
  preparedBy: string; // Ahli K3/Safety Engineer
  reviewedBy: string; // Team Leader
  approvedBy: string; // Pengguna Jasa / PPK
  revisionNotes?: string;
  history?: RKKRevisionHistory[];
  isLocked?: boolean;
  qrVerificationCode: string;
  createdAt: string;
  updatedAt: string;
}

export interface RKKRevisionHistory {
  id: string;
  version: string;
  date: string;
  reason: string;
  changedSections: string;
  changedBy: string;
  reviewedBy: string;
  approvedBy: string;
}

// Bab 1: Komitmen Rencana Aksi
export interface RKKCommitment {
  id: string;
  rkkId: string;
  companyName: string;
  packageName: string;
  city: string;
  date: string;
  headSupervisorName: string;
  headSupervisorPosition: string;
  signatureUrl?: string;
  commitmentPoints: string[];
}

// Bab 2: Perencanaan
export type RiskLevel = 'Kecil' | 'Sedang' | 'Besar' | 'Sangat Besar';

export interface HazardIdentification {
  id: string;
  rkkId: string;
  orderNumber: number;
  activityDescription: string; // Uraian Kegiatan (contoh: Pekerjaan Galian Tanah, Erection Girder)
  workStage: string; // Tahapan Pekerjaan (Persiapan, Struktur, ME, dll)
  supervisionActivity: string; // Aktivitas Pengawasan Konsultan
  hazardIdentification: string; // Identifikasi Bahaya
  riskDescription: string; // Paparan / Risiko
  probability: number; // 1-5 (Kekerapan)
  severity: number; // 1-5 (Keparahan)
  riskScore: number; // Probability x Severity
  riskLevel: RiskLevel; // Kecil, Sedang, Besar
  initialControls: string[]; // Pengendalian Awal (Eliminasi, Substitusi, Rekayasa, Administrasi, APD)
  residualProbability?: number;
  residualSeverity?: number;
  residualRiskScore?: number;
  residualRiskLevel?: RiskLevel;
  followUpControls?: string; // Pengendalian Lanjutan
  pic: string;
  supportingDoc?: string;
  status: 'SESUAI' | 'PERLU_PERBAIKAN' | 'DRAFT';
}

export interface SafetyRegulation {
  id: string;
  rkkId: string;
  orderNumber: number;
  methodDescription: string; // Metode Pelaksanaan
  regulationTitle: string; // Peraturan Perundangan & Persyaratan Lainnya
  numberAndYear: string; // Nomor & Tahun
  articleClause: string; // Pasal / Klausul
  notes?: string;
  documentUrl?: string;
}

export interface SupervisionTargetProgram {
  id: string;
  rkkId: string;
  orderNumber: number;
  activityDescription: string; // Uraian Kegiatan
  target: string; // Sasaran
  supervisionProgram: string; // Program Pengawasan
  benchmark: string; // Tolok Ukur
  pic: string; // Penanggung Jawab
  schedule: string; // Jadwal
  status: 'TERLAKSANA' | 'SEDANG_BERJALAN' | 'BELUM_TERLAKSANA';
  notes?: string;
}

// Bab 3: Dukungan
export type CertificateStatus = 'AKTIF' | 'AKAN_BERAKHIR' | 'KEDALUWARSA';

export interface Personnel {
  id: string;
  projectId: string;
  name: string;
  nik: string;
  position: string; // Ahli K3 Konstruksi, Ahli Teknik Jalan & Jembatan, Pengawas Lapangan, dll
  education: string;
  fieldOfExpertise: string;
  yearsOfExperience: number;
  photoUrl?: string;
  cvUrl?: string;
  certificates: PersonnelCertificate[];
}

export interface PersonnelCertificate {
  id: string;
  personnelId?: string;
  certificateNumber: string;
  certificateType: string; // SKA Ahli Muda K3 Konstruksi, SKT, dll
  issuingBody: string; // LPJK, BNSP, Kemenaker
  issueDate?: string;
  expiryDate?: string;
  validUntil?: string;
  isValid?: boolean;
  status?: CertificateStatus;
  fileUrl?: string;
}

export interface SafetyBudget {
  id: string;
  rkkId: string;
  orderNumber: number;
  componentCategory: string; // 9 Komponen Biaya SMKK (Penyiapan RKK, Sosialisasi/Pelatihan, APD/APK, Asuransi, Personel, Fasilitas Kesehatan, Rambu/Prasarana, Konsultasi, Kegiatan terkait)
  itemDescription: string; // Uraian
  volume: number;
  unit: string;
  unitPrice: number;
  totalPrice: number;
  notes?: string;
}

export type SafetyBudgetItem = SafetyBudget;

// Bab 4: Operasi
export interface OrgMember {
  id: string;
  rkkId: string;
  positionTitle?: string; // Pimpinan Pengawasan, Quality/Quantity Engineer, Inspeksi Engineer, Ahli K3 Pengawasan
  position?: string;
  name?: string;
  personnelName?: string;
  reportsToPosition?: string;
  duties?: string[]; // Tugas
  responsibilities: string[]; // Tanggung Jawab
  authorities?: string[]; // Kewenangan
}

export type SafetyDocCategory = 'SOP' | 'INSTRUKSI_KERJA' | 'FORM' | 'PEDOMAN' | 'CHECKLIST';
export type SafetyDocStatus = 'DRAFT' | 'REVIEW' | 'APPROVED' | 'OBSOLETE' | 'AKTIF';

export interface SafetyDocument {
  id: string;
  projectId: string;
  category?: SafetyDocCategory;
  type?: string;
  code?: string;
  docNumber?: string;
  title: string;
  revision?: string;
  effectiveDate?: string;
  preparedBy?: string;
  reviewedBy?: string;
  approvedBy?: string;
  status: SafetyDocStatus;
  fileUrl?: string;
  contentSummary?: string;
  description?: string;
}

// Bab 5 & Monitoring
export type InspectionStatus = 'OPEN' | 'FOLLOW_UP' | 'VERIFICATION' | 'CLOSED' | 'COMPLETED';
export type PriorityLevel = 'RENDAH' | 'SEDANG' | 'TINGGI' | 'KRITIS';

export interface InspectionItem {
  id: string;
  category: string;
  itemDescription: string;
  result: 'PASS' | 'FAIL';
  notes?: string;
}

export interface Inspection {
  id: string;
  projectId: string;
  inspectionNumber?: string;
  date?: string;
  inspectionDate?: string;
  location: string;
  activity?: string;
  inspectorName: string;
  contractorRepresentative?: string;
  weather?: string;
  summary?: string;
  conditionDescription?: string;
  findings?: string;
  identifiedRisk?: string;
  correctiveAction?: string;
  pic?: string;
  deadline?: string;
  status: InspectionStatus;
  photos?: InspectionPhoto[];
  items?: InspectionItem[];
  findingsCount?: number;
  createdAt?: string;
}

export interface InspectionPhoto {
  id: string;
  inspectionId?: string;
  findingId?: string;
  photoUrl: string;
  caption: string;
  date: string;
  location: string;
  coordinates?: string;
  uploaderName: string;
}

export type FindingStatus = 'OPEN' | 'IN_PROGRESS' | 'SUBMITTED' | 'VERIFIED' | 'CLOSED';

export interface Finding {
  id: string;
  projectId: string;
  findingNumber: string;
  date: string;
  source: 'INSPEKSI_RUTIN' | 'PATROLI_K3' | 'LAPORAN_PEKERJA' | 'AUDIT';
  location: string;
  description: string;
  priority: PriorityLevel;
  pic: string;
  deadline: string;
  correctiveActionPlan: string;
  completionProofUrl?: string;
  completionDate?: string;
  verifierName?: string;
  status: FindingStatus;
  photos: InspectionPhoto[];
}

export interface JSAItem {
  step: number;
  workStep: string;
  hazard: string;
  risk: string;
  controlMeasure: string;
  pic: string;
}

export interface JobSafetyAnalysis {
  id: string;
  projectId: string;
  jsaNumber: string;
  jobName: string;
  workStage: string;
  location: string;
  date: string;
  preparedBy: string; // Supervisor / Kontraktor
  reviewedBy: string; // Safety Engineer Pengawas
  approvedBy: string; // Team Leader / Pengguna Jasa
  items: JSAItem[];
  status: 'DRAFT' | 'APPROVED' | 'REJECTED';
}

export type WorkPermitType =
  | 'HOT_WORK' // Pekerjaan Panas
  | 'EXCAVATION' // Pekerjaan Galian > 2m
  | 'HEIGHT' // Pekerjaan di Ketinggian
  | 'CONFINED_SPACE' // Ruang Terbatas
  | 'LIFTING' // Pengangkatan / Alat Berat
  | 'ELECTRICAL' // Pekerjaan Listrik
  | 'NIGHT_WORK'; // Kerja Malam

export interface WorkPermit {
  id: string;
  projectId: string;
  permitNumber: string;
  permitType: WorkPermitType;
  location: string;
  startDate: string;
  endDate: string;
  applicantName: string;
  contractorTeam: string;
  workersCount: number;
  safetyChecklist: { question: string; isCompliant: boolean; note?: string }[];
  requiredApd: string[];
  supervisorSign?: string;
  safetyOfficerSign?: string;
  clientApproverSign?: string;
  status: 'SUBMITTED' | 'APPROVED' | 'REJECTED' | 'EXPIRED' | 'CLOSED';
}

export interface WeeklyReport {
  id: string;
  projectId: string;
  reportNumber: string;
  weekNumber: number;
  startDate: string;
  endDate: string;
  supervisionActivitiesSummary: string;
  inspectionsConductedCount: number;
  openFindingsCount: number;
  closedFindingsCount: number;
  permitsIssuedCount: number;
  safeManHours: number;
  incidentCount: number;
  recommendations: string;
  preparedBy: string;
  approvedBy: string;
  status: 'DRAFT' | 'SUBMITTED' | 'APPROVED';
}

export interface MonthlyReport {
  id: string;
  projectId: string;
  reportNumber: string;
  month?: string; // e.g., "September 2026"
  monthName?: string;
  executiveSummary: string;
  severityRate: number; // SR
  frequencyRate: number; // FR
  zeroAccidentStatus: boolean;
  inspectionsSummary: string;
  findingsAnalysis: string;
  testingCommissioningSummary: string;
  kpiScore: number; // out of 100
  recommendations: string;
  preparedBy: string;
  approvedBy: string;
  status: 'DRAFT' | 'SUBMITTED' | 'APPROVED';
}

export interface TestingCommissioning {
  id: string;
  projectId: string;
  itemNumber?: string;
  equipmentOrSystemName?: string;
  type?: 'ALAT_BERAT' | 'INSTALASI_LISTRIK' | 'SISTEM_PROTEKSI_KEBAKARAN' | 'SCAFFOLDING' | 'PERALATAN_ANGKAT';
  serialNumberOrTag?: string;
  workDescription?: string;
  date?: string;
  testDate?: string;
  location?: string;
  method?: string;
  appliedStandard?: string;
  testResult?: 'LAIK_OPERASI' | 'PERLU_PERBAIKAN' | 'TIDAK_LAIK';
  silOExpirationDate?: string;
  sioOperatorNumber?: string;
  certificateOrDocRef?: string;
  certificateUrl?: string;
  notes?: string;
  recommendations?: string;
  inspectorName?: string;
  testResults?: { item: string; standard: string; actual: string; result: 'PASS' | 'FAIL' }[];
  status: 'LAIK_OPERASI' | 'PERLU_PERBAIKAN' | 'TIDAK_LAIK' | 'PENDING' | 'COMPLETED' | 'FOLLOW_UP';
}

export interface FinalEvaluation {
  id: string;
  projectId: string;
  completionDate?: string;
  phoDate?: string;
  fhoDate?: string;
  overallComplianceScore?: number; // 0-100%
  totalInspections?: number;
  totalFindings?: number;
  resolvedFindings?: number;
  totalSafeManHours?: number;
  totalIncidents?: number;
  zeroAccidentAchieved?: boolean;
  zeroAccidentAwardNominated?: boolean;
  contractorPerformanceScore?: number;
  consultantPerformanceScore?: number;
  environmentalCompliance?: string;
  lessonsLearned?: string;
  conclusionNote?: string;
  finalRecommendations?: string;
  evaluatorName?: string;
  evaluatedBy?: string;
  approvedByPpk?: string;
  clientReviewNotes?: string;
  signedReportUrl?: string;
  asBuiltSafetyDocumentsUrl?: string;
}

export interface ApprovalRecord {
  id: string;
  rkkId: string;
  stage: RKKStatus;
  actorRole: UserRole;
  actorName: string;
  decision: 'APPROVE' | 'REJECT' | 'REQUEST_REVISION';
  comments?: string;
  timestamp: string;
  signatureUrl?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userName: string;
  userRole: UserRole;
  action: 'LOGIN' | 'LOGOUT' | 'CREATE' | 'UPDATE' | 'DELETE' | 'APPROVAL' | 'GENERATE_PDF' | 'REVISION';
  module: string;
  recordIdentifier: string;
  description: string;
  ipAddress?: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'INFO' | 'WARNING' | 'ALERT' | 'SUCCESS';
  timestamp: string;
  isRead: boolean;
  linkTo?: string;
}

export interface RKKTemplate {
  id: string;
  name: string;
  category: 'GEDUNG' | 'JALAN' | 'JEMBATAN' | 'IRIGASI' | 'DRAINASE' | 'AIR_MINUM' | 'SANITASI';
  description: string;
  sampleHazards: Partial<HazardIdentification>[];
  sampleRegulations: Partial<SafetyRegulation>[];
  samplePrograms: Partial<SupervisionTargetProgram>[];
}
