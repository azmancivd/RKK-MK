import React from 'react';
import {
  Printer,
  Download,
  Shield,
  CheckCircle2,
  QrCode,
  Building,
  Calendar,
  FileCheck2,
  ArrowLeft,
} from 'lucide-react';
import { useAppStore } from '../../lib/store';

interface RKKPrintA4Props {
  onBack: () => void;
}

export const RKKPrintA4: React.FC<RKKPrintA4Props> = ({ onBack }) => {
  const { currentProject, currentRKK, company, state } = useAppStore();

  if (!currentProject || !currentRKK) {
    return (
      <div className="p-8 text-center bg-white rounded-xl">
        <p className="text-slate-500">Pilih proyek dan dokumen RKK terlebih dahulu.</p>
        <button onClick={onBack} className="mt-4 px-4 py-2 bg-blue-600 text-white text-xs rounded-lg">
          Kembali
        </button>
      </div>
    );
  }

  const rkkId = currentRKK.id;
  const commitment = state.commitments[rkkId];
  const hazards = state.hazards[rkkId] || [];
  const regulations = state.regulations[rkkId] || [];
  const programs = state.supervisionPrograms[rkkId] || [];
  const personnel = state.personnel[currentProject.id] || [];
  const budgets = state.safetyBudgets[rkkId] || [];
  const orgMembers = state.orgMembers[rkkId] || [];
  const safetyDocs = state.safetyDocuments[currentProject.id] || [];

  const grandTotalSMKK = budgets.reduce((acc, curr) => acc + curr.totalPrice, 0);

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Floating Print Bar (Hidden during actual print) */}
      <div className="print:hidden bg-slate-900 text-white p-4 rounded-2xl shadow-xl flex items-center justify-between sticky top-4 z-30">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title="Kembali"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="text-sm font-bold flex items-center space-x-2">
              <span>Pratinjau Dokumen Resmi RKK (Format A4 Cetak)</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/30 text-blue-300 border border-blue-400/30">
                Permen PUPR No. 10/2021
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Dokumen: {currentRKK.documentNumber} • {currentRKK.version}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handlePrint}
            className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-sm transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Dokumen / Simpan PDF</span>
          </button>
        </div>
      </div>

      {/* A4 PRINT CONTAINER */}
      <div className="print:m-0 print:p-0 max-w-4xl mx-auto space-y-8 print:space-y-0 text-slate-900 font-serif">
        {/* =========================================================================
            PAGE 1: COVER DOKUMEN RESMI (Format Lampiran D.1 Hal. 117)
           ========================================================================= */}
        <div className="bg-white p-12 sm:p-16 rounded-2xl shadow-md print:shadow-none border border-slate-200 print:border-none min-h-[1050px] flex flex-col justify-between text-center relative overflow-hidden print:break-after-page">
          {/* Watermark */}
          {currentRKK.status !== 'FINAL' && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
              <span className="text-8xl font-black rotate-[-35deg] uppercase select-none">
                {currentRKK.status}
              </span>
            </div>
          )}

          {/* Top Logo / Header Box */}
          <div>
            <div className="w-32 h-20 border-2 border-slate-400 border-dashed rounded-lg mx-auto flex items-center justify-center text-xs text-slate-500 font-sans mb-3">
              [Logo Perusahaan]
            </div>
            <h3 className="text-base font-bold tracking-wider uppercase font-sans text-slate-900">
              {company.name}
            </h3>
            <p className="text-xs font-sans text-slate-600 max-w-md mx-auto">{company.address}</p>
          </div>

          {/* Main Titles */}
          <div className="space-y-3 my-8">
            <h1 className="text-2xl sm:text-3xl font-black tracking-wide font-sans text-slate-900">
              RENCANA KESELAMATAN KONSTRUKSI
            </h1>
            <h2 className="text-xl sm:text-2xl font-bold font-sans text-slate-900">(RKK)</h2>
            <div className="w-32 h-1 bg-slate-900 mx-auto my-3" />
            <h3 className="text-sm sm:text-base font-extrabold uppercase font-sans text-slate-800 tracking-wider">
              KONSULTANSI KONSTRUKSI PENGAWASAN / MANAJEMEN PENYELENGGARAAN KONSTRUKSI
            </h3>
            <p className="text-sm italic font-sans text-slate-700 max-w-xl mx-auto mt-4">
              ({currentProject.packageTitle})
            </p>
          </div>

          {/* Metadata Box (Format D.1) */}
          <div className="max-w-lg mx-auto w-full border-2 border-slate-800 text-xs font-sans text-left my-6">
            <div className="grid grid-cols-3 border-b border-slate-400 p-2.5">
              <span className="font-bold">Lokasi Pekerjaan</span>
              <span className="col-span-2">: {currentProject.location}</span>
            </div>
            <div className="grid grid-cols-3 border-b border-slate-400 p-2.5">
              <span className="font-bold">Nomor Kontrak</span>
              <span className="col-span-2 font-mono">: {currentProject.contractNumber}</span>
            </div>
            <div className="grid grid-cols-3 p-2.5">
              <span className="font-bold">Waktu Pelaksanaan</span>
              <span className="col-span-2">: {currentProject.executionPeriodDays} Hari Kalender</span>
            </div>
          </div>

          {/* Bottom Disusun Oleh */}
          <div className="pt-6 font-sans space-y-1">
            <span className="text-xs uppercase font-bold tracking-widest text-slate-600 block">
              DISUSUN OLEH:
            </span>
            <p className="text-base font-bold text-slate-900 uppercase">{company.name}</p>
            <p className="text-xs text-slate-500 italic">
              (Penyedia Jasa Konsultansi Konstruksi Pengawas Wakil Sah Pengguna Jasa)
            </p>
            <div className="pt-4 flex items-center justify-center space-x-2 text-[10px] font-mono text-slate-400">
              <QrCode className="w-4 h-4" />
              <span>Kode Verifikasi: {currentRKK.qrVerificationCode}</span>
            </div>
          </div>
        </div>

        {/* =========================================================================
            PAGE 2: LEMBAR PENGESAHAN RESMI (Format Lampiran D.1 Hal. 118)
           ========================================================================= */}
        <div className="bg-white p-12 sm:p-16 rounded-2xl shadow-md print:shadow-none border border-slate-200 print:border-none min-h-[1050px] flex flex-col justify-between relative print:break-after-page">
          <div className="text-center space-y-2 border-b-2 border-slate-900 pb-4">
            <h2 className="text-lg sm:text-xl font-bold font-sans text-slate-900 uppercase">
              LEMBAR PENGESAHAN
            </h2>
            <h3 className="text-sm font-bold font-sans text-slate-800 uppercase">
              RENCANA KESELAMATAN KONSTRUKSI (RKK) KONSULTANSI KONSTRUKSI PENGAWASAN
            </h3>
            <p className="text-xs font-sans text-slate-600 italic">
              Paket Pekerjaan: {currentProject.packageTitle}
            </p>
          </div>

          {/* Dual Signatures Table (D.1 Hal. 118) */}
          <div className="grid grid-cols-2 gap-8 my-auto font-sans text-xs">
            {/* Pihak Penyedia Konsultan */}
            <div className="border border-slate-300 p-6 flex flex-col justify-between min-h-[280px] text-center">
              <div className="space-y-1">
                <span className="font-bold text-slate-600 uppercase block">Pihak Penyedia Konsultan</span>
                <p className="text-slate-500 text-[11px]">Dibuat Oleh:</p>
                <p className="font-bold text-slate-900 text-sm mt-1">Kepala Pengawas Pekerjaan</p>
              </div>

              <div className="my-6">
                {commitment?.signatureUrl ? (
                  <img
                    src={commitment.signatureUrl}
                    alt="Tanda Tangan Kepala Pengawas"
                    className="max-h-20 mx-auto object-contain"
                  />
                ) : (
                  <div className="h-16 flex items-center justify-center text-slate-400 italic text-[11px]">
                    (Tanda Tangan Elektronik Sah)
                  </div>
                )}
                <div className="w-48 h-0.5 bg-slate-800 mx-auto mt-2" />
                <p className="font-bold text-slate-900 text-xs mt-1">
                  ({currentProject.teamLeaderName || 'Ir. Hendra Wijaya, ST., MT.'})
                </p>
                <p className="text-[11px] text-slate-500">Team Leader / Kepala Pengawas</p>
              </div>

              <p className="text-[10px] text-slate-500 italic border-t pt-2">
                (Penyedia Jasa Konsultansi Pengawas Wakil Sah Pengguna Jasa)
              </p>
            </div>

            {/* Pihak Pengguna Jasa (PPK) */}
            <div className="border border-slate-300 p-6 flex flex-col justify-between min-h-[280px] text-center">
              <div className="space-y-1">
                <span className="font-bold text-slate-600 uppercase block">Pihak Pengguna Jasa</span>
                <p className="text-slate-500 text-[11px]">Disetujui Oleh:</p>
                <p className="font-bold text-slate-900 text-sm mt-1">Pejabat Pembuat Komitmen (PPK)</p>
              </div>

              <div className="my-6">
                <div className="h-16 flex items-center justify-center text-slate-400 italic text-[11px]">
                  (Tanda Tangan Persetujuan)
                </div>
                <div className="w-48 h-0.5 bg-slate-800 mx-auto mt-2" />
                <p className="font-bold text-slate-900 text-xs mt-1">({currentProject.ppkName})</p>
                <p className="text-[11px] font-mono text-slate-600">NIP. {currentProject.ppkNip || '-'}</p>
              </div>

              <p className="text-[10px] text-slate-500 italic border-t pt-2">
                (Pengguna Jasa pada saat Rapat Persiapan Pelaksanaan Konstruksi / PCM)
              </p>
            </div>
          </div>

          <div className="text-xs font-sans text-slate-500 text-center border-t pt-4">
            Dokumen RKK ini telah diperiksa kesesuaiannya terhadap Kerangka Acuan Kerja (KAK) dan peraturan perundangan yang berlaku.
          </div>
        </div>

        {/* =========================================================================
            PAGE 3: DAFTAR ISI (Format Lampiran D.1 Hal. 119)
           ========================================================================= */}
        <div className="bg-white p-12 sm:p-16 rounded-2xl shadow-md print:shadow-none border border-slate-200 print:border-none min-h-[1050px] font-sans text-xs relative print:break-after-page">
          <div className="text-center border-b-2 border-slate-900 pb-3 mb-6">
            <h2 className="text-base font-bold uppercase tracking-wider text-slate-900">
              DAFTAR ISI DOKUMEN RKK
            </h2>
          </div>

          <div className="space-y-3 max-w-2xl mx-auto leading-relaxed">
            <div className="flex justify-between font-bold border-b border-dotted pb-1">
              <span>LEMBAR PENGESAHAN</span>
              <span>i</span>
            </div>
            <div className="flex justify-between font-bold border-b border-dotted pb-1">
              <span>DAFTAR ISI</span>
              <span>ii</span>
            </div>

            <div className="pt-2 font-bold text-slate-900">
              1. KEPEMIMPINAN DAN PARTISIPASI TENAGA KERJA DALAM KESELAMATAN KONSTRUKSI
            </div>
            <div className="pl-6 flex justify-between border-b border-dotted pb-1 text-slate-700">
              <span>1.1 Lembar Komitmen Rencana Aksi Keselamatan Konstruksi</span>
              <span>1</span>
            </div>

            <div className="pt-2 font-bold text-slate-900">
              2. PERENCANAAN KESELAMATAN KONSTRUKSI
            </div>
            <div className="pl-6 flex justify-between border-b border-dotted pb-1 text-slate-700">
              <span>2.1 Identifikasi Bahaya dan Pengendalian Risiko (Tabel 1 IBPRP)</span>
              <span>2</span>
            </div>
            <div className="pl-6 flex justify-between border-b border-dotted pb-1 text-slate-700">
              <span>2.2 Peraturan Perundang-undangan dan Standar (Tabel 2)</span>
              <span>4</span>
            </div>
            <div className="pl-6 flex justify-between border-b border-dotted pb-1 text-slate-700">
              <span>2.3 Sasaran dan Program Pengawasan (Tabel 3)</span>
              <span>5</span>
            </div>

            <div className="pt-2 font-bold text-slate-900">
              3. DUKUNGAN KESELAMATAN KONSTRUKSI
            </div>
            <div className="pl-6 flex justify-between border-b border-dotted pb-1 text-slate-700">
              <span>3.1 Kompetensi Personel Pengawasan & Sertifikasi</span>
              <span>6</span>
            </div>
            <div className="pl-6 flex justify-between border-b border-dotted pb-1 text-slate-700">
              <span>3.2 Biaya Penerapan SMKK (9 Komponen)</span>
              <span>7</span>
            </div>

            <div className="pt-2 font-bold text-slate-900">
              4. OPERASI KESELAMATAN KONSTRUKSI
            </div>
            <div className="pl-6 flex justify-between border-b border-dotted pb-1 text-slate-700">
              <span>4.1 Bagan Struktur Organisasi & Uraian Tugas Tanggung Jawab (Tabel 5)</span>
              <span>8</span>
            </div>
            <div className="pl-6 flex justify-between border-b border-dotted pb-1 text-slate-700">
              <span>4.2 Pengelolaan Dokumen Keselamatan Konstruksi (SOP / Instruksi Kerja)</span>
              <span>9</span>
            </div>

            <div className="pt-2 font-bold text-slate-900">
              5. EVALUASI KINERJA KESELAMATAN KONSTRUKSI
            </div>
            <div className="pl-6 flex justify-between border-b border-dotted pb-1 text-slate-700">
              <span>5.1 Jadwal Rekaman Pelaksanaan Pengawasan Penerapan SMKK (Tabel 6)</span>
              <span>10</span>
            </div>
          </div>
        </div>

        {/* =========================================================================
            PAGE 4: BAB 1 KOMITMEN RENCANA AKSI (Format D.1 Hal. 120)
           ========================================================================= */}
        <div className="bg-white p-12 sm:p-16 rounded-2xl shadow-md print:shadow-none border border-slate-200 print:border-none min-h-[1050px] font-sans text-xs relative flex flex-col justify-between print:break-after-page">
          <div>
            <div className="text-center border-b-2 border-slate-900 pb-3 mb-6">
              <h2 className="text-base font-bold uppercase tracking-wider text-slate-900">
                1. KEPEMIMPINAN DAN PARTISIPASI TENAGA KERJA DALAM KESELAMATAN KONSTRUKSI
              </h2>
            </div>

            <div className="space-y-4 max-w-2xl mx-auto">
              <h3 className="font-bold text-center text-sm uppercase">
                1.1 LEMBAR KOMITMEN RENCANA AKSI KESELAMATAN KONSTRUKSI
              </h3>

              <div className="border border-slate-400 p-6 rounded-lg space-y-4 leading-relaxed bg-slate-50/50">
                <p className="text-center font-bold text-sm">
                  KOMITMEN RENCANA AKSI KESELAMATAN KONSTRUKSI
                </p>

                <p className="text-justify">
                  <strong>{company.name}</strong> sebagai Badan Usaha Jasa Konstruksi berkomitmen melaksanakan pengawasan pelaksanaan pekerjaan konstruksi berkeselamatan pada pelaksanaan Paket Pekerjaan Pembangunan{' '}
                  <strong>{currentProject.packageTitle}</strong> demi terciptanya{' '}
                  <strong>Zero Accident</strong>, dengan memastikan:
                </p>

                <ol className="list-lower-alpha pl-6 space-y-2">
                  {(commitment?.commitmentPoints || [
                    'Pemenuhan ketentuan Keselamatan Konstruksi telah sesuai dengan Dokumen RKK;',
                    'Pengawasan mengacu kepada Kerangka Acuan Kerja (KAK);',
                    'Pengawasan pelaksanaan berdasarkan kesesuaian standar dan desain;',
                    'Pengawasan pelaksanaan pekerjaan sesuai dengan Standar Operasional Prosedur (SOP); dan',
                    'Menggunakan tenaga kerja yang berkompeten dan bersertifikat.',
                  ]).map((point, idx) => (
                    <li key={idx} className="pl-1">
                      {point}
                    </li>
                  ))}
                </ol>

                <div className="pt-8 flex justify-end">
                  <div className="text-center w-64">
                    <p>
                      {currentProject.regency || 'Jakarta'}, {currentRKK.date}
                    </p>
                    <p className="font-bold mt-1">Kepala Pengawas Pekerjaan</p>
                    <div className="my-3 min-h-[60px] flex items-center justify-center">
                      {commitment?.signatureUrl ? (
                        <img src={commitment.signatureUrl} alt="Ttd" className="max-h-16 object-contain" />
                      ) : (
                        <span className="text-slate-400 italic text-[10px]">(ttd)</span>
                      )}
                    </div>
                    <p className="font-bold">
                      ({currentProject.teamLeaderName || 'Ir. Hendra Wijaya, ST., MT.'})
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-right text-[10px] text-slate-400">Halaman 1</div>
        </div>

        {/* =========================================================================
            PAGE 5: BAB 2 PERENCANAAN K3 (Tabel 1 IBPRP Hal. 121)
           ========================================================================= */}
        <div className="bg-white p-10 sm:p-12 rounded-2xl shadow-md print:shadow-none border border-slate-200 print:border-none min-h-[1050px] font-sans text-xs relative flex flex-col justify-between print:break-after-page">
          <div>
            <div className="text-center border-b-2 border-slate-900 pb-3 mb-4">
              <h2 className="text-base font-bold uppercase tracking-wider text-slate-900">
                2. PERENCANAAN KESELAMATAN KONSTRUKSI
              </h2>
              <p className="text-[11px] text-slate-600">2.1 Identifikasi Bahaya dan Pengendalian Risiko</p>
            </div>

            <p className="text-[11px] text-slate-700 mb-3 italic">
              Tabel 1 Contoh Format Tabel Identifikasi Bahaya dan Pengendalian Risiko (Permen PUPR No. 10/2021 Hal. 121):
            </p>

            <table className="w-full text-[10px] border border-slate-800 border-collapse">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-800">
                  <th className="border border-slate-800 p-1.5 w-8 text-center">No</th>
                  <th className="border border-slate-800 p-1.5 w-44">Uraian Kegiatan</th>
                  <th className="border border-slate-800 p-1.5 w-44">Identifikasi Bahaya</th>
                  <th className="border border-slate-800 p-1.5 w-36">Risiko</th>
                  <th className="border border-slate-800 p-1.5 w-16 text-center">Tingkat Risiko</th>
                  <th className="border border-slate-800 p-1.5">Pengendalian Risiko Pengawasan</th>
                </tr>
              </thead>
              <tbody>
                {hazards.slice(0, 7).map((h, idx) => (
                  <tr key={h.id}>
                    <td className="border border-slate-800 p-1.5 text-center font-bold">{idx + 1}</td>
                    <td className="border border-slate-800 p-1.5 font-bold">{h.activityDescription}</td>
                    <td className="border border-slate-800 p-1.5">{h.hazardIdentification}</td>
                    <td className="border border-slate-800 p-1.5">{h.riskDescription}</td>
                    <td className="border border-slate-800 p-1.5 text-center font-bold">
                      {h.riskLevel} (Score: {h.riskScore})
                    </td>
                    <td className="border border-slate-800 p-1.5">
                      {h.initialControls.join('; ')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Bottom Signatures for Table 1 */}
            <div className="grid grid-cols-2 gap-8 pt-6 text-[11px] text-center">
              <div>
                <p>Dibuat Oleh:</p>
                <p className="font-bold">Penanggung Jawab K3 Pengawasan</p>
                <div className="h-12" />
                <p className="font-bold">({currentRKK.preparedBy})</p>
              </div>
              <div>
                <p>Disetujui Oleh:</p>
                <p className="font-bold">Kepala Pengawas / Team Leader</p>
                <div className="h-12" />
                <p className="font-bold">({currentProject.teamLeaderName})</p>
              </div>
            </div>
          </div>

          <div className="text-right text-[10px] text-slate-400">Halaman 2</div>
        </div>

        {/* =========================================================================
            PAGE 6: BAB 3 BIAYA SMKK (9 KOMPONEN Hal. 123)
           ========================================================================= */}
        <div className="bg-white p-10 sm:p-12 rounded-2xl shadow-md print:shadow-none border border-slate-200 print:border-none min-h-[1050px] font-sans text-xs relative flex flex-col justify-between print:break-after-page">
          <div>
            <div className="text-center border-b-2 border-slate-900 pb-3 mb-4">
              <h2 className="text-base font-bold uppercase tracking-wider text-slate-900">
                3. DUKUNGAN KESELAMATAN KONSTRUKSI
              </h2>
              <p className="text-[11px] text-slate-600">3.2 Biaya Penerapan SMKK (9 Komponen Standar)</p>
            </div>

            <table className="w-full text-[10px] border border-slate-800 border-collapse">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-800">
                  <th className="border border-slate-800 p-1.5 w-8 text-center">No</th>
                  <th className="border border-slate-800 p-1.5">Uraian Komponen SMKK (Permen PUPR 10/2021)</th>
                  <th className="border border-slate-800 p-1.5 w-14 text-center">Vol</th>
                  <th className="border border-slate-800 p-1.5 w-14 text-center">Satuan</th>
                  <th className="border border-slate-800 p-1.5 w-24 text-right">Harga Satuan (Rp)</th>
                  <th className="border border-slate-800 p-1.5 w-28 text-right">Total Biaya (Rp)</th>
                </tr>
              </thead>
              <tbody>
                {budgets.map((b, idx) => (
                  <tr key={b.id}>
                    <td className="border border-slate-800 p-1 text-center">{idx + 1}</td>
                    <td className="border border-slate-800 p-1">
                      <strong>{b.componentName}</strong>
                      <span className="block text-[9px] text-slate-500">{b.description}</span>
                    </td>
                    <td className="border border-slate-800 p-1 text-center">{b.volume}</td>
                    <td className="border border-slate-800 p-1 text-center">{b.unit}</td>
                    <td className="border border-slate-800 p-1 text-right font-mono">
                      {formatRupiah(b.unitPrice)}
                    </td>
                    <td className="border border-slate-800 p-1 text-right font-mono font-bold">
                      {formatRupiah(b.totalPrice)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-slate-100 font-bold">
                  <td colSpan={5} className="border border-slate-800 p-1.5 text-right uppercase">
                    Grand Total Biaya Penerapan SMKK :
                  </td>
                  <td className="border border-slate-800 p-1.5 text-right font-mono font-black">
                    {formatRupiah(grandTotalSMKK)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="text-right text-[10px] text-slate-400">Halaman 7</div>
        </div>
      </div>
    </div>
  );
};
