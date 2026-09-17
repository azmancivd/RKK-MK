import React, { useState } from 'react';
import {
  Award,
  CheckCircle2,
  FileCheck,
  ShieldAlert,
  Calendar,
  Layers,
  Sparkles,
  Printer,
  Save,
} from 'lucide-react';
import { useAppStore } from '../../lib/store';
import { FinalEvaluation } from '../../types';

export const FinalEvaluationView: React.FC = () => {
  const { currentProject, currentUser, state, updateGlobalState, addAuditLog, addNotification } = useAppStore();

  const projectId = currentProject?.id || '';
  const evaluation: FinalEvaluation = state.finalEvaluations[projectId] || {
    id: 'eval-' + projectId,
    projectId,
    phoDate: currentProject?.endDate || '2026-12-31',
    fhoDate: '2027-06-30',
    totalSafeManHours: 85200,
    totalIncidents: 0,
    zeroAccidentAwardNominated: true,
    contractorPerformanceScore: 94,
    consultantPerformanceScore: 96,
    lessonsLearned:
      'Pemberlakuan reward bulanan bagi pekerja paling disiplin APD terbukti meningkatkan kepatuhan sukarela hingga 98%. Perbaikan area barikade perimeter galian harus selalu dipantau saat musim penghujan.',
    conclusionNote:
      'Penerapan SMKK Pengawasan selama masa pelaksanaan konstruksi berlangsung tertib, nihil kecelakaan kerja (Zero Accident), dan memenuhi standar Permen PUPR No. 10/2021 untuk penyerahan pertama pekerjaan (PHO).',
    evaluatedBy: currentUser.fullName,
    approvedByPpk: currentProject?.ppkName || 'Ahmad Fauzi, ST., M.Eng.',
  };

  const [formData, setFormData] = useState<FinalEvaluation>(evaluation);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateGlobalState((prev) => ({
      ...prev,
      finalEvaluations: {
        ...prev.finalEvaluations,
        [projectId]: formData,
      },
    }));

    addAuditLog('UPDATE', 'Evaluasi Akhir SMKK', projectId, 'Menyimpan evaluasi akhir pengawasan SMKK untuk PHO');
    addNotification('Evaluasi Akhir Disimpan', 'Dokumen evaluasi akhir SMKK siap untuk berita acara PHO.', 'SUCCESS');
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
            Serah Terima Pertama (PHO / FHO)
          </span>
          <h1 className="text-xl font-black text-slate-900 mt-1 flex items-center space-x-2">
            <Award className="w-5 h-5 text-emerald-600" />
            <span>Laporan Evaluasi Akhir Pengawasan SMKK</span>
          </h1>
          <p className="text-xs text-slate-500">
            Penilaian akhir kinerja K3 konstruksi, rekapitulasi jam kerja selamat, dan kompilasi As-Built Dokumen SMKK
          </p>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center space-x-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors shrink-0"
        >
          <Save className="w-4 h-4" />
          <span>{isSaved ? 'Tersimpan ✓' : 'Simpan Evaluasi Akhir'}</span>
        </button>
      </div>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase">Akumulasi Jam Selamat</span>
          <p className="text-2xl font-black text-indigo-700 font-mono">
            {(formData?.totalSafeManHours ?? 0).toLocaleString()}
          </p>
          <span className="text-[11px] text-slate-500">Jam Orang Tanpa Kecelakaan</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-emerald-100 bg-emerald-50/20 space-y-1">
          <span className="text-xs font-bold text-emerald-600 uppercase">Status Zero Accident</span>
          <p className="text-2xl font-black text-emerald-600">
            {formData.totalIncidents === 0 ? 'TERCAPAI 100%' : `${formData.totalIncidents} Insiden`}
          </p>
          <span className="text-[11px] text-emerald-700 font-semibold">Memenuhi Syarat Penghargaan</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase">Kinerja Kontraktor</span>
          <p className="text-2xl font-black text-slate-900">{formData.contractorPerformanceScore}/100</p>
          <span className="text-[11px] text-emerald-600 font-bold">Kategori: Sangat Baik (A)</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase">Kinerja Pengawas MK</span>
          <p className="text-2xl font-black text-blue-600">{formData.consultantPerformanceScore}/100</p>
          <span className="text-[11px] text-blue-600 font-bold">Kategori: Sangat Baik (A)</span>
        </div>
      </div>

      {/* Form Details */}
      <form onSubmit={handleSave} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
        <h3 className="text-sm font-bold text-slate-900 border-b pb-3">Formulir Verifikasi Akhir SMKK</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Tanggal Provisional Hand Over (PHO)</label>
            <input
              type="date"
              value={formData.phoDate}
              onChange={(e) => setFormData({ ...formData, phoDate: e.target.value })}
              className="w-full text-xs p-2.5 border border-slate-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block font-bold text-slate-700 mb-1">Tanggal Final Hand Over (FHO)</label>
            <input
              type="date"
              value={formData.fhoDate || ''}
              onChange={(e) => setFormData({ ...formData, fhoDate: e.target.value })}
              className="w-full text-xs p-2.5 border border-slate-300 rounded-lg"
            />
          </div>
        </div>

        <div className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Catatan Pembelajaran Proyek (Lessons Learned)
            </label>
            <textarea
              rows={3}
              value={formData.lessonsLearned}
              onChange={(e) => setFormData({ ...formData, lessonsLearned: e.target.value })}
              className="w-full text-xs p-3 border border-slate-300 rounded-lg leading-relaxed"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Kesimpulan Akhir Penerapan SMKK untuk Berita Acara PHO
            </label>
            <textarea
              rows={3}
              value={formData.conclusionNote}
              onChange={(e) => setFormData({ ...formData, conclusionNote: e.target.value })}
              className="w-full text-xs p-3 border border-slate-300 rounded-lg leading-relaxed"
            />
          </div>
        </div>

        {/* Signatures */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100 text-xs">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
              Dievaluasi Oleh (Konsultan Pengawas):
            </span>
            <p className="font-bold text-slate-900">{formData.evaluatedBy}</p>
            <p className="text-[11px] text-slate-500">Ahli K3 Konstruksi / Team Leader</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
              Disetujui Oleh (Pengguna Jasa):
            </span>
            <p className="font-bold text-slate-900">{formData.approvedByPpk}</p>
            <p className="text-[11px] text-slate-500">Pejabat Pembuat Komitmen (PPK)</p>
          </div>
        </div>
      </form>
    </div>
  );
};
