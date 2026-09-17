import React, { useState } from 'react';
import {
  ShieldAlert,
  Building2,
  Bell,
  CheckCircle,
  Database,
  Menu,
  ChevronDown,
  UserCheck,
  RotateCcw,
} from 'lucide-react';
import { useAppStore } from '../../lib/store';
import { UserRole } from '../../types';
import { isSupabaseConfigured } from '../../lib/supabase';

interface HeaderProps {
  onToggleSidebar: () => void;
  onOpenNewRKKModal: () => void;
  onNavigate: (view: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onToggleSidebar,
  onOpenNewRKKModal,
  onNavigate,
}) => {
  const {
    state,
    projects,
    selectedProjectId,
    selectProject,
    currentUser,
    switchUserRole,
    resetToDemoData,
  } = useAppStore();

  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const unreadNotifs = state.notifications.filter((n) => !n.isRead).length;

  const roles: { role: UserRole; label: string; desc: string }[] = [
    { role: 'TEAM_LEADER', label: 'Team Leader', desc: 'Kepala Pengawas / Review & Internal Approval' },
    { role: 'SAFETY_ENGINEER', label: 'Safety Engineer', desc: 'Ahli K3 / IBPRP, JSA, Izin Kerja' },
    { role: 'INSPECTOR_ENGINEER', label: 'Inspeksi Engineer', desc: 'Inspector Lapangan / Temuan & Foto' },
    { role: 'QUALITY_ENGINEER', label: 'Quality Engineer', desc: 'Mutu, Testing & Commissioning' },
    { role: 'QUANTITY_ENGINEER', label: 'Quantity Engineer', desc: 'Volume & Progres Pengawasan' },
    { role: 'USER_CLIENT', label: 'Pengguna Jasa / PPK', desc: 'Pemberi Tugas / Approval Final' },
    { role: 'COMPANY_ADMIN', label: 'Admin Perusahaan', desc: 'Manajemen Perusahaan & Dokumen' },
    { role: 'SUPER_ADMIN', label: 'Super Admin', desc: 'Hak Akses Penuh Sistem' },
  ];

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 sm:px-6 bg-white border-b border-slate-200 shadow-xs">
      {/* Left: Mobile Toggle & Project Selector */}
      <div className="flex items-center space-x-3 sm:space-x-4">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 lg:hidden"
          title="Buka Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Project Selector */}
        <div className="relative flex items-center">
          <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 hover:border-slate-300 transition-colors">
            <Building2 className="w-4 h-4 text-blue-600 shrink-0" />
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Proyek Aktif</span>
              <select
                value={selectedProjectId}
                onChange={(e) => selectProject(e.target.value)}
                className="text-xs font-semibold text-slate-800 bg-transparent border-none focus:outline-hidden focus:ring-0 cursor-pointer pr-4 max-w-[160px] sm:max-w-[280px] truncate"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.projectName}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Actions, Role Switcher, Database status, Notifications */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        {/* Supabase / Live DB or Demo indicator */}
        <div className="hidden md:flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
          <Database className="w-3.5 h-3.5 text-blue-600" />
          <span>{isSupabaseConfigured ? 'Supabase Live' : 'Database Lokal'}</span>
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse ml-1" />
        </div>

        {/* Role Switcher */}
        <div className="relative">
          <button
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            className="flex items-center space-x-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition-colors"
          >
            <UserCheck className="w-3.5 h-3.5 text-blue-600" />
            <span className="hidden sm:inline font-semibold">{currentUser.role.replace('_', ' ')}</span>
            <ChevronDown className="w-3 h-3" />
          </button>

          {showRoleMenu && (
            <div className="absolute right-0 mt-2 w-72 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="px-3 py-1.5 border-b border-slate-100">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Simulasi Peran (Role)</p>
                <p className="text-xs font-medium text-slate-600">{currentUser.fullName}</p>
              </div>
              <div className="max-h-60 overflow-y-auto py-1">
                {roles.map((r) => (
                  <button
                    key={r.role}
                    onClick={() => {
                      switchUserRole(r.role);
                      setShowRoleMenu(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex flex-col hover:bg-slate-50 transition-colors ${
                      currentUser.role === r.role ? 'bg-blue-50/80 font-semibold text-blue-700' : 'text-slate-700'
                    }`}
                  >
                    <span>{r.label}</span>
                    <span className="text-[10px] text-slate-400 font-normal">{r.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifMenu(!showNotifMenu)}
            className="relative p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
            title="Pemberitahuan"
          >
            <Bell className="w-5 h-5" />
            {unreadNotifs > 0 && (
              <span className="absolute top-1 right-1 flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-rose-500 rounded-full">
                {unreadNotifs}
              </span>
            )}
          </button>

          {showNotifMenu && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="px-3 py-2 border-b border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">Pemberitahuan K3</span>
                <span className="text-[10px] text-slate-400">{state.notifications.length} Catatan</span>
              </div>
              <div className="max-h-64 overflow-y-auto divide-y divide-slate-100">
                {state.notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => {
                      if (n.linkTo) onNavigate(n.linkTo);
                      setShowNotifMenu(false);
                    }}
                    className="p-3 hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <p className="text-xs font-semibold text-slate-800">{n.title}</p>
                      <span className="text-[10px] text-slate-400">{n.timestamp}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-0.5">{n.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Reset Demo Button */}
        <button
          onClick={resetToDemoData}
          title="Reset Data Demo"
          className="hidden lg:flex items-center space-x-1 px-2.5 py-1.5 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
          <span>Reset Demo</span>
        </button>

        {/* Primary Action */}
        <button
          onClick={onOpenNewRKKModal}
          className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors"
        >
          <ShieldAlert className="w-4 h-4" />
          <span className="hidden sm:inline">RKK Baru</span>
        </button>
      </div>
    </header>
  );
};
