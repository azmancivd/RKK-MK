import React from 'react';
import {
  FolderGit2,
  FileCheck2,
  ClipboardList,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Sparkles,
  Printer,
  ChevronRight,
  Shield,
  Activity,
  AlertOctagon,
  Calendar,
  Layers,
} from 'lucide-react';
import { useAppStore, calculateRKKProgress } from '../../lib/store';
import { StatusBadge } from '../common/StatusBadge';
import { RKKDocument } from '../../types';

interface DashboardProps {
  onNavigate: (view: string) => void;
  onOpenNewRKKModal: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  onNavigate,
  onOpenNewRKKModal,
}) => {
  const {
    state,
    projects,
    currentProject,
    currentRKK,
  } = useAppStore();

  const activeProjectsCount = projects.filter((p) => p.status === 'ACTIVE').length;
  const rkkList = Object.values(state.rkkDocuments) as RKKDocument[];
  const rkkDraftCount = rkkList.filter((r) => r.status === 'DRAFT').length;
  const rkkReviewCount = rkkList.filter((r) => r.status === 'IN_REVIEW' || r.status === 'SUBMITTED').length;
  const rkkApprovedCount = rkkList.filter((r) => r.status === 'APPROVED' || r.status === 'FINAL').length;

  const currentInspections = currentProject ? state.inspections[currentProject.id] || [] : [];
  const currentFindings = currentProject ? state.findings[currentProject.id] || [] : [];
  const openFindingsCount = currentFindings.filter((f) => f.status !== 'CLOSED').length;
  const closedFindingsCount = currentFindings.filter((f) => f.status === 'CLOSED').length;

  const currentWeeklyReports = currentProject ? state.weeklyReports[currentProject.id] || [] : [];
  const currentMonthlyReports = currentProject ? state.monthlyReports[currentProject.id] || [] : [];

  // RKK Completion Progress calculation for current project
  const rkkId = currentRKK?.id || '';
  const progressData = calculateRKKProgress(
    currentProject,
    currentRKK,
    state.commitments[rkkId],
    state.hazards[rkkId],
    state.regulations[rkkId],
    state.supervisionPrograms[rkkId],
    currentProject ? state.personnel[currentProject.id] : undefined,
    state.safetyBudgets[rkkId],
    state.orgMembers[rkkId],
    currentProject ? state.safetyDocuments[currentProject.id] : undefined
  );

  const breakdown = [
    { label: 'Data Proyek', passed: progressData.checks?.dataProyek, weight: '10%' },
    { label: 'Cover Dokumen', passed: progressData.checks?.cover, weight: '5%' },
    { label: 'Lembar Pengesahan', passed: progressData.checks?.pengesahan, weight: '5%' },
    { label: 'Bab 1 Komitmen Rencana Aksi', passed: progressData.checks?.bab1Komitmen, weight: '10%' },
    { label: 'Bab 2 Identifikasi Bahaya & IBPRP', passed: progressData.checks?.bab2IdentifikasiBahaya, weight: '15%' },
    { label: 'Bab 2 Peraturan & Standar', passed: progressData.checks?.bab2Peraturan, weight: '5%' },
    { label: 'Bab 2 Sasaran & Program Pengawasan', passed: progressData.checks?.bab2SasaranProgram, weight: '10%' },
    { label: 'Bab 3 Personel & Sertifikat K3', passed: progressData.checks?.bab3Personel && progressData.checks?.bab3Sertifikat, weight: '15%' },
    { label: 'Bab 3 Biaya Penerapan SMKK (9 Komponen)', passed: progressData.checks?.bab3BiayaSMKK, weight: '10%' },
    { label: 'Bab 4 Bagan Organisasi & SOP/IK', passed: progressData.checks?.bab4StrukturOrganisasi && progressData.checks?.bab4SOPInstruksi, weight: '10%' },
    { label: 'Bab 5 Rekaman Laporan & Evaluasi', passed: progressData.checks?.bab5EvaluasiKinerja, weight: '5%' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner / Project Context */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-2xl p-5 sm:p-6 text-white shadow-lg border border-slate-800">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold border border-blue-400/30">
              <Shield className="w-3.5 h-3.5" />
              <span>Sistem Manajemen Keselamatan Konstruksi (Permen PUPR No. 10/2021)</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              {currentProject?.projectName || 'RKK Pengawasan & Manajemen Penyelenggaraan Konstruksi'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              Paket: <span className="text-white font-medium">{currentProject?.packageTitle}</span>
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-slate-300">
              <span>No Kontrak: <strong className="text-white">{currentProject?.contractNumber}</strong></span>
              <span>•</span>
              <span>PPK: <strong className="text-white">{currentProject?.ppkName}</strong></span>
              <span>•</span>
              <span>Status RKK: {currentRKK ? <StatusBadge status={currentRKK.status} type="rkk" /> : 'Belum Ada'}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => onNavigate('rkk-validation')}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              <span>Validasi Kelengkapan</span>
            </button>
            <button
              onClick={() => onNavigate('print-rkk')}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Dokumen RKK (A4)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        {/* Total Proyek */}
        <div
          onClick={() => onNavigate('projects-list')}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-blue-300 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Proyek</span>
            <FolderGit2 className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{projects.length}</div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">
            {activeProjectsCount} Proyek Aktif
          </div>
        </div>

        {/* RKK Status Summary */}
        <div
          onClick={() => onNavigate('rkk-document')}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-blue-300 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Status RKK</span>
            <FileCheck2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{rkkApprovedCount}</div>
          <div className="text-[11px] text-slate-500 font-medium mt-1 flex space-x-1.5">
            <span>{rkkDraftCount} Draft</span>
            <span>•</span>
            <span className="text-blue-600">{rkkReviewCount} Review</span>
          </div>
        </div>

        {/* Inspeksi Lapangan */}
        <div
          onClick={() => onNavigate('monitoring-inspections')}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-blue-300 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Inspeksi K3</span>
            <ClipboardList className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{currentInspections.length}</div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">
            Sesi pemeriksaan lapangan
          </div>
        </div>

        {/* Temuan Terbuka vs Closed */}
        <div
          onClick={() => onNavigate('monitoring-findings')}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-rose-300 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Temuan Terbuka</span>
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-bold text-rose-600">{openFindingsCount}</div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">
            {closedFindingsCount} Temuan Selesai (Closed)
          </div>
        </div>

        {/* Laporan K3 */}
        <div
          onClick={() => onNavigate('reports-weekly')}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-blue-300 cursor-pointer transition-all col-span-2 sm:col-span-1"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Laporan K3</span>
            <Activity className="w-4 h-4 text-cyan-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {currentWeeklyReports.length + currentMonthlyReports.length}
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">
            {currentWeeklyReports.length} Mingguan • {currentMonthlyReports.length} Bulanan
          </div>
        </div>
      </div>

      {/* RKK Completion Engine Card & Progress Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Progress Bar & Detailed Checklist */}
        <div className="lg:col-span-2 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-800 flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>Indikator Kelengkapan Dokumen RKK Pengawasan</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Evaluasi otomatis berdasarkan persyaratan Lampiran D.1 Permen PUPR No. 10/2021
              </p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-blue-600">{progressData.total}%</span>
              <span className="block text-[10px] text-slate-400 font-semibold uppercase">Tingkat Kelengkapan</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden border border-slate-200">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                progressData.total === 100
                  ? 'bg-emerald-500'
                  : progressData.total > 70
                  ? 'bg-blue-600'
                  : 'bg-amber-500'
              }`}
              style={{ width: `${progressData.total}%` }}
            />
          </div>

          {/* Breakdown Elements Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
            {breakdown.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2.5 rounded-lg border border-slate-100 bg-slate-50/70 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center space-x-2 truncate">
                  {item.passed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertOctagon className="w-4 h-4 text-amber-500 shrink-0" />
                  )}
                  <span className="text-xs font-medium text-slate-700 truncate">{item.label}</span>
                </div>
                <div className="flex items-center space-x-1.5 shrink-0">
                  <span className="text-[10px] text-slate-400 font-semibold">{item.weight}</span>
                  <span
                    className={`text-[11px] font-bold px-1.5 py-0.2 rounded ${
                      item.passed ? 'text-emerald-700 bg-emerald-100' : 'text-amber-700 bg-amber-100'
                    }`}
                  >
                    {item.passed ? 'Lengkap' : 'Perlu Diisi'}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-slate-100 text-xs">
            <span className="text-slate-500">
              *Dokumen RKK dapat dinaikkan ke status <strong>FINAL</strong> setelah kelengkapan wajib terpenuhi.
            </span>
            <button
              onClick={() => onNavigate('rkk-validation')}
              className="text-blue-600 font-semibold hover:text-blue-800 flex items-center"
            >
              Lihat Analisis Detail <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
            </button>
          </div>
        </div>

        {/* Right 1 Col: Quick Links & Safety Calendar Alerts */}
        <div className="space-y-6">
          {/* Quick Nav to 5 Bab */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              5 Bab Utama RKK Pengawasan/MK
            </h3>
            <div className="space-y-2">
              <button
                onClick={() => onNavigate('rkk-commitments')}
                className="w-full text-left p-2.5 rounded-lg border border-slate-100 hover:border-blue-200 hover:bg-blue-50/50 transition-colors flex items-center justify-between text-xs font-medium text-slate-700"
              >
                <span>Bab 1: Komitmen Rencana Aksi</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
              <button
                onClick={() => onNavigate('rkk-planning')}
                className="w-full text-left p-2.5 rounded-lg border border-slate-100 hover:border-blue-200 hover:bg-blue-50/50 transition-colors flex items-center justify-between text-xs font-medium text-slate-700"
              >
                <span>Bab 2: Identifikasi Bahaya & Perencanaan</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
              <button
                onClick={() => onNavigate('rkk-support')}
                className="w-full text-left p-2.5 rounded-lg border border-slate-100 hover:border-blue-200 hover:bg-blue-50/50 transition-colors flex items-center justify-between text-xs font-medium text-slate-700"
              >
                <span>Bab 3: Personel & 9 Biaya SMKK</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
              <button
                onClick={() => onNavigate('rkk-operations')}
                className="w-full text-left p-2.5 rounded-lg border border-slate-100 hover:border-blue-200 hover:bg-blue-50/50 transition-colors flex items-center justify-between text-xs font-medium text-slate-700"
              >
                <span>Bab 4: Bagan Organisasi & SOP/IK</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
              <button
                onClick={() => onNavigate('rkk-evaluation')}
                className="w-full text-left p-2.5 rounded-lg border border-slate-100 hover:border-blue-200 hover:bg-blue-50/50 transition-colors flex items-center justify-between text-xs font-medium text-slate-700"
              >
                <span>Bab 5: Evaluasi Penerapan SMKK</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          </div>

          {/* Monitoring Alert Box */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center space-x-2 text-slate-800 font-bold text-xs">
              <Calendar className="w-4 h-4 text-blue-600" />
              <span>Agenda & Pengingat Lapangan</span>
            </div>
            <div className="space-y-2 text-xs">
              <div className="p-2 bg-white rounded-lg border border-slate-200 flex items-start space-x-2">
                <Clock className="w-3.5 h-3.5 text-amber-500 mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-slate-800">Inspeksi Scaffolding Mingguan</p>
                  <p className="text-[11px] text-slate-500">Jumat, 08:00 WIB • Zona Barat Lantai 4</p>
                </div>
              </div>
              <div className="p-2 bg-white rounded-lg border border-slate-200 flex items-start space-x-2">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-500 mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-slate-800">Deadline Tindak Lanjut Grounding</p>
                  <p className="text-[11px] text-slate-500">Hari ini, 17:00 WIB • FIND-K3-002</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
