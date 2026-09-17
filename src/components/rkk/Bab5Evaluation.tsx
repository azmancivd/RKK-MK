import React, { useState } from 'react';
import {
  Activity,
  CheckCircle2,
  Calendar,
  FileCheck2,
  Clock,
  Plus,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { useAppStore } from '../../lib/store';

export const Bab5Evaluation: React.FC = () => {
  const { currentProject, currentRKK, state } = useAppStore();

  const projectId = currentProject?.id || '';
  const weeklyReports = state.weeklyReports[projectId] || [];
  const monthlyReports = state.monthlyReports[projectId] || [];
  const inspections = state.inspections[projectId] || [];
  const findings = state.findings[projectId] || [];

  const closedFindings = findings.filter((f) => f.status === 'CLOSED').length;
  const resolutionRate = findings.length > 0 ? Math.round((closedFindings / findings.length) * 100) : 100;

  // Standard Table 6 Format Jadwal Rekaman Laporan Permen PUPR D.1
  const scheduleRows = [
    {
      no: 1,
      activity: 'Laporan Pengawasan Penerapan SMKK Mingguan',
      schedule: 'Setiap akhir pekan kerja (Jumat/Sabtu)',
      pic: 'Ahli K3 Konstruksi Pengawas',
      notes: 'Melampirkan rangkuman inspeksi, temuan, tindak lanjut, dan dokumentasi foto',
      realizationCount: `${weeklyReports.length} Dokumen Tersimpan`,
    },
    {
      no: 2,
      activity: 'Laporan Pengawasan Penerapan SMKK Bulanan',
      schedule: 'Tanggal 25 setiap bulannya',
      pic: 'Kepala Pengawas (Team Leader)',
      notes: 'Evaluasi tren kepatuhan, jam kerja selamat (safe manhours), dan performa kontraktor',
      realizationCount: `${monthlyReports.length} Dokumen Tersimpan`,
    },
    {
      no: 3,
      activity: 'Pemeriksaan Hasil Testing dan Commissioning (T&C)',
      schedule: 'Sesuai tahapan uji fungsi peralatan mekanikal/elektrikal/struktur',
      pic: 'Quality & Safety Engineer',
      notes: 'Berita acara uji kelaikan operasi alat dan sistem proteksi kebakaran',
      realizationCount: '1 Berita Acara',
    },
    {
      no: 4,
      activity: 'Laporan Akhir Pengawasan Keselamatan Konstruksi (PHO/FHO)',
      schedule: 'Menjelang Serah Terima Pertama Pekerjaan (PHO)',
      pic: 'Team Leader & Pengguna Jasa',
      notes: 'Laporan komprehensif penutupan seluruh komitmen dan dokumentasi as-built SMKK',
      realizationCount: 'Draft Tersedia',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
            Bab 5 Permen PUPR No. 10/2021
          </span>
          <h1 className="text-lg sm:text-xl font-black text-slate-900 mt-1">
            5. Evaluasi Kinerja Keselamatan Konstruksi
          </h1>
          <p className="text-xs text-slate-500">
            5.1 Jadwal dan daftar rekaman laporan pelaksanaan pengawasan penerapan SMKK berkala
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <div className="px-3.5 py-2 bg-blue-50 rounded-xl border border-blue-200 text-right">
            <span className="text-[10px] uppercase font-bold text-blue-600 block">Tingkat Penyelesaian Temuan</span>
            <span className="text-sm font-black text-blue-900">{resolutionRate}% Resolved</span>
          </div>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <span className="text-xs font-bold text-slate-400 uppercase">Inspeksi Selesai</span>
          <p className="text-2xl font-black text-slate-900 mt-1">{inspections.length}</p>
          <span className="text-[11px] text-emerald-600 font-semibold">100% terjadwal</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <span className="text-xs font-bold text-slate-400 uppercase">Total Temuan</span>
          <p className="text-2xl font-black text-slate-900 mt-1">{findings.length}</p>
          <span className="text-[11px] text-slate-500 font-semibold">{closedFindings} Closed</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <span className="text-xs font-bold text-slate-400 uppercase">Laporan Mingguan</span>
          <p className="text-2xl font-black text-blue-600 mt-1">{weeklyReports.length}</p>
          <span className="text-[11px] text-blue-600 font-semibold">Siap diserahkan</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <span className="text-xs font-bold text-slate-400 uppercase">Laporan Bulanan</span>
          <p className="text-2xl font-black text-indigo-600 mt-1">{monthlyReports.length}</p>
          <span className="text-[11px] text-indigo-600 font-semibold">Tersimpan rapi</span>
        </div>
      </div>

      {/* Tabel 6 Permen PUPR Format */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-800">
              Tabel 6: Format Jadwal Rekaman Pelaksanaan Pengawasan Penerapan SMKK
            </h3>
            <p className="text-xs text-slate-500">
              Lampiran D.1 Hal. 124 Permen PUPR No. 10/2021
            </p>
          </div>
        </div>

        <div className="overflow-x-auto border border-slate-200 rounded-xl">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 border-b text-slate-700">
                <th className="py-2.5 px-3 font-bold w-12 text-center">No</th>
                <th className="py-2.5 px-3 font-bold w-64">Kegiatan Pengawasan SMKK</th>
                <th className="py-2.5 px-3 font-bold w-52">Periode / Jadwal</th>
                <th className="py-2.5 px-3 font-bold w-48">Penanggung Jawab</th>
                <th className="py-2.5 px-3 font-bold">Keterangan & Lingkup Rekaman</th>
                <th className="py-2.5 px-3 font-bold w-36 text-center">Realisasi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {scheduleRows.map((row) => (
                <tr key={row.no} className="hover:bg-slate-50">
                  <td className="py-3 px-3 text-center font-bold text-slate-500">{row.no}</td>
                  <td className="py-3 px-3 font-bold text-slate-900">{row.activity}</td>
                  <td className="py-3 px-3 font-medium text-blue-900">{row.schedule}</td>
                  <td className="py-3 px-3 font-semibold text-slate-800">{row.pic}</td>
                  <td className="py-3 px-3 text-slate-600">{row.notes}</td>
                  <td className="py-3 px-3 text-center">
                    <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                      {row.realizationCount}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
