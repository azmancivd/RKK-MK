import React, { useState } from 'react';
import {
  Plus,
  ClipboardList,
  AlertTriangle,
  Camera,
  FileText,
  FileCheck2,
  X,
} from 'lucide-react';

interface MobileQuickActionProps {
  onNavigate: (view: string) => void;
  onOpenQuickForm?: (type: string) => void;
}

export const MobileQuickAction: React.FC<MobileQuickActionProps> = ({
  onNavigate,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const actions = [
    {
      id: 'monitoring-inspections',
      label: 'Inspeksi K3',
      icon: ClipboardList,
      color: 'bg-blue-600',
    },
    {
      id: 'monitoring-findings',
      label: 'Catat Temuan',
      icon: AlertTriangle,
      color: 'bg-amber-600',
    },
    {
      id: 'monitoring-photos',
      label: 'Foto Lapangan',
      icon: Camera,
      color: 'bg-emerald-600',
    },
    {
      id: 'monitoring-jsa',
      label: 'JSA Pekerjaan',
      icon: FileText,
      color: 'bg-purple-600',
    },
    {
      id: 'monitoring-permits',
      label: 'Izin Kerja (PTW)',
      icon: FileCheck2,
      color: 'bg-indigo-600',
    },
  ];

  const handleAction = (viewId: string) => {
    onNavigate(viewId);
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-5 right-5 z-40 lg:hidden">
      {/* Expanded Quick Buttons */}
      {isOpen && (
        <div className="flex flex-col items-end space-y-2.5 mb-3 animate-in fade-in slide-in-from-bottom-3 duration-200">
          {actions.map((act) => {
            const Icon = act.icon;
            return (
              <button
                key={act.id}
                onClick={() => handleAction(act.id)}
                className="flex items-center space-x-2 px-3.5 py-2 rounded-full shadow-lg text-white text-xs font-semibold backdrop-blur-xs transition-transform active:scale-95"
                style={{ backgroundColor: act.color.replace('bg-', '') }}
              >
                <div className={`w-7 h-7 rounded-full ${act.color} flex items-center justify-center text-white`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-slate-900 bg-white/95 px-2.5 py-1 rounded-full shadow-xs border border-slate-200 text-xs font-bold">
                  {act.label}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Main Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-xl transition-all duration-200 active:scale-95 ${
          isOpen ? 'bg-slate-800 rotate-45' : 'bg-blue-600 hover:bg-blue-700'
        }`}
        title="Aksi Cepat Lapangan"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Plus className="w-7 h-7" />}
      </button>
    </div>
  );
};
