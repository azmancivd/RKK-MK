import React, { useState } from 'react';
import {
  Network,
  FileCode2,
  Plus,
  Trash2,
  Edit2,
  FileText,
  CheckCircle2,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useAppStore } from '../../lib/store';
import { OrgMember, SafetyDocument } from '../../types';

export const Bab4Operations: React.FC = () => {
  const { currentProject, currentRKK, state, updateGlobalState, addAuditLog } = useAppStore();
  const [activeTab, setActiveTab] = useState<'ORGANISASI' | 'DOKUMEN_SOP'>('ORGANISASI');

  const projectId = currentProject?.id || '';
  const rkkId = currentRKK?.id || '';
  const orgMembers = state.orgMembers[rkkId] || [];
  const safetyDocs = state.safetyDocuments[projectId] || [];

  // Editing Org Member
  const [editingMember, setEditingMember] = useState<Partial<OrgMember> | null>(null);
  // Editing SOP Doc
  const [editingDoc, setEditingDoc] = useState<Partial<SafetyDocument> | null>(null);

  const handleSaveMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember?.position || !editingMember?.name) {
      alert('Mohon lengkapi Jabatan dan Nama Personel');
      return;
    }

    const newMember: OrgMember = {
      id: editingMember.id || 'org-' + Date.now(),
      rkkId,
      position: editingMember.position,
      name: editingMember.name,
      responsibilities: editingMember.responsibilities || [
        'Memastikan penerapan SMKK berjalan sesuai ketentuan',
        'Melakukan koordinasi dengan PPK dan Penyedia Pelaksana',
      ],
    };

    updateGlobalState((prev) => {
      const existing = prev.orgMembers[rkkId] || [];
      const updated = editingMember.id
        ? existing.map((m) => (m.id === editingMember.id ? newMember : m))
        : [...existing, newMember];
      return {
        ...prev,
        orgMembers: { ...prev.orgMembers, [rkkId]: updated },
      };
    });

    addAuditLog('UPDATE', 'Bab 4.1 Struktur Organisasi', newMember.id, `Menyimpan anggota struktur organisasi: ${newMember.position}`);
    setEditingMember(null);
  };

  const handleSaveDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDoc?.title || !editingDoc?.code) {
      alert('Mohon isi Judul dan Kode Dokumen');
      return;
    }

    const newDoc: SafetyDocument = {
      id: editingDoc.id || 'doc-' + Date.now(),
      projectId,
      code: editingDoc.code,
      title: editingDoc.title,
      type: editingDoc.type || 'SOP',
      revision: editingDoc.revision || '00',
      status: 'AKTIF',
      description: editingDoc.description || '',
    };

    updateGlobalState((prev) => {
      const existing = prev.safetyDocuments[projectId] || [];
      const updated = editingDoc.id
        ? existing.map((d) => (d.id === editingDoc.id ? newDoc : d))
        : [...existing, newDoc];
      return {
        ...prev,
        safetyDocuments: { ...prev.safetyDocuments, [projectId]: updated },
      };
    });

    addAuditLog('UPDATE', 'Bab 4.2 Dokumen SOP', newDoc.id, `Menyimpan SOP/IK: ${newDoc.title}`);
    setEditingDoc(null);
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
            Bab 4 Permen PUPR No. 10/2021
          </span>
          <h1 className="text-lg sm:text-xl font-black text-slate-900 mt-1">
            4. Operasi Keselamatan Konstruksi
          </h1>
          <p className="text-xs text-slate-500">
            Bagan struktur organisasi pengawasan K3, uraian tugas & tanggung jawab, serta pengendalian dokumen SOP/Instruksi Kerja
          </p>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex border-b border-slate-200 bg-white rounded-t-xl px-4">
        <button
          onClick={() => setActiveTab('ORGANISASI')}
          className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center space-x-2 transition-colors ${
            activeTab === 'ORGANISASI'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Network className="w-4 h-4" />
          <span>4.1 Bagan Struktur Organisasi & Tugas Tanggung Jawab</span>
          <span className="px-2 py-0.2 rounded-full bg-blue-100 text-blue-800 text-[10px]">
            {orgMembers.length} Posisi
          </span>
        </button>

        <button
          onClick={() => setActiveTab('DOKUMEN_SOP')}
          className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center space-x-2 transition-colors ${
            activeTab === 'DOKUMEN_SOP'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileCode2 className="w-4 h-4" />
          <span>4.2 Pengelolaan Dokumen Keselamatan (SOP / Instruksi Kerja)</span>
          <span className="px-2 py-0.2 rounded-full bg-slate-100 text-slate-700 text-[10px]">
            {safetyDocs.length} Dokumen
          </span>
        </button>
      </div>

      {/* Pane 4.1: Struktur Organisasi & Tugas */}
      {activeTab === 'ORGANISASI' && (
        <div className="bg-white rounded-b-xl border border-slate-200 p-5 shadow-xs space-y-6">
          {/* Visual Org Tree / Chart */}
          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Bagan Struktur Organisasi Unit Pengawasan Keselamatan Konstruksi (MK)
            </h3>

            {/* Level 1: Kepala Pengawas */}
            <div className="inline-block p-4 bg-blue-900 text-white rounded-xl shadow-md border border-blue-700 max-w-xs text-center">
              <span className="text-[10px] text-blue-300 font-extrabold uppercase block">Pimpinan Pengawasan</span>
              <p className="text-sm font-bold mt-0.5">Kepala Pengawas Pekerjaan (Team Leader)</p>
              <p className="text-xs text-blue-200 mt-1 font-medium">{currentProject?.teamLeaderName}</p>
            </div>

            <div className="w-0.5 h-6 bg-slate-300 mx-auto" />

            {/* Level 2: Penanggung Jawab K3 */}
            <div className="inline-block p-3.5 bg-emerald-700 text-white rounded-xl shadow-md border border-emerald-600 max-w-xs text-center">
              <span className="text-[10px] text-emerald-200 font-extrabold uppercase block">
                Penanggung Jawab K3 Pengawasan
              </span>
              <p className="text-xs font-bold mt-0.5">Ahli Keselamatan Konstruksi / Safety Engineer</p>
            </div>

            <div className="w-0.5 h-6 bg-slate-300 mx-auto" />

            {/* Level 3: Inspector Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
              <div className="p-3 bg-white border border-slate-300 rounded-xl shadow-xs text-center">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Teknis Sipil & Struktur</span>
                <p className="text-xs font-bold text-slate-800 mt-0.5">Quality / Quantity Engineer</p>
              </div>
              <div className="p-3 bg-white border border-slate-300 rounded-xl shadow-xs text-center">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Pemeriksaan Lapangan</span>
                <p className="text-xs font-bold text-slate-800 mt-0.5">Safety & Field Inspector</p>
              </div>
              <div className="p-3 bg-white border border-slate-300 rounded-xl shadow-xs text-center">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Dukungan Administrasi</span>
                <p className="text-xs font-bold text-slate-800 mt-0.5">Petugas Administrasi & K3 Dokumen</p>
              </div>
            </div>
          </div>

          {/* Tabel 5: Format Tugas dan Tanggung Jawab Struktur Organisasi */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-800">
                  Tabel 5: Format Uraian Tugas dan Tanggung Jawab Struktur Organisasi Pengawasan
                </h3>
                <p className="text-xs text-slate-500">
                  Format resmi Lampiran D.1 Permen PUPR No. 10 Tahun 2021
                </p>
              </div>
              <button
                onClick={() =>
                  setEditingMember({
                    position: '',
                    name: '',
                    responsibilities: ['Melaksanakan pengawasan harian', 'Menyusun laporan K3 mingguan'],
                  })
                }
                className="flex items-center space-x-1 px-3 py-1.5 text-xs font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Jabatan</span>
              </button>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100 border-b text-slate-700">
                    <th className="py-2.5 px-3 font-bold w-12 text-center">No</th>
                    <th className="py-2.5 px-3 font-bold w-64">Jabatan</th>
                    <th className="py-2.5 px-3 font-bold w-48">Nama Pejabat / Personel</th>
                    <th className="py-2.5 px-3 font-bold">Tugas dan Tanggung Jawab</th>
                    <th className="py-2.5 px-3 font-bold w-16 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {orgMembers.map((member, idx) => (
                    <tr key={member.id} className="hover:bg-slate-50">
                      <td className="py-3 px-3 text-center font-bold text-slate-500">{idx + 1}</td>
                      <td className="py-3 px-3 font-bold text-slate-900">{member.position}</td>
                      <td className="py-3 px-3 font-semibold text-blue-900">{member.name}</td>
                      <td className="py-3 px-3 space-y-1">
                        {member.responsibilities.map((resp, rIdx) => (
                          <div key={rIdx} className="flex items-start space-x-1.5">
                            <span className="text-blue-600 font-bold">•</span>
                            <span className="text-slate-700">{resp}</span>
                          </div>
                        ))}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <button
                          onClick={() => setEditingMember(member)}
                          className="p-1 rounded-md text-slate-400 hover:text-blue-600 hover:bg-blue-50"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Pane 4.2: Dokumen SOP & Instruksi Kerja */}
      {activeTab === 'DOKUMEN_SOP' && (
        <div className="bg-white rounded-b-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-800">
                Pengelolaan Dokumen Keselamatan Konstruksi (SOP, Instruksi Kerja, Form)
              </h3>
              <p className="text-xs text-slate-500">
                Daftar prosedur operasional standar acuan pengawasan dan audit keselamatan lapangan
              </p>
            </div>
            <button
              onClick={() =>
                setEditingDoc({
                  code: 'SOP-PW-K3-00' + (safetyDocs.length + 1),
                  title: '',
                  type: 'SOP',
                  revision: '00',
                })
              }
              className="flex items-center space-x-1 px-3 py-1.5 text-xs font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah SOP / IK</span>
            </button>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 border-b text-slate-700">
                  <th className="py-2.5 px-3 font-bold w-12 text-center">No</th>
                  <th className="py-2.5 px-3 font-bold w-40">Nomor Dokumen</th>
                  <th className="py-2.5 px-3 font-bold">Judul SOP / Instruksi Kerja</th>
                  <th className="py-2.5 px-3 font-bold w-28 text-center">Jenis</th>
                  <th className="py-2.5 px-3 font-bold w-20 text-center">Revisi</th>
                  <th className="py-2.5 px-3 font-bold w-24 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {safetyDocs.map((doc, idx) => (
                  <tr key={doc.id} className="hover:bg-slate-50">
                    <td className="py-3 px-3 text-center font-bold text-slate-500">{idx + 1}</td>
                    <td className="py-3 px-3 font-mono font-bold text-slate-800">{doc.code}</td>
                    <td className="py-3 px-3">
                      <strong className="text-slate-900 block">{doc.title}</strong>
                      {doc.description && <span className="text-[11px] text-slate-500">{doc.description}</span>}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] font-bold">
                        {doc.type}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center font-mono text-slate-600">Rev.{doc.revision}</td>
                    <td className="py-3 px-3 text-center">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                        {doc.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Editing Org Member */}
      {editingMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <form
            onSubmit={handleSaveMember}
            className="bg-white rounded-2xl p-6 shadow-2xl border border-slate-200 max-w-md w-full space-y-4"
          >
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-sm font-bold text-slate-900">Uraian Jabatan & Tugas</h3>
              <button
                type="button"
                onClick={() => setEditingMember(null)}
                className="text-slate-400 hover:text-slate-700 text-xs font-bold"
              >
                ✕
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Jabatan *</label>
                <input
                  type="text"
                  required
                  value={editingMember.position || ''}
                  onChange={(e) => setEditingMember({ ...editingMember, position: e.target.value })}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Pejabat / Personel *</label>
                <input
                  type="text"
                  required
                  value={editingMember.name || ''}
                  onChange={(e) => setEditingMember({ ...editingMember, name: e.target.value })}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2 pt-3 border-t">
              <button
                type="button"
                onClick={() => setEditingMember(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl"
              >
                Simpan
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
