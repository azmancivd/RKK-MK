import React, { useState, useRef } from 'react';
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
  Upload,
  Image as ImageIcon,
  Trash2,
  Sparkles,
  Eye,
  CheckCircle2,
} from 'lucide-react';
import { useAppStore } from '../../lib/store';
import { Company } from '../../types';

export const CompanyProfileView: React.FC = () => {
  const { company, updateGlobalState, addAuditLog, addNotification } = useAppStore();
  const [formData, setFormData] = useState<Company>(company);
  const [isSaved, setIsSaved] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Default preset sample logo (Safety Green Helm & Gear Icon as Data SVG)
  const sampleK3Logo =
    'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f8?w=200&auto=format&fit=crop&q=60';

  const handleFileUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Mohon pilih file gambar (PNG, JPG, SVG, WebP).');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      alert('Ukuran file maksimal 2 MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        setFormData((prev) => ({ ...prev, logoUrl: result }));
      }
    };
    reader.readAsDataURL(file);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateGlobalState((prev) => ({
      ...prev,
      company: formData,
    }));

    addAuditLog('UPDATE', 'Company Profile', formData.name, 'Memperbarui profil perusahaan, kop surat, dan logo konsultan');
    addNotification('Profil & Kop Surat Disimpan', 'Identitas perusahaan, kop dokumen resmi, dan logo berhasil disimpan.', 'SUCCESS');
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
            Identitas & Kop Surat Resmi
          </span>
          <h1 className="text-xl font-black text-slate-900 mt-1 flex items-center space-x-2">
            <Building className="w-5 h-5 text-blue-600" />
            <span>Kop Dokumen & Logo Perusahaan Konsultan</span>
          </h1>
          <p className="text-xs text-slate-500">
            Atur logo perusahaan, format kepala surat (kop dokumen), informasi kontak, serta legalitas NIB & SBU untuk Dokumen RKK dan Laporan K3
          </p>
        </div>

        <button
          onClick={handleSubmit}
          className="flex items-center space-x-1.5 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors shrink-0 cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>{isSaved ? 'Tersimpan ✓' : 'Simpan Perubahan'}</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* BAGIAN 1: PENGATURAN LOGO PERUSAHAAN */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                <ImageIcon className="w-4 h-4 text-blue-600" />
                <span>1. Logo Perusahaan Konsultan Pengawas</span>
              </h3>
              <p className="text-xs text-slate-500">
                Logo ini akan otomatis dicetak pada Cover Dokumen RKK, Lembar Komitmen, Kop Surat, dan Laporan K3
              </p>
            </div>
            {formData.logoUrl && (
              <button
                type="button"
                onClick={() => setFormData({ ...formData, logoUrl: '' })}
                className="flex items-center space-x-1 text-xs font-semibold text-rose-600 hover:text-rose-700"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Hapus Logo</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Logo Preview Box */}
            <div className="lg:col-span-4 flex flex-col items-center justify-center p-4 bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl min-h-[160px]">
              {formData.logoUrl ? (
                <div className="relative group flex flex-col items-center">
                  <img
                    src={formData.logoUrl}
                    alt="Logo Perusahaan"
                    className="max-h-28 max-w-full object-contain p-2 rounded-lg bg-white border border-slate-200 shadow-xs"
                  />
                  <span className="text-[10px] font-bold text-emerald-600 mt-2 flex items-center">
                    <CheckCircle2 className="w-3 h-3 mr-1" /> Logo Aktif
                  </span>
                </div>
              ) : (
                <div className="text-center p-3 text-slate-400">
                  <ImageIcon className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                  <p className="text-xs font-semibold">Belum Ada Logo</p>
                  <p className="text-[10px]">Unggah gambar atau gunakan URL</p>
                </div>
              )}
            </div>

            {/* Upload Controls */}
            <div className="lg:col-span-8 space-y-3">
              {/* Drag & Drop Upload Zone */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={onDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`p-4 border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${
                  isDragging
                    ? 'border-blue-500 bg-blue-50/50'
                    : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50'
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/png, image/jpeg, image/svg+xml, image/webp"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileUpload(e.target.files[0]);
                    }
                  }}
                />
                <Upload className="w-6 h-6 text-blue-600 mb-1.5" />
                <p className="text-xs font-bold text-slate-800">
                  Klik untuk Memilih File Logo atau Seret & Letakkan di Sini
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Format: PNG transparan, JPG, SVG, WebP (Maks. 2 MB)
                </p>
              </div>

              {/* URL Input */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Atau Tempel Tautan Gambar / Direct URL Logo:
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="https://contoh-domain.com/logo-perusahaan.png"
                    value={formData.logoUrl || ''}
                    onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                    className="flex-1 p-2 text-xs border border-slate-300 rounded-lg font-mono focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, logoUrl: sampleK3Logo })}
                    className="px-3 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center space-x-1 shrink-0 transition-colors"
                    title="Gunakan contoh logo standar"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>Pakai Contoh</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BAGIAN 2: PRATINJAU KOP SURAT RESMI (LIVE A4 PREVIEW) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                <Eye className="w-4 h-4 text-blue-600" />
                <span>2. Pratinjau Kop Surat Resmi (A4 Letterhead Preview)</span>
              </h3>
              <p className="text-xs text-slate-500">
                Tampilan kepala surat resmi sesuai standar pelaporan Permen PUPR No. 10/2021
              </p>
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-100 px-2.5 py-1 rounded-md">
              Standar Formal A4
            </span>
          </div>

          {/* Actual Letterhead Box */}
          <div className="p-6 sm:p-8 bg-slate-50/70 border border-slate-200 rounded-xl overflow-x-auto">
            <div className="bg-white p-6 sm:p-8 border border-slate-200 shadow-xs max-w-3xl mx-auto rounded-lg">
              <div className="flex items-center gap-4 sm:gap-6 pb-4">
                {/* Logo in letterhead */}
                <div className="w-24 sm:w-28 shrink-0 flex items-center justify-center">
                  {formData.logoUrl ? (
                    <img
                      src={formData.logoUrl}
                      alt="Logo"
                      className="max-h-20 max-w-full object-contain"
                    />
                  ) : (
                    <div className="w-20 h-16 border-2 border-dashed border-slate-300 rounded flex items-center justify-center text-[10px] text-slate-400 font-sans text-center p-1">
                      [Logo Perusahaan]
                    </div>
                  )}
                </div>

                {/* Header text content */}
                <div className="flex-1 text-center space-y-1">
                  <h2 className="text-sm sm:text-base font-black tracking-wider uppercase text-slate-900 font-sans">
                    {formData.name || 'PT. NAMA PERUSAHAAN KONSULTAN'}
                  </h2>
                  <p className="text-[11px] sm:text-xs font-bold uppercase text-slate-700 font-sans tracking-wide">
                    PENYEDIA JASA KONSULTANSI KONSTRUKSI PENGAWASAN / MK
                  </p>
                  <p className="text-[10px] sm:text-[11px] text-slate-600 font-sans leading-tight">
                    {formData.address || 'Alamat Kantor Pusat, Gedung, Jalan, Kota'}
                  </p>
                  <p className="text-[10px] text-slate-500 font-sans">
                    Telp: {formData.phone || '(021) 0000000'} | Email: {formData.email || 'info@konsultan.co.id'}{' '}
                    {formData.website ? `| Web: ${formData.website}` : ''}
                  </p>
                  <p className="text-[9px] font-mono text-slate-400">
                    NIB: {formData.nib || '-'} | No. SBU: {formData.sbuNumber || '-'}
                  </p>
                </div>
              </div>

              {/* Double Line Letterhead Border (Standar Kop Surat Resmi Indonesia: Garis Tebal + Garis Tipis) */}
              <div className="border-t-[3px] border-slate-900 pt-[2px]">
                <div className="border-t-[1px] border-slate-900" />
              </div>

              {/* Simulated document title below kop */}
              <div className="mt-4 text-center py-2">
                <span className="text-[10px] text-slate-400 italic">
                  — Area Isi Dokumen RKK, Lembar Pengesahan, Pakta Komitmen, & Laporan K3 —
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* BAGIAN 3: FORM DETAIL KOP & INFORMASI PERUSAHAAN */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 border-b pb-2">
            3. Rincian Teks Kop Surat & Kontak Perusahaan
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Nama Badan Usaha / Perusahaan Konsultan *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-2.5 border border-slate-300 rounded-lg font-bold"
                placeholder="Contoh: PT. CIPTA SARANA KONSULTAN"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Nama Direktur Utama / Penanggung Jawab Teknis *
              </label>
              <input
                type="text"
                required
                value={formData.directorName}
                onChange={(e) => setFormData({ ...formData, directorName: e.target.value })}
                className="w-full p-2.5 border border-slate-300 rounded-lg font-semibold"
                placeholder="Nama Lengkap & Gelar Direktur"
              />
            </div>
          </div>

          <div className="text-xs">
            <label className="block font-bold text-slate-700 mb-1">
              Alamat Lengkap Kantor Pusat (Ditampilkan di Kop Surat) *
            </label>
            <input
              type="text"
              required
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full p-2.5 border border-slate-300 rounded-lg"
              placeholder="Contoh: Jl. Jenderal Sudirman No. 45, Kompleks Perkantoran Puri Indah, Jakarta Pusat 10220"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Nomor Telepon / Hotline</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full p-2.5 border border-slate-300 rounded-lg"
                placeholder="(021) 555-1234 / 0812-..."
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Alamat Email Resmi</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full p-2.5 border border-slate-300 rounded-lg"
                placeholder="office@konsultan.co.id"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Website Resmi</label>
              <input
                type="text"
                value={formData.website || ''}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                className="w-full p-2.5 border border-slate-300 rounded-lg"
                placeholder="www.konsultan.co.id"
              />
            </div>
          </div>
        </div>

        {/* BAGIAN 4: LEGALITAS & SERTIFIKASI */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 border-b pb-2">
            4. Legalitas Usaha & Sertifikasi SMKK
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Nomor Induk Berusaha (NIB)</label>
              <input
                type="text"
                value={formData.nib}
                onChange={(e) => setFormData({ ...formData, nib: e.target.value })}
                className="w-full p-2.5 border border-slate-300 rounded-lg font-mono font-bold"
                placeholder="Contoh: 9120003456789"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Nomor Sertifikat Badan Usaha (SBU) Jasa Pengawasan
              </label>
              <input
                type="text"
                value={formData.sbuNumber}
                onChange={(e) => setFormData({ ...formData, sbuNumber: e.target.value })}
                className="w-full p-2.5 border border-slate-300 rounded-lg font-mono font-bold"
                placeholder="Contoh: SBU-01928/LPJK/2024"
              />
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <span className="text-xs font-bold text-slate-700 flex items-center">
              <Award className="w-4 h-4 text-amber-600 mr-1.5" />
              Sertifikasi Sistem Manajemen Terakreditasi (ISO / SMKK)
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

        {/* Floating Bottom Action Bar */}
        <div className="flex items-center justify-end space-x-3 pt-2">
          <button
            type="submit"
            className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md transition-colors cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{isSaved ? 'Perubahan Tersimpan ✓' : 'Simpan Kop & Logo'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
