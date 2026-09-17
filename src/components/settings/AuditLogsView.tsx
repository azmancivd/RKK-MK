import React, { useState } from 'react';
import {
  History,
  Search,
  Filter,
  ShieldCheck,
  Calendar,
  User,
  Clock,
} from 'lucide-react';
import { useAppStore } from '../../lib/store';

export const AuditLogsView: React.FC = () => {
  const { state } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState<string>('ALL');

  const logs = state.auditLogs || [];

  const filteredLogs = logs.filter((log) => {
    const matchSearch =
      log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.module.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.recordIdentifier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchAction = actionFilter === 'ALL' || log.action === actionFilter;
    return matchSearch && matchAction;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
            Jejak Rekam Akuntabilitas (ISO 19650 / SMKK)
          </span>
          <h1 className="text-xl font-black text-slate-900 mt-1 flex items-center space-x-2">
            <History className="w-5 h-5 text-blue-600" />
            <span>Audit Trail & Log Aktivitas Sistem</span>
          </h1>
          <p className="text-xs text-slate-500">
            Pencatatan menyeluruh setiap perubahan data, pengesahan dokumen RKK, penerbitan izin, dan perubahan hak akses
          </p>
        </div>
      </div>

      {/* Filter & Search */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari user, modul, nomor dokumen, atau deskripsi..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs border border-slate-200 rounded-lg bg-slate-50/50"
          />
        </div>

        <select
          value={actionFilter}
          onChange={(e) => setActionFilter(e.target.value)}
          className="text-xs px-3 py-1.5 border border-slate-200 rounded-lg bg-white text-slate-700 font-medium w-full sm:w-auto"
        >
          <option value="ALL">Semua Aksi</option>
          <option value="CREATE">CREATE (Tambah Data)</option>
          <option value="UPDATE">UPDATE (Perubahan)</option>
          <option value="APPROVE">APPROVE (Pengesahan)</option>
          <option value="REJECT">REJECT (Penolakan)</option>
          <option value="DELETE">DELETE (Penghapusan)</option>
        </select>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <th className="p-3 w-40">Waktu & Tanggal</th>
                <th className="p-3 w-48">Pengguna & Peran</th>
                <th className="p-3 w-28 text-center">Aksi</th>
                <th className="p-3 w-36">Modul</th>
                <th className="p-3 w-32 font-mono">No. Referensi</th>
                <th className="p-3">Uraian Aktivitas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/70">
                  <td className="p-3 text-[11px] text-slate-500 font-mono">
                    {log.timestamp ? new Date(log.timestamp).toLocaleString('id-ID') : '-'}
                  </td>
                  <td className="p-3">
                    <p className="font-bold text-slate-900">{log.userName}</p>
                    <span className="text-[10px] text-slate-400 font-medium">{log.userRole}</span>
                  </td>
                  <td className="p-3 text-center">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                        log.action === 'APPROVE'
                          ? 'bg-emerald-100 text-emerald-800'
                          : log.action === 'CREATE'
                          ? 'bg-blue-100 text-blue-800'
                          : log.action === 'UPDATE'
                          ? 'bg-amber-100 text-amber-800'
                          : log.action === 'REJECT'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {log.action}
                    </span>
                  </td>
                  <td className="p-3 font-semibold text-slate-800">{log.module}</td>
                  <td className="p-3 font-mono text-slate-600 text-[11px]">{log.recordIdentifier}</td>
                  <td className="p-3 text-slate-700">{log.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
