import React, { useState } from 'react';
import {
  FileCheck2,
  CheckCircle2,
  AlertTriangle,
  Printer,
  History,
  Lock,
  Unlock,
  QrCode,
  Shield,
  FileText,
  ChevronRight,
  Send,
  RotateCcw,
} from 'lucide-react';
import { useAppStore } from '../../lib/store';
import { StatusBadge } from '../common/StatusBadge';
import { SignaturePad } from '../common/SignaturePad';
import { RKKStatus } from '../../types';

interface RKKDocumentViewProps {
  onNavigate: (view: string) => void;
}

export const RKKDocumentView: React.FC<RKKDocumentViewProps> = ({ onNavigate }) => {
  const { currentProject, currentRKK, company, currentUser, updateGlobalState, addAuditLog, addNotification } =
    useAppStore();

  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [approvalDecision, setApprovalDecision] = useState<'APPROVE' | 'REJECT' | 'REQUEST_REVISION'>('APPROVE');
  const [approvalComments, setApprovalComments] = useState('');
  const [showRevisionModal, setShowRevisionModal] = useState(false);
  const [revisionReason, setRevisionReason] = useState('');
  const [revisionSections, setRevisionSections] = useState('Bab 2 & Personel');

  if (!currentProject || !currentRKK) {
    return (
      <div className="bg-white p-12 text-center rounded-2xl border border-slate-200">
        <FileCheck2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h3 className="text-sm font-bold text-slate-700">Dokumen RKK belum dibuat untuk proyek ini</h3>
        <p className="text-xs text-slate-400 mt-1">
          Silakan buat Dokumen RKK baru melalui tombol di bagian atas atau menu Manajemen Proyek.
        </p>
      </div>
    );
  }

  // Handle Workflow Status Transition
  const handleStatusTransition = (newStatus: RKKStatus) => {
    updateGlobalState((prev) => ({
      ...prev,
      rkkDocuments: {
        ...prev.rkkDocuments,
        [currentProject.id]: {
          ...prev.rkkDocuments[currentProject.id],
          status: newStatus,
          updatedAt: new Date().toISOString(),
        },
      },
    }));

    addAuditLog('APPROVAL', 'RKK Dokumen', currentRKK.documentNumber, `Mengubah status dokumen RKK menjadi ${newStatus}`);
    addNotification(
      'Status RKK Diperbarui',
      `Dokumen ${currentRKK.documentNumber} kini berstatus ${newStatus}`,
      'INFO'
    );
    setShowApprovalModal(false);
  };

  // Handle Create New Revision (Section 77)
  const handleCreateNewRevision = (e: React.FormEvent) => {
    e.preventDefault();
    const currentRevNum = parseInt(currentRKK.version.replace('Rev.', ''), 10) || 0;
    const nextRevStr = `Rev.${String(currentRevNum + 1).padStart(2, '0')}`;

    const historyEntry = {
      id: 'rev-' + Date.now(),
      version: currentRKK.version,
      date: new Date().toISOString().split('T')[0],
      reason: revisionReason,
      changedSections: revisionSections,
      changedBy: currentUser.fullName,
      reviewedBy: currentRKK.reviewedBy,
      approvedBy: currentRKK.approvedBy,
    };

    updateGlobalState((prev) => ({
      ...prev,
      rkkDocuments: {
        ...prev.rkkDocuments,
        [currentProject.id]: {
          ...prev.rkkDocuments[currentProject.id],
          version: nextRevStr,
          status: 'DRAFT',
          date: new Date().toISOString().split('T')[0],
          history: [...(prev.rkkDocuments[currentProject.id].history || []), historyEntry],
          updatedAt: new Date().toISOString(),
        },
      },
    }));

    addAuditLog('REVISION', 'RKK Dokumen', currentRKK.documentNumber, `Menerbitkan revisi baru: ${nextRevStr} (${revisionReason})`);
    addNotification('Revisi RKK Diterbitkan', `Revisi ${nextRevStr} berhasil dibuat dan dikembalikan ke status DRAFT.`, 'WARNING');
    setShowRevisionModal(false);
    setRevisionReason('');
  };

  return (
    <div className="space-y-6">
      {/* Action and Status Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Dokumen RKK</span>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
              {currentRKK.version}
            </span>
            <StatusBadge status={currentRKK.status} type="rkk" />
          </div>
          <h1 className="text-lg sm:text-xl font-bold text-slate-900 mt-1">
            {currentRKK.documentNumber}
          </h1>
          <p className="text-xs text-slate-500">
            Tanggal Berlaku: {currentRKK.date} • Kode Verifikasi:{' '}
            <span className="font-mono font-semibold text-slate-700">{currentRKK.qrVerificationCode}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Approval Action */}
          <button
            onClick={() => setShowApprovalModal(true)}
            className="flex items-center space-x-1.5 px-3.5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Alur Persetujuan (Workflow)</span>
          </button>

          {/* New Revision Action */}
          <button
            onClick={() => setShowRevisionModal(true)}
            className="flex items-center space-x-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Buat Revisi Baru</span>
          </button>

          {/* Print A4 */}
          <button
            onClick={() => onNavigate('print-rkk')}
            className="flex items-center space-x-1.5 px-3.5 py-2 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-xl border border-emerald-200 transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak A4 / PDF Resmi</span>
          </button>
        </div>
      </div>

      {/* Official RKK Cover Summary (Format Lampiran D.1) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs max-w-4xl mx-auto text-center space-y-6">
        <div className="flex items-center justify-between border-b pb-4">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Format Standar Permen PUPR No. 10/2021 Lampiran D.1
          </span>
          <span className="text-[11px] font-mono text-slate-400">Hal. 117 - 124</span>
        </div>

        {/* Company Header Box */}
        <div className="border border-slate-300 rounded-xl p-4 inline-block mx-auto min-w-[280px]">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">
            [Logo Perusahaan]
          </span>
          <p className="text-sm font-bold text-slate-800">{company.name}</p>
          <p className="text-[11px] text-slate-500">{company.address}</p>
        </div>

        {/* Document Title per Permen PUPR D.1 */}
        <div className="space-y-1.5 py-4">
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-wide">
            RENCANA KESELAMATAN KONSTRUKSI (RKK)
          </h2>
          <h3 className="text-sm sm:text-base font-bold text-blue-900 uppercase">
            KONSULTANSI KONSTRUKSI PENGAWASAN / MANAJEMEN PENYELENGGARAAN KONSTRUKSI
          </h3>
          <div className="w-24 h-1 bg-blue-600 mx-auto my-3 rounded-full" />
          <p className="text-sm font-semibold text-slate-700 italic max-w-xl mx-auto">
            ({currentProject.packageTitle})
          </p>
        </div>

        {/* Project Metadata Table (Format Permen PUPR) */}
        <div className="max-w-md mx-auto border border-slate-300 rounded-lg overflow-hidden text-xs text-left">
          <div className="grid grid-cols-3 border-b border-slate-200 p-2.5 bg-slate-50">
            <span className="font-semibold text-slate-600">Lokasi Pekerjaan</span>
            <span className="col-span-2 text-slate-800 font-medium">: {currentProject.location}</span>
          </div>
          <div className="grid grid-cols-3 border-b border-slate-200 p-2.5 bg-white">
            <span className="font-semibold text-slate-600">Nomor Kontrak</span>
            <span className="col-span-2 text-slate-800 font-medium font-mono">: {currentProject.contractNumber}</span>
          </div>
          <div className="grid grid-cols-3 p-2.5 bg-slate-50">
            <span className="font-semibold text-slate-600">Waktu Pelaksanaan</span>
            <span className="col-span-2 text-slate-800 font-medium">
              : {currentProject.executionPeriodDays} Hari Kalender
            </span>
          </div>
        </div>

        {/* Prepared by */}
        <div className="pt-6 space-y-1">
          <span className="text-xs uppercase font-bold text-slate-400">DISUSUN OLEH:</span>
          <p className="text-sm font-bold text-slate-800">{company.name}</p>
          <p className="text-xs text-slate-500 italic">
            (Penyedia Jasa Konsultansi Konstruksi Pengawas Wakil Sah Pengguna Jasa)
          </p>
        </div>
      </div>

      {/* Lembar Pengesahan (Permen PUPR Hal. 118) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs max-w-4xl mx-auto space-y-6">
        <div className="text-center border-b pb-4">
          <h2 className="text-base sm:text-lg font-extrabold text-slate-900 uppercase">
            LEMBAR PENGESAHAN
          </h2>
          <p className="text-xs font-semibold text-slate-600 uppercase">
            RENCANA KESELAMATAN KONSTRUKSI (RKK) KONSULTANSI KONSTRUKSI PENGAWASAN
          </p>
          <p className="text-xs text-slate-500 mt-1">Paket: {currentProject.packageTitle}</p>
        </div>

        {/* Two Signature Columns (Penyedia vs Pengguna Jasa) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
          {/* Column 1: Pihak Penyedia Konsultan */}
          <div className="border border-slate-200 rounded-xl p-5 bg-slate-50/50 flex flex-col justify-between">
            <div className="text-center space-y-1">
              <span className="text-xs font-bold text-blue-900 uppercase tracking-wider block">
                Pihak Penyedia Konsultan
              </span>
              <p className="text-xs text-slate-500">Dibuat Oleh:</p>
              <p className="text-xs font-semibold text-slate-800">{currentRKK.reviewedBy}</p>
              <p className="text-[11px] text-slate-500 italic">Kepala Pengawas Pekerjaan (Team Leader)</p>
            </div>

            <div className="my-4">
              <SignaturePad
                label="Tanda Tangan Kepala Pengawas"
                onSave={(dataUrl) => {
                  updateGlobalState((prev) => ({
                    ...prev,
                    rkkDocuments: {
                      ...prev.rkkDocuments,
                      [currentProject.id]: {
                        ...prev.rkkDocuments[currentProject.id],
                        reviewedBy: `${currentRKK.reviewedBy}`,
                      },
                    },
                  }));
                }}
              />
            </div>

            <div className="text-center text-[11px] text-slate-500 border-t pt-2">
              (Diisi oleh penyedia jasa konsultansi konstruksi/pengendali/pengawas wakil sah pengguna jasa)
            </div>
          </div>

          {/* Column 2: Pihak Pengguna Jasa (PPK) */}
          <div className="border border-slate-200 rounded-xl p-5 bg-slate-50/50 flex flex-col justify-between">
            <div className="text-center space-y-1">
              <span className="text-xs font-bold text-blue-900 uppercase tracking-wider block">
                Pihak Pengguna Jasa
              </span>
              <p className="text-xs text-slate-500">Disetujui Oleh:</p>
              <p className="text-xs font-semibold text-slate-800">{currentProject.ppkName}</p>
              <p className="text-[11px] text-slate-500">NIP: {currentProject.ppkNip || '-'}</p>
              <p className="text-[11px] text-slate-500 italic">Pejabat Pembuat Komitmen (PPK)</p>
            </div>

            <div className="my-4">
              <SignaturePad
                label="Tanda Tangan Pengguna Jasa (PPK)"
                onSave={(dataUrl) => {
                  updateGlobalState((prev) => ({
                    ...prev,
                    rkkDocuments: {
                      ...prev.rkkDocuments,
                      [currentProject.id]: {
                        ...prev.rkkDocuments[currentProject.id],
                        approvedBy: `${currentProject.ppkName}`,
                      },
                    },
                  }));
                }}
              />
            </div>

            <div className="text-center text-[11px] text-slate-500 border-t pt-2">
              (Diisi oleh Pengguna Jasa setelah memberikan persetujuan pada rapat persiapan pelaksanaan / Pre Construction Meeting)
            </div>
          </div>
        </div>
      </div>

      {/* Revision History Table (Section 39) */}
      {currentRKK.history && currentRKK.history.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center space-x-2">
            <History className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-800">Riwayat Versi & Revisi Dokumen</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b text-slate-600">
                  <th className="py-2.5 px-3 font-semibold">Versi</th>
                  <th className="py-2.5 px-3 font-semibold">Tanggal</th>
                  <th className="py-2.5 px-3 font-semibold">Alasan Revisi</th>
                  <th className="py-2.5 px-3 font-semibold">Bagian Berubah</th>
                  <th className="py-2.5 px-3 font-semibold">Dibuat Oleh</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {currentRKK.history.map((h) => (
                  <tr key={h.id}>
                    <td className="py-2.5 px-3 font-bold text-blue-600">{h.version}</td>
                    <td className="py-2.5 px-3">{h.date}</td>
                    <td className="py-2.5 px-3">{h.reason}</td>
                    <td className="py-2.5 px-3 font-medium">{h.changedSections}</td>
                    <td className="py-2.5 px-3">{h.changedBy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Workflow Approval Modal */}
      {showApprovalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 shadow-2xl border border-slate-200 max-w-lg w-full space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-sm font-bold text-slate-900">Alur Persetujuan (Workflow RKK)</h3>
              <button
                onClick={() => setShowApprovalModal(false)}
                className="text-slate-400 hover:text-slate-700 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-slate-600">
                Status Saat Ini: <StatusBadge status={currentRKK.status} type="rkk" />
              </p>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Keputusan / Status Baru</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleStatusTransition('IN_REVIEW')}
                    className="p-2.5 text-left border rounded-lg hover:border-blue-500 hover:bg-blue-50 font-semibold"
                  >
                    Ajukan Review (IN_REVIEW)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleStatusTransition('REVISION_REQUIRED')}
                    className="p-2.5 text-left border rounded-lg hover:border-rose-500 hover:bg-rose-50 font-semibold text-rose-700"
                  >
                    Minta Revisi (REVISION_REQUIRED)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleStatusTransition('APPROVED_INTERNAL')}
                    className="p-2.5 text-left border rounded-lg hover:border-cyan-500 hover:bg-cyan-50 font-semibold text-cyan-700"
                  >
                    Disetujui Internal (APPROVED_INTERNAL)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleStatusTransition('SUBMITTED')}
                    className="p-2.5 text-left border rounded-lg hover:border-indigo-500 hover:bg-indigo-50 font-semibold text-indigo-700"
                  >
                    Kirim ke Pengguna (SUBMITTED)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleStatusTransition('APPROVED')}
                    className="p-2.5 text-left border rounded-lg hover:border-emerald-500 hover:bg-emerald-50 font-bold text-emerald-700"
                  >
                    Disetujui PPK (APPROVED)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleStatusTransition('FINAL')}
                    className="p-2.5 text-left border rounded-lg hover:border-emerald-700 hover:bg-emerald-100 font-extrabold text-emerald-900"
                  >
                    Kunci Status FINAL
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Catatan Persetujuan / Catatan Reviewer</label>
                <textarea
                  rows={3}
                  value={approvalComments}
                  onChange={(e) => setApprovalComments(e.target.value)}
                  placeholder="Masukkan instruksi atau catatan perbaikan..."
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2 border-t">
              <button
                type="button"
                onClick={() => setShowApprovalModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create New Revision Modal */}
      {showRevisionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <form
            onSubmit={handleCreateNewRevision}
            className="bg-white rounded-2xl p-6 shadow-2xl border border-slate-200 max-w-md w-full space-y-4"
          >
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-sm font-bold text-slate-900">Buat Revisi RKK Baru</h3>
              <button
                type="button"
                onClick={() => setShowRevisionModal(false)}
                className="text-slate-400 hover:text-slate-700 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-slate-600">
                Dokumen saat ini: <strong>{currentRKK.version}</strong>. Sistem akan menaikkan versi menjadi{' '}
                <strong>
                  Rev.{String((parseInt(currentRKK.version.replace('Rev.', ''), 10) || 0) + 1).padStart(2, '0')}
                </strong>{' '}
                dan status dikembalikan ke DRAFT untuk diedit.
              </p>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Alasan Revisi *</label>
                <input
                  type="text"
                  required
                  value={revisionReason}
                  onChange={(e) => setRevisionReason(e.target.value)}
                  placeholder="Contoh: Penyesuaian metode galian & penambahan personil K3"
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Bagian Yang Mengalami Perubahan *</label>
                <input
                  type="text"
                  required
                  value={revisionSections}
                  onChange={(e) => setRevisionSections(e.target.value)}
                  placeholder="Contoh: Bab 2.1 IBPRP, Bab 3.1 Personel"
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-3 border-t">
              <button
                type="button"
                onClick={() => setShowRevisionModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl"
              >
                Simpan & Terbitkan Revisi
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
