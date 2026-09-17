import React, { useState } from 'react';
import {
  FolderGit2,
  Plus,
  Search,
  Filter,
  Copy,
  Trash2,
  Archive,
  ExternalLink,
  Edit2,
  Calendar,
  Building,
  MapPin,
  CheckCircle2,
  Shield,
  Layers,
  AlertTriangle,
  X,
} from 'lucide-react';
import { useAppStore } from '../../lib/store';
import { Project, ProjectStatus } from '../../types';

interface ProjectsListProps {
  onSelectProject: (projectId: string) => void;
  onOpenCreateProject: () => void;
}

export const ProjectsList: React.FC<ProjectsListProps> = ({
  onSelectProject,
  onOpenCreateProject,
}) => {
  const { projects, selectedProjectId, updateGlobalState, addAuditLog, addNotification } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'value'>('date');
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);

  // Duplicate Project feature (Section 43)
  const handleDuplicateProject = (sourceProject: Project, e: React.MouseEvent) => {
    e.stopPropagation();
    const newId = 'proj-' + Date.now();
    const newProject: Project = {
      ...sourceProject,
      id: newId,
      projectName: `${sourceProject.projectName} (Salinan)`,
      packageTitle: `${sourceProject.packageTitle} (Salinan Proyek)`,
      contractNumber: `${sourceProject.contractNumber}-REV`,
      status: 'PLANNING',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    updateGlobalState((prev) => {
      // Copy templates, hazards, regulations, budgets, org members, sops into new project
      const sourceRKK = prev.rkkDocuments[sourceProject.id];
      const newRKKId = 'rkk-' + Date.now();

      const newRKKDocuments = { ...prev.rkkDocuments };
      const newCommitments = { ...prev.commitments };
      const newHazards = { ...prev.hazards };
      const newRegulations = { ...prev.regulations };
      const newPrograms = { ...prev.supervisionPrograms };
      const newPersonnel = { ...prev.personnel };
      const newBudgets = { ...prev.safetyBudgets };
      const newOrgMembers = { ...prev.orgMembers };
      const newDocs = { ...prev.safetyDocuments };

      if (sourceRKK) {
        newRKKDocuments[newId] = {
          ...sourceRKK,
          id: newRKKId,
          projectId: newId,
          version: 'Rev.00',
          status: 'DRAFT', // Reset status, no final approval
          date: new Date().toISOString().split('T')[0],
          history: [],
          isLocked: false,
          qrVerificationCode: `VERIFY-RKK-${Date.now()}`,
        };

        if (prev.commitments[sourceRKK.id]) {
          newCommitments[newRKKId] = {
            ...prev.commitments[sourceRKK.id],
            id: 'com-' + Date.now(),
            rkkId: newRKKId,
            signatureUrl: undefined, // Reset signature
          };
        }

        if (prev.hazards[sourceRKK.id]) {
          newHazards[newRKKId] = prev.hazards[sourceRKK.id].map((h) => ({
            ...h,
            id: 'haz-' + Math.random().toString(36).substring(2, 9),
            rkkId: newRKKId,
          }));
        }

        if (prev.regulations[sourceRKK.id]) {
          newRegulations[newRKKId] = prev.regulations[sourceRKK.id].map((r) => ({
            ...r,
            id: 'reg-' + Math.random().toString(36).substring(2, 9),
            rkkId: newRKKId,
          }));
        }

        if (prev.supervisionPrograms[sourceRKK.id]) {
          newPrograms[newRKKId] = prev.supervisionPrograms[sourceRKK.id].map((sp) => ({
            ...sp,
            id: 'sp-' + Math.random().toString(36).substring(2, 9),
            rkkId: newRKKId,
          }));
        }

        if (prev.safetyBudgets[sourceRKK.id]) {
          newBudgets[newRKKId] = prev.safetyBudgets[sourceRKK.id].map((b) => ({
            ...b,
            id: 'bud-' + Math.random().toString(36).substring(2, 9),
            rkkId: newRKKId,
          }));
        }

        if (prev.orgMembers[sourceRKK.id]) {
          newOrgMembers[newRKKId] = prev.orgMembers[sourceRKK.id].map((m) => ({
            ...m,
            id: 'org-' + Math.random().toString(36).substring(2, 9),
            rkkId: newRKKId,
          }));
        }
      }

      if (prev.personnel[sourceProject.id]) {
        newPersonnel[newId] = [...prev.personnel[sourceProject.id]];
      }

      if (prev.safetyDocuments[sourceProject.id]) {
        newDocs[newId] = prev.safetyDocuments[sourceProject.id].map((d) => ({
          ...d,
          id: 'doc-' + Math.random().toString(36).substring(2, 9),
          projectId: newId,
        }));
      }

      return {
        ...prev,
        projects: [newProject, ...prev.projects],
        selectedProjectId: newId,
        rkkDocuments: newRKKDocuments,
        commitments: newCommitments,
        hazards: newHazards,
        regulations: newRegulations,
        supervisionPrograms: newPrograms,
        personnel: newPersonnel,
        safetyBudgets: newBudgets,
        orgMembers: newOrgMembers,
        safetyDocuments: newDocs,
      };
    });

    addAuditLog('CREATE', 'Proyek', newId, `Duplikasi struktur proyek dari ${sourceProject.projectName}`);
  };

  const handleToggleArchive = (project: Project, e: React.MouseEvent) => {
    e.stopPropagation();
    const newStatus: ProjectStatus = project.status === 'ARCHIVED' ? 'ACTIVE' : 'ARCHIVED';
    updateGlobalState((prev) => ({
      ...prev,
      projects: prev.projects.map((p) => (p.id === project.id ? { ...p, status: newStatus } : p)),
    }));
    addAuditLog('UPDATE', 'Proyek', project.id, `Mengubah status proyek menjadi ${newStatus}`);
  };

  const handleInitiateDelete = (project: Project, e: React.MouseEvent) => {
    e.stopPropagation();
    setProjectToDelete(project);
  };

  const handleConfirmDelete = () => {
    if (!projectToDelete) return;
    const project = projectToDelete;

    updateGlobalState((prev) => {
      let remainingProjects = prev.projects.filter((p) => p.id !== project.id);
      let newSelectedId =
        prev.selectedProjectId === project.id
          ? remainingProjects[0]?.id || ''
          : prev.selectedProjectId;

      // Clean up project RKK documents and associated maps
      const newRkkDocs = { ...prev.rkkDocuments };
      delete newRkkDocs[project.id];

      const newPersonnel = { ...prev.personnel };
      delete newPersonnel[project.id];

      const newDocs = { ...prev.safetyDocuments };
      delete newDocs[project.id];

      const newInspections = { ...prev.inspections };
      delete newInspections[project.id];

      const newFindings = { ...prev.findings };
      delete newFindings[project.id];

      const newJsa = { ...prev.jsaList };
      delete newJsa[project.id];

      const newPermits = { ...prev.workPermits };
      delete newPermits[project.id];

      const newWeekly = { ...prev.weeklyReports };
      delete newWeekly[project.id];

      const newMonthly = { ...prev.monthlyReports };
      delete newMonthly[project.id];

      const newTesting = { ...prev.testingList };
      delete newTesting[project.id];

      // If user deletes the last remaining project, create a fresh blank project template
      if (remainingProjects.length === 0) {
        const freshId = 'proj-' + Date.now();
        const freshProj: Project = {
          id: freshId,
          companyId: prev.company.id,
          projectName: 'Paket Pekerjaan Pengawasan Baru',
          packageTitle: 'Pengawasan Teknis Penyelenggaraan Konstruksi',
          location: 'Lokasi Proyek',
          province: 'Jawa Tengah',
          regency: 'Kabupaten Kendal',
          district: 'Kecamatan Kendal',
          fundingSource: 'APBN',
          budgetYear: '2026',
          contractNumber: '01/KTR/SMKK/2026',
          contractDate: new Date().toISOString().split('T')[0],
          contractValue: 10000000000,
          startDate: new Date().toISOString().split('T')[0],
          endDate: '2026-12-31',
          executionPeriodDays: 240,
          maintenancePeriodDays: 180,
          status: 'ACTIVE',
          clientInstitution: 'Dinas Pekerjaan Umum dan Penataan Ruang',
          clientOfficerName: 'Kepala Satuan Kerja',
          clientOfficerPosition: 'Kepala Satker',
          ppkName: 'Pejabat Pembuat Komitmen',
          ppkPosition: 'PPK',
          contractorName: 'PT. Kontraktor Pelaksana',
          contractorDirector: 'Direktur Utama',
          consultantName: prev.company.name,
          teamLeaderName: prev.currentUser.fullName,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          createdBy: prev.currentUser.id,
        };
        const freshRkkId = 'rkk-' + Date.now();
        newRkkDocs[freshId] = {
          id: freshRkkId,
          projectId: freshId,
          documentNumber: `RKK-MK/2026/${freshId.slice(-4).toUpperCase()}`,
          rkkNumber: 'RKK-01-REV00',
          version: 'Rev.00',
          date: new Date().toISOString().split('T')[0],
          status: 'DRAFT',
          preparedBy: `${prev.currentUser.fullName} (Ahli K3 Konstruksi)`,
          reviewedBy: `${prev.currentUser.fullName} (Team Leader)`,
          approvedBy: 'PPK Proyek',
          isLocked: false,
          qrVerificationCode: `VERIFY-RKK-${freshId}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        remainingProjects = [freshProj];
        newSelectedId = freshId;
      }

      return {
        ...prev,
        projects: remainingProjects,
        selectedProjectId: newSelectedId,
        rkkDocuments: newRkkDocs,
        personnel: newPersonnel,
        safetyDocuments: newDocs,
        inspections: newInspections,
        findings: newFindings,
        jsaList: newJsa,
        workPermits: newPermits,
        weeklyReports: newWeekly,
        monthlyReports: newMonthly,
        testingList: newTesting,
      };
    });

    addAuditLog('DELETE', 'Proyek', project.id, `Menghapus proyek: ${project.projectName}`);
    addNotification('Proyek Berhasil Dihapus', `Paket proyek "${project.projectName}" telah dihapus secara permanen.`, 'INFO');
    setProjectToDelete(null);
  };

  // Filter & Search Logic
  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.packageTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.contractNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center space-x-2">
            <FolderGit2 className="w-6 h-6 text-blue-600" />
            <span>Manajemen Paket Proyek Pengawasan</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Kelola data kontrak, PPK, kontraktor, dan dokumen RKK Konsultansi Pengawasan / MK
          </p>
        </div>

        <button
          onClick={onOpenCreateProject}
          className="flex items-center justify-center space-x-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Paket Proyek</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari nama proyek, paket pekerjaan, no kontrak, atau lokasi..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-slate-50/50"
          />
        </div>

        <div className="flex items-center space-x-2 w-full md:w-auto">
          <div className="flex items-center space-x-1.5 text-xs text-slate-500">
            <Filter className="w-3.5 h-3.5" />
            <span>Status:</span>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs font-medium border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white focus:outline-hidden"
          >
            <option value="ALL">Semua Status</option>
            <option value="ACTIVE">Aktif</option>
            <option value="PLANNING">Perencanaan</option>
            <option value="COMPLETED">Selesai</option>
            <option value="ARCHIVED">Arsip</option>
          </select>
        </div>
      </div>

      {/* Projects List Cards */}
      {filteredProjects.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-2xl border border-dashed border-slate-300">
          <FolderGit2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-700">Belum ada paket proyek yang sesuai</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Gunakan kata kunci pencarian lain atau klik Tambah Paket Proyek untuk mendaftarkan proyek baru.
          </p>
          <button
            onClick={onOpenCreateProject}
            className="mt-4 px-4 py-2 text-xs font-semibold text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100"
          >
            Tambah Proyek Pertama
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredProjects.map((proj) => {
            const isSelected = proj.id === selectedProjectId;
            return (
              <div
                key={proj.id}
                onClick={() => onSelectProject(proj.id)}
                className={`bg-white rounded-2xl p-5 border transition-all cursor-pointer relative hover:shadow-md ${
                  isSelected
                    ? 'border-blue-600 ring-2 ring-blue-600/10'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Status & Action badges */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${
                        proj.status === 'ACTIVE'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : proj.status === 'ARCHIVED'
                          ? 'bg-slate-100 text-slate-600 border-slate-200'
                          : 'bg-blue-50 text-blue-700 border-blue-200'
                      }`}
                    >
                      {proj.status === 'ACTIVE' ? 'Aktif' : proj.status === 'ARCHIVED' ? 'Arsip' : proj.status}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      TA {proj.budgetYear} • {proj.fundingSource}
                    </span>
                  </div>

                  <div className="flex items-center space-x-1" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={(e) => handleDuplicateProject(proj, e)}
                      title="Duplikasi Struktur Proyek"
                      className="p-1.5 rounded-md text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => handleInitiateDelete(proj, e)}
                      title="Hapus Proyek"
                      className="p-1.5 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Project Title */}
                <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 line-clamp-2">
                  {proj.projectName}
                </h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-1">{proj.packageTitle}</p>

                {/* Contract & Financial metadata */}
                <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">No. Kontrak</span>
                    <p className="font-semibold text-slate-800 truncate">{proj.contractNumber}</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Nilai Kontrak</span>
                    <p className="font-bold text-emerald-700">{formatRupiah(proj.contractValue)}</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Lokasi</span>
                    <p className="text-slate-600 truncate flex items-center">
                      <MapPin className="w-3 h-3 text-slate-400 mr-1 shrink-0" />
                      {proj.location}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Masa Pelaksanaan</span>
                    <p className="text-slate-600 flex items-center">
                      <Calendar className="w-3 h-3 text-slate-400 mr-1 shrink-0" />
                      {proj.executionPeriodDays} Hari Kalender
                    </p>
                  </div>
                </div>

                {/* Bottom Footer Parties */}
                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <div className="truncate">
                    PPK: <strong className="text-slate-700">{proj.ppkName}</strong>
                  </div>
                  <div className="flex items-center space-x-1 text-blue-600 font-semibold">
                    <span>Buka RKK & Detail</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Konfirmasi Hapus Proyek (In-App Dialog - Tidak terblokir iFrame) */}
      {projectToDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setProjectToDelete(null)}
        >
          <div
            className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4 animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3.5">
                <div className="p-3 bg-rose-100 text-rose-600 rounded-xl shrink-0">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">Hapus Paket Proyek?</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Tindakan ini tidak dapat dibatalkan</p>
                </div>
              </div>
              <button
                onClick={() => setProjectToDelete(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Proyek yang akan dihapus:</span>
              <p className="text-sm font-bold text-slate-900">{projectToDelete.projectName}</p>
              <p className="text-xs text-slate-500">{projectToDelete.packageTitle}</p>
              <p className="text-[11px] font-mono text-slate-400 mt-1">No: {projectToDelete.contractNumber}</p>
            </div>

            <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-[11px] text-rose-800 leading-relaxed">
              Seluruh dokumen RKK (Bab 1 s/d Bab 5), rekaman inspeksi, temuan NCR, JSA, dan laporan K3 yang terafiliasi dengan proyek ini akan dihapus secara permanen dari basis data.
            </div>

            <div className="flex items-center justify-end space-x-2.5 pt-2">
              <button
                type="button"
                onClick={() => setProjectToDelete(null)}
                className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="flex items-center space-x-1.5 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>Ya, Hapus Permanen</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
