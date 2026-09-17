import React, { useState } from 'react';
import {
  AlertTriangle,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  Filter,
  User,
  MapPin,
  Calendar,
  Camera,
  Check,
  ArrowRight,
  ShieldAlert,
  FileCheck,
} from 'lucide-react';
import { useAppStore } from '../../lib/store';
import { Finding, PriorityLevel, FindingStatus } from '../../types';

export const FindingsList: React.FC = () => {
  const { currentProject, currentUser, state, updateGlobalState, addAuditLog, addNotification } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeFindingToVerify, setActiveFindingToVerify] = useState<Finding | null>(null);

  const projectId = currentProject?.id || '';
  const findings = state.findings[projectId] || [];

  // New Finding Form
  const [newFinding, setNewFinding] = useState<Partial<Finding>>({
    findingNumber: `NCR-K3-${new Date().getFullYear()}-${String(findings.length + 1).padStart(3, '0')}`,
    date: new Date().toISOString().split('T')[0],
    source: 'INSPEKSI_RUTIN',
    location: currentProject?.location || '',
    description: '',
    priority: 'SEDANG',
    pic: currentProject?.contractorName || 'Safety Officer Kontraktor',
    deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    correctiveActionPlan: '',
    status: 'OPEN',
  });

  const handleCreateFinding = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFinding.description) return;

    const created: Finding = {
      id: 'find-' + Date.now(),
      projectId,
      findingNumber:
        newFinding.findingNumber ||
        `NCR-K3-${new Date().getFullYear()}-${String(findings.length + 1).padStart(3, '0')}`,
      date: newFinding.date || new Date().toISOString().split('T')[0],
      source: newFinding.source || 'INSPEKSI_RUTIN',
      location: newFinding.location || 'Area Proyek',
      description: newFinding.description || '',
      priority: (newFinding.priority as PriorityLevel) || 'SEDANG',
      pic: newFinding.pic || 'Kontraktor',
      deadline: newFinding.deadline || new Date().toISOString().split('T')[0],
      correctiveActionPlan: newFinding.correctiveActionPlan || '',
      status: 'OPEN',
      photos: [],
    };

    updateGlobalState((prev) => ({
      ...prev,
      findings: {
        ...prev.findings,
        [projectId]: [created, ...(prev.findings[projectId] || [])],
      },
    }));

    addAuditLog('CREATE', 'Temuan K3 (NCR)', created.findingNumber, `Mencatat temuan baru: ${created.description}`);
    addNotification('Temuan K3 Dicatat', `Nomor ${created.findingNumber} telah diterbitkan kepada Kontraktor.`, 'WARNING');
    setShowCreateModal(false);
    setNewFinding({
      findingNumber: `NCR-K3-${new Date().getFullYear()}-${String(findings.length + 2).padStart(3, '0')}`,
      date: new Date().toISOString().split('T')[0],
      source: 'INSPEKSI_RUTIN',
      location: currentProject?.location || '',
      description: '',
      priority: 'SEDANG',
      pic: currentProject?.contractorName || 'Safety Officer Kontraktor',
      deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      correctiveActionPlan: '',
      status: 'OPEN',
    });
  };

  const handleUpdateStatus = (findingId: string, newStatus: FindingStatus) => {
    const today = new Date().toISOString().split('T')[0];
    updateGlobalState((prev) => {
      const list = prev.findings[projectId] || [];
      const updated = list.map((item) => {
        if (item.id === findingId) {
          return {
            ...item,
            status: newStatus,
            completionDate: newStatus === 'CLOSED' || newStatus === 'SUBMITTED' ? today : item.completionDate,
            verifierName: newStatus === 'CLOSED' ? currentUser.fullName : item.verifierName,
          };
        }
        return item;
      });
      return {
        ...prev,
        findings: {
          ...prev.findings,
          [projectId]: updated,
        },
      };
    });

    addAuditLog('UPDATE', 'Temuan K3 (NCR)', findingId, `Status temuan diubah menjadi ${newStatus}`);
    addNotification('Status Temuan Diperbarui', `Temuan K3 telah diperbarui ke status ${newStatus}`, 'SUCCESS');
    setActiveFindingToVerify(null);
  };

  const filteredFindings = findings.filter((f) => {
    const matchSearch =
      f.findingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.pic.toLowerCase().includes(searchTerm.toLowerCase());

    const matchStatus = statusFilter === 'ALL' || f.status === statusFilter;
    const matchPriority = priorityFilter === 'ALL' || f.priority === priorityFilter;

    return matchSearch && matchStatus && matchPriority;
  });

  const countOpen = findings.filter((f) => f.status === 'OPEN').length;
  const countInProgress = findings.filter((f) => f.status === 'IN_PROGRESS' || f.status === 'SUBMITTED').length;
  const countClosed = findings.filter((f) => f.status === 'CLOSED').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800">
            Tindak Lanjut Ketidaksesuaian (CAPA)
          </span>
          <h1 className="text-xl font-black text-slate-900 mt-1 flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <span>Daftar Temuan K3 & Tindak Lanjut Perbaikan</span>
          </h1>
          <p className="text-xs text-slate-500">
            Pencatatan Non-Conformance Report (NCR) K3, penetapan batas waktu (deadline), dan verifikasi penutupan
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center space-x-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Terbitkan Temuan / NCR Baru</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <span className="text-xs font-bold text-slate-400 uppercase">Total Temuan</span>
          <p className="text-2xl font-black text-slate-900 mt-1">{findings.length}</p>
          <span className="text-[11px] text-slate-500 font-semibold">Sepanjang proyek</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-rose-100 bg-rose-50/20">
          <span className="text-xs font-bold text-rose-500 uppercase">Temuan Belum Ditindak</span>
          <p className="text-2xl font-black text-rose-600 mt-1">{countOpen}</p>
          <span className="text-[11px] text-rose-600 font-semibold">Perlu tindakan cepat</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-amber-100 bg-amber-50/20">
          <span className="text-xs font-bold text-amber-500 uppercase">Dalam Proses Perbaikan</span>
          <p className="text-2xl font-black text-amber-600 mt-1">{countInProgress}</p>
          <span className="text-[11px] text-amber-700 font-semibold">Menunggu verifikasi</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-emerald-100 bg-emerald-50/20">
          <span className="text-xs font-bold text-emerald-600 uppercase">Selesai Diverifikasi (Closed)</span>
          <p className="text-2xl font-black text-emerald-600 mt-1">{countClosed}</p>
          <span className="text-[11px] text-emerald-600 font-semibold">Tuntas 100%</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari no NCR, uraian bahaya, lokasi, atau PIC..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs border border-slate-200 rounded-lg bg-slate-50/50"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs px-3 py-1.5 border border-slate-200 rounded-lg bg-white text-slate-700 font-medium"
          >
            <option value="ALL">Semua Status</option>
            <option value="OPEN">Open (Belum Selesai)</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="SUBMITTED">Submitted (Perbaikan Diajukan)</option>
            <option value="CLOSED">Closed (Selesai)</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="text-xs px-3 py-1.5 border border-slate-200 rounded-lg bg-white text-slate-700 font-medium"
          >
            <option value="ALL">Semua Tingkat Bahaya</option>
            <option value="KRITIS">Kritis</option>
            <option value="TINGGI">Tinggi</option>
            <option value="SEDANG">Sedang</option>
            <option value="RENDAH">Rendah</option>
          </select>
        </div>
      </div>

      {/* Findings List */}
      <div className="space-y-3">
        {filteredFindings.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl border border-dashed border-slate-300">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
            <p className="text-xs font-bold text-slate-700">Tidak ada temuan yang sesuai kriteria.</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Seluruh parameter pengawasan berjalan tertib dan aman.</p>
          </div>
        ) : (
          filteredFindings.map((finding) => {
            const isClosed = finding.status === 'CLOSED';
            const isKritis = finding.priority === 'KRITIS' || finding.priority === 'TINGGI';

            return (
              <div
                key={finding.id}
                className={`bg-white p-5 rounded-2xl border transition-all space-y-3 ${
                  isClosed
                    ? 'border-slate-200 opacity-90'
                    : isKritis
                    ? 'border-rose-300 shadow-xs ring-1 ring-rose-200'
                    : 'border-slate-200 hover:border-blue-300 shadow-xs'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center space-x-2.5">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200">
                      {finding.findingNumber}
                    </span>
                    <span
                      className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                        finding.priority === 'KRITIS'
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : finding.priority === 'TINGGI'
                          ? 'bg-orange-100 text-orange-800 border border-orange-200'
                          : finding.priority === 'SEDANG'
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      Prioritas: {finding.priority}
                    </span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs text-slate-500 font-medium">
                      Sumber: {finding.source.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span
                      className={`text-[11px] font-bold px-3 py-0.5 rounded-full ${
                        finding.status === 'CLOSED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : finding.status === 'SUBMITTED'
                          ? 'bg-blue-100 text-blue-800'
                          : finding.status === 'IN_PROGRESS'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800 animate-pulse'
                      }`}
                    >
                      Status: {finding.status}
                    </span>
                  </div>
                </div>

                {/* Description & Action Plan */}
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-slate-900">{finding.description}</p>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-700 space-y-1">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">
                      Rencana Tindak Lanjut Perbaikan (CAPA):
                    </span>
                    <p>{finding.correctiveActionPlan || 'Belum ada rencana perbaikan yang dimasukkan.'}</p>
                  </div>
                </div>

                {/* Metadata Row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 text-[11px] text-slate-600 border-t border-slate-100">
                  <div className="flex items-center space-x-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>Lokasi: <strong className="text-slate-800">{finding.location}</strong></span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>PIC: <strong className="text-slate-800">{finding.pic}</strong></span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Batas Waktu: <strong className="text-slate-800">{finding.deadline}</strong></span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <div className="text-[10px] text-slate-400">
                    {finding.verifierName && `Diverifikasi oleh: ${finding.verifierName} pada ${finding.completionDate}`}
                  </div>

                  <div className="flex items-center space-x-2">
                    {finding.status === 'OPEN' && (
                      <button
                        onClick={() => handleUpdateStatus(finding.id, 'IN_PROGRESS')}
                        className="px-3 py-1 bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs font-semibold rounded-lg border border-amber-200"
                      >
                        Tandai Mulai Dikerjakan
                      </button>
                    )}

                    {(finding.status === 'OPEN' || finding.status === 'IN_PROGRESS') && (
                      <button
                        onClick={() => handleUpdateStatus(finding.id, 'SUBMITTED')}
                        className="px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold rounded-lg border border-blue-200"
                      >
                        Ajukan Bukti Perbaikan
                      </button>
                    )}

                    {finding.status === 'SUBMITTED' && (
                      <button
                        onClick={() => handleUpdateStatus(finding.id, 'CLOSED')}
                        className="px-3.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-xs flex items-center space-x-1"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Verifikasi & Tutup Temuan (Close)</span>
                      </button>
                    )}

                    {finding.status === 'CLOSED' && (
                      <button
                        onClick={() => handleUpdateStatus(finding.id, 'OPEN')}
                        className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-medium rounded-lg"
                      >
                        Buka Kembali (Re-open)
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal Terbitkan Temuan Baru */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
          <form
            onSubmit={handleCreateFinding}
            className="bg-white rounded-2xl p-6 shadow-2xl border border-slate-200 max-w-xl w-full space-y-4 my-8"
          >
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-sm font-bold text-slate-900">Terbitkan Lembar Temuan K3 (NCR) Baru</h3>
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
                  <label className="block font-bold text-slate-700 mb-1">Nomor Dokumen NCR</label>
                  <input
                    type="text"
                    required
                    value={newFinding.findingNumber || ''}
                    onChange={(e) => setNewFinding({ ...newFinding, findingNumber: e.target.value })}
                    className="w-full text-xs p-2 border border-slate-300 rounded-lg font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tingkat Prioritas Risiko</label>
                  <select
                    value={newFinding.priority || 'SEDANG'}
                    onChange={(e) =>
                      setNewFinding({ ...newFinding, priority: e.target.value as PriorityLevel })
                    }
                    className="w-full text-xs p-2 border border-slate-300 rounded-lg bg-white font-semibold"
                  >
                    <option value="RENDAH">Rendah (Penyimpangan minor)</option>
                    <option value="SEDANG">Sedang (Beresiko mengganggu)</option>
                    <option value="TINGGI">Tinggi (Beresiko cedera serius)</option>
                    <option value="KRITIS">Kritis (Hentikan Pekerjaan Seketika!)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Lokasi Ketidaksesuaian *</label>
                <input
                  type="text"
                  required
                  value={newFinding.location || ''}
                  onChange={(e) => setNewFinding({ ...newFinding, location: e.target.value })}
                  placeholder="Contoh: Kolom Lantai 3 Zona Barat atau Perancah Luar"
                  className="w-full text-xs p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Uraian Temuan Ketidaksesuaian K3 *</label>
                <textarea
                  rows={3}
                  required
                  value={newFinding.description || ''}
                  onChange={(e) => setNewFinding({ ...newFinding, description: e.target.value })}
                  placeholder="Deskripsikan kondisi tidak aman (Unsafe Condition) atau perilaku tidak aman (Unsafe Act) yang ditemukan..."
                  className="w-full text-xs p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Rencana Tindak Lanjut Perbaikan yang Diminta
                </label>
                <textarea
                  rows={2}
                  value={newFinding.correctiveActionPlan || ''}
                  onChange={(e) => setNewFinding({ ...newFinding, correctiveActionPlan: e.target.value })}
                  placeholder="Contoh: Pasang safety net dan pasang toe board perancah sebelum pekerjaan berlanjut."
                  className="w-full text-xs p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Penanggung Jawab Perbaikan (PIC)</label>
                  <input
                    type="text"
                    value={newFinding.pic || ''}
                    onChange={(e) => setNewFinding({ ...newFinding, pic: e.target.value })}
                    className="w-full text-xs p-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Batas Waktu Penyelesaian (Deadline)</label>
                  <input
                    type="date"
                    required
                    value={newFinding.deadline || ''}
                    onChange={(e) => setNewFinding({ ...newFinding, deadline: e.target.value })}
                    className="w-full text-xs p-2 border border-slate-300 rounded-lg"
                  />
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
                Terbitkan NCR
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
