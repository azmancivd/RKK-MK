import React from 'react';
import {
  Sparkles,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  Printer,
  Send,
  FileCheck2,
} from 'lucide-react';
import { useAppStore, calculateRKKProgress } from '../../lib/store';

interface RKKValidationProps {
  onNavigate: (view: string) => void;
}

export const RKKValidation: React.FC<RKKValidationProps> = ({ onNavigate }) => {
  const { currentProject, currentRKK, state } = useAppStore();

  const rkkId = currentRKK?.id || '';
  const progress = calculateRKKProgress(
    currentProject,
    currentRKK,
    state.commitments[rkkId],
    state.hazards[rkkId],
    state.regulations[rkkId],
    state.supervisionPrograms[rkkId],
    currentProject ? state.personnel[currentProject.id] : undefined,
    state.safetyBudgets[rkkId],
    state.orgMembers[rkkId],
    currentProject ? state.safetyDocuments[currentProject.id] : undefined
  );

  const checks = [
    {
      id: 'dataProyek',
      title: 'Data Umum Proyek Lengkap',
      desc: 'Nama paket, no kontrak, nilai, PPK, dan penyedia',
      passed: progress.checks.dataProyek,
      targetView: 'projects-list',
    },
    {
      id: 'cover',
      title: 'Format Cover Sesuai Lampiran D.1',
      desc: 'Logo, judul resmi, dan metadata kontrak',
      passed: progress.checks.cover,
      targetView: 'rkk-document',
    },
    {
      id: 'pengesahan',
      title: 'Lembar Pengesahan Sesuai KAK & PCM',
      desc: 'Kepala Pengawas & Pejabat Pembuat Komitmen',
      passed: progress.checks.pengesahan,
      targetView: 'rkk-document',
    },
    {
      id: 'bab1Komitmen',
      title: 'Bab 1: Komitmen Rencana Aksi K3',
      desc: 'Pernyataan 5 butir komitmen pengawasan zero accident',
      passed: progress.checks.bab1Komitmen,
      targetView: 'rkk-commitments',
    },
    {
      id: 'bab2IdentifikasiBahaya',
      title: 'Bab 2.1: Identifikasi Bahaya & IBPRP',
      desc: 'Tabel 1 minimal 1 uraian kegiatan & pengendalian risiko',
      passed: progress.checks.bab2IdentifikasiBahaya,
      targetView: 'rkk-planning',
    },
    {
      id: 'bab2Peraturan',
      title: 'Bab 2.2: Peraturan Perundang-undangan Acuan',
      desc: 'Tabel 2 standar perundangan dan pasal yang diacu',
      passed: progress.checks.bab2Peraturan,
      targetView: 'rkk-planning',
    },
    {
      id: 'bab2SasaranProgram',
      title: 'Bab 2.3: Sasaran & Program Pengawasan',
      desc: 'Tabel 3 sasaran mutu K3, tolok ukur, dan jadwal',
      passed: progress.checks.bab2SasaranProgram,
      targetView: 'rkk-planning',
    },
    {
      id: 'bab3Personel',
      title: 'Bab 3.1: Personel Pengawas & Sertifikat K3',
      desc: 'Daftar personil lengkap dengan sertifikat kompetensi SKA/SKT',
      passed: progress.checks.bab3Personel && progress.checks.bab3Sertifikat,
      targetView: 'rkk-support',
    },
    {
      id: 'bab3BiayaSMKK',
      title: 'Bab 3.2: 9 Komponen Biaya Penerapan SMKK',
      desc: 'Rincian anggaran biaya keselamatan konstruksi',
      passed: progress.checks.bab3BiayaSMKK,
      targetView: 'rkk-support',
    },
    {
      id: 'bab4StrukturOrganisasi',
      title: 'Bab 4.1: Struktur Organisasi & Uraian Tugas',
      desc: 'Tabel 5 tugas dan tanggung jawab unit pengawas',
      passed: progress.checks.bab4StrukturOrganisasi,
      targetView: 'rkk-operations',
    },
    {
      id: 'bab4SOPInstruksi',
      title: 'Bab 4.2: Prosedur / SOP & Instruksi Kerja',
      desc: 'Daftar dokumen operasional standar pengawasan',
      passed: progress.checks.bab4SOPInstruksi,
      targetView: 'rkk-operations',
    },
    {
      id: 'bab5EvaluasiKinerja',
      title: 'Bab 5.1: Jadwal Rekaman Laporan Pengawasan SMKK',
      desc: 'Tabel 6 agenda laporan mingguan, bulanan, T&C, dan PHO',
      passed: progress.checks.bab5EvaluasiKinerja,
      targetView: 'rkk-evaluation',
    },
  ];

  const allPassed = checks.every((c) => c.passed);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
            Engine Validasi Standar Permen PUPR No. 10/2021
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
            Uji Kelayakan & Kelengkapan Dokumen RKK
          </h1>
          <p className="text-xs text-slate-500">
            Evaluasi otomatis seluruh parameter wajib Lampiran D.1 sebelum pengesahan oleh PPK
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <div className="text-right">
            <span className="text-3xl font-black text-blue-600">{progress.total}%</span>
            <span className="block text-[10px] font-bold uppercase text-slate-400">Tingkat Kelengkapan</span>
          </div>
        </div>
      </div>

      {/* Outcome Verdict Card */}
      <div
        className={`p-5 rounded-2xl border flex items-center justify-between ${
          allPassed
            ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
            : 'bg-amber-50 border-amber-200 text-amber-900'
        }`}
      >
        <div className="flex items-center space-x-3">
          {allPassed ? (
            <CheckCircle2 className="w-8 h-8 text-emerald-600 shrink-0" />
          ) : (
            <AlertTriangle className="w-8 h-8 text-amber-600 shrink-0" />
          )}
          <div>
            <h3 className="text-sm font-bold">
              {allPassed
                ? 'Status: SIAP DISETUJUI & FINALISASI (Permen PUPR Compliant)'
                : 'Status: BELUM LENGKAP - Butuh Pengisian Data Wajib'}
            </h3>
            <p className="text-xs mt-0.5 opacity-90">
              {allPassed
                ? 'Seluruh 11 kriteria wajib Lampiran D.1 telah terpenuhi. Dokumen siap dicetak atau diajukan persetujuan.'
                : 'Lengkapi butir-butir bertanda merah di bawah agar dokumen sah dan siap diverifikasi oleh PPK.'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={() => onNavigate('print-rkk')}
            className="flex items-center space-x-1.5 px-3.5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl"
          >
            <Printer className="w-4 h-4" />
            <span>Lihat Cetak A4</span>
          </button>
        </div>
      </div>

      {/* Verification Checklist Items */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
          Daftar Pemeriksaan Komponen Wajib RKK
        </h3>

        <div className="space-y-2.5">
          {checks.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                {item.passed ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                ) : (
                  <XCircle className="w-5 h-5 text-rose-500 shrink-0" />
                )}
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{item.title}</h4>
                  <p className="text-[11px] text-slate-500">{item.desc}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 shrink-0">
                <span
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                    item.passed ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {item.passed ? 'Lengkap ✓' : 'Belum Terisi'}
                </span>

                <button
                  onClick={() => onNavigate(item.targetView)}
                  className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg flex items-center space-x-1 text-xs font-semibold"
                >
                  <span>Buka Bagian</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
