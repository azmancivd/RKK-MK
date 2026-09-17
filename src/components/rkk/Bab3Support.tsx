import React, { useState } from 'react';
import {
  Users,
  DollarSign,
  Plus,
  Trash2,
  Edit2,
  FileCheck2,
  AlertTriangle,
  CheckCircle2,
  Award,
} from 'lucide-react';
import { useAppStore } from '../../lib/store';
import { Personnel, SafetyBudgetItem } from '../../types';

export const Bab3Support: React.FC = () => {
  const { currentProject, currentRKK, state, updateGlobalState, addAuditLog, addNotification } = useAppStore();
  const [activeTab, setActiveTab] = useState<'PERSONEL' | 'BIAYA_SMKK'>('PERSONEL');

  const projectId = currentProject?.id || '';
  const rkkId = currentRKK?.id || '';
  const personnelList = state.personnel[projectId] || [];
  const budgetList = state.safetyBudgets[rkkId] || [];

  // Editing Personnel
  const [editingPerson, setEditingPerson] = useState<Partial<Personnel> | null>(null);

  // Quick edit budget item
  const handleUpdateBudgetItem = (id: string, volume: number, unitPrice: number) => {
    const total = volume * unitPrice;
    updateGlobalState((prev) => ({
      ...prev,
      safetyBudgets: {
        ...prev.safetyBudgets,
        [rkkId]: (prev.safetyBudgets[rkkId] || []).map((b) =>
          b.id === id ? { ...b, volume, unitPrice, totalPrice: total } : b
        ),
      },
    }));
  };

  const handleSavePersonnel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPerson?.name || !editingPerson?.position) {
      alert('Mohon isi nama dan jabatan personel');
      return;
    }

    const newPerson: Personnel = {
      id: editingPerson.id || 'per-' + Date.now(),
      projectId,
      name: editingPerson.name,
      nik: editingPerson.nik || '3324000000000000',
      position: editingPerson.position,
      education: editingPerson.education || 'S1 Teknik Sipil',
      fieldOfExpertise: editingPerson.fieldOfExpertise || 'Keselamatan Konstruksi & Pengawasan',
      yearsOfExperience: editingPerson.yearsOfExperience || 5,
      certificates: editingPerson.certificates || [
        {
          id: 'cert-' + Date.now(),
          certificateType: 'SKA Ahli K3 Konstruksi - Muda',
          certificateNumber: 'SKA-9021-' + Math.floor(1000 + Math.random() * 9000),
          issuingBody: 'LPJK / BNSP',
          validUntil: '2028-12-31',
          isValid: true,
        },
      ],
    };

    updateGlobalState((prev) => {
      const existing = prev.personnel[projectId] || [];
      const updated = editingPerson.id
        ? existing.map((p) => (p.id === editingPerson.id ? newPerson : p))
        : [...existing, newPerson];
      return {
        ...prev,
        personnel: { ...prev.personnel, [projectId]: updated },
      };
    });

    addAuditLog('UPDATE', 'Bab 3.1 Personel', newPerson.id, `Menyimpan data personel pengawas: ${newPerson.name}`);
    setEditingPerson(null);
  };

  const handleDeletePerson = (id: string) => {
    if (!confirm('Hapus personel ini dari daftar pengawasan?')) return;
    updateGlobalState((prev) => ({
      ...prev,
      personnel: {
        ...prev.personnel,
        [projectId]: (prev.personnel[projectId] || []).filter((p) => p.id !== id),
      },
    }));
    addAuditLog('DELETE', 'Bab 3.1 Personel', id, 'Menghapus personel');
  };

  // Calculate Grand Total of 9 Components
  const grandTotalSMKK = budgetList.reduce((acc, curr) => acc + curr.totalPrice, 0);

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
            Bab 3 Permen PUPR No. 10/2021
          </span>
          <h1 className="text-lg sm:text-xl font-black text-slate-900 mt-1">
            3. Dukungan Keselamatan Konstruksi
          </h1>
          <p className="text-xs text-slate-500">
            Kompetensi personel pengawasan berkeselamatan & 9 komponen rincian biaya penerapan SMKK
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <div className="px-3.5 py-2 bg-emerald-50 rounded-xl border border-emerald-200 text-right">
            <span className="text-[10px] uppercase font-bold text-emerald-600 block">Total Biaya SMKK</span>
            <span className="text-sm font-black text-emerald-800">{formatRupiah(grandTotalSMKK)}</span>
          </div>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex border-b border-slate-200 bg-white rounded-t-xl px-4">
        <button
          onClick={() => setActiveTab('PERSONEL')}
          className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center space-x-2 transition-colors ${
            activeTab === 'PERSONEL'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>3.1 Kompetensi Personel Pengawas & Sertifikat K3</span>
          <span className="px-2 py-0.2 rounded-full bg-blue-100 text-blue-800 text-[10px]">
            {personnelList.length} Personel
          </span>
        </button>

        <button
          onClick={() => setActiveTab('BIAYA_SMKK')}
          className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center space-x-2 transition-colors ${
            activeTab === 'BIAYA_SMKK'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>3.2 Rincian 9 Komponen Biaya Penerapan SMKK</span>
          <span className="px-2 py-0.2 rounded-full bg-emerald-100 text-emerald-800 text-[10px]">
            {budgetList.length} Item
          </span>
        </button>
      </div>

      {/* Pane 3.1: Personel & Sertifikat K3 */}
      {activeTab === 'PERSONEL' && (
        <div className="bg-white rounded-b-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-800">
                Tabel Personel Pengawas & Bukti Sertifikasi Kompetensi Kerja
              </h3>
              <p className="text-xs text-slate-500">
                Penyedia jasa wajib menugaskan tenaga ahli yang memiliki sertifikat kompetensi kerja yang masih berlaku
              </p>
            </div>
            <button
              onClick={() =>
                setEditingPerson({
                  name: '',
                  position: 'Quality & Safety Inspector',
                  education: 'S1 Teknik Sipil',
                  yearsOfExperience: 4,
                })
              }
              className="flex items-center space-x-1 px-3 py-1.5 text-xs font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Personel</span>
            </button>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 border-b text-slate-700">
                  <th className="py-2.5 px-3 font-bold w-12 text-center">No</th>
                  <th className="py-2.5 px-3 font-bold">Nama Personel & Jabatan</th>
                  <th className="py-2.5 px-3 font-bold w-36">Pendidikan & Pengalaman</th>
                  <th className="py-2.5 px-3 font-bold">Sertifikat Kompetensi Kerja (SKA/SKT/K3)</th>
                  <th className="py-2.5 px-3 font-bold w-32">Masa Berlaku</th>
                  <th className="py-2.5 px-3 font-bold w-28 text-center">Status</th>
                  <th className="py-2.5 px-3 font-bold w-20 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {personnelList.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400">
                      Belum ada personel pengawas yang terdaftar.
                    </td>
                  </tr>
                ) : (
                  personnelList.map((person, idx) => (
                    <tr key={person.id} className="hover:bg-slate-50">
                      <td className="py-3 px-3 text-center font-bold text-slate-500">{idx + 1}</td>
                      <td className="py-3 px-3">
                        <strong className="text-slate-900 block">{person.name}</strong>
                        <span className="text-[11px] text-blue-600 font-medium">{person.position}</span>
                      </td>
                      <td className="py-3 px-3">
                        <p className="font-semibold text-slate-800">{person.education}</p>
                        <p className="text-[11px] text-slate-500">{person.yearsOfExperience} Tahun Pengalaman</p>
                      </td>
                      <td className="py-3 px-3 space-y-1">
                        {person.certificates?.map((c) => (
                          <div key={c.id} className="flex items-center space-x-1.5">
                            <Award className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                            <div>
                              <span className="font-bold text-slate-800">{c.certificateType}</span>
                              <span className="text-[10px] text-slate-400 block font-mono">
                                No: {c.certificateNumber} • {c.issuingBody}
                              </span>
                            </div>
                          </div>
                        ))}
                      </td>
                      <td className="py-3 px-3 font-mono text-[11px]">
                        {person.certificates?.[0]?.validUntil || '-'}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>VALID AKTIF</span>
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <div className="flex items-center justify-center space-x-1">
                          <button
                            onClick={() => setEditingPerson(person)}
                            className="p-1 rounded-md text-slate-400 hover:text-blue-600 hover:bg-blue-50"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeletePerson(person.id)}
                            className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pane 3.2: 9 Komponen Biaya Penerapan SMKK */}
      {activeTab === 'BIAYA_SMKK' && (
        <div className="bg-white rounded-b-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-800">
                Tabel Format Rincian Biaya Penerapan SMKK (Permen PUPR No. 10/2021)
              </h3>
              <p className="text-xs text-slate-500">
                Mengacu pada 9 butir komponen biaya keselamatan konstruksi yang wajib dianggarkan dalam pengawasan
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold text-slate-500 block">Total Anggaran SMKK</span>
              <span className="text-lg font-black text-emerald-700">{formatRupiah(grandTotalSMKK)}</span>
            </div>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 border-b text-slate-700">
                  <th className="py-2.5 px-3 font-bold w-12 text-center">No</th>
                  <th className="py-2.5 px-3 font-bold w-64">Uraian Komponen SMKK</th>
                  <th className="py-2.5 px-3 font-bold">Rincian Kegiatan / Pengadaan</th>
                  <th className="py-2.5 px-2 font-bold w-20 text-center">Volume</th>
                  <th className="py-2.5 px-2 font-bold w-20 text-center">Satuan</th>
                  <th className="py-2.5 px-3 font-bold w-32 text-right">Harga Satuan (Rp)</th>
                  <th className="py-2.5 px-3 font-bold w-36 text-right">Total Biaya (Rp)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {budgetList.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="py-3 px-3 text-center font-bold text-slate-500">{idx + 1}</td>
                    <td className="py-3 px-3 font-bold text-slate-900">{item.componentName}</td>
                    <td className="py-3 px-3 text-slate-700">{item.description}</td>
                    <td className="py-3 px-2 text-center">
                      <input
                        type="number"
                        value={item.volume}
                        onChange={(e) =>
                          handleUpdateBudgetItem(item.id, Number(e.target.value), item.unitPrice)
                        }
                        className="w-16 p-1 text-center font-mono border rounded bg-white"
                      />
                    </td>
                    <td className="py-3 px-2 text-center font-semibold text-slate-600">{item.unit}</td>
                    <td className="py-3 px-3 text-right">
                      <input
                        type="number"
                        value={item.unitPrice}
                        onChange={(e) =>
                          handleUpdateBudgetItem(item.id, item.volume, Number(e.target.value))
                        }
                        className="w-28 p-1 text-right font-mono border rounded bg-white"
                      />
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-emerald-800 font-mono">
                      {formatRupiah(item.totalPrice)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-slate-100 font-black text-slate-900 border-t-2 border-slate-300">
                  <td colSpan={6} className="py-3 px-4 text-right uppercase tracking-wider text-xs">
                    Total Biaya Penerapan SMKK (Termasuk PPN) :
                  </td>
                  <td className="py-3 px-3 text-right text-sm text-emerald-800 font-mono">
                    {formatRupiah(grandTotalSMKK)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* Edit Person Modal */}
      {editingPerson && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <form
            onSubmit={handleSavePersonnel}
            className="bg-white rounded-2xl p-6 shadow-2xl border border-slate-200 max-w-md w-full space-y-4"
          >
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-sm font-bold text-slate-900">
                {editingPerson.id ? 'Ubah Personel Pengawas' : 'Tambah Personel Pengawas'}
              </h3>
              <button
                type="button"
                onClick={() => setEditingPerson(null)}
                className="text-slate-400 hover:text-slate-700 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Lengkap & Gelar *</label>
                <input
                  type="text"
                  required
                  value={editingPerson.name || ''}
                  onChange={(e) => setEditingPerson({ ...editingPerson, name: e.target.value })}
                  placeholder="Contoh: Ir. Wahyu Hidayat, MT."
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Jabatan dalam Proyek *</label>
                <input
                  type="text"
                  required
                  value={editingPerson.position || ''}
                  onChange={(e) => setEditingPerson({ ...editingPerson, position: e.target.value })}
                  placeholder="Contoh: Ahli K3 Konstruksi Pengawas"
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Pendidikan Terakhir</label>
                  <input
                    type="text"
                    value={editingPerson.education || ''}
                    onChange={(e) => setEditingPerson({ ...editingPerson, education: e.target.value })}
                    placeholder="S1 Teknik Sipil"
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Pengalaman (Tahun)</label>
                  <input
                    type="number"
                    value={editingPerson.yearsOfExperience || 5}
                    onChange={(e) =>
                      setEditingPerson({ ...editingPerson, yearsOfExperience: Number(e.target.value) })
                    }
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-3 border-t">
              <button
                type="button"
                onClick={() => setEditingPerson(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl"
              >
                Simpan Personel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
