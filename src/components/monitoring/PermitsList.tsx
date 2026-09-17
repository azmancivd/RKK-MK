import React, { useState } from 'react';
import {
  FileCheck2,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Calendar,
  MapPin,
  Users,
  Shield,
  Check,
  XCircle,
} from 'lucide-react';
import { useAppStore } from '../../lib/store';
import { WorkPermit, WorkPermitType } from '../../types';

export const PermitsList: React.FC = () => {
  const { currentProject, currentUser, state, updateGlobalState, addAuditLog, addNotification } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [showModal, setShowModal] = useState(false);

  const projectId = currentProject?.id || '';
  const permits = state.workPermits[projectId] || [];

  // New Permit Form State
  const [newPermit, setNewPermit] = useState<Partial<WorkPermit>>({
    permitNumber: `SIK-SMKK-${new Date().getFullYear()}-${String(permits.length + 1).padStart(3, '0')}`,
    permitType: 'HEIGHT',
    location: currentProject?.location || '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    applicantName: 'Bpk. Hendra Gunawan (Supervisor Kontraktor)',
    contractorTeam: currentProject?.contractorName || 'PT. Kontraktor Pelaksana Utama',
    workersCount: 6,
    requiredApd: ['Safety Helmet', 'Safety Shoes', 'Full Body Harness Double Lanyard', 'Reflective Vest', 'Kacamata Pelindung'],
    status: 'APPROVED',
  });

  const permitTypeLabels: Record<WorkPermitType, string> = {
    HEIGHT: 'Pekerjaan Ketinggian (> 1.8m)',
    HOT_WORK: 'Pekerjaan Panas (Pengelasan/Pemotongan)',
    EXCAVATION: 'Pekerjaan Penggalian (> 1.5m)',
    CONFINED_SPACE: 'Bekerja di Ruang Terbatas',
    LIFTING: 'Pengangkatan Alat Berat (Lifting/Rigging)',
    ELECTRICAL: 'Pekerjaan Tegangan Listrik Sementara',
    NIGHT_WORK: 'Pekerjaan Lembur / Malam Hari',
  };

  const handleCreatePermit = (e: React.FormEvent) => {
    e.preventDefault();
    const created: WorkPermit = {
      id: 'ptw-' + Date.now(),
      projectId,
      permitNumber:
        newPermit.permitNumber ||
        `SIK-SMKK-${new Date().getFullYear()}-${String(permits.length + 1).padStart(3, '0')}`,
      permitType: (newPermit.permitType as WorkPermitType) || 'HEIGHT',
      location: newPermit.location || 'Area Kerja',
      startDate: newPermit.startDate || new Date().toISOString().split('T')[0],
      endDate: newPermit.endDate || new Date().toISOString().split('T')[0],
      applicantName: newPermit.applicantName || 'Kontraktor',
      contractorTeam: newPermit.contractorTeam || 'Tim Pelaksana',
      workersCount: newPermit.workersCount || 4,
      safetyChecklist: [
        { question: 'JSA telah disetujui & disosialisasikan', isCompliant: true },
        { question: 'Pekerja dalam kondisi sehat & bersertifikat', isCompliant: true },
        { question: 'Peralatan telah diinspeksi lolos uji laik', isCompliant: true },
        { question: 'APAR & P3K tersedia di lokasi', isCompliant: true },
      ],
      requiredApd: newPermit.requiredApd || ['Safety Helmet', 'Safety Shoes'],
      safetyOfficerSign: currentUser.fullName,
      status: 'APPROVED',
    };

    updateGlobalState((prev) => ({
      ...prev,
      workPermits: {
        ...prev.workPermits,
        [projectId]: [created, ...(prev.workPermits[projectId] || [])],
      },
    }));

    addAuditLog('CREATE', 'Izin Kerja (PTW)', created.permitNumber, `Menerbitkan Izin Kerja Khusus: ${created.permitType}`);
    addNotification('Izin Kerja Disetujui', `Surat Izin Kerja ${created.permitNumber} berhasil diterbitkan.`, 'SUCCESS');
    setShowModal(false);
  };

  const handleUpdateStatus = (permitId: string, status: WorkPermit['status']) => {
    updateGlobalState((prev) => {
      const list = prev.workPermits[projectId] || [];
      const updated = list.map((p) => (p.id === permitId ? { ...p, status } : p));
      return {
        ...prev,
        workPermits: {
          ...prev.workPermits,
          [projectId]: updated,
        },
      };
    });
    addAuditLog('UPDATE', 'Izin Kerja (PTW)', permitId, `Status izin kerja diubah menjadi ${status}`);
  };

  const filtered = permits.filter((p) => {
    const matchSearch =
      p.permitNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.applicantName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchType = typeFilter === 'ALL' || p.permitType === typeFilter;
    return matchSearch && matchType;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
            Kendali Operasi K3 Berisiko Tinggi
          </span>
          <h1 className="text-xl font-black text-slate-900 mt-1 flex items-center space-x-2">
            <FileCheck2 className="w-5 h-5 text-emerald-600" />
            <span>Surat Izin Kerja Berbahaya (Permit to Work - PTW)</span>
          </h1>
          <p className="text-xs text-slate-500">
            Verifikasi keselamatan pekerjaan berisiko tinggi (ketinggian, galian dalam, pengelasan, ruang terbatas, lifting)
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center space-x-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Terbitkan Izin Kerja Baru</span>
        </button>
      </div>

      {/* Filter & Search */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari nomor izin, pemohon, atau lokasi..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs border border-slate-200 rounded-lg bg-slate-50/50"
          />
        </div>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="text-xs px-3 py-1.5 border border-slate-200 rounded-lg bg-white text-slate-700 font-medium w-full sm:w-auto"
        >
          <option value="ALL">Semua Jenis Pekerjaan Berbahaya</option>
          <option value="HEIGHT">Ketinggian</option>
          <option value="HOT_WORK">Pekerjaan Panas</option>
          <option value="EXCAVATION">Penggalian</option>
          <option value="CONFINED_SPACE">Ruang Terbatas</option>
          <option value="LIFTING">Pengangkatan / Crane</option>
          <option value="ELECTRICAL">Listrik</option>
          <option value="NIGHT_WORK">Kerja Malam</option>
        </select>
      </div>

      {/* Cards List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl border border-dashed border-slate-300">
            <FileCheck2 className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-xs text-slate-500">Belum ada Surat Izin Kerja (PTW) yang tercatat.</p>
          </div>
        ) : (
          filtered.map((permit) => (
            <div
              key={permit.id}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-emerald-300 transition-all space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-2.5">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                    {permit.permitNumber}
                  </span>
                  <span className="text-xs font-black text-slate-900">
                    {permitTypeLabels[permit.permitType] || permit.permitType}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      permit.status === 'APPROVED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : permit.status === 'CLOSED'
                        ? 'bg-slate-100 text-slate-700'
                        : permit.status === 'EXPIRED'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    Status: {permit.status}
                  </span>
                </div>
              </div>

              {/* Detail Info */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-700">
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Lokasi & Zona</span>
                  <p className="font-semibold flex items-center mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 mr-1" />
                    {permit.location}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Masa Berlaku Izin</span>
                  <p className="font-semibold flex items-center mt-0.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400 mr-1" />
                    {permit.startDate} s.d {permit.endDate}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Tenaga Kerja</span>
                  <p className="font-semibold flex items-center mt-0.5">
                    <Users className="w-3.5 h-3.5 text-slate-400 mr-1" />
                    {permit.workersCount} Pekerja Terverifikasi Sehat
                  </p>
                </div>
              </div>

              {/* APD Requirements Checklist */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5">
                <span className="text-[10px] font-bold uppercase text-slate-500 block">
                  Alat Pelindung Diri (APD) Wajib yang Harus Dikenakan:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {permit.requiredApd.map((apd, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 bg-white border border-slate-200 text-slate-700 rounded text-[10px] font-medium"
                    >
                      ✓ {apd}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions & Approver */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                <span className="text-[11px] text-slate-500">
                  Pemohon: <strong className="text-slate-800">{permit.applicantName}</strong> ({permit.contractorTeam})
                </span>

                <div className="flex items-center space-x-2">
                  {permit.status === 'APPROVED' && (
                    <button
                      onClick={() => handleUpdateStatus(permit.id, 'CLOSED')}
                      className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg"
                    >
                      Tutup Izin Kerja (Pekerjaan Selesai)
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Terbitkan Izin */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
          <form
            onSubmit={handleCreatePermit}
            className="bg-white rounded-2xl p-6 shadow-2xl border border-slate-200 max-w-xl w-full space-y-4 my-8"
          >
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-sm font-bold text-slate-900">Terbitkan Surat Izin Kerja (PTW) Baru</h3>
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
                  <label className="block font-bold text-slate-700 mb-1">Nomor Izin Kerja</label>
                  <input
                    type="text"
                    required
                    value={newPermit.permitNumber || ''}
                    onChange={(e) => setNewPermit({ ...newPermit, permitNumber: e.target.value })}
                    className="w-full text-xs p-2 border border-slate-300 rounded-lg font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kategori Pekerjaan Berbahaya</label>
                  <select
                    value={newPermit.permitType || 'HEIGHT'}
                    onChange={(e) =>
                      setNewPermit({ ...newPermit, permitType: e.target.value as WorkPermitType })
                    }
                    className="w-full text-xs p-2 border border-slate-300 rounded-lg bg-white font-semibold"
                  >
                    <option value="HEIGHT">Pekerjaan di Ketinggian (&gt; 1.8m)</option>
                    <option value="HOT_WORK">Pekerjaan Panas (Welding/Cutting)</option>
                    <option value="EXCAVATION">Penggalian (&gt; 1.5m)</option>
                    <option value="CONFINED_SPACE">Ruang Terbatas (Confined Space)</option>
                    <option value="LIFTING">Pengangkatan Alat Berat (Lifting)</option>
                    <option value="ELECTRICAL">Pekerjaan Listrik Tegangan Menengah</option>
                    <option value="NIGHT_WORK">Pekerjaan Malam Hari</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Lokasi Spesifik Pekerjaan *</label>
                <input
                  type="text"
                  required
                  value={newPermit.location || ''}
                  onChange={(e) => setNewPermit({ ...newPermit, location: e.target.value })}
                  placeholder="Contoh: Tangki Reservoir B Bawah Tanah atau Scaffolding Tower A"
                  className="w-full text-xs p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Mulai Berlaku</label>
                  <input
                    type="date"
                    required
                    value={newPermit.startDate || ''}
                    onChange={(e) => setNewPermit({ ...newPermit, startDate: e.target.value })}
                    className="w-full text-xs p-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Sampai Dengan</label>
                  <input
                    type="date"
                    required
                    value={newPermit.endDate || ''}
                    onChange={(e) => setNewPermit({ ...newPermit, endDate: e.target.value })}
                    className="w-full text-xs p-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nama Pemohon (Supervisor)</label>
                  <input
                    type="text"
                    value={newPermit.applicantName || ''}
                    onChange={(e) => setNewPermit({ ...newPermit, applicantName: e.target.value })}
                    className="w-full text-xs p-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Jumlah Personel Bekerja</label>
                  <input
                    type="number"
                    value={newPermit.workersCount ?? 1}
                    onChange={(e) =>
                      setNewPermit({ ...newPermit, workersCount: parseInt(e.target.value) || 1 })
                    }
                    className="w-full text-xs p-2 border border-slate-300 rounded-lg"
                  />
                </div>
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
                className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs"
              >
                Setujui & Terbitkan Izin Kerja
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
