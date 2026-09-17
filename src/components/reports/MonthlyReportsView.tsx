import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Search,
  CheckCircle2,
  Calendar,
  Activity,
  Award,
  TrendingUp,
  ShieldAlert,
} from 'lucide-react';
import { useAppStore } from '../../lib/store';
import { MonthlyReport } from '../../types';

export const MonthlyReportsView: React.FC = () => {
  const { currentProject, currentUser, state, updateGlobalState, addAuditLog, addNotification } = useAppStore();
  const [showModal, setShowModal] = useState(false);

  const projectId = currentProject?.id || '';
  const monthlyReports = state.monthlyReports[projectId] || [];

  const [formData, setFormData] = useState<Partial<MonthlyReport>>({
    reportNumber: `LAP-BLN-K3-${new Date().getFullYear()}-09`,
    month: 'September 2026',
    executiveSummary:
      'Penerapan SMKK pada bulan September berjalan efektif dengan kepatuhan pemakaian APD mencapai 98%. Seluruh pekerjaan erection dan pengecoran lantai bertingkat dilaksanakan dengan pengawasan ketat tanpa ada kecelakaan kerja (Zero Accident).',
    severityRate: 0,
    frequencyRate: 0,
    zeroAccidentStatus: true,
    inspectionsSummary: 'Telah dilaksanakan 16 kali inspeksi keselamatan rutin dan 4 kali inspeksi bersama PPK.',
    findingsAnalysis: 'Ditemukan 8 temuan ketidaksesuaian minor yang seluruhnya telah ditutup (100% closed).',
    testingCommissioningSummary: 'Uji fungsi Tower Crane dan instalasi genset sementara telah dinyatakan laik operasi.',
    kpiScore: 94,
    recommendations:
      'Mempertahankan budaya keselamatan dan memperketat pengawasan pekerjaan penutup atap baja di bulan berikutnya.',
    preparedBy: currentUser.fullName,
    approvedBy: currentProject?.teamLeaderName || 'Ir. Hendra Wijaya, ST., MT.',
    status: 'APPROVED',
  });

  const handleSaveMonthlyReport = (e: React.FormEvent) => {
    e.preventDefault();
    const newRep: MonthlyReport = {
      id: 'rep-m-' + Date.now(),
      projectId,
      reportNumber: formData.reportNumber || `LAP-BLN-K3-${new Date().getFullYear()}-09`,
      month: formData.month || 'September 2026',
      executiveSummary: formData.executiveSummary || '',
      severityRate: formData.severityRate || 0,
      frequencyRate: formData.frequencyRate || 0,
      zeroAccidentStatus: formData.zeroAccidentStatus ?? true,
      inspectionsSummary: formData.inspectionsSummary || '',
      findingsAnalysis: formData.findingsAnalysis || '',
      testingCommissioningSummary: formData.testingCommissioningSummary || '',
      kpiScore: formData.kpiScore || 90,
      recommendations: formData.recommendations || '',
      preparedBy: formData.preparedBy || currentUser.fullName,
      approvedBy: formData.approvedBy || 'Team Leader',
      status: 'APPROVED',
    };

    updateGlobalState((prev) => ({
      ...prev,
      monthlyReports: {
        ...prev.monthlyReports,
        [projectId]: [newRep, ...(prev.monthlyReports[projectId] || [])],
      },
    }));

    addAuditLog('CREATE', 'Laporan Bulanan SMKK', newRep.reportNumber, `Menerbitkan Laporan Bulanan ${newRep.month}`);
    addNotification('Laporan Bulanan Diterbitkan', `Laporan ${newRep.month} berhasil disimpan.`, 'SUCCESS');
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
            Evaluasi Komprehensif Bulanan
          </span>
          <h1 className="text-xl font-black text-slate-900 mt-1 flex items-center space-x-2">
            <FileText className="w-5 h-5 text-indigo-600" />
            <span>Laporan Pengawasan Penerapan SMKK Bulanan</span>
          </h1>
          <p className="text-xs text-slate-500">
            Analisis tren kepatuhan, indikator kinerja keselamatan (KPI), Frequency Rate (FR), dan Severity Rate (SR)
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center space-x-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Buat Laporan Bulanan Baru</span>
        </button>
      </div>

      {/* Monthly Reports List */}
      <div className="space-y-4">
        {monthlyReports.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl border border-dashed border-slate-300">
            <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-xs text-slate-500">Belum ada laporan bulanan.</p>
          </div>
        ) : (
          monthlyReports.map((report) => (
            <div
              key={report.id}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-indigo-300 transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-3">
                  <h3 className="text-sm font-black text-slate-900">
                    Laporan Kinerja SMKK Periode: {report.month}
                  </h3>
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                    {report.reportNumber}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold flex items-center space-x-1">
                    <Award className="w-3.5 h-3.5" />
                    <span>KPI SMKK: {report.kpiScore}/100</span>
                  </span>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
                    {report.status}
                  </span>
                </div>
              </div>

              {/* Statistical KPI Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-center">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Frequency Rate (FR)</span>
                  <span className="text-base font-black text-slate-800">{report.frequencyRate}</span>
                  <span className="block text-[9px] text-slate-400">Jml Kecelakaan / Juta Jam</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Severity Rate (SR)</span>
                  <span className="text-base font-black text-slate-800">{report.severityRate}</span>
                  <span className="block text-[9px] text-slate-400">Hari Hilang / Juta Jam</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Zero Accident</span>
                  <span className="text-base font-black text-emerald-600">
                    {report.zeroAccidentStatus ? 'TERCAPAI ✓' : 'TIDAK'}
                  </span>
                  <span className="block text-[9px] text-slate-400">Status Nihil Kecelakaan</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">T&C Peralatan</span>
                  <span className="text-base font-black text-blue-600">100% Laik</span>
                  <span className="block text-[9px] text-slate-400">Testing & Commissioning</span>
                </div>
              </div>

              {/* Sections Breakdown */}
              <div className="space-y-3 text-xs text-slate-700">
                <div className="p-3 bg-white rounded-xl border border-slate-100 space-y-1">
                  <strong className="text-slate-900 block font-bold">Ringkasan Eksekutif (Executive Summary):</strong>
                  <p className="leading-relaxed">{report.executiveSummary}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-100 space-y-1">
                    <strong className="text-slate-800 font-bold block text-[11px]">Evaluasi Hasil Inspeksi:</strong>
                    <p>{report.inspectionsSummary}</p>
                  </div>
                  <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-100 space-y-1">
                    <strong className="text-slate-800 font-bold block text-[11px]">Analisis Penutupan Temuan (CAPA):</strong>
                    <p>{report.findingsAnalysis}</p>
                  </div>
                </div>

                <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-100 space-y-1">
                  <strong className="text-amber-900 font-bold block text-[11px]">Rekomendasi Strategis Bulan Berikutnya:</strong>
                  <p className="text-amber-900">{report.recommendations}</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100 gap-2">
                <span>Disusun Oleh: <strong className="text-slate-800">{report.preparedBy}</strong></span>
                <span>Disetujui Oleh: <strong className="text-slate-800">{report.approvedBy}</strong></span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Buat Laporan Bulanan */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
          <form
            onSubmit={handleSaveMonthlyReport}
            className="bg-white rounded-2xl p-6 shadow-2xl border border-slate-200 max-w-xl w-full space-y-4 my-8"
          >
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-sm font-bold text-slate-900">Buat Laporan Bulanan Pengawasan SMKK</h3>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-700 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nomor Laporan</label>
                  <input
                    type="text"
                    required
                    value={formData.reportNumber}
                    onChange={(e) => setFormData({ ...formData, reportNumber: e.target.value })}
                    className="w-full text-xs p-2 border border-slate-300 rounded-lg font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Bulan & Tahun</label>
                  <input
                    type="text"
                    required
                    value={formData.month}
                    onChange={(e) => setFormData({ ...formData, month: e.target.value })}
                    className="w-full text-xs p-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Skor Kepatuhan KPI (0-100)</label>
                  <input
                    type="number"
                    value={formData.kpiScore}
                    onChange={(e) =>
                      setFormData({ ...formData, kpiScore: parseInt(e.target.value) || 0 })
                    }
                    className="w-full text-xs p-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Status Zero Accident</label>
                  <select
                    value={formData.zeroAccidentStatus ? 'YES' : 'NO'}
                    onChange={(e) =>
                      setFormData({ ...formData, zeroAccidentStatus: e.target.value === 'YES' })
                    }
                    className="w-full text-xs p-2 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="YES">Tercapai (Nihil Kecelakaan Kerja)</option>
                    <option value="NO">Terjadi Kecelakaan</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Ringkasan Eksekutif</label>
                <textarea
                  rows={3}
                  value={formData.executiveSummary}
                  onChange={(e) => setFormData({ ...formData, executiveSummary: e.target.value })}
                  className="w-full text-xs p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Rekomendasi Bulan Berikutnya</label>
                <textarea
                  rows={2}
                  value={formData.recommendations}
                  onChange={(e) => setFormData({ ...formData, recommendations: e.target.value })}
                  className="w-full text-xs p-2 border border-slate-300 rounded-lg"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-3 border-t">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl"
              >
                Simpan Laporan Bulanan
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
