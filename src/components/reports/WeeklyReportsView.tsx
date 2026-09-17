import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Plus,
  Search,
  CheckCircle2,
  Calendar,
  Clock,
  Printer,
  FileCheck,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';
import { useAppStore } from '../../lib/store';
import { WeeklyReport } from '../../types';

export const WeeklyReportsView: React.FC = () => {
  const { currentProject, currentUser, state, updateGlobalState, addAuditLog, addNotification } = useAppStore();
  const [showModal, setShowModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState<WeeklyReport | null>(null);

  const projectId = currentProject?.id || '';
  const weeklyReports = state.weeklyReports[projectId] || [];

  // Form State
  const [formData, setFormData] = useState<Partial<WeeklyReport>>({
    reportNumber: `LAP-MGG-K3-${new Date().getFullYear()}-${String(weeklyReports.length + 1).padStart(2, '0')}`,
    weekNumber: weeklyReports.length + 1,
    startDate: '2026-09-08',
    endDate: '2026-09-14',
    supervisionActivitiesSummary:
      'Pengawasan kepatuhan APD pekerjaan pembesian dan bekisting, verifikasi 3 izin kerja ketinggian, dan pelaksanaan safety induction 14 pekerja baru.',
    inspectionsConductedCount: 4,
    openFindingsCount: 1,
    closedFindingsCount: 3,
    permitsIssuedCount: 5,
    safeManHours: 2450,
    incidentCount: 0,
    recommendations:
      'Kontraktor diminta merapikan kabel temporary pada jalur perlintasan mixer dan memasang barikade di lubang bukaan void lantai 3.',
    preparedBy: currentUser.fullName,
    approvedBy: currentProject?.teamLeaderName || 'Ir. Hendra Wijaya, ST., MT.',
    status: 'APPROVED',
  });

  const handleSaveReport = (e: React.FormEvent) => {
    e.preventDefault();
    const newRep: WeeklyReport = {
      id: 'rep-w-' + Date.now(),
      projectId,
      reportNumber:
        formData.reportNumber ||
        `LAP-MGG-K3-${new Date().getFullYear()}-${String(weeklyReports.length + 1).padStart(2, '0')}`,
      weekNumber: formData.weekNumber || 1,
      startDate: formData.startDate || '2026-09-01',
      endDate: formData.endDate || '2026-09-07',
      supervisionActivitiesSummary: formData.supervisionActivitiesSummary || '',
      inspectionsConductedCount: formData.inspectionsConductedCount || 0,
      openFindingsCount: formData.openFindingsCount || 0,
      closedFindingsCount: formData.closedFindingsCount || 0,
      permitsIssuedCount: formData.permitsIssuedCount || 0,
      safeManHours: formData.safeManHours || 0,
      incidentCount: formData.incidentCount || 0,
      recommendations: formData.recommendations || '',
      preparedBy: formData.preparedBy || currentUser.fullName,
      approvedBy: formData.approvedBy || 'Team Leader',
      status: 'APPROVED',
    };

    updateGlobalState((prev) => ({
      ...prev,
      weeklyReports: {
        ...prev.weeklyReports,
        [projectId]: [newRep, ...(prev.weeklyReports[projectId] || [])],
      },
    }));

    addAuditLog('CREATE', 'Laporan Mingguan SMKK', newRep.reportNumber, `Menerbitkan Laporan Pengawasan Minggu ke-${newRep.weekNumber}`);
    addNotification('Laporan Mingguan Diterbitkan', `Laporan Minggu ke-${newRep.weekNumber} tersimpan dan siap diserahkan ke PPK.`, 'SUCCESS');
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
            Pelaporan Berkala Permen PUPR No. 10/2021
          </span>
          <h1 className="text-xl font-black text-slate-900 mt-1 flex items-center space-x-2">
            <FileSpreadsheet className="w-5 h-5 text-blue-600" />
            <span>Laporan Pengawasan Penerapan SMKK Mingguan</span>
          </h1>
          <p className="text-xs text-slate-500">
            Kompilasi mingguan inspeksi K3, status temuan, jam kerja selamat (safe manhours), dan rekomendasi pengawas
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center space-x-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Buat Laporan Mingguan Baru</span>
        </button>
      </div>

      {/* Reports List */}
      <div className="space-y-4">
        {weeklyReports.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl border border-dashed border-slate-300">
            <FileSpreadsheet className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-xs text-slate-500">Belum ada laporan mingguan yang dibuat.</p>
          </div>
        ) : (
          weeklyReports.map((report) => (
            <div
              key={report.id}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-300 transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-black text-slate-900">
                    Laporan Pengawasan K3 Minggu ke-{report.weekNumber}
                  </span>
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                    {report.reportNumber}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-xs text-slate-500 flex items-center">
                    <Calendar className="w-3.5 h-3.5 text-slate-400 mr-1" />
                    {report.startDate} s.d {report.endDate}
                  </span>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    {report.status}
                  </span>
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Inspeksi Selesai</span>
                  <span className="text-base font-black text-slate-800">{report.inspectionsConductedCount}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Izin Kerja (PTW)</span>
                  <span className="text-base font-black text-blue-600">{report.permitsIssuedCount}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Temuan Ditutup</span>
                  <span className="text-base font-black text-emerald-600">{report.closedFindingsCount}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Jam Selamat</span>
                  <span className="text-base font-black text-indigo-600 font-mono">{(report.safeManHours ?? 0).toLocaleString()} Jam</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Kecelakaan (Accident)</span>
                  <span className={`text-base font-black ${report.incidentCount === 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {report.incidentCount} (Zero)
                  </span>
                </div>
              </div>

              {/* Summary & Recommendations */}
              <div className="space-y-2 text-xs text-slate-700">
                <div>
                  <strong className="text-slate-900 block font-bold mb-0.5">Uraian Ringkasan Pengawasan:</strong>
                  <p className="bg-white p-2.5 rounded-lg border border-slate-100">{report.supervisionActivitiesSummary}</p>
                </div>
                <div>
                  <strong className="text-slate-900 block font-bold mb-0.5">Instruksi & Rekomendasi Pengawas:</strong>
                  <p className="bg-amber-50/50 p-2.5 rounded-lg border border-amber-100 text-amber-900">
                    {report.recommendations}
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100 gap-2">
                <span>Disusun Oleh: <strong className="text-slate-800">{report.preparedBy}</strong></span>
                <span>Disetujui: <strong className="text-slate-800">{report.approvedBy}</strong></span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Buat Laporan */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
          <form
            onSubmit={handleSaveReport}
            className="bg-white rounded-2xl p-6 shadow-2xl border border-slate-200 max-w-xl w-full space-y-4 my-8"
          >
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-sm font-bold text-slate-900">Buat Laporan Mingguan Pengawasan SMKK</h3>
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
                  <label className="block font-bold text-slate-700 mb-1">Minggu Pengawasan Ke-</label>
                  <input
                    type="number"
                    required
                    value={formData.weekNumber}
                    onChange={(e) => setFormData({ ...formData, weekNumber: parseInt(e.target.value) || 1 })}
                    className="w-full text-xs p-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tanggal Mulai</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full text-xs p-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tanggal Selesai</label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full text-xs p-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Sesi Inspeksi</label>
                  <input
                    type="number"
                    value={formData.inspectionsConductedCount}
                    onChange={(e) =>
                      setFormData({ ...formData, inspectionsConductedCount: parseInt(e.target.value) || 0 })
                    }
                    className="w-full text-xs p-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Izin Kerja (PTW)</label>
                  <input
                    type="number"
                    value={formData.permitsIssuedCount}
                    onChange={(e) =>
                      setFormData({ ...formData, permitsIssuedCount: parseInt(e.target.value) || 0 })
                    }
                    className="w-full text-xs p-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Safe Man-Hours</label>
                  <input
                    type="number"
                    value={formData.safeManHours}
                    onChange={(e) =>
                      setFormData({ ...formData, safeManHours: parseInt(e.target.value) || 0 })
                    }
                    className="w-full text-xs p-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Uraian Ringkasan Pengawasan</label>
                <textarea
                  rows={2}
                  value={formData.supervisionActivitiesSummary}
                  onChange={(e) =>
                    setFormData({ ...formData, supervisionActivitiesSummary: e.target.value })
                  }
                  className="w-full text-xs p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Rekomendasi & Instruksi ke Kontraktor</label>
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
                Simpan & Terbitkan Laporan
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
