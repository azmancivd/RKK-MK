import React, { useState } from 'react';
import {
  Settings,
  Database,
  RefreshCw,
  Download,
  Upload,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Server,
  Cloud,
  KeyRound,
  ExternalLink,
  Sliders,
} from 'lucide-react';
import { useAppStore } from '../../lib/store';
import {
  isSupabaseConfigured,
  getSupabaseConfig,
  saveSupabaseConfig,
  clearSupabaseConfig,
  testSupabaseConnection,
} from '../../lib/supabase';

export const AppSettingsView: React.FC = () => {
  const { state, resetToDemoData, addNotification, addAuditLog, updateGlobalState } = useAppStore();
  const [isResetting, setIsResetting] = useState(false);

  // Supabase form state
  const currentConfig = getSupabaseConfig();
  const [sbUrl, setSbUrl] = useState(currentConfig.url);
  const [sbKey, setSbKey] = useState(currentConfig.key);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  const handleSaveSupabase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sbUrl || !sbKey) {
      alert('Harap isi URL Proyek dan Publishable / Anon Key Supabase');
      return;
    }
    saveSupabaseConfig(sbUrl, sbKey);
    addAuditLog('UPDATE', 'System Settings', 'SUPABASE_CONFIG', 'Menyimpan konfigurasi Supabase Cloud');
    addNotification('Supabase Dikonfigurasi', 'Koneksi database Supabase telah diperbarui.', 'SUCCESS');
    setTestResult(null);
  };

  const handleClearSupabase = () => {
    clearSupabaseConfig();
    setSbUrl('');
    setSbKey('');
    setTestResult(null);
    addNotification('Supabase Diputuskan', 'Aplikasi kembali beroperasi dalam mode offline lokal.', 'INFO');
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const res = await testSupabaseConnection();
      setTestResult(res);
      if (res.success) {
        addNotification('Koneksi Berhasil', res.message, 'SUCCESS');
      } else {
        addNotification('Koneksi Gagal', res.message, 'WARNING');
      }
    } finally {
      setIsTesting(false);
    }
  };

  const handleReset = () => {
    if (window.confirm('Apakah Anda yakin ingin mengembalikan seluruh data ke setelan awal default (demo data)?')) {
      setIsResetting(true);
      resetToDemoData();
      addAuditLog('UPDATE', 'System Settings', 'RESET', 'Mereset data aplikasi ke data bawaan demo');
      addNotification('Data Direset', 'Seluruh data telah dikembalikan ke setelan demo default.', 'INFO');
      setTimeout(() => setIsResetting(false), 500);
    }
  };

  const handleExportData = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(state, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `rkk_smkk_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    addNotification('Backup Berhasil', 'File JSON backup data SMKK telah diunduh.', 'SUCCESS');
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.projects && parsed.rkkDocuments) {
          updateGlobalState(() => parsed);
          addNotification('Pemulihan Berhasil', 'Data SMKK berhasil dipulihkan dari file backup JSON.', 'SUCCESS');
          addAuditLog('UPDATE', 'System Settings', 'RESTORE', 'Memulihkan data dari file JSON');
        } else {
          alert('Format file JSON tidak valid untuk aplikasi RKK-MK.');
        }
      } catch (err) {
        alert('Gagal membaca file JSON: ' + String(err));
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
            Aktivasi & Pengaturan Sistem
          </span>
          <h1 className="text-xl font-black text-slate-900 mt-1 flex items-center space-x-2">
            <Settings className="w-5 h-5 text-blue-600" />
            <span>Pengaturan Aplikasi, Database & Sinkronisasi Cloud</span>
          </h1>
          <p className="text-xs text-slate-500">
            Seluruh fungsi modul RKK-MK aktif secara default, siap digunakan baik dalam mode Cloud maupun Offline-First.
          </p>
        </div>
      </div>

      {/* Cloud & Local Storage Status */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Database className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-bold text-slate-800">Penyimpanan Lokal (Browser Storage)</span>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center space-x-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>Aktif 100%</span>
            </span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Data dokumen RKK, tanda tangan, risiko IBPRP, inspeksi lapangan, dan laporan tersimpan secara otomatis dan persisten di browser.
          </p>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Cloud className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-bold text-slate-800">Koneksi Cloud (Supabase)</span>
            </div>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                isSupabaseConfigured
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              {isSupabaseConfigured ? 'Terkoneksi ke Cloud' : 'Mode Offline Lokal (Aktif)'}
            </span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            {isSupabaseConfigured
              ? 'Tersinkronisasi dengan proyek cloud Supabase Anda.'
              : 'Dapat langsung diaktifkan dengan memasukkan URL dan Publishable Key di bawah ini.'}
          </p>
        </div>
      </div>

      {/* Supabase Cloud Connection Box */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b pb-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
            <Cloud className="w-4 h-4 text-blue-600" />
            <span>Konfigurasi Langsung Supabase Cloud</span>
          </h3>
          <span className="text-[11px] text-slate-500">
            Project ID: <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono text-slate-700">fhcaimryuphzdaoctbeb</code>
          </span>
        </div>

        <form onSubmit={handleSaveSupabase} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Supabase Project URL (SUPABASE_URL)
            </label>
            <input
              type="text"
              value={sbUrl}
              onChange={(e) => setSbUrl(e.target.value)}
              placeholder="https://fhcaimryuphzdaoctbeb.supabase.co"
              className="w-full text-xs font-mono px-3 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
              <span>Publishable / Anon Key (SUPABASE_PUBLISHABLE_KEY)</span>
              <span className="text-[10px] font-normal text-slate-400">Diawali sb_publishable_... atau eyJh...</span>
            </label>
            <input
              type="password"
              value={sbKey}
              onChange={(e) => setSbKey(e.target.value)}
              placeholder="sb_publishable_upANAcGEo_iiAVHY..."
              className="w-full text-xs font-mono px-3 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            />
          </div>

          {testResult && (
            <div
              className={`p-3 rounded-xl border text-xs flex items-center space-x-2 ${
                testResult.success
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-amber-50 text-amber-800 border-amber-200'
              }`}
            >
              {testResult.success ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              )}
              <span>{testResult.message}</span>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
            >
              Simpan & Hubungkan Cloud
            </button>

            <button
              type="button"
              onClick={handleTestConnection}
              disabled={isTesting || !isSupabaseConfigured}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-50 rounded-xl text-xs font-bold transition-colors flex items-center space-x-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
              <span>Uji Koneksi Cloud</span>
            </button>

            {isSupabaseConfigured && (
              <button
                type="button"
                onClick={handleClearSupabase}
                className="px-3 py-2 text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-bold transition-colors"
              >
                Putuskan Koneksi Cloud
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Feature Activation Matrix */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 border-b pb-2 flex items-center space-x-2">
          <Sliders className="w-4 h-4 text-blue-600" />
          <span>Status Aktivasi Modul & Fitur Aplikasi RKK-MK</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { name: 'Bab 1: Pakta Komitmen & Tanda Tangan Digital', status: 'Aktif' },
            { name: 'Bab 2: IBPRP Matrix 5x5 & Sasaran Pengawasan', status: 'Aktif' },
            { name: 'Bab 3: Personel SKA/SKT & 9 Biaya SMKK', status: 'Aktif' },
            { name: 'Bab 4: Struktur Organisasi & Prosedur SOP', status: 'Aktif' },
            { name: 'Bab 5: Evaluasi SMKK & Jadwal Laporan', status: 'Aktif' },
            { name: 'Validasi & Penilaian Kelayakan RKK', status: 'Aktif' },
            { name: 'Cetak Dokumen Resmi A4 + QR Verifikasi', status: 'Aktif' },
            { name: 'Inspeksi K3 Checklist & Temuan NCR', status: 'Aktif' },
            { name: 'Job Safety Analysis (JSA) & PTW Kerja', status: 'Aktif' },
            { name: 'Laporan Mingguan & Bulanan K3 (FR / SR)', status: 'Aktif' },
            { name: 'Testing & Commissioning (SILO / SIO)', status: 'Aktif' },
            { name: 'Evaluasi Akhir Pengawasan K3 (PHO/FHO)', status: 'Aktif' },
          ].map((item, idx) => (
            <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
              <span className="text-xs font-medium text-slate-800">{item.name}</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 shrink-0 ml-2">
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Backup & Restore */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 border-b pb-2 flex items-center space-x-2">
          <Database className="w-4 h-4 text-slate-700" />
          <span>Pencadangan & Pemulihan (Backup & Restore)</span>
        </h3>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <button
            onClick={handleExportData}
            className="flex items-center justify-center space-x-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Ekspor / Unduh Backup JSON</span>
          </button>

          <label className="flex items-center justify-center space-x-2 px-4 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-xl text-xs font-bold cursor-pointer transition-colors">
            <Upload className="w-4 h-4" />
            <span>Impor / Pulihkan Backup JSON</span>
            <input type="file" accept=".json" onChange={handleImportData} className="hidden" />
          </label>

          <button
            onClick={handleReset}
            disabled={isResetting}
            className="flex items-center justify-center space-x-2 px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${isResetting ? 'animate-spin' : ''}`} />
            <span>Reset ke Data Demo Default</span>
          </button>
        </div>
      </div>

      {/* Standard Reference Info */}
      <div className="p-5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 space-y-2">
        <h4 className="text-xs font-bold text-blue-900 flex items-center space-x-1.5">
          <ShieldCheck className="w-4 h-4 text-blue-600" />
          <span>Kepatuhan Regulasi & Standar Referensi</span>
        </h4>
        <p className="text-xs text-blue-800 leading-relaxed">
          Sistem ini disusun mengacu secara ketat pada <strong>Permen PUPR No. 10 Tahun 2021</strong> tentang Pedoman Sistem Manajemen Keselamatan Konstruksi (SMKK) Lampiran Rencana Keselamatan Konstruksi (RKK) Pengawasan / Manajemen Penyelenggaraan Konstruksi, UU No. 2/2017 tentang Jasa Konstruksi, dan Permenaker No. 05/1996 tentang SMK3.
        </p>
      </div>
    </div>
  );
};
