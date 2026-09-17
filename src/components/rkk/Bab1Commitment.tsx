import React, { useState } from 'react';
import { Shield, Save, CheckCircle2, Plus, Trash2, Edit2, RotateCcw } from 'lucide-react';
import { useAppStore } from '../../lib/store';
import { SignaturePad } from '../common/SignaturePad';

export const Bab1Commitment: React.FC = () => {
  const { currentProject, currentRKK, company, state, updateGlobalState, addAuditLog, addNotification } =
    useAppStore();

  const rkkId = currentRKK?.id || '';
  const currentCommitment = state.commitments[rkkId] || {
    id: 'com-' + Date.now(),
    rkkId,
    companyName: company.name,
    packageName: currentProject?.packageTitle || '',
    city: currentProject?.regency || 'Kendal',
    date: currentRKK?.date || new Date().toISOString().split('T')[0],
    headSupervisorName: currentProject?.teamLeaderName || 'Ir. Hendra Wijaya, ST., MT.',
    headSupervisorPosition: 'Kepala Pengawas Pekerjaan',
    commitmentPoints: [
      'Pemenuhan ketentuan Keselamatan Konstruksi telah sesuai dengan Dokumen RKK;',
      'Pengawasan mengacu kepada Kerangka Acuan Kerja (KAK);',
      'Pengawasan pelaksanaan berdasarkan kesesuaian standar dan desain;',
      'Pengawasan pelaksanaan pekerjaan sesuai dengan Standar Operasional Prosedur (SOP); dan',
      'Menggunakan tenaga kerja yang berkompeten dan bersertifikat.',
    ],
  };

  const [formData, setFormData] = useState(currentCommitment);
  const [points, setPoints] = useState<string[]>(currentCommitment.commitmentPoints);
  const [newPoint, setNewPoint] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  React.useEffect(() => {
    setFormData(currentCommitment);
    setPoints(currentCommitment.commitmentPoints || []);
  }, [rkkId, currentCommitment?.id]);

  const handleAddPoint = () => {
    if (!newPoint.trim()) return;
    setPoints([...points, newPoint.trim()]);
    setNewPoint('');
  };

  const handleRemovePoint = (index: number) => {
    setPoints(points.filter((_, i) => i !== index));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = {
      ...formData,
      commitmentPoints: points,
    };

    updateGlobalState((prev) => ({
      ...prev,
      commitments: {
        ...prev.commitments,
        [rkkId]: updated,
      },
    }));

    addAuditLog('UPDATE', 'Bab 1 Komitmen Rencana Aksi', rkkId, 'Menyimpan Lembar Komitmen Rencana Aksi K3');
    addNotification('Komitmen RKK Disimpan', 'Lembar Komitmen Rencana Aksi K3 Pengawasan berhasil diperbarui.', 'SUCCESS');
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header Info */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex items-center justify-between">
        <div>
          <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
            Bab 1 Permen PUPR No. 10/2021
          </span>
          <h1 className="text-lg sm:text-xl font-black text-slate-900 mt-1">
            1. Kepemimpinan dan Partisipasi Tenaga Kerja dalam Keselamatan Konstruksi
          </h1>
          <p className="text-xs text-slate-500">
            1.1 Lembar Komitmen Rencana Aksi Keselamatan Konstruksi Konsultan Pengawas / MK
          </p>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center space-x-1.5 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors"
        >
          <Save className="w-4 h-4" />
          <span>{isSaved ? 'Tersimpan ✓' : 'Simpan Komitmen'}</span>
        </button>
      </div>

      {/* Official Sheet Preview & Interactive Editor */}
      <form onSubmit={handleSave} className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs space-y-6">
        <div className="text-center space-y-1 border-b pb-4">
          <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-wide">
            KOMITMEN RENCANA AKSI KESELAMATAN KONSTRUKSI
          </h2>
          <p className="text-xs font-bold text-blue-900 uppercase">
            {formData.companyName || company.name}
          </p>
        </div>

        {/* Lead Statement */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed space-y-3">
          <p>
            <strong className="text-slate-900">{formData.companyName}</strong> sebagai Badan Usaha Jasa Konstruksi berkomitmen melaksanakan pengawasan pelaksanaan pekerjaan konstruksi berkeselamatan pada pelaksanaan Paket Pekerjaan Pembangunan{' '}
            <strong className="text-slate-900">{formData.packageName}</strong> demi terciptanya{' '}
            <strong className="text-blue-700 font-extrabold">Zero Accident</strong>, dengan memastikan:
          </p>

          {/* Dynamic Editable Commitment Points */}
          <div className="space-y-2 pt-1">
            {points.map((pt, idx) => (
              <div key={idx} className="flex items-start justify-between bg-white p-2.5 rounded-lg border border-slate-200">
                <div className="flex items-start space-x-2">
                  <span className="font-bold text-blue-600">{String.fromCharCode(97 + idx)}.</span>
                  <span className="text-xs text-slate-800">{pt}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemovePoint(idx)}
                  className="text-slate-400 hover:text-rose-600 p-1"
                  title="Hapus butir"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          {/* Add custom commitment point */}
          <div className="flex gap-2 pt-2">
            <input
              type="text"
              placeholder="Tambahkan butir komitmen pengawasan keselamatan..."
              value={newPoint}
              onChange={(e) => setNewPoint(e.target.value)}
              className="flex-1 text-xs p-2 border border-slate-300 rounded-lg bg-white"
            />
            <button
              type="button"
              onClick={handleAddPoint}
              className="px-3 py-2 text-xs font-semibold bg-slate-800 text-white rounded-lg hover:bg-slate-700 flex items-center space-x-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah</span>
            </button>
          </div>
        </div>

        {/* Signing Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 text-xs">
          <div className="space-y-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Kota Penandatanganan</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full text-xs p-2 border border-slate-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Tanggal</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full text-xs p-2 border border-slate-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Nama Kepala Pengawas Pekerjaan *</label>
              <input
                type="text"
                value={formData.headSupervisorName}
                onChange={(e) => setFormData({ ...formData, headSupervisorName: e.target.value })}
                className="w-full text-xs p-2 border border-slate-300 rounded-lg font-bold"
              />
            </div>
          </div>

          {/* Signature Box */}
          <div>
            <SignaturePad
              label="Tanda Tangan Kepala Pengawas Pekerjaan"
              initialSignature={formData.signatureUrl}
              onSave={(dataUrl) => setFormData({ ...formData, signatureUrl: dataUrl })}
            />
          </div>
        </div>
      </form>
    </div>
  );
};
