/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Sidebar } from './components/common/Sidebar';
import { Header } from './components/common/Header';
import { Dashboard } from './components/dashboard/Dashboard';
import { ProjectsList } from './components/projects/ProjectsList';
import { ProjectDetail } from './components/projects/ProjectDetail';
import { ProjectModal } from './components/projects/ProjectModal';
import { RKKDocumentView } from './components/rkk/RKKDocumentView';
import { Bab1Commitment } from './components/rkk/Bab1Commitment';
import { Bab2Planning } from './components/rkk/Bab2Planning';
import { Bab3Support } from './components/rkk/Bab3Support';
import { Bab4Operations } from './components/rkk/Bab4Operations';
import { Bab5Evaluation } from './components/rkk/Bab5Evaluation';
import { RKKValidation } from './components/rkk/RKKValidation';
import { RKKPrintA4 } from './components/rkk/RKKPrintA4';
import { InspectionsList } from './components/monitoring/InspectionsList';
import { FindingsList } from './components/monitoring/FindingsList';
import { JSAList } from './components/monitoring/JSAList';
import { PermitsList } from './components/monitoring/PermitsList';
import { SafetyPhotosView } from './components/monitoring/SafetyPhotosView';
import { WeeklyReportsView } from './components/reports/WeeklyReportsView';
import { MonthlyReportsView } from './components/reports/MonthlyReportsView';
import { TestingCommissioningView } from './components/reports/TestingCommissioningView';
import { FinalEvaluationView } from './components/reports/FinalEvaluationView';
import { CompanyProfileView } from './components/settings/CompanyProfileView';
import { AuditLogsView } from './components/settings/AuditLogsView';
import { AppSettingsView } from './components/settings/AppSettingsView';
import { useAppStore } from './lib/store';
import { Project } from './types';

export default function App() {
  const { currentProject, selectProject } = useAppStore();
  const [activeView, setActiveView] = useState<string>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState<Project | undefined>(undefined);

  const handleOpenNewProject = () => {
    setProjectToEdit(undefined);
    setIsProjectModalOpen(true);
  };

  const handleOpenEditProject = () => {
    setProjectToEdit(currentProject);
    setIsProjectModalOpen(true);
  };

  // Dedicated full-screen printable document view
  if (activeView === 'print-rkk') {
    return (
      <div className="min-h-screen bg-slate-100 antialiased">
        <RKKPrintA4 onBack={() => setActiveView('rkk-document')} />
      </div>
    );
  }

  const renderActiveView = () => {
    switch (activeView) {
      case 'dashboard':
        return (
          <Dashboard
            onNavigate={setActiveView}
            onOpenNewRKKModal={handleOpenNewProject}
          />
        );

      case 'projects-list':
        return (
          <ProjectsList
            onSelectProject={(projectId) => {
              selectProject(projectId);
              setActiveView('project-detail');
            }}
            onOpenCreateProject={handleOpenNewProject}
          />
        );

      case 'project-detail':
        return (
          <ProjectDetail
            onNavigate={setActiveView}
            onOpenEditModal={handleOpenEditProject}
          />
        );

      case 'rkk-document':
        return <RKKDocumentView onNavigate={setActiveView} />;

      case 'rkk-commitments':
        return <Bab1Commitment />;

      case 'rkk-planning':
        return <Bab2Planning />;

      case 'rkk-support':
        return <Bab3Support />;

      case 'rkk-operations':
        return <Bab4Operations />;

      case 'rkk-evaluation':
        return <Bab5Evaluation />;

      case 'rkk-validation':
        return <RKKValidation onNavigate={setActiveView} />;

      case 'monitoring-inspections':
        return <InspectionsList />;

      case 'monitoring-findings':
        return <FindingsList />;

      case 'monitoring-jsa':
        return <JSAList />;

      case 'monitoring-permits':
        return <PermitsList />;

      case 'monitoring-photos':
        return <SafetyPhotosView />;

      case 'reports-weekly':
        return <WeeklyReportsView />;

      case 'reports-monthly':
        return <MonthlyReportsView />;

      case 'reports-testing':
        return <TestingCommissioningView />;

      case 'reports-final':
        return <FinalEvaluationView />;

      case 'company-profile':
        return <CompanyProfileView />;

      case 'audit-logs':
        return <AuditLogsView />;

      case 'app-settings':
        return <AppSettingsView />;

      default:
        return (
          <Dashboard
            onNavigate={setActiveView}
            onOpenNewRKKModal={handleOpenNewProject}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col antialiased">
      {/* Top Header */}
      <Header
        onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
        onOpenNewRKKModal={handleOpenNewProject}
        onNavigate={setActiveView}
      />

      {/* Main Body with Sidebar */}
      <div className="flex-1 flex overflow-hidden">
        {/* Navigation Sidebar */}
        <Sidebar
          activeView={activeView}
          onSelectView={setActiveView}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Content View Container */}
        <main
          id="main-content-area"
          className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 transition-all"
        >
          <div className="max-w-7xl mx-auto">
            {renderActiveView()}
          </div>
        </main>
      </div>

      {/* Project Create / Edit Modal */}
      {isProjectModalOpen && (
        <ProjectModal
          isOpen={isProjectModalOpen}
          onClose={() => {
            setIsProjectModalOpen(false);
            setProjectToEdit(undefined);
          }}
          projectToEdit={projectToEdit}
        />
      )}
    </div>
  );
}

