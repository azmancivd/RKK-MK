import { useState, useEffect } from 'react';
import {
  UserProfile,
  Company,
  Project,
  RKKDocument,
  RKKCommitment,
  HazardIdentification,
  SafetyRegulation,
  SupervisionTargetProgram,
  Personnel,
  SafetyBudget,
  OrgMember,
  SafetyDocument,
  Inspection,
  Finding,
  JobSafetyAnalysis,
  WorkPermit,
  WeeklyReport,
  MonthlyReport,
  TestingCommissioning,
  FinalEvaluation,
  AuditLog,
  AppNotification,
  UserRole,
  RKKStatus,
} from '../types';
import {
  initialCompany,
  initialUser,
  initialProjects,
  initialRKKDocument,
  initialCommitment,
  initialHazards,
  initialRegulations,
  initialSupervisionPrograms,
  initialPersonnel,
  initialSafetyBudgets,
  initialOrgMembers,
  initialSafetyDocuments,
  initialInspections,
  initialFindings,
  initialJSA,
  initialWorkPermits,
  initialWeeklyReports,
  initialMonthlyReports,
  initialTestingCommissioning,
  initialFinalEvaluation,
  initialAuditLogs,
  initialNotifications,
} from './demoData';
import { supabase, isSupabaseConfigured } from './supabase';

const STORAGE_KEY = 'rkk_mk_app_data_v1';

interface AppState {
  currentUser: UserProfile;
  company: Company;
  projects: Project[];
  selectedProjectId: string;
  rkkDocuments: Record<string, RKKDocument>; // key: projectId
  commitments: Record<string, RKKCommitment>; // key: rkkId
  hazards: Record<string, HazardIdentification[]>; // key: rkkId
  regulations: Record<string, SafetyRegulation[]>; // key: rkkId
  supervisionPrograms: Record<string, SupervisionTargetProgram[]>; // key: rkkId
  personnel: Record<string, Personnel[]>; // key: projectId
  safetyBudgets: Record<string, SafetyBudget[]>; // key: rkkId
  orgMembers: Record<string, OrgMember[]>; // key: rkkId
  safetyDocuments: Record<string, SafetyDocument[]>; // key: projectId
  inspections: Record<string, Inspection[]>; // key: projectId
  findings: Record<string, Finding[]>; // key: projectId
  jsaList: Record<string, JobSafetyAnalysis[]>; // key: projectId
  workPermits: Record<string, WorkPermit[]>; // key: projectId
  weeklyReports: Record<string, WeeklyReport[]>; // key: projectId
  monthlyReports: Record<string, MonthlyReport[]>; // key: projectId
  testingList: Record<string, TestingCommissioning[]>; // key: projectId
  finalEvaluations: Record<string, FinalEvaluation>; // key: projectId
  auditLogs: AuditLog[];
  notifications: AppNotification[];
  isDemoMode: boolean;
  isOffline: boolean;
}

const defaultState: AppState = {
  currentUser: initialUser,
  company: initialCompany,
  projects: initialProjects,
  selectedProjectId: initialProjects[0].id,
  rkkDocuments: {
    'proj-001': initialRKKDocument,
  },
  commitments: {
    'rkk-001': initialCommitment,
  },
  hazards: {
    'rkk-001': initialHazards,
  },
  regulations: {
    'rkk-001': initialRegulations,
  },
  supervisionPrograms: {
    'rkk-001': initialSupervisionPrograms,
  },
  personnel: {
    'proj-001': initialPersonnel,
  },
  safetyBudgets: {
    'rkk-001': initialSafetyBudgets,
  },
  orgMembers: {
    'rkk-001': initialOrgMembers,
  },
  safetyDocuments: {
    'proj-001': initialSafetyDocuments,
  },
  inspections: {
    'proj-001': initialInspections,
  },
  findings: {
    'proj-001': initialFindings,
  },
  jsaList: {
    'proj-001': initialJSA,
  },
  workPermits: {
    'proj-001': initialWorkPermits,
  },
  weeklyReports: {
    'proj-001': initialWeeklyReports,
  },
  monthlyReports: {
    'proj-001': initialMonthlyReports,
  },
  testingList: {
    'proj-001': initialTestingCommissioning,
  },
  finalEvaluations: {
    'proj-001': initialFinalEvaluation,
  },
  auditLogs: initialAuditLogs,
  notifications: initialNotifications,
  isDemoMode: true,
  isOffline: false,
};

// Global Store Hook
let globalState = loadState();
const listeners = new Set<() => void>();

function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...defaultState, ...parsed };
    }
  } catch (e) {
    console.error('Error loading stored state:', e);
  }
  return defaultState;
}

function saveState(newState: AppState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
  } catch (e) {
    console.error('Error saving state:', e);
  }
}

function notifyListeners() {
  listeners.forEach((listener) => listener());
}

export function updateGlobalState(updater: (prev: AppState) => AppState) {
  globalState = updater(globalState);
  saveState(globalState);
  notifyListeners();
}

export function useAppStore() {
  const [state, setState] = useState<AppState>(globalState);

  useEffect(() => {
    const listener = () => setState(globalState);
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  const addAuditLog = (
    action: AuditLog['action'],
    module: string,
    recordIdentifier: string,
    description: string
  ) => {
    const newLog: AuditLog = {
      id: 'aud-' + Date.now(),
      timestamp: new Date().toISOString(),
      userName: state.currentUser.fullName,
      userRole: state.currentUser.role,
      action,
      module,
      recordIdentifier,
      description,
      ipAddress: '127.0.0.1',
    };
    updateGlobalState((prev) => ({
      ...prev,
      auditLogs: [newLog, ...prev.auditLogs],
    }));
  };

  const addNotification = (
    title: string,
    message: string,
    type: AppNotification['type'] = 'INFO',
    linkTo?: string
  ) => {
    const newNotif: AppNotification = {
      id: 'notif-' + Date.now(),
      title,
      message,
      type,
      timestamp: 'Baru saja',
      isRead: false,
      linkTo,
    };
    updateGlobalState((prev) => ({
      ...prev,
      notifications: [newNotif, ...prev.notifications],
    }));
  };

  const selectProject = (projectId: string) => {
    updateGlobalState((prev) => ({
      ...prev,
      selectedProjectId: projectId,
    }));
  };

  const switchUserRole = (role: UserRole) => {
    const roleNames: Record<UserRole, string> = {
      SUPER_ADMIN: 'Super Administrator',
      COMPANY_ADMIN: 'Direktur / Admin Perusahaan',
      TEAM_LEADER: 'Ir. Hendra Wijaya, ST., MT. (Team Leader)',
      SAFETY_ENGINEER: 'Drs. Wahyu Prasetyo, ST. (Ahli K3 Konstruksi)',
      INSPECTOR_ENGINEER: 'Faisal Akbar, ST. (Inspeksi Engineer)',
      QUALITY_ENGINEER: 'Rian Setyawan, ST. (Quality Engineer)',
      QUANTITY_ENGINEER: 'Budi Kurniawan, ST. (Quantity Engineer)',
      USER_CLIENT: 'Ahmad Fauzi, ST., M.Eng. (PPK / Pengguna Jasa)',
    };

    updateGlobalState((prev) => ({
      ...prev,
      currentUser: {
        ...prev.currentUser,
        role,
        fullName: roleNames[role] || 'User',
      },
    }));
    addAuditLog('UPDATE', 'User Profile', role, `Beralih peran (Role switch) ke ${role}`);
  };

  const resetToDemoData = () => {
    localStorage.removeItem(STORAGE_KEY);
    globalState = defaultState;
    saveState(globalState);
    notifyListeners();
  };

  return {
    state,
    currentUser: state.currentUser,
    company: state.company,
    projects: state.projects,
    selectedProjectId: state.selectedProjectId,
    currentProject: state.projects.find((p) => p.id === state.selectedProjectId) || state.projects[0],
    currentRKK: state.rkkDocuments[state.selectedProjectId],
    selectProject,
    switchUserRole,
    addAuditLog,
    addNotification,
    resetToDemoData,
    updateGlobalState,
  };
}

// RKK Completion Calculation (Permen PUPR Format Compliance)
export function calculateRKKProgress(
  project?: Project,
  rkk?: RKKDocument,
  commitment?: RKKCommitment,
  hazards?: HazardIdentification[],
  regulations?: SafetyRegulation[],
  programs?: SupervisionTargetProgram[],
  personnel?: Personnel[],
  budgets?: SafetyBudget[],
  orgMembers?: OrgMember[],
  documents?: SafetyDocument[]
) {
  if (!project || !rkk) return { total: 0, items: {} };

  const checks = {
    dataProyek: Boolean(project.projectName && project.contractNumber && project.clientInstitution),
    cover: Boolean(project.packageTitle && project.location && project.consultantName),
    pengesahan: Boolean(rkk.preparedBy && rkk.reviewedBy && rkk.approvedBy),
    bab1Komitmen: Boolean(commitment && commitment.commitmentPoints && commitment.commitmentPoints.length >= 5),
    bab2IdentifikasiBahaya: Boolean(hazards && hazards.length > 0),
    bab2Peraturan: Boolean(regulations && regulations.length > 0),
    bab2SasaranProgram: Boolean(programs && programs.length > 0),
    bab3Personel: Boolean(personnel && personnel.length > 0),
    bab3Sertifikat: Boolean(personnel && personnel.some((p) => p.certificates && p.certificates.length > 0)),
    bab3BiayaSMKK: Boolean(budgets && budgets.length > 0),
    bab4StrukturOrganisasi: Boolean(orgMembers && orgMembers.length >= 3),
    bab4SOPInstruksi: Boolean(documents && documents.length > 0),
    bab5EvaluasiKinerja: Boolean(rkk.status !== 'DRAFT'),
  };

  const weights: Record<keyof typeof checks, number> = {
    dataProyek: 10,
    cover: 5,
    pengesahan: 5,
    bab1Komitmen: 10,
    bab2IdentifikasiBahaya: 15,
    bab2Peraturan: 5,
    bab2SasaranProgram: 10,
    bab3Personel: 10,
    bab3Sertifikat: 5,
    bab3BiayaSMKK: 10,
    bab4StrukturOrganisasi: 5,
    bab4SOPInstruksi: 5,
    bab5EvaluasiKinerja: 5,
  };

  let totalScore = 0;
  let maxScore = 0;

  for (const [key, passed] of Object.entries(checks)) {
    const k = key as keyof typeof checks;
    maxScore += weights[k];
    if (passed) {
      totalScore += weights[k];
    }
  }

  const percentage = Math.round((totalScore / maxScore) * 100);

  return {
    total: percentage,
    checks,
  };
}
