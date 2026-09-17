import React, { useState } from 'react';
import { X, Building2, Save } from 'lucide-react';
import { Project } from '../../types';
import { useAppStore } from '../../lib/store';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectToEdit?: Project;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({
  isOpen,
  onClose,
  projectToEdit,
}) => {
  const { company, currentUser, updateGlobalState, addAuditLog } = useAppStore();

  const [formData, setFormData] = useState<Partial<Project>>({
    packageTitle: projectToEdit?.packageTitle || '',
    projectName: projectToEdit?.projectName || '',
    location: projectToEdit?.location || '',
    province: projectToEdit?.province || 'Jawa Tengah',
    regency: projectToEdit?.regency || 'Kabupaten Kendal',
    district: projectToEdit?.district || '',
    village: projectToEdit?.village || '',
    fundingSource: projectToEdit?.fundingSource || 'APBN',
    budgetYear: projectToEdit?.budgetYear || '2026',
    contractNumber: projectToEdit?.contractNumber || '',
    contractDate: projectToEdit?.contractDate || new Date().toISOString().split('T')[0],
    contractValue: projectToEdit?.contractValue || 15000000000,
    startDate: projectToEdit?.startDate || new Date().toISOString().split('T')[0],
    endDate: projectToEdit?.endDate || '2026-12-31',
    executionPeriodDays: projectToEdit?.executionPeriodDays || 240,
    maintenancePeriodDays: projectToEdit?.maintenancePeriodDays || 180,
    status: projectToEdit?.status || 'ACTIVE',

    // Pengguna Jasa
    clientInstitution: projectToEdit?.clientInstitution || 'Dinas Pekerjaan Umum dan Penataan Ruang',
    clientOfficerName: projectToEdit?.clientOfficerName || '',
    clientOfficerPosition: projectToEdit?.clientOfficerPosition || 'Kepala Satuan Kerja',
    clientOfficerNip: projectToEdit?.clientOfficerNip || '',
    clientOfficerPhone: projectToEdit?.clientOfficerPhone || '',

    // PPK
    ppkName: projectToEdit?.ppkName || '',
    ppkNip: projectToEdit?.ppkNip || '',
    ppkPosition: projectToEdit?.ppkPosition || 'Pejabat Pembuat Komitmen (PPK)',
    ppkPhone: projectToEdit?.ppkPhone || '',

    // Kontraktor Pelaksana
    contractorName: projectToEdit?.contractorName || '',
    contractorDirector: projectToEdit?.contractorDirector || '',
    contractorPhone: projectToEdit?.contractorPhone || '',
    contractorAddress: projectToEdit?.contractorAddress || '',

    // Konsultan Pengawas / MK
    consultantName: projectToEdit?.consultantName || company.name,
    teamLeaderName: projectToEdit?.teamLeaderName || currentUser.fullName,
    consultantPhone: projectToEdit?.consultantPhone || company.phone,
  });

  const [activeTab, setActiveTab] = useState<'IDENTITAS' | 'PENGGUNA' | 'KONTRAKTOR' | 'KONSULTAN'>('IDENTITAS');

  if (!isOpen) return null;

  const handleChange = (field: keyof Project, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.packageTitle || !formData.projectName || !formData.contractNumber) {
      alert('Mohon lengkapi Nama Paket, Nama Pekerjaan, dan Nomor Kontrak.');
      return;
    }

    if (projectToEdit) {
      // Edit mode
      updateGlobalState((prev) => ({
        ...prev,
        projects: prev.projects.map((p) =>
          p.id === projectToEdit.id ? ({ ...p, ...formData, updatedAt: new Date().toISOString() } as Project) : p
        ),
      }));
      addAuditLog('UPDATE', 'Proyek', projectToEdit.id, `Memperbarui data proyek ${formData.projectName}`);
    } else {
      // Create mode
      const newProjectId = 'proj-' + Date.now();
      const newProject: Project = {
        ...(formData as Project),
        id: newProjectId,
        companyId: company.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: currentUser.id,
      };

      // Also create starter RKK Document for this new project
      const newRkkId = 'rkk-' + Date.now();
      const newRKK = {
        id: newRkkId,
        projectId: newProjectId,
        documentNumber: `RKK-MK/${formData.budgetYear}/${newProjectId.slice(-4).toUpperCase()}`,
        rkkNumber: 'RKK-01-REV00',
        version: 'Rev.00',
        date: new Date().toISOString().split('T')[0],
        status: 'DRAFT' as const,
        preparedBy: `${currentUser.fullName} (Safety Engineer)`,
        reviewedBy: `${formData.teamLeaderName || currentUser.fullName} (Team Leader)`,
        approvedBy: `${formData.ppkName || 'PPK'} (Pengguna Jasa)`,
        isLocked: false,
        qrVerificationCode: `VERIFY-RKK-${newProjectId}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const starterCommitment = {
        id: 'com-' + Date.now(),
        rkkId: newRkkId,
        companyName: company.name,
        packageName: formData.packageTitle || '',
        city: formData.regency || 'Jakarta',
        date: new Date().toISOString().split('T')[0],
        headSupervisorName: formData.teamLeaderName || currentUser.fullName,
        headSupervisorPosition: 'Kepala Pengawas Pekerjaan (Team Leader)',
        commitmentPoints: [
          'Pemenuhan ketentuan Keselamatan Konstruksi telah sesuai dengan Dokumen RKK;',
          'Pengawasan mengacu kepada Kerangka Acuan Kerja (KAK);',
          'Pengawasan pelaksanaan berdasarkan kesesuaian standar dan desain;',
          'Pengawasan pelaksanaan pekerjaan sesuai dengan Standar Operasional Prosedur (SOP); dan',
          'Menggunakan tenaga kerja yang berkompeten dan bersertifikat.',
        ],
      };

      updateGlobalState((prev) => ({
        ...prev,
        projects: [newProject, ...prev.projects],
        selectedProjectId: newProjectId,
        rkkDocuments: { ...prev.rkkDocuments, [newProjectId]: newRKK },
        commitments: { ...prev.commitments, [newRkkId]: starterCommitment },
      }));
      addAuditLog('CREATE', 'Proyek', newProjectId, `Mendaftarkan proyek baru: ${formData.projectName}`);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                {projectToEdit ? 'Ubah Data Paket Proyek' : 'Tambah Paket Proyek Pengawasan Baru'}
              </h2>
              <p className="text-xs text-slate-500">
                Lengkapi identitas paket, kontrak, dan pihak-pihak terkait sesuai KAK
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Subnav inside modal */}
        <div className="flex border-b border-slate-200 bg-white px-6">
          <button
            type="button"
            onClick={() => setActiveTab('IDENTITAS')}
            className={`py-2.5 px-3 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'IDENTITAS'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            1. Identitas & Kontrak
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('PENGGUNA')}
            className={`py-2.5 px-3 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'PENGGUNA'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            2. Pengguna Jasa & PPK
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('KONTRAKTOR')}
            className={`py-2.5 px-3 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'KONTRAKTOR'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            3. Kontraktor Pelaksana
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('KONSULTAN')}
            className={`py-2.5 px-3 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'KONSULTAN'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            4. Konsultan MK / Pengawas
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit}>
          <div className="p-6 max-h-[65vh] overflow-y-auto space-y-4">
            {activeTab === 'IDENTITAS' && (
              <div className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nama Paket Pekerjaan (Sesuai Kontrak) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.packageTitle}
                    onChange={(e) => handleChange('packageTitle', e.target.value)}
                    placeholder="Contoh: Pengawasan Pembangunan Gedung Ruang Rawat Inap RSUD Dr. Soewondo"
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Nama Singkat Pekerjaan *</label>
                    <input
                      type="text"
                      required
                      value={formData.projectName}
                      onChange={(e) => handleChange('projectName', e.target.value)}
                      placeholder="Contoh: Gedung Rawat Inap Terpadu 6 Lantai"
                      className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Lokasi Pekerjaan *</label>
                    <input
                      type="text"
                      required
                      value={formData.location}
                      onChange={(e) => handleChange('location', e.target.value)}
                      placeholder="Contoh: Jl. Diponegoro No. 12, Kendal"
                      className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Provinsi</label>
                    <input
                      type="text"
                      value={formData.province}
                      onChange={(e) => handleChange('province', e.target.value)}
                      className="w-full text-xs p-2.5 border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Kabupaten / Kota</label>
                    <input
                      type="text"
                      value={formData.regency}
                      onChange={(e) => handleChange('regency', e.target.value)}
                      className="w-full text-xs p-2.5 border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Kecamatan / Desa</label>
                    <input
                      type="text"
                      value={formData.district}
                      onChange={(e) => handleChange('district', e.target.value)}
                      className="w-full text-xs p-2.5 border border-slate-300 rounded-lg"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Sumber Dana</label>
                    <input
                      type="text"
                      value={formData.fundingSource}
                      onChange={(e) => handleChange('fundingSource', e.target.value)}
                      placeholder="APBN, APBD, DAK, Swasta"
                      className="w-full text-xs p-2.5 border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Tahun Anggaran</label>
                    <input
                      type="text"
                      value={formData.budgetYear}
                      onChange={(e) => handleChange('budgetYear', e.target.value)}
                      className="w-full text-xs p-2.5 border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Nilai Kontrak (Rp)</label>
                    <input
                      type="number"
                      value={formData.contractValue}
                      onChange={(e) => handleChange('contractValue', Number(e.target.value))}
                      className="w-full text-xs p-2.5 border border-slate-300 rounded-lg font-mono font-semibold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Nomor Kontrak *</label>
                    <input
                      type="text"
                      required
                      value={formData.contractNumber}
                      onChange={(e) => handleChange('contractNumber', e.target.value)}
                      placeholder="HK.02.03/KONT-MK/..."
                      className="w-full text-xs p-2.5 border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Tanggal Kontrak</label>
                    <input
                      type="date"
                      value={formData.contractDate}
                      onChange={(e) => handleChange('contractDate', e.target.value)}
                      className="w-full text-xs p-2.5 border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Masa Pelaksanaan (Hari)</label>
                    <input
                      type="number"
                      value={formData.executionPeriodDays}
                      onChange={(e) => handleChange('executionPeriodDays', Number(e.target.value))}
                      className="w-full text-xs p-2.5 border border-slate-300 rounded-lg font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'PENGGUNA' && (
              <div className="space-y-3.5">
                <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100 space-y-3">
                  <h4 className="text-xs font-bold text-blue-900 uppercase">Institusi Pengguna Jasa</h4>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Nama Instansi / Balai / Dinas</label>
                    <input
                      type="text"
                      value={formData.clientInstitution}
                      onChange={(e) => handleChange('clientInstitution', e.target.value)}
                      placeholder="Dinas PUPR / Balai BPJN / RSUD"
                      className="w-full text-xs p-2.5 border border-slate-300 rounded-lg bg-white"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Nama Pejabat Pengguna</label>
                      <input
                        type="text"
                        value={formData.clientOfficerName}
                        onChange={(e) => handleChange('clientOfficerName', e.target.value)}
                        className="w-full text-xs p-2.5 border border-slate-300 rounded-lg bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">NIP Pejabat</label>
                      <input
                        type="text"
                        value={formData.clientOfficerNip}
                        onChange={(e) => handleChange('clientOfficerNip', e.target.value)}
                        className="w-full text-xs p-2.5 border border-slate-300 rounded-lg bg-white font-mono"
                      />
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  <h4 className="text-xs font-bold text-slate-900 uppercase">Pejabat Pembuat Komitmen (PPK)</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Nama PPK</label>
                      <input
                        type="text"
                        value={formData.ppkName}
                        onChange={(e) => handleChange('ppkName', e.target.value)}
                        placeholder="Nama lengkap & gelar"
                        className="w-full text-xs p-2.5 border border-slate-300 rounded-lg bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">NIP PPK</label>
                      <input
                        type="text"
                        value={formData.ppkNip}
                        onChange={(e) => handleChange('ppkNip', e.target.value)}
                        className="w-full text-xs p-2.5 border border-slate-300 rounded-lg bg-white font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'KONTRAKTOR' && (
              <div className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nama Perusahaan Kontraktor Pelaksana</label>
                  <input
                    type="text"
                    value={formData.contractorName}
                    onChange={(e) => handleChange('contractorName', e.target.value)}
                    placeholder="PT / KSO ..."
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Nama Direktur Kontraktor</label>
                    <input
                      type="text"
                      value={formData.contractorDirector}
                      onChange={(e) => handleChange('contractorDirector', e.target.value)}
                      className="w-full text-xs p-2.5 border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Kontak Telepon Kontraktor</label>
                    <input
                      type="text"
                      value={formData.contractorPhone}
                      onChange={(e) => handleChange('contractorPhone', e.target.value)}
                      className="w-full text-xs p-2.5 border border-slate-300 rounded-lg"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Alamat Kantor Kontraktor</label>
                  <textarea
                    rows={2}
                    value={formData.contractorAddress}
                    onChange={(e) => handleChange('contractorAddress', e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>
            )}

            {activeTab === 'KONSULTAN' && (
              <div className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nama Perusahaan Konsultan Supervisi / MK</label>
                  <input
                    type="text"
                    value={formData.consultantName}
                    onChange={(e) => handleChange('consultantName', e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Nama Kepala Pengawas / Team Leader *</label>
                    <input
                      type="text"
                      value={formData.teamLeaderName}
                      onChange={(e) => handleChange('teamLeaderName', e.target.value)}
                      className="w-full text-xs p-2.5 border border-slate-300 rounded-lg font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Kontak Telepon Kantor Pengawas</label>
                    <input
                      type="text"
                      value={formData.consultantPhone}
                      onChange={(e) => handleChange('consultantPhone', e.target.value)}
                      className="w-full text-xs p-2.5 border border-slate-300 rounded-lg"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-between px-6 py-3.5 bg-slate-50 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex items-center space-x-1.5 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Data Paket Proyek</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
