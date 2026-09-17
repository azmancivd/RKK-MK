import React from 'react';
import { RKKStatus, RiskLevel, PriorityLevel, FindingStatus, InspectionStatus, CertificateStatus } from '../../types';

interface StatusBadgeProps {
  status: string;
  type?: 'rkk' | 'risk' | 'priority' | 'finding' | 'inspection' | 'cert' | 'generic';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, type = 'generic' }) => {
  let colorClasses = 'bg-slate-100 text-slate-700 border-slate-200';

  if (type === 'rkk') {
    switch (status as RKKStatus) {
      case 'DRAFT':
        colorClasses = 'bg-amber-50 text-amber-700 border-amber-200';
        break;
      case 'IN_REVIEW':
        colorClasses = 'bg-blue-50 text-blue-700 border-blue-200';
        break;
      case 'REVISION_REQUIRED':
        colorClasses = 'bg-rose-50 text-rose-700 border-rose-200';
        break;
      case 'APPROVED_INTERNAL':
        colorClasses = 'bg-cyan-50 text-cyan-700 border-cyan-200';
        break;
      case 'SUBMITTED':
        colorClasses = 'bg-indigo-50 text-indigo-700 border-indigo-200';
        break;
      case 'APPROVED':
        colorClasses = 'bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold';
        break;
      case 'FINAL':
        colorClasses = 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold';
        break;
    }
  } else if (type === 'risk' || type === 'priority') {
    switch (status) {
      case 'Kecil':
      case 'RENDAH':
        colorClasses = 'bg-emerald-50 text-emerald-700 border-emerald-200';
        break;
      case 'Sedang':
      case 'SEDANG':
        colorClasses = 'bg-amber-50 text-amber-700 border-amber-200';
        break;
      case 'Besar':
      case 'TINGGI':
        colorClasses = 'bg-orange-50 text-orange-700 border-orange-200';
        break;
      case 'Sangat Besar':
      case 'KRITIS':
        colorClasses = 'bg-rose-100 text-rose-800 border-rose-300 font-bold';
        break;
    }
  } else if (type === 'finding') {
    switch (status as FindingStatus) {
      case 'OPEN':
        colorClasses = 'bg-rose-50 text-rose-700 border-rose-200';
        break;
      case 'IN_PROGRESS':
        colorClasses = 'bg-amber-50 text-amber-700 border-amber-200';
        break;
      case 'SUBMITTED':
        colorClasses = 'bg-blue-50 text-blue-700 border-blue-200';
        break;
      case 'VERIFIED':
        colorClasses = 'bg-teal-50 text-teal-700 border-teal-200';
        break;
      case 'CLOSED':
        colorClasses = 'bg-slate-100 text-slate-700 border-slate-300';
        break;
    }
  } else if (type === 'cert') {
    switch (status as CertificateStatus) {
      case 'AKTIF':
        colorClasses = 'bg-emerald-50 text-emerald-700 border-emerald-200';
        break;
      case 'AKAN_BERAKHIR':
        colorClasses = 'bg-amber-50 text-amber-700 border-amber-200';
        break;
      case 'KEDALUWARSA':
        colorClasses = 'bg-rose-50 text-rose-700 border-rose-200';
        break;
    }
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${colorClasses} whitespace-nowrap`}
    >
      {status.replace(/_/g, ' ')}
    </span>
  );
};
