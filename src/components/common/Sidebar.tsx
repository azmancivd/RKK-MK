import React from 'react';
import {
  LayoutDashboard,
  FolderGit2,
  FileCheck2,
  Crosshair,
  Users2,
  Network,
  ClipboardList,
  FileText,
  FileSpreadsheet,
  Settings,
  Shield,
  X,
  ChevronRight,
  Sparkles,
  AlertTriangle,
  Building,
} from 'lucide-react';
import { useAppStore } from '../../lib/store';

interface SidebarProps {
  activeView: string;
  onSelectView: (view: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  onSelectView,
  isOpen,
  onClose,
}) => {
  const { currentProject, company } = useAppStore();

  const menuSections = [
    {
      title: 'UTAMA',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      ],
    },
    {
      title: 'MANAJEMEN PROYEK',
      items: [
        { id: 'projects-list', label: 'Daftar Proyek', icon: FolderGit2 },
        { id: 'project-detail', label: 'Detail Proyek Aktif', icon: Building },
      ],
    },
    {
      title: 'RENCANA KESELAMATAN (RKK)',
      items: [
        { id: 'rkk-document', label: 'Dokumen & Pengesahan', icon: FileCheck2 },
        { id: 'rkk-commitments', label: 'Bab 1: Komitmen Rencana Aksi', icon: Shield },
        { id: 'rkk-planning', label: 'Bab 2: Identifikasi & Sasaran', icon: Crosshair },
        { id: 'rkk-support', label: 'Bab 3: Personel & Biaya SMKK', icon: Users2 },
        { id: 'rkk-operations', label: 'Bab 4: Struktur & Prosedur', icon: Network },
        { id: 'rkk-evaluation', label: 'Bab 5: Evaluasi Penerapan', icon: FileSpreadsheet },
        { id: 'rkk-validation', label: 'Validasi & Kelayakan RKK', icon: Sparkles },
      ],
    },
    {
      title: 'PENGAWASAN & MONITORING',
      items: [
        { id: 'monitoring-inspections', label: 'Inspeksi K3 Lapangan', icon: ClipboardList },
        { id: 'monitoring-findings', label: 'Temuan & Tindak Lanjut', icon: AlertTriangle },
        { id: 'monitoring-jsa', label: 'Job Safety Analysis (JSA)', icon: FileText },
        { id: 'monitoring-permits', label: 'Surat Izin Kerja (PTW)', icon: FileCheck2 },
        { id: 'monitoring-photos', label: 'Dokumentasi Foto Lapangan', icon: FolderGit2 },
      ],
    },
    {
      title: 'PELAPORAN & PENGUJIAN',
      items: [
        { id: 'reports-weekly', label: 'Laporan Mingguan K3', icon: FileSpreadsheet },
        { id: 'reports-monthly', label: 'Laporan Bulanan K3', icon: FileText },
        { id: 'reports-testing', label: 'Testing & Commissioning', icon: ClipboardList },
        { id: 'reports-final', label: 'Evaluasi Akhir Pengawasan', icon: FileCheck2 },
      ],
    },
    {
      title: 'DOKUMEN & PENGATURAN',
      items: [
        { id: 'print-rkk', label: 'Cetak Dokumen Resmi (A4)', icon: FileText },
        { id: 'company-profile', label: 'Profil Perusahaan Konsultan', icon: Building },
        { id: 'audit-logs', label: 'Audit Trail & Aktivitas', icon: ClipboardList },
        { id: 'app-settings', label: 'Pengaturan & Supabase', icon: Settings },
      ],
    },
  ];

  const handleItemClick = (id: string) => {
    onSelectView(id);
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-50 w-72 bg-slate-900 text-slate-100 flex flex-col border-r border-slate-800 transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-slate-800 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center shadow-md">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-base tracking-tight text-white">RKK-MK</span>
                <span className="px-1.5 py-0.5 text-[9px] font-bold bg-blue-500/20 text-blue-300 rounded border border-blue-400/30">
                  PUPR
                </span>
              </div>
              <p className="text-[10px] text-slate-400 truncate max-w-[170px]">
                Konsultansi Pengawasan / MK
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Active Project Banner */}
        <div className="p-3 bg-slate-950/60 border-b border-slate-800/80">
          <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            Proyek yang Diawasi
          </div>
          <div className="text-xs font-semibold text-white truncate mt-0.5">
            {currentProject?.projectName || 'Belum memilih proyek'}
          </div>
          <div className="text-[11px] text-blue-400 truncate mt-0.5">
            {currentProject?.contractNumber}
          </div>
        </div>

        {/* Navigation Sections */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {menuSections.map((section) => (
            <div key={section.title} className="space-y-1">
              <div className="px-3 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                {section.title}
              </div>
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                      isActive
                        ? 'bg-blue-600 text-white font-semibold shadow-xs'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5 truncate">
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                      <span className="truncate">{item.label}</span>
                    </div>
                    {isActive && <ChevronRight className="w-3.5 h-3.5 text-blue-200" />}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Footer info */}
        <div className="p-3 border-t border-slate-800 text-[11px] text-slate-400 bg-slate-950/40 shrink-0">
          <p className="truncate font-medium text-slate-300">{company.name}</p>
          <p className="text-[10px] text-slate-400">Permen PUPR No. 10/2021 Lamp. D.1</p>
        </div>
      </aside>
    </>
  );
};
