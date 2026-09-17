import React, { useState } from 'react';
import {
  Building,
  Save,
  Shield,
  FileCheck2,
  Mail,
  Phone,
  MapPin,
  Globe,
  Award,
} from 'lucide-react';
import { useAppStore } from '../../lib/store';
import { Company } from '../../types';

export const CompanyProfileView: React.FC = () => {
  const { company, updateGlobalState, addAuditLog, addNotification } = useAppStore();
  const [formData, setFormData] = useState<Company>(company);
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateGlobalState((prev) => ({
      ...prev,
      company: formData,
    }));

    addAuditLog('UPDATE', 'Company Profile', formData.name, 'Memperbarui profil perusahaan konsultan dan sertifikasi');
    addNotification('Profil Perusahaan Diperbarui', 'Data perusahaan & legalitas berhasil disimpan.', 'SUCCESS');
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
            Identitas Penyedia Jasa Konsultansi
          </span>
          <h1 className="text-xl font-black text-slate-900 mt-1 flex items-center space-x-2">
            <Building className="w-5 h-5 text-blue-600" />
            <span>Profil Perusahaan Konsultan Pengawas</span>
          </h1>
          <p className="text-xs text-slate-500">
            Informasi legalitas perusahaan, Nomor Induk Berusaha (NIB), SBU Konstruksi, dan sertifikasi ISO SMKK
          </p>
        </div>

        <button
          onClick={handleSubmit}
          className="flex items-center space-x-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors shrink-0"
        >
          <Save className="w-4 h-4" />
          <span>{isSaved ? 'Tersimpan ✓' : 'Simpan Profil'}</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
        {/* Core Company Info */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900 border-b pb-2">Informasi Umum Perusahaan</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Nama Perusahaan Konsultan *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-2.5 border border-slate-300 rounded-lg font-bold"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Nama Direktur Utama / Penanggung Jawab *</label>
              <input
                type="text"
                required
                value={formData.directorName}
                onChange={(e) => setFormData({ ...formData, directorName: e.target.value })}
                className="w-full p-2.5 border border-slate-300 rounded-lg font-semibold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Nomor Telepon</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full p-2.5 border border-slate-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Email Resmi</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full p-2.5 border border-slate-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Website</label>
              <input
                type="text"
                value={formData.website || ''}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                className="w-full p-2.5 border border-slate-300 rounded-lg"
              />
            </div>
          </div>

          <div className="text-xs">
            <label className="block font-bold text-slate-700 mb-1">Alamat Kantor Pusat</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full p-2.5 border border-slate-300 rounded-lg"
            />
          </div>
        </div>

        {/* Legalitas & Sertifikasi */}
        <div className="space-y-4 pt-4 border-t border-slate-200">
          <h3 className="text-sm font-bold text-slate-900 border-b pb-2">Legalitas & Sertifikasi Badan Usaha</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Nomor Induk Berusaha (NIB)</label>
              <input
                type="text"
                value={formData.nib}
                onChange={(e) => setFormData({ ...formData, nib: e.target.value })}
                className="w-full p-2.5 border border-slate-300 rounded-lg font-mono font-bold"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Nomor Sertifikat Badan Usaha (SBU)</label>
              <input
                type="text"
                value={formData.sbuNumber}
                onChange={(e) => setFormData({ ...formData, sbuNumber: e.target.value })}
                className="w-full p-2.5 border border-slate-300 rounded-lg font-mono font-bold"
              />
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <span className="text-xs font-bold text-slate-700 flex items-center">
              <Award className="w-4 h-4 text-amber-600 mr-1.5" />
              Sertifikasi Sistem Manajemen Terakreditasi
            </span>
            <div className="flex flex-wrap gap-2">
              {formData.isoCertifications?.map((cert, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-800 shadow-xs"
                >
                  ✓ {cert}
                </span>
              ))}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
