import React, { useState } from 'react';
import {
  Wrench,
  Plus,
  Search,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  Clock,
  Shield,
  FileCheck2,
  XCircle,
} from 'lucide-react';
import { useAppStore } from '../../lib/store';
import { TestingCommissioning } from '../../types';

export const TestingCommissioningView: React.FC = () => {
  const { currentProject, currentUser, state, updateGlobalState, addAuditLog, addNotification } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);

  const projectId = currentProject?.id || '';
  const testingList = state.testingList[projectId] || [];

  const [formData, setFormData] = useState<Partial<TestingCommissioning>>({
    equipmentOrSystemName: 'Tower Crane 50m (TC-01)',
    type: 'ALAT_BERAT',
    serialNumberOrTag: 'TC-LIEBHERR-2022-09',
    testDate: new Date().toISOString().split('T')[0],
    inspectorName: currentUser.fullName,
    silOExpirationDate: '2027-08-15',
    sioOperatorNumber: 'SIO-DISNAKER-K3-88741',
    status: 'LAIK_OPERASI',
    notes: 'Load cell test 100% dan 110% overload limit switch berfungsi akurat.',
    testResults: [
      { item: 'Rem Hoisting & Slewing', standard: 'Berhenti instan tanpa selip', actual: 'Normal 100%', result: 'PASS' },
      { item: 'Limit Switch Ketinggian', standard: 'Auto-cut pada jarak 2m', actual: 'Sesuai standar', result: 'PASS' },
      { item: 'Anti-Collision System', standard: 'Sensor aktif radius 15m', actual: 'Berfungsi dengan baik', result: 'PASS' },
      { item: 'Grounding Proteksi Petir', standard: '< 5 Ohm', actual: '2.1 Ohm', result: 'PASS' },
    ],
  });

  const handleSaveTC = (e: React.FormEvent) => {
    e.preventDefault();
    const created: TestingCommissioning = {
      id: 'tc-' + Date.now(),
      projectId,
      equipmentOrSystemName: formData.equipmentOrSystemName || 'Alat',
      type: formData.type || 'ALAT_BERAT',
      serialNumberOrTag: formData.serialNumberOrTag || 'TAG-01',
      testDate: formData.testDate || new Date().toISOString().split('T')[0],
      inspectorName: formData.inspectorName || currentUser.fullName,
      silOExpirationDate: formData.silOExpirationDate,
      sioOperatorNumber: formData.sioOperatorNumber,
      testResults: formData.testResults || [],
      status: formData.status || 'LAIK_OPERASI',
      notes: formData.notes || '',
    };

    updateGlobalState((prev) => ({
      ...prev,
      testingList: {
        ...prev.testingList,
        [projectId]: [created, ...(prev.testingList[projectId] || [])],
      },
    }));

    addAuditLog('CREATE', 'Testing & Commissioning', created.serialNumberOrTag, `Uji kelaikan operasi: ${created.equipmentOrSystemName}`);
    addNotification('T&C Berhasil Disimpan', `Sertifikat Kelaikan Operasi ${created.equipmentOrSystemName} diterbitkan.`, 'SUCCESS');
    setShowModal(false);
  };

  const filtered = testingList.filter(
    (t) =>
      t.equipmentOrSystemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.serialNumberOrTag.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.inspectorName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800">
            Uji Kelaikan Operasi (Permen PUPR 10/2021)
          </span>
          <h1 className="text-xl font-black text-slate-900 mt-1 flex items-center space-x-2">
            <Wrench className="w-5 h-5 text-amber-600" />
            <span>Pemeriksaan, Pengujian & Laik Operasi (T&C)</span>
          </h1>
          <p className="text-xs text-slate-500">
            Pemeriksaan Surat Izin Laik Operasi (SILO), lisensi operator (SIO), dan uji komisioning alat berat konstruksi
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center space-x-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Catat Hasil Uji Kelaikan (T&C)</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari nama peralatan, no seri SILO atau penguji..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs border border-slate-200 rounded-lg bg-slate-50/50"
          />
        </div>
      </div>

      {/* List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl border border-dashed border-slate-300">
            <Wrench className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-xs text-slate-500">Belum ada rekaman uji kelaikan peralatan (T&C).</p>
          </div>
        ) : (
          filtered.map((tc) => (
            <div
              key={tc.id}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-amber-300 transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-3">
                  <h3 className="text-sm font-black text-slate-900">{tc.equipmentOrSystemName}</h3>
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200">
                    {tc.serialNumberOrTag}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <span
                    className={`text-[10px] font-extrabold uppercase px-3 py-1 rounded-full ${
                      tc.status === 'LAIK_OPERASI'
                        ? 'bg-emerald-100 text-emerald-800'
                        : tc.status === 'PERLU_PERBAIKAN'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {tc.status === 'LAIK_OPERASI'
                      ? '✓ LAIK OPERASI'
                      : tc.status === 'PERLU_PERBAIKAN'
                      ? '⚠ PERLU PERBAIKAN'
                      : '✕ TIDAK LAIK OPERASI'}
                  </span>
                </div>
              </div>

              {/* Legalitas & Operator */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Kategori Peralatan</span>
                  <span className="font-semibold text-slate-800">{tc.type.replace('_', ' ')}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Masa Berlaku SILO</span>
                  <span className="font-semibold text-slate-800">
                    {tc.silOExpirationDate ? `${tc.silOExpirationDate} (Aktif)` : 'Tidak berbayar'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Nomor Lisensi Operator (SIO)</span>
                  <span className="font-mono font-bold text-blue-700">{tc.sioOperatorNumber || '-'}</span>
                </div>
              </div>

              {/* Detailed Test Results Table */}
              <div className="overflow-x-auto border border-slate-100 rounded-xl">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                      <th className="p-2.5">Parameter Uji Kelaikan</th>
                      <th className="p-2.5">Standar Acuan</th>
                      <th className="p-2.5">Hasil Pengukuran Nyata</th>
                      <th className="p-2.5 w-24 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {tc.testResults.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/70">
                        <td className="p-2.5 font-bold text-slate-900">{item.item}</td>
                        <td className="p-2.5 text-slate-500">{item.standard}</td>
                        <td className="p-2.5 font-mono text-slate-800">{item.actual}</td>
                        <td className="p-2.5 text-center">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              item.result === 'PASS'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {item.result}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100 gap-2">
                <span>Inspektur Ahli K3: <strong className="text-slate-800">{tc.inspectorName}</strong></span>
                <span>Tanggal Pengujian: <strong className="text-slate-800">{tc.testDate}</strong></span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Tambah T&C */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
          <form
            onSubmit={handleSaveTC}
            className="bg-white rounded-2xl p-6 shadow-2xl border border-slate-200 max-w-xl w-full space-y-4 my-8"
          >
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-sm font-bold text-slate-900">Catat Pengujian Kelaikan Operasi (T&C)</h3>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-700 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Alat / Sistem Yang Diuji *</label>
                <input
                  type="text"
                  required
                  value={formData.equipmentOrSystemName}
                  onChange={(e) => setFormData({ ...formData, equipmentOrSystemName: e.target.value })}
                  className="w-full text-xs p-2 border border-slate-300 rounded-lg font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kategori</label>
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value as TestingCommissioning['type'] })
                    }
                    className="w-full text-xs p-2 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="ALAT_BERAT">Alat Berat Konstruksi</option>
                    <option value="PERALATAN_ANGKAT">Peralatan Angkat & Angkut</option>
                    <option value="SCAFFOLDING">Instalasi Perancah (Scaffolding)</option>
                    <option value="INSTALASI_LISTRIK">Instalasi Kelistrikan Sementara</option>
                    <option value="SISTEM_PROTEKSI_KEBAKARAN">Sistem Proteksi Kebakaran</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nomor Seri / Tag</label>
                  <input
                    type="text"
                    value={formData.serialNumberOrTag}
                    onChange={(e) => setFormData({ ...formData, serialNumberOrTag: e.target.value })}
                    className="w-full text-xs p-2 border border-slate-300 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Masa Berlaku SILO (Izin Laik)</label>
                  <input
                    type="date"
                    value={formData.silOExpirationDate}
                    onChange={(e) => setFormData({ ...formData, silOExpirationDate: e.target.value })}
                    className="w-full text-xs p-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nomor SIO Operator</label>
                  <input
                    type="text"
                    value={formData.sioOperatorNumber}
                    onChange={(e) => setFormData({ ...formData, sioOperatorNumber: e.target.value })}
                    placeholder="Contoh: SIO-K3-99120"
                    className="w-full text-xs p-2 border border-slate-300 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Kesimpulan Kelaikan</label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value as TestingCommissioning['status'] })
                  }
                  className="w-full text-xs p-2 border border-slate-300 rounded-lg bg-white font-bold text-emerald-700"
                >
                  <option value="LAIK_OPERASI">LAIK OPERASI (Dapat Digunakan)</option>
                  <option value="PERLU_PERBAIKAN">PERLU PERBAIKAN (Perbaiki sebelum operasi)</option>
                  <option value="TIDAK_LAIK">TIDAK LAIK OPERASI (Dilarang Operasi!)</option>
                </select>
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
                Simpan Lembar T&C
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
