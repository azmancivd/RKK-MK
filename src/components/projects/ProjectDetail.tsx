import React, { useState } from 'react';
import {
  Building2,
  Calendar,
  DollarSign,
  FileCheck2,
  Layers,
  MapPin,
  Shield,
  UserCheck,
  CheckCircle2,
  ExternalLink,
  Edit2,
  FileText,
  AlertTriangle,
  History,
  ClipboardList,
} from 'lucide-react';
import { useAppStore, calculateRKKProgress } from '../../lib/store';
import { StatusBadge } from '../common/StatusBadge';

interface ProjectDetailProps {
  onNavigate: (view: string) => void;
  onOpenEditModal: () => void;
}

export const ProjectDetail: React.FC<ProjectDetailProps> = ({
  onNavigate,
  onOpenEditModal,
}) => {
  const { currentProject, currentRKK, state } = useAppStore();
  const [activeTab, setActiveTab] = useState<
    | 'OVERVIEW'
    | 'DATA_PROYEK'
    | 'RKK'
    | 'PERENCANAAN'
    | 'PERSONEL'
    | 'OPERASI'
    | 'MONITORING'
    | 'LAPORAN'
    | 'DOKUMEN'
    | 'APPROVAL'
    | 'AUDIT_LOG'
  >('OVERVIEW');

  if (!currentProject) {
    return (
      <div className="bg-white p-8 text-center rounded-2xl border border-slate-200">
        <p className="text-sm text-slate-500">Pilih proyek terlebih dahulu.</p>
      </div>
    );
  }

  const rkkId = currentRKK?.id || '';
  const progress = calculateRKKProgress(
    currentProject,
    currentRKK,
    state.commitments[rkkId],
    state.hazards[rkkId],
    state.regulations[rkkId],
    state.supervisionPrograms[rkkId],
    state.personnel[currentProject.id],
    state.safetyBudgets[rkkId],
    state.orgMembers[rkkId],
    state.safetyDocuments[currentProject.id]
  );

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const currentInspections = state.inspections[currentProject.id] || [];
  const currentFindings = state.findings[currentProject.id] || [];
  const currentJSA = state.jsaList[currentProject.id] || [];
  const currentPermits = state.workPermits[currentProject.id] || [];
  const currentPersonnel = state.personnel[currentProject.id] || [];

  return (
    <div className="space-y-6">
      {/* Detail Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 uppercase">
                {currentProject.status}
              </span>
              <span className="text-xs font-semibold text-slate-500">
                TA {currentProject.budgetYear} • {currentProject.fundingSource}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {currentProject.projectName}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              {currentProject.packageTitle}
            </p>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={onOpenEditModal}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Ubah Data</span>
            </button>
            <button
              onClick={() => onNavigate('print-rkk')}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-xs"
            >
              <FileCheck2 className="w-4 h-4" />
              <span>Lihat RKK Dokumen</span>
            </button>
          </div>
        </div>

        {/* Quick Meta Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-100 text-xs">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Nomor Kontrak</span>
            <p className="font-semibold text-slate-800 truncate">{currentProject.contractNumber}</p>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Nilai Kontrak</span>
            <p className="font-bold text-emerald-700">{formatRupiah(currentProject.contractValue)}</p>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Masa Pelaksanaan</span>
            <p className="text-slate-700">{currentProject.executionPeriodDays} Hari Kalender</p>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Status Dokumen RKK</span>
            <div className="mt-0.5">
              {currentRKK ? <StatusBadge status={currentRKK.status} type="rkk" /> : 'Belum Terdaftar'}
            </div>
          </div>
        </div>
      </div>

      {/* 11 Navigation Tabs */}
      <div className="flex border-b border-slate-200 bg-white rounded-t-xl px-4 overflow-x-auto">
        {[
          { id: 'OVERVIEW', label: 'Overview' },
          { id: 'DATA_PROYEK', label: 'Data Proyek' },
          { id: 'RKK', label: 'RKK Dokumen' },
          { id: 'PERENCANAAN', label: 'Perencanaan K3' },
          { id: 'PERSONEL', label: 'Personel' },
          { id: 'OPERASI', label: 'Operasi & SOP' },
          { id: 'MONITORING', label: 'Monitoring' },
          { id: 'LAPORAN', label: 'Laporan K3' },
          { id: 'DOKUMEN', label: 'Dokumen' },
          { id: 'APPROVAL', label: 'Approval' },
          { id: 'AUDIT_LOG', label: 'Audit Log' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`py-3 px-3.5 text-xs font-bold whitespace-nowrap border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content Panes */}
      <div className="bg-white rounded-b-xl border border-slate-200 p-6 shadow-xs">
        {activeTab === 'OVERVIEW' && (
          <div className="space-y-6">
            {/* Progress Bar */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-700">Tingkat Kelengkapan Dokumen RKK</span>
                <span className="text-blue-600">{progress.total}% Lengkap</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-blue-600 h-full rounded-full transition-all duration-300"
                  style={{ width: `${progress.total}%` }}
                />
              </div>
            </div>

            {/* Quick Summary Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl border border-slate-200 space-y-1">
                <span className="text-xs font-bold text-slate-500 uppercase">Inspeksi K3</span>
                <p className="text-2xl font-black text-slate-900">{currentInspections.length}</p>
                <button
                  onClick={() => onNavigate('monitoring-inspections')}
                  className="text-xs text-blue-600 font-semibold hover:underline"
                >
                  Buka Modul Inspeksi →
                </button>
              </div>
              <div className="p-4 rounded-xl border border-slate-200 space-y-1">
                <span className="text-xs font-bold text-slate-500 uppercase">Temuan K3 Lapangan</span>
                <p className="text-2xl font-black text-rose-600">{currentFindings.length}</p>
                <button
                  onClick={() => onNavigate('monitoring-findings')}
                  className="text-xs text-blue-600 font-semibold hover:underline"
                >
                  Kelola Temuan & Tindak Lanjut →
                </button>
              </div>
              <div className="p-4 rounded-xl border border-slate-200 space-y-1">
                <span className="text-xs font-bold text-slate-500 uppercase">Surat Izin Kerja (PTW)</span>
                <p className="text-2xl font-black text-indigo-600">{currentPermits.length}</p>
                <button
                  onClick={() => onNavigate('monitoring-permits')}
                  className="text-xs text-blue-600 font-semibold hover:underline"
                >
                  Buka Daftar Izin Kerja →
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'DATA_PROYEK' && (
          <div className="space-y-6 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-slate-800 border-b pb-1">Identitas Kontrak Pekerjaan</h4>
                <div>
                  <span className="text-slate-400 block">Nama Paket:</span>
                  <span className="font-semibold text-slate-800">{currentProject.packageTitle}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Nomor & Tanggal Kontrak:</span>
                  <span className="font-semibold text-slate-800">
                    {currentProject.contractNumber} ({currentProject.contractDate})
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">Nilai Kontrak Pengawasan:</span>
                  <span className="font-bold text-emerald-700">{formatRupiah(currentProject.contractValue)}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Lokasi & Wilayah:</span>
                  <span className="font-semibold text-slate-800">
                    {currentProject.location}, {currentProject.regency}, {currentProject.province}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-bold text-slate-800 border-b pb-1">Pihak Terkait Pengawasan</h4>
                <div>
                  <span className="text-slate-400 block">Pengguna Jasa / Satker:</span>
                  <span className="font-semibold text-slate-800">{currentProject.clientInstitution}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Pejabat Pembuat Komitmen (PPK):</span>
                  <span className="font-semibold text-slate-800">
                    {currentProject.ppkName} (NIP: {currentProject.ppkNip || '-'})
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">Kontraktor Pelaksana:</span>
                  <span className="font-semibold text-slate-800">{currentProject.contractorName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Konsultan Pengawas / MK:</span>
                  <span className="font-semibold text-slate-800">
                    {currentProject.consultantName} • TL: {currentProject.teamLeaderName}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'RKK' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-800">Dokumen RKK Pengawasan</h4>
                <p className="text-xs text-slate-500">Nomor: {currentRKK?.documentNumber || '-'}</p>
              </div>
              <button
                onClick={() => onNavigate('rkk-document')}
                className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                Buka Editor RKK
              </button>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
              <p><strong>Penyusun:</strong> {currentRKK?.preparedBy}</p>
              <p><strong>Pemeriksa:</strong> {currentRKK?.reviewedBy}</p>
              <p><strong>Penyetuju (Pengguna Jasa):</strong> {currentRKK?.approvedBy}</p>
              <p><strong>Versi Terakhir:</strong> {currentRKK?.version}</p>
            </div>
          </div>
        )}

        {activeTab === 'PERENCANAAN' && (
          <div className="space-y-4 text-xs">
            <p className="text-slate-600">
              Modul Perencanaan K3 mencakup Identifikasi Bahaya & Pengendalian Risiko Pengawasan, Peraturan Perundangan, serta Sasaran dan Program.
            </p>
            <button
              onClick={() => onNavigate('rkk-planning')}
              className="px-3.5 py-2 text-xs font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700"
            >
              Kelola Bab 2 Perencanaan K3 →
            </button>
          </div>
        )}

        {activeTab === 'PERSONEL' && (
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-800">Daftar Personel Pengawas ({currentPersonnel.length})</h4>
              <button
                onClick={() => onNavigate('rkk-support')}
                className="px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100"
              >
                Kelola Personel & Sertifikat →
              </button>
            </div>
            <div className="space-y-2">
              {currentPersonnel.map((p) => (
                <div key={p.id} className="p-3 bg-slate-50 border rounded-lg flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-900">{p.name}</p>
                    <p className="text-slate-500">{p.position} • Pengalaman {p.yearsOfExperience} Thn</p>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold">
                    {p.certificates?.[0]?.certificateType || 'Sertifikat Terdaftar'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'OPERASI' && (
          <div className="space-y-4 text-xs">
            <p className="text-slate-600">Bagan Struktur Organisasi Pengawasan K3 dan Daftar Dokumen SOP / Instruksi Kerja.</p>
            <button
              onClick={() => onNavigate('rkk-operations')}
              className="px-3.5 py-2 text-xs font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700"
            >
              Buka Modul Bab 4 Operasi K3 →
            </button>
          </div>
        )}

        {activeTab === 'MONITORING' && (
          <div className="space-y-4 text-xs">
            <p className="text-slate-600">
              Pelaksanaan monitoring lapangan: Inspeksi rutin, pencatatan temuan unsafe act/condition, JSA, dan izin kerja khusus.
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => onNavigate('monitoring-inspections')}
                className="px-3 py-1.5 font-semibold bg-slate-100 hover:bg-slate-200 rounded-lg"
              >
                Inspeksi Lapangan
              </button>
              <button
                onClick={() => onNavigate('monitoring-findings')}
                className="px-3 py-1.5 font-semibold bg-slate-100 hover:bg-slate-200 rounded-lg"
              >
                Temuan & Tindak Lanjut
              </button>
              <button
                onClick={() => onNavigate('monitoring-jsa')}
                className="px-3 py-1.5 font-semibold bg-slate-100 hover:bg-slate-200 rounded-lg"
              >
                Job Safety Analysis (JSA)
              </button>
              <button
                onClick={() => onNavigate('monitoring-permits')}
                className="px-3 py-1.5 font-semibold bg-slate-100 hover:bg-slate-200 rounded-lg"
              >
                Surat Izin Kerja (PTW)
              </button>
            </div>
          </div>
        )}

        {activeTab === 'LAPORAN' && (
          <div className="space-y-4 text-xs">
            <p className="text-slate-600">
              Laporan berkala keselamatan konstruksi: Laporan Mingguan, Laporan Bulanan, Hasil Testing & Commissioning, dan Evaluasi Akhir.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => onNavigate('reports-weekly')}
                className="px-3.5 py-2 text-xs font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700"
              >
                Laporan Mingguan
              </button>
              <button
                onClick={() => onNavigate('reports-monthly')}
                className="px-3.5 py-2 text-xs font-bold text-slate-700 bg-slate-100 rounded-xl hover:bg-slate-200"
              >
                Laporan Bulanan
              </button>
            </div>
          </div>
        )}

        {activeTab === 'DOKUMEN' && (
          <div className="space-y-4 text-xs">
            <p className="text-slate-600">Pusat dokumen resmi RKK format Permen PUPR No. 10/2021.</p>
            <button
              onClick={() => onNavigate('print-rkk')}
              className="px-4 py-2 font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700"
            >
              Cetak Dokumen Resmi RKK (A4) →
            </button>
          </div>
        )}

        {activeTab === 'APPROVAL' && (
          <div className="space-y-4 text-xs">
            <h4 className="text-sm font-bold text-slate-800">Alur Persetujuan Dokumen RKK</h4>
            <div className="p-4 bg-slate-50 border rounded-xl space-y-2">
              <p><strong>Status Terkini:</strong> {currentRKK ? <StatusBadge status={currentRKK.status} type="rkk" /> : '-'}</p>
              <p className="text-slate-500">
                Alur: DRAFT → IN REVIEW → REVISION REQUIRED / APPROVED INTERNAL → SUBMITTED → APPROVED → FINAL
              </p>
              <button
                onClick={() => onNavigate('rkk-document')}
                className="mt-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg font-bold"
              >
                Kelola Workflow Approval di Modul RKK
              </button>
            </div>
          </div>
        )}

        {activeTab === 'AUDIT_LOG' && (
          <div className="space-y-4 text-xs">
            <h4 className="text-sm font-bold text-slate-800">Histori Aktivitas Dokumen & Proyek</h4>
            <div className="space-y-2">
              {state.auditLogs.slice(0, 5).map((log) => (
                <div key={log.id} className="p-2.5 bg-slate-50 border rounded-lg flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-800">{log.action}: {log.module}</span>
                    <p className="text-slate-500 text-[11px]">{log.description}</p>
                  </div>
                  <span className="text-[10px] text-slate-400">{log.timestamp.slice(0, 10)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
