import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Search,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  MapPin,
  User,
  Shield,
  Trash2,
  Eye,
} from 'lucide-react';
import { useAppStore } from '../../lib/store';
import { JobSafetyAnalysis, JSAItem } from '../../types';

export const JSAList: React.FC = () => {
  const { currentProject, currentUser, state, updateGlobalState, addAuditLog, addNotification } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedJSA, setSelectedJSA] = useState<JobSafetyAnalysis | null>(null);

  const projectId = currentProject?.id || '';
  const jsaList = state.jsaList[projectId] || [];

  // Form State
  const [formData, setFormData] = useState<Partial<JobSafetyAnalysis>>({
    jsaNumber: `JSA-SMKK-${new Date().getFullYear()}-${String(jsaList.length + 1).padStart(3, '0')}`,
    jobName: '',
    workStage: 'Pekerjaan Struktur',
    location: currentProject?.location || '',
    date: new Date().toISOString().split('T')[0],
    preparedBy: currentProject?.contractorName || 'HSE Officer Kontraktor',
    reviewedBy: currentUser.fullName,
    approvedBy: currentProject?.teamLeaderName || 'Ir. Hendra Wijaya, ST., MT.',
    status: 'APPROVED',
  });

  const [items, setItems] = useState<JSAItem[]>([
    {
      step: 1,
      workStep: 'Persiapan area dan mobilisasi alat kerja',
      hazard: 'Akses sempit, material licin, lalu lintas kendaraan',
      risk: 'Pekerja tertabrak, terpeleset',
      controlMeasure: 'Pasang barikade, rambu peringatan, dan atur jalur lalu lintas material',
      pic: 'Mandor / Safety Officer',
    },
    {
      step: 2,
      workStep: 'Pemasangan scaffolding & bekisting di ketinggian > 2m',
      hazard: 'Ketinggian, perancah tidak stabil, cuaca angin kencang',
      risk: 'Jatuh dari ketinggian, perancah roboh',
      controlMeasure: 'Wajib kenakan full body harness cantol double lanyard ke lifeline independen; pasang Green Tag',
      pic: 'Scaffolder Bersertifikat',
    },
    {
      step: 3,
      workStep: 'Pengecoran beton ready mix dengan concrete pump',
      hazard: 'Pipa pompa bertekanan tinggi, percikan adukan beton',
      risk: 'Pipa pecah mengenai pekerja, iritasi kulit/mata',
      controlMeasure: 'Gunakan kacamata safety, sarung tangan karet, dan inspeksi sambungan pipa pump',
      pic: 'Operator Concrete Pump',
    },
  ]);

  const handleAddItem = () => {
    setItems([
      ...items,
      {
        step: items.length + 1,
        workStep: '',
        hazard: '',
        risk: '',
        controlMeasure: '',
        pic: 'Supervisor Lapangan',
      },
    ]);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, idx) => idx !== index));
  };

  const handleSaveJSA = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.jobName) return;

    const newJSA: JobSafetyAnalysis = {
      id: 'jsa-' + Date.now(),
      projectId,
      jsaNumber:
        formData.jsaNumber ||
        `JSA-SMKK-${new Date().getFullYear()}-${String(jsaList.length + 1).padStart(3, '0')}`,
      jobName: formData.jobName || '',
      workStage: formData.workStage || 'Struktur',
      location: formData.location || 'Site',
      date: formData.date || new Date().toISOString().split('T')[0],
      preparedBy: formData.preparedBy || 'Kontraktor',
      reviewedBy: formData.reviewedBy || currentUser.fullName,
      approvedBy: formData.approvedBy || 'Team Leader',
      items,
      status: 'APPROVED',
    };

    updateGlobalState((prev) => ({
      ...prev,
      jsaList: {
        ...prev.jsaList,
        [projectId]: [newJSA, ...(prev.jsaList[projectId] || [])],
      },
    }));

    addAuditLog('CREATE', 'Job Safety Analysis (JSA)', newJSA.jsaNumber, `Mengesahkan JSA untuk pekerjaan: ${newJSA.jobName}`);
    addNotification('JSA Disetujui', `Dokumen ${newJSA.jsaNumber} siap digunakan sebelum izin kerja diterbitkan.`, 'SUCCESS');
    setShowCreateModal(false);
  };

  const filtered = jsaList.filter(
    (j) =>
      j.jsaNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      j.jobName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      j.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
            Analisis Keselamatan Pekerjaan
          </span>
          <h1 className="text-xl font-black text-slate-900 mt-1 flex items-center space-x-2">
            <FileText className="w-5 h-5 text-indigo-600" />
            <span>Job Safety Analysis (JSA) Pengawasan</span>
          </h1>
          <p className="text-xs text-slate-500">
            Penelaahan sistematis tahapan kerja kritis, potensi bahaya, dan langkah pengendalian sebelum izin kerja (PTW) disetujui
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center space-x-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Buat / Tinjau JSA Baru</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari nomor JSA, nama pekerjaan atau lokasi..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs border border-slate-200 rounded-lg bg-slate-50/50"
          />
        </div>
      </div>

      {/* JSA Cards */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl border border-dashed border-slate-300">
            <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-xs text-slate-500">Belum ada dokumen Job Safety Analysis (JSA).</p>
          </div>
        ) : (
          filtered.map((jsa) => (
            <div
              key={jsa.id}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-indigo-300 transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-2.5">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                    {jsa.jsaNumber}
                  </span>
                  <h3 className="text-sm font-black text-slate-900">{jsa.jobName}</h3>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    Status: {jsa.status}
                  </span>
                </div>
              </div>

              {/* Steps Table Preview */}
              <div className="overflow-x-auto border border-slate-100 rounded-xl">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                      <th className="p-2.5 w-12 text-center">Step</th>
                      <th className="p-2.5 w-56">Tahapan Pekerjaan</th>
                      <th className="p-2.5 w-52">Potensi Bahaya</th>
                      <th className="p-2.5 w-48">Risiko Cedera / Kerusakan</th>
                      <th className="p-2.5">Pengendalian Risiko Pengawasan</th>
                      <th className="p-2.5 w-32">PIC</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {jsa.items.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/70">
                        <td className="p-2.5 text-center font-bold text-slate-400">{item.step}</td>
                        <td className="p-2.5 font-bold text-slate-900">{item.workStep}</td>
                        <td className="p-2.5 text-rose-700 font-medium">{item.hazard}</td>
                        <td className="p-2.5 text-slate-600">{item.risk}</td>
                        <td className="p-2.5 text-slate-800 bg-emerald-50/30">{item.controlMeasure}</td>
                        <td className="p-2.5 text-[11px] font-medium text-slate-500">{item.pic}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Signatures & Metadata */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100 gap-2">
                <div className="flex items-center space-x-3">
                  <span>Lokasi: <strong>{jsa.location}</strong></span>
                  <span>•</span>
                  <span>Tanggal: <strong>{jsa.date}</strong></span>
                </div>
                <div className="flex items-center space-x-3">
                  <span>Disusun: <strong>{jsa.preparedBy}</strong></span>
                  <span>•</span>
                  <span>Diperiksa: <strong>{jsa.reviewedBy}</strong></span>
                  <span>•</span>
                  <span>Disetujui: <strong>{jsa.approvedBy}</strong></span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Buat JSA Baru */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
          <form
            onSubmit={handleSaveJSA}
            className="bg-white rounded-2xl p-6 shadow-2xl border border-slate-200 max-w-3xl w-full space-y-4 my-8 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-sm font-bold text-slate-900">Buat / Telaah Job Safety Analysis (JSA) Baru</h3>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-700 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nomor JSA</label>
                  <input
                    type="text"
                    required
                    value={formData.jsaNumber || ''}
                    onChange={(e) => setFormData({ ...formData, jsaNumber: e.target.value })}
                    className="w-full text-xs p-2 border border-slate-300 rounded-lg font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tahapan / Kategori Pekerjaan</label>
                  <input
                    type="text"
                    value={formData.workStage || ''}
                    onChange={(e) => setFormData({ ...formData, workStage: e.target.value })}
                    className="w-full text-xs p-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Pekerjaan Kritis *</label>
                <input
                  type="text"
                  required
                  value={formData.jobName || ''}
                  onChange={(e) => setFormData({ ...formData, jobName: e.target.value })}
                  placeholder="Contoh: Pemasangan Girder Precast Jembatan dengan Crane 50 Ton"
                  className="w-full text-xs p-2 border border-slate-300 rounded-lg font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Lokasi Pekerjaan</label>
                  <input
                    type="text"
                    value={formData.location || ''}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full text-xs p-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tanggal Berlaku</label>
                  <input
                    type="date"
                    value={formData.date || ''}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full text-xs p-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              {/* Items Section */}
              <div className="space-y-2 pt-2 border-t">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900">Langkah Analisis Tahapan Kerja (JSA Steps)</h4>
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="text-[11px] font-bold text-blue-600 hover:text-blue-700 flex items-center space-x-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah Langkah</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {items.map((item, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 border rounded-xl space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-700">Langkah #{idx + 1}</span>
                        {items.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(idx)}
                            className="text-rose-500 hover:text-rose-700"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="Tahapan kegiatan..."
                          value={item.workStep || ''}
                          onChange={(e) => {
                            const copy = [...items];
                            copy[idx].workStep = e.target.value;
                            setItems(copy);
                          }}
                          className="p-1.5 border rounded bg-white"
                        />
                        <input
                          type="text"
                          placeholder="Potensi bahaya..."
                          value={item.hazard || ''}
                          onChange={(e) => {
                            const copy = [...items];
                            copy[idx].hazard = e.target.value;
                            setItems(copy);
                          }}
                          className="p-1.5 border rounded bg-white"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="Risiko paparan..."
                          value={item.risk || ''}
                          onChange={(e) => {
                            const copy = [...items];
                            copy[idx].risk = e.target.value;
                            setItems(copy);
                          }}
                          className="p-1.5 border rounded bg-white"
                        />
                        <input
                          type="text"
                          placeholder="Tindakan pengendalian mitigasi..."
                          value={item.controlMeasure || ''}
                          onChange={(e) => {
                            const copy = [...items];
                            copy[idx].controlMeasure = e.target.value;
                            setItems(copy);
                          }}
                          className="p-1.5 border rounded bg-white"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-3 border-t">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl"
              >
                Simpan & Setujui JSA
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
