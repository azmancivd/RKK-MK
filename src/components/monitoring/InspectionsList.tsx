import React, { useState } from 'react';
import {
  ClipboardList,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  MapPin,
  Camera,
  ChevronRight,
  User,
} from 'lucide-react';
import { useAppStore } from '../../lib/store';
import { Inspection, InspectionItem } from '../../types';

export const InspectionsList: React.FC = () => {
  const { currentProject, state, updateGlobalState, addAuditLog, addNotification } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);

  const projectId = currentProject?.id || '';
  const inspections = state.inspections[projectId] || [];

  // Form State
  const [formData, setFormData] = useState<Partial<Inspection>>({
    inspectionDate: new Date().toISOString().split('T')[0],
    location: currentProject?.location || '',
    inspectorName: 'Ir. Wahyu Hidayat, MT.',
    contractorRepresentative: 'Bpk. Budi Santoso (Safety Officer)',
    weather: 'Cerah',
    summary: 'Pemeriksaan rutin kepatuhan K3 dan kelayakan scaffolding pekerjaan struktur lantai 4.',
    status: 'COMPLETED',
  });

  const [items, setItems] = useState<InspectionItem[]>([
    {
      id: 'item-1',
      category: 'Alat Pelindung Diri (APD)',
      itemDescription: 'Seluruh pekerja mengenakan helm tali dagu, rompi reflektif, dan sepatu safety',
      result: 'PASS',
      notes: '100% patuh',
    },
    {
      id: 'item-2',
      category: 'Scaffolding & Perancah',
      itemDescription: 'Scaffolding terpasang baseplate, pipa pengaku diagonal, dan handrail 1.1m',
      result: 'PASS',
      notes: 'Green Tag terpasang',
    },
    {
      id: 'item-3',
      category: 'Kelistrikan Sementara',
      itemDescription: 'Kabel daya terlindungi dan panel listrik dilengkapi ELCB/grounding',
      result: 'FAIL',
      notes: 'Ditemukan kabel melintang di genangan air dekat mixer',
    },
    {
      id: 'item-4',
      category: 'Housekeeping & 5R',
      itemDescription: 'Area kerja bersih dari paku berserakan dan sisa potongan besi',
      result: 'PASS',
    },
  ]);

  const handleSaveInspection = (e: React.FormEvent) => {
    e.preventDefault();
    const newInsp: Inspection = {
      id: 'insp-' + Date.now(),
      projectId,
      inspectionDate: formData.inspectionDate || new Date().toISOString().split('T')[0],
      location: formData.location || '',
      inspectorName: formData.inspectorName || '',
      contractorRepresentative: formData.contractorRepresentative || '',
      weather: formData.weather || 'Cerah',
      summary: formData.summary || '',
      items,
      findingsCount: items.filter((i) => i.result === 'FAIL').length,
      status: 'COMPLETED',
    };

    updateGlobalState((prev) => ({
      ...prev,
      inspections: {
        ...prev.inspections,
        [projectId]: [newInsp, ...(prev.inspections[projectId] || [])],
      },
    }));

    addAuditLog('CREATE', 'Inspeksi K3', newInsp.id, `Mencatat sesi inspeksi K3 di ${newInsp.location}`);
    addNotification('Inspeksi Tercatat', 'Sesi pemeriksaan K3 lapangan berhasil disimpan.', 'SUCCESS');
    setShowModal(false);
  };

  const filtered = inspections.filter(
    (i) =>
      i.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.inspectorName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
            <ClipboardList className="w-5 h-5 text-blue-600" />
            <span>Inspeksi Keselamatan Konstruksi (K3)</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Pencatatan pemeriksaan berkala kepatuhan APD, perancah, alat berat, dan izin kerja di lapangan
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center space-x-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Catat Sesi Inspeksi Baru</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari lokasi, inspektur, atau ringkasan temuan..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs border border-slate-200 rounded-lg bg-slate-50/50"
          />
        </div>
      </div>

      {/* List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white p-8 text-center rounded-2xl border border-dashed border-slate-300">
            <ClipboardList className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-xs text-slate-500">Belum ada catatan inspeksi.</p>
          </div>
        ) : (
          filtered.map((insp) => (
            <div
              key={insp.id}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-300 transition-all space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-slate-800 flex items-center">
                    <Calendar className="w-3.5 h-3.5 text-blue-600 mr-1.5" />
                    {insp.inspectionDate}
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="text-xs text-slate-600 flex items-center">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 mr-1" />
                    {insp.location}
                  </span>
                  <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">
                    Cuaca: {insp.weather}
                  </span>
                </div>

                <div>
                  {insp.findingsCount > 0 ? (
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 flex items-center space-x-1">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>{insp.findingsCount} Temuan Ketidaksesuaian</span>
                    </span>
                  ) : (
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 flex items-center space-x-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Semua Item Sesuai (Pass)</span>
                    </span>
                  )}
                </div>
              </div>

              <p className="text-xs text-slate-700 font-medium">{insp.summary}</p>

              {/* Items Checklist Pills */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                {insp.items.map((item) => (
                  <div
                    key={item.id}
                    className={`p-2 rounded-lg border text-xs flex items-start justify-between ${
                      item.result === 'PASS'
                        ? 'bg-emerald-50/50 border-emerald-100'
                        : item.result === 'FAIL'
                        ? 'bg-rose-50/50 border-rose-100'
                        : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="pr-2">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">{item.category}</span>
                      <span className="text-slate-800 font-medium">{item.itemDescription}</span>
                      {item.notes && <p className="text-[10px] text-slate-500 mt-0.5 italic">{item.notes}</p>}
                    </div>
                    <span
                      className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded ${
                        item.result === 'PASS'
                          ? 'bg-emerald-200 text-emerald-800'
                          : 'bg-rose-200 text-rose-800'
                      }`}
                    >
                      {item.result}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500">
                <span>Inspektur: <strong className="text-slate-700">{insp.inspectorName}</strong></span>
                <span>Pendamping Kontraktor: <strong className="text-slate-700">{insp.contractorRepresentative}</strong></span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* New Inspection Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
          <form
            onSubmit={handleSaveInspection}
            className="bg-white rounded-2xl p-6 shadow-2xl border border-slate-200 max-w-xl w-full space-y-4 my-8"
          >
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-sm font-bold text-slate-900">Catat Sesi Inspeksi K3 Baru</h3>
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
                  <label className="block font-bold text-slate-700 mb-1">Tanggal Inspeksi</label>
                  <input
                    type="date"
                    required
                    value={formData.inspectionDate}
                    onChange={(e) => setFormData({ ...formData, inspectionDate: e.target.value })}
                    className="w-full text-xs p-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Cuaca Lapangan</label>
                  <select
                    value={formData.weather}
                    onChange={(e) => setFormData({ ...formData, weather: e.target.value })}
                    className="w-full text-xs p-2 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="Cerah">Cerah</option>
                    <option value="Berawan">Berawan</option>
                    <option value="Hujan Ringan">Hujan Ringan</option>
                    <option value="Hujan Deras">Hujan Deras / Angin</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Lokasi / Zona Inspeksi *</label>
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Contoh: Gedung A Lantai 4 & Area Fabrikasi Besi"
                  className="w-full text-xs p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nama Pengawas (Inspektur)</label>
                  <input
                    type="text"
                    value={formData.inspectorName}
                    onChange={(e) => setFormData({ ...formData, inspectorName: e.target.value })}
                    className="w-full text-xs p-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Perwakilan Kontraktor</label>
                  <input
                    type="text"
                    value={formData.contractorRepresentative}
                    onChange={(e) =>
                      setFormData({ ...formData, contractorRepresentative: e.target.value })
                    }
                    className="w-full text-xs p-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Ringkasan Hasil Pemeriksaan</label>
                <textarea
                  rows={2}
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
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
                Simpan Hasil Inspeksi
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
