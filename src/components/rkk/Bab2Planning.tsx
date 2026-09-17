import React, { useState } from 'react';
import {
  Crosshair,
  Plus,
  Trash2,
  Edit2,
  Copy,
  BookOpen,
  Target,
  FileSpreadsheet,
  Download,
  Upload,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Save,
  Sparkles,
} from 'lucide-react';
import { useAppStore } from '../../lib/store';
import { HazardIdentification, SafetyRegulation, SupervisionTargetProgram, RiskLevel } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { initialTemplates } from '../../lib/demoData';

export const Bab2Planning: React.FC = () => {
  const { currentRKK, state, updateGlobalState, addAuditLog, addNotification } = useAppStore();
  const [activeSubTab, setActiveSubTab] = useState<'IBPRP' | 'REGULASI' | 'SASARAN_PROGRAM'>('IBPRP');

  const rkkId = currentRKK?.id || '';
  const hazards = state.hazards[rkkId] || [];
  const regulations = state.regulations[rkkId] || [];
  const programs = state.supervisionPrograms[rkkId] || [];

  // Editing states
  const [editingHazard, setEditingHazard] = useState<Partial<HazardIdentification> | null>(null);
  const [editingRegulation, setEditingRegulation] = useState<Partial<SafetyRegulation> | null>(null);
  const [editingProgram, setEditingProgram] = useState<Partial<SupervisionTargetProgram> | null>(null);

  // Template selector
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');

  // Risk calculation helper
  const calculateRiskLevel = (prob: number, sev: number): { score: number; level: RiskLevel } => {
    const score = prob * sev;
    let level: RiskLevel = 'Kecil';
    if (score >= 15) level = 'Besar';
    else if (score >= 8) level = 'Sedang';
    return { score, level };
  };

  // Save Hazard Item
  const handleSaveHazard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingHazard?.activityDescription || !editingHazard?.hazardIdentification) {
      alert('Mohon isi Uraian Kegiatan dan Identifikasi Bahaya');
      return;
    }

    const prob = editingHazard.probability || 3;
    const sev = editingHazard.severity || 3;
    const { score, level } = calculateRiskLevel(prob, sev);

    const resProb = editingHazard.residualProbability || 1;
    const resSev = editingHazard.residualSeverity || 2;
    const resRisk = calculateRiskLevel(resProb, resSev);

    const newItem: HazardIdentification = {
      id: editingHazard.id || 'haz-' + Date.now(),
      rkkId,
      orderNumber: editingHazard.orderNumber || hazards.length + 1,
      activityDescription: editingHazard.activityDescription,
      workStage: editingHazard.workStage || 'Tahap Konstruksi',
      supervisionActivity: editingHazard.supervisionActivity || '',
      hazardIdentification: editingHazard.hazardIdentification,
      riskDescription: editingHazard.riskDescription || '',
      probability: prob,
      severity: sev,
      riskScore: score,
      riskLevel: level,
      initialControls: editingHazard.initialControls || [
        'Rekayasa Teknis: Pemasangan barikade & perkuatan',
        'Administrasi: Izin Kerja & Safety Induction',
        'APD: Helm K3, Rompi Reflektif, Sepatu Safety',
      ],
      residualProbability: resProb,
      residualSeverity: resSev,
      residualRiskScore: resRisk.score,
      residualRiskLevel: resRisk.level,
      followUpControls: editingHazard.followUpControls || 'Pengawasan rutin setiap hari oleh Safety Inspector',
      pic: editingHazard.pic || 'Safety Engineer & Inspector Sipil',
      supportingDoc: editingHazard.supportingDoc || 'SOP-PW-K3-001',
      status: 'SESUAI',
    };

    updateGlobalState((prev) => {
      const existing = prev.hazards[rkkId] || [];
      const updated = editingHazard.id
        ? existing.map((h) => (h.id === editingHazard.id ? newItem : h))
        : [...existing, newItem];
      return {
        ...prev,
        hazards: { ...prev.hazards, [rkkId]: updated },
      };
    });

    addAuditLog('UPDATE', 'Bab 2.1 Identifikasi Bahaya', newItem.id, `Menyimpan identifikasi bahaya: ${newItem.activityDescription}`);
    setEditingHazard(null);
  };

  const handleDeleteHazard = (id: string) => {
    updateGlobalState((prev) => ({
      ...prev,
      hazards: {
        ...prev.hazards,
        [rkkId]: (prev.hazards[rkkId] || []).filter((h) => h.id !== id),
      },
    }));
    addAuditLog('DELETE', 'Bab 2.1 Identifikasi Bahaya', id, 'Menghapus identifikasi bahaya');
    addNotification('Identifikasi Bahaya Dihapus', 'Butir identifikasi bahaya telah dihapus.', 'INFO');
  };

  const handleDuplicateHazard = (item: HazardIdentification) => {
    const dup: HazardIdentification = {
      ...item,
      id: 'haz-' + Date.now(),
      activityDescription: `${item.activityDescription} (Salinan)`,
      orderNumber: hazards.length + 1,
    };
    updateGlobalState((prev) => ({
      ...prev,
      hazards: {
        ...prev.hazards,
        [rkkId]: [...(prev.hazards[rkkId] || []), dup],
      },
    }));
    addAuditLog('CREATE', 'Bab 2.1 Identifikasi Bahaya', dup.id, 'Duplikasi identifikasi bahaya');
  };

  // Load Template (Gedung, Jalan, Jembatan)
  const handleApplyTemplate = () => {
    const tpl = initialTemplates.find((t) => t.id === selectedTemplateId);
    if (!tpl) return;

    const importedHazards: HazardIdentification[] = tpl.sampleHazards.map((sh, idx) => ({
      id: 'haz-' + Date.now() + idx,
      rkkId,
      orderNumber: hazards.length + idx + 1,
      activityDescription: sh.activityDescription || 'Uraian Kegiatan',
      workStage: 'Pekerjaan Spesifik',
      supervisionActivity: sh.supervisionActivity || 'Aktivitas Pengawasan',
      hazardIdentification: sh.hazardIdentification || 'Identifikasi Bahaya',
      riskDescription: sh.riskDescription || 'Risiko',
      probability: 3,
      severity: 4,
      riskScore: 12,
      riskLevel: sh.riskLevel || 'Sedang',
      initialControls: ['Rekayasa Teknis', 'Administrasi / SOP', 'APD'],
      residualProbability: 1,
      residualSeverity: 2,
      residualRiskScore: 2,
      residualRiskLevel: 'Kecil',
      followUpControls: 'Pengawasan berkala konsultan pengawas',
      pic: 'Ahli K3 Pengawasan',
      status: 'SESUAI',
    }));

    updateGlobalState((prev) => ({
      ...prev,
      hazards: {
        ...prev.hazards,
        [rkkId]: [...(prev.hazards[rkkId] || []), ...importedHazards],
      },
    }));

    addNotification('Template K3 Diterapkan', `Template ${tpl.name} berhasil dimuat ke Bab 2.`, 'INFO');
    setSelectedTemplateId('');
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
            Bab 2 Permen PUPR No. 10/2021
          </span>
          <h1 className="text-lg sm:text-xl font-black text-slate-900 mt-1">
            2. Perencanaan Keselamatan Konstruksi Pengawasan
          </h1>
          <p className="text-xs text-slate-500">
            Identifikasi bahaya, analisis risiko pengawasan, perundangan acuan, serta sasaran dan program kerja pengawasan
          </p>
        </div>

        {/* Template Selector */}
        <div className="flex items-center space-x-2 shrink-0">
          <select
            value={selectedTemplateId}
            onChange={(e) => setSelectedTemplateId(e.target.value)}
            className="text-xs border border-slate-300 rounded-xl px-3 py-2 bg-slate-50 focus:outline-hidden font-medium"
          >
            <option value="">Pilih Referensi Template...</option>
            {initialTemplates.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
          <button
            type="button"
            disabled={!selectedTemplateId}
            onClick={handleApplyTemplate}
            className="px-3 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 rounded-xl transition-colors flex items-center space-x-1"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Terapkan</span>
          </button>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex border-b border-slate-200 bg-white rounded-t-xl px-4">
        <button
          onClick={() => setActiveSubTab('IBPRP')}
          className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center space-x-2 transition-colors ${
            activeSubTab === 'IBPRP'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Crosshair className="w-4 h-4" />
          <span>2.1 Identifikasi Bahaya & Pengendalian Risiko (IBPRP)</span>
          <span className="px-2 py-0.2 rounded-full bg-blue-100 text-blue-800 text-[10px]">{hazards.length}</span>
        </button>

        <button
          onClick={() => setActiveSubTab('REGULASI')}
          className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center space-x-2 transition-colors ${
            activeSubTab === 'REGULASI'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>2.2 Peraturan Perundang-undangan & Standar</span>
          <span className="px-2 py-0.2 rounded-full bg-slate-100 text-slate-700 text-[10px]">{regulations.length}</span>
        </button>

        <button
          onClick={() => setActiveSubTab('SASARAN_PROGRAM')}
          className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center space-x-2 transition-colors ${
            activeSubTab === 'SASARAN_PROGRAM'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Target className="w-4 h-4" />
          <span>2.3 Sasaran & Program Pengawasan</span>
          <span className="px-2 py-0.2 rounded-full bg-slate-100 text-slate-700 text-[10px]">{programs.length}</span>
        </button>
      </div>

      {/* Pane 2.1: Identifikasi Bahaya & IBPRP */}
      {activeSubTab === 'IBPRP' && (
        <div className="bg-white rounded-b-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h3 className="text-sm font-bold text-slate-800">
                Tabel 1: Format Identifikasi Bahaya dan Pengendalian Risiko Pengawasan
              </h3>
              <p className="text-xs text-slate-500">
                Dibuat oleh Ahli Keselamatan/K3 Konstruksi dan disetujui oleh Kepala Pengawas/MK (Team Leader)
              </p>
            </div>
            <button
              onClick={() =>
                setEditingHazard({
                  probability: 3,
                  severity: 3,
                  initialControls: ['Rekayasa Teknis', 'Administrasi / SOP', 'APD'],
                  residualProbability: 1,
                  residualSeverity: 2,
                })
              }
              className="flex items-center space-x-1.5 px-3.5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Butir Aktivitas</span>
            </button>
          </div>

          {/* Table Container with Horizontal Scroll */}
          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-xs text-left border-collapse min-w-[1100px]">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-200 text-slate-700">
                  <th className="py-2.5 px-3 font-bold w-12 text-center">No</th>
                  <th className="py-2.5 px-3 font-bold w-48">Uraian Kegiatan & Tahap</th>
                  <th className="py-2.5 px-3 font-bold w-48">Identifikasi Bahaya</th>
                  <th className="py-2.5 px-3 font-bold w-44">Risiko / Paparan</th>
                  <th className="py-2.5 px-2 font-bold w-24 text-center">Tingkat Risiko Awal</th>
                  <th className="py-2.5 px-3 font-bold w-56">Pengendalian Risiko Awal</th>
                  <th className="py-2.5 px-2 font-bold w-24 text-center">Sisa Risiko</th>
                  <th className="py-2.5 px-3 font-bold w-32">Penanggung Jawab</th>
                  <th className="py-2.5 px-3 font-bold w-20 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {hazards.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-8 text-center text-slate-400">
                      Belum ada butir identifikasi bahaya. Klik "Tambah Butir Aktivitas" atau pilih template di atas.
                    </td>
                  </tr>
                ) : (
                  hazards.map((item, idx) => (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-3 text-center font-bold text-slate-500">{idx + 1}</td>
                      <td className="py-3 px-3">
                        <strong className="text-slate-900 block">{item.activityDescription}</strong>
                        <span className="text-[10px] text-blue-600 bg-blue-50 px-1.5 py-0.2 rounded font-medium inline-block mt-0.5">
                          {item.workStage}
                        </span>
                        {item.supervisionActivity && (
                          <p className="text-[11px] text-slate-500 mt-1 italic">
                            Pengawasan: {item.supervisionActivity}
                          </p>
                        )}
                      </td>
                      <td className="py-3 px-3 text-slate-800">{item.hazardIdentification}</td>
                      <td className="py-3 px-3 text-slate-700">{item.riskDescription}</td>
                      <td className="py-3 px-2 text-center">
                        <StatusBadge status={item.riskLevel} type="risk" />
                        <span className="block text-[10px] text-slate-400 mt-0.5">
                          Nilai: {item.riskScore} (F:{item.probability} x A:{item.severity})
                        </span>
                      </td>
                      <td className="py-3 px-3 text-[11px] space-y-1">
                        {item.initialControls.map((c, cIdx) => (
                          <div key={cIdx} className="flex items-start space-x-1">
                            <span className="text-blue-600 font-bold">•</span>
                            <span>{c}</span>
                          </div>
                        ))}
                      </td>
                      <td className="py-3 px-2 text-center">
                        <StatusBadge status={item.residualRiskLevel || 'Kecil'} type="risk" />
                        <span className="block text-[10px] text-slate-400 mt-0.5">
                          Nilai: {item.residualRiskScore || 2}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-[11px] font-medium text-slate-800">{item.pic}</td>
                      <td className="py-3 px-3 text-center">
                        <div className="flex items-center justify-center space-x-1">
                          <button
                            onClick={() => setEditingHazard(item)}
                            className="p-1 rounded-md text-slate-400 hover:text-blue-600 hover:bg-blue-50"
                            title="Ubah"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDuplicateHazard(item)}
                            className="p-1 rounded-md text-slate-400 hover:text-blue-600 hover:bg-blue-50"
                            title="Duplikasi"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteHazard(item.id)}
                            className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                            title="Hapus"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Signatures footer of Table 1 per Permen PUPR D.1 */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-600 gap-4">
            <div className="text-center sm:text-left">
              <span className="text-[11px] text-slate-400 block font-semibold uppercase">Dibuat Oleh:</span>
              <strong className="text-slate-800">{currentRKK?.preparedBy || 'Ahli Keselamatan/K3 Konstruksi'}</strong>
              <p className="text-[10px] text-slate-400">Penanggung Jawab K3 Pengawasan</p>
            </div>
            <div className="text-center sm:text-right">
              <span className="text-[11px] text-slate-400 block font-semibold uppercase">Disetujui Oleh:</span>
              <strong className="text-slate-800">{currentRKK?.reviewedBy || 'Team Leader'}</strong>
              <p className="text-[10px] text-slate-400">Kepala Pengawas / MK</p>
            </div>
          </div>
        </div>
      )}

      {/* Pane 2.2: Peraturan & Standar */}
      {activeSubTab === 'REGULASI' && (
        <div className="bg-white rounded-b-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-800">
                Tabel 2: Peraturan Perundang-undangan dan Standar Acuan Pengawasan
              </h3>
              <p className="text-xs text-slate-500">
                Landasan hukum dan klausul pasal yang diacu dalam pengendalian risiko
              </p>
            </div>
            <button
              onClick={() =>
                setEditingRegulation({
                  methodDescription: 'Pekerjaan Struktur',
                  regulationTitle: 'Permen PUPR No. 10 Tahun 2021',
                  numberAndYear: 'Permen PUPR 10/2021',
                  articleClause: 'Pasal 26 & Lampiran D.1',
                })
              }
              className="flex items-center space-x-1 px-3 py-1.5 text-xs font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Acuan Hukum</span>
            </button>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 border-b text-slate-700">
                  <th className="py-2.5 px-3 font-bold w-12 text-center">No</th>
                  <th className="py-2.5 px-3 font-bold w-64">Metode Pelaksanaan / Aktivitas</th>
                  <th className="py-2.5 px-3 font-bold">Peraturan Perundangan & Persyaratan yang Menjadi Acuan</th>
                  <th className="py-2.5 px-3 font-bold w-48">Pasal / Klausul Terkait</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {regulations.map((reg, idx) => (
                  <tr key={reg.id} className="hover:bg-slate-50">
                    <td className="py-3 px-3 text-center font-bold text-slate-500">{idx + 1}</td>
                    <td className="py-3 px-3 font-semibold text-slate-800">{reg.methodDescription}</td>
                    <td className="py-3 px-3">
                      <span className="font-bold text-blue-900 block">{reg.regulationTitle}</span>
                      <span className="text-[11px] text-slate-500">{reg.notes}</span>
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-800 font-semibold">{reg.articleClause}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pane 2.3: Sasaran & Program Pengawasan */}
      {activeSubTab === 'SASARAN_PROGRAM' && (
        <div className="bg-white rounded-b-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-800">
                Tabel 3: Sasaran dan Program Pengawasan Keselamatan Konstruksi
              </h3>
              <p className="text-xs text-slate-500">
                Sasaran mutu K3, tolok ukur keberhasilan, dan program tindakan pengawasan harian/mingguan
              </p>
            </div>
            <button
              onClick={() =>
                setEditingProgram({
                  activityDescription: 'Pengawasan K3 Mingguan',
                  target: 'Zero Accident',
                  supervisionProgram: 'Safety Walkthrough & Toolbox Meeting',
                  benchmark: '100% kepatuhan SOP',
                  schedule: 'Setiap Hari',
                  status: 'SEDANG_BERJALAN',
                })
              }
              className="flex items-center space-x-1 px-3 py-1.5 text-xs font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Program</span>
            </button>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 border-b text-slate-700">
                  <th className="py-2.5 px-3 font-bold w-12 text-center">No</th>
                  <th className="py-2.5 px-3 font-bold w-56">Uraian Kegiatan</th>
                  <th className="py-2.5 px-3 font-bold">Sasaran K3</th>
                  <th className="py-2.5 px-3 font-bold">Program Pengawasan</th>
                  <th className="py-2.5 px-3 font-bold w-40">Tolok Ukur</th>
                  <th className="py-2.5 px-3 font-bold w-32">Penanggung Jawab</th>
                  <th className="py-2.5 px-3 font-bold w-24">Jadwal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {programs.map((prog, idx) => (
                  <tr key={prog.id} className="hover:bg-slate-50">
                    <td className="py-3 px-3 text-center font-bold text-slate-500">{idx + 1}</td>
                    <td className="py-3 px-3 font-bold text-slate-800">{prog.activityDescription}</td>
                    <td className="py-3 px-3 whitespace-pre-line text-slate-700">{prog.target}</td>
                    <td className="py-3 px-3 whitespace-pre-line text-slate-700">{prog.supervisionProgram}</td>
                    <td className="py-3 px-3 text-emerald-800 font-semibold">{prog.benchmark}</td>
                    <td className="py-3 px-3 font-medium text-slate-800">{prog.pic}</td>
                    <td className="py-3 px-3 text-slate-500">{prog.schedule}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit Hazard Modal */}
      {editingHazard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
          <form
            onSubmit={handleSaveHazard}
            className="bg-white rounded-2xl p-6 shadow-2xl border border-slate-200 max-w-2xl w-full space-y-4 my-8"
          >
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-sm font-bold text-slate-900">
                {editingHazard.id ? 'Ubah Butir Identifikasi Bahaya' : 'Tambah Identifikasi Bahaya Baru'}
              </h3>
              <button
                type="button"
                onClick={() => setEditingHazard(null)}
                className="text-slate-400 hover:text-slate-700 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs max-h-[65vh] overflow-y-auto pr-1">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Uraian Kegiatan Pekerjaan *</label>
                <input
                  type="text"
                  required
                  value={editingHazard.activityDescription || ''}
                  onChange={(e) => setEditingHazard({ ...editingHazard, activityDescription: e.target.value })}
                  placeholder="Contoh: Pengawasan Pekerjaan Galian Tanah Basement > 3m"
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tahapan Pekerjaan</label>
                  <input
                    type="text"
                    value={editingHazard.workStage || ''}
                    onChange={(e) => setEditingHazard({ ...editingHazard, workStage: e.target.value })}
                    placeholder="Contoh: Struktur Bawah"
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Aktivitas Pengawasan Konsultan</label>
                  <input
                    type="text"
                    value={editingHazard.supervisionActivity || ''}
                    onChange={(e) => setEditingHazard({ ...editingHazard, supervisionActivity: e.target.value })}
                    placeholder="Contoh: Pemeriksaan lereng galian & shoring"
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Identifikasi Bahaya *</label>
                  <textarea
                    rows={2}
                    required
                    value={editingHazard.hazardIdentification || ''}
                    onChange={(e) => setEditingHazard({ ...editingHazard, hazardIdentification: e.target.value })}
                    placeholder="Contoh: Dinding galian longsor mendadak"
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Paparan / Konsekuensi Risiko</label>
                  <textarea
                    rows={2}
                    value={editingHazard.riskDescription || ''}
                    onChange={(e) => setEditingHazard({ ...editingHazard, riskDescription: e.target.value })}
                    placeholder="Contoh: Pekerja tertimbun material galian"
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              {/* Risk Assessment (Probability & Severity) */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <span className="font-bold text-slate-800 uppercase block text-[11px]">
                  Penilaian Tingkat Risiko Awal (Skala 1 - 5)
                </span>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-600 mb-1">Kekerapan (F: 1-5)</label>
                    <select
                      value={editingHazard.probability || 3}
                      onChange={(e) => setEditingHazard({ ...editingHazard, probability: Number(e.target.value) })}
                      className="w-full p-2 border rounded-lg bg-white"
                    >
                      <option value={1}>1 - Hampir Tidak Pernah</option>
                      <option value={2}>2 - Jarang</option>
                      <option value={3}>3 - Kadang-kadang</option>
                      <option value={4}>4 - Sering</option>
                      <option value={5}>5 - Sangat Sering</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-1">Keparahan (A: 1-5)</label>
                    <select
                      value={editingHazard.severity || 3}
                      onChange={(e) => setEditingHazard({ ...editingHazard, severity: Number(e.target.value) })}
                      className="w-full p-2 border rounded-lg bg-white"
                    >
                      <option value={1}>1 - Luka Ringan</option>
                      <option value={2}>2 - Cedera Sedang</option>
                      <option value={3}>3 - Cedera Berat</option>
                      <option value={4}>4 - Cacat / Fatality 1 org</option>
                      <option value={5}>5 - Kematian Jamak / Bencana</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-1">Tingkat Risiko Terhitung</label>
                    <div className="p-2 border rounded-lg bg-white font-bold text-center">
                      Score: {(editingHazard.probability || 3) * (editingHazard.severity || 3)} •{' '}
                      {calculateRiskLevel(editingHazard.probability || 3, editingHazard.severity || 3).level}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Penanggung Jawab (PIC)</label>
                <input
                  type="text"
                  value={editingHazard.pic || ''}
                  onChange={(e) => setEditingHazard({ ...editingHazard, pic: e.target.value })}
                  placeholder="Contoh: Ahli K3 Pengawasan & Inspector Lapangan"
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-3 border-t">
              <button
                type="button"
                onClick={() => setEditingHazard(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl"
              >
                Simpan Butir IBPRP
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
