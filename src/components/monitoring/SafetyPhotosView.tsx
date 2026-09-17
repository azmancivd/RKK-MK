import React, { useState } from 'react';
import {
  Camera,
  Plus,
  Search,
  Filter,
  Calendar,
  MapPin,
  User,
  CheckCircle2,
  AlertTriangle,
  Upload,
} from 'lucide-react';
import { useAppStore } from '../../lib/store';
import { InspectionPhoto } from '../../types';

export const SafetyPhotosView: React.FC = () => {
  const { currentProject, currentUser, updateGlobalState, addAuditLog, addNotification } = useAppStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Demo photos curated for Indonesian civil engineering / construction safety
  const [photos, setPhotos] = useState<
    (InspectionPhoto & { category: string; statusType: 'GOOD' | 'FINDING' })[]
  >([
    {
      id: 'photo-1',
      photoUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb186156f?w=600&auto=format&fit=crop&q=60',
      caption: 'Kepatuhan 100% penggunaan rompi reflektif & full body harness saat perakitan bekisting kolom',
      date: '2026-09-15',
      location: 'Lantai 4 Sektor Barat',
      uploaderName: 'Ir. Wahyu Hidayat, MT.',
      category: 'APD & Ketinggian',
      statusType: 'GOOD',
    },
    {
      id: 'photo-2',
      photoUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&auto=format&fit=crop&q=60',
      caption: 'Pemeriksaan Green Tag Scaffolding dan pemasangan toe board ganda',
      date: '2026-09-14',
      location: 'Fasad Utama Gedung A',
      uploaderName: 'Faisal Akbar, ST.',
      category: 'Perancah',
      statusType: 'GOOD',
    },
    {
      id: 'photo-3',
      photoUrl: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=600&auto=format&fit=crop&q=60',
      caption: 'Pekerjaan pengelasan plat simpul menggunakan perlindungan APAR 6kg siap pakai',
      date: '2026-09-12',
      location: 'Workshop Pabrikasi Baja',
      uploaderName: 'Ir. Wahyu Hidayat, MT.',
      category: 'Pekerjaan Panas',
      statusType: 'GOOD',
    },
    {
      id: 'photo-4',
      photoUrl: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=600&auto=format&fit=crop&q=60',
      caption: 'Pelaksanaan Safety Morning Talk / Tool Box Meeting harian sebelum galian dimulai',
      date: '2026-09-10',
      location: 'Lapangan Proyek Depan Direksi Keet',
      uploaderName: 'Drs. Wahyu Prasetyo, ST.',
      category: 'Sosialisasi & TBM',
      statusType: 'GOOD',
    },
  ]);

  const [newPhotoCaption, setNewPhotoCaption] = useState('');
  const [newPhotoLocation, setNewPhotoLocation] = useState(currentProject?.location || '');
  const [newPhotoCategory, setNewPhotoCategory] = useState('APD & Ketinggian');
  const [newPhotoType, setNewPhotoType] = useState<'GOOD' | 'FINDING'>('GOOD');

  const handleAddPhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPhotoCaption) return;

    const newPhotoItem = {
      id: 'photo-' + Date.now(),
      photoUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&auto=format&fit=crop&q=60',
      caption: newPhotoCaption,
      date: new Date().toISOString().split('T')[0],
      location: newPhotoLocation || 'Area Proyek',
      uploaderName: currentUser.fullName,
      category: newPhotoCategory,
      statusType: newPhotoType,
    };

    setPhotos([newPhotoItem, ...photos]);
    addAuditLog('CREATE', 'Dokumentasi Foto K3', newPhotoItem.id, `Unggah foto K3: ${newPhotoCaption}`);
    addNotification('Foto Dokumentasi Disimpan', 'Dokumentasi foto K3 berhasil ditambahkan.', 'SUCCESS');
    setShowUploadModal(false);
    setNewPhotoCaption('');
  };

  const filteredPhotos = photos.filter(
    (p) => selectedCategory === 'ALL' || p.category === selectedCategory
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
            Bukti Lapangan Visual SMKK
          </span>
          <h1 className="text-xl font-black text-slate-900 mt-1 flex items-center space-x-2">
            <Camera className="w-5 h-5 text-blue-600" />
            <span>Dokumentasi Foto Pengawasan K3</span>
          </h1>
          <p className="text-xs text-slate-500">
            Galeri visual inspeksi kepatuhan, pemenuhan rambu K3, APD, safety talk, dan rekaman tindak lanjut perbaikan
          </p>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="flex items-center space-x-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors shrink-0"
        >
          <Upload className="w-4 h-4" />
          <span>Unggah Foto Pengawasan</span>
        </button>
      </div>

      {/* Filter Categories */}
      <div className="flex flex-wrap gap-2">
        {['ALL', 'APD & Ketinggian', 'Perancah', 'Pekerjaan Panas', 'Sosialisasi & TBM'].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              selectedCategory === cat
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {cat === 'ALL' ? 'Semua Kategori' : cat}
          </button>
        ))}
      </div>

      {/* Photo Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredPhotos.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="relative aspect-video bg-slate-100 overflow-hidden">
              <img
                src={item.photoUrl}
                alt={item.caption}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-2.5 left-2.5">
                <span className="px-2 py-0.5 rounded-md bg-slate-900/80 text-white text-[10px] font-bold backdrop-blur-xs">
                  {item.category}
                </span>
              </div>
              <div className="absolute top-2.5 right-2.5">
                <span
                  className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold backdrop-blur-xs ${
                    item.statusType === 'GOOD'
                      ? 'bg-emerald-600/90 text-white'
                      : 'bg-rose-600/90 text-white'
                  }`}
                >
                  {item.statusType === 'GOOD' ? '✓ Kondisi Patuh' : '⚠ Temuan NCR'}
                </span>
              </div>
            </div>

            <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
              <p className="text-xs font-semibold text-slate-800 leading-snug">{item.caption}</p>

              <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="flex items-center">
                    <MapPin className="w-3 h-3 text-slate-400 mr-1" />
                    {item.location}
                  </span>
                  <span className="flex items-center">
                    <Calendar className="w-3 h-3 text-slate-400 mr-1" />
                    {item.date}
                  </span>
                </div>
                <div className="text-[10px] text-slate-400">
                  Diunggah: <strong className="text-slate-600">{item.uploaderName}</strong>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Upload */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <form
            onSubmit={handleAddPhoto}
            className="bg-white rounded-2xl p-6 shadow-2xl border border-slate-200 max-w-lg w-full space-y-4"
          >
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-sm font-bold text-slate-900">Unggah Dokumentasi Foto Pengawasan K3</h3>
              <button
                type="button"
                onClick={() => setShowUploadModal(false)}
                className="text-slate-400 hover:text-slate-700 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Keterangan / Caption Foto *</label>
                <textarea
                  rows={2}
                  required
                  value={newPhotoCaption}
                  onChange={(e) => setNewPhotoCaption(e.target.value)}
                  placeholder="Contoh: Kondisi pemasangan safety line & barikade perimeter galian basement"
                  className="w-full text-xs p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kategori</label>
                  <select
                    value={newPhotoCategory}
                    onChange={(e) => setNewPhotoCategory(e.target.value)}
                    className="w-full text-xs p-2 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="APD & Ketinggian">APD & Ketinggian</option>
                    <option value="Perancah">Perancah (Scaffolding)</option>
                    <option value="Pekerjaan Panas">Pekerjaan Panas</option>
                    <option value="Sosialisasi & TBM">Sosialisasi & TBM</option>
                    <option value="Housekeeping">Housekeeping 5R</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Status Kepatuhan</label>
                  <select
                    value={newPhotoType}
                    onChange={(e) => setNewPhotoType(e.target.value as 'GOOD' | 'FINDING')}
                    className="w-full text-xs p-2 border border-slate-300 rounded-lg bg-white font-semibold"
                  >
                    <option value="GOOD">Kondisi Patuh (Good Practice)</option>
                    <option value="FINDING">Temuan Ketidaksesuaian (NCR)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Lokasi Foto</label>
                <input
                  type="text"
                  value={newPhotoLocation}
                  onChange={(e) => setNewPhotoLocation(e.target.value)}
                  className="w-full text-xs p-2 border border-slate-300 rounded-lg"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-3 border-t">
              <button
                type="button"
                onClick={() => setShowUploadModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl"
              >
                Simpan Foto
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
