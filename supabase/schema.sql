-- ==============================================================================
-- RKK-MK (Sistem Manajemen Rencana Keselamatan Konstruksi Pengawasan / MK)
-- Sesuai Permen PUPR No. 10 Tahun 2021 Lampiran D.1
-- PostgreSQL / Supabase Schema Definition with Row Level Security (RLS)
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. COMPANIES
CREATE TABLE IF NOT EXISTS public.companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  business_entity VARCHAR(50) DEFAULT 'PT',
  nib VARCHAR(50),
  address TEXT NOT NULL,
  province VARCHAR(100) NOT NULL,
  regency VARCHAR(100) NOT NULL,
  district VARCHAR(100),
  phone VARCHAR(50) NOT NULL,
  email VARCHAR(100) NOT NULL,
  website VARCHAR(255),
  director_name VARCHAR(150) NOT NULL,
  authorized_rep_name VARCHAR(150) NOT NULL,
  logo_url TEXT,
  signature_url TEXT,
  stamp_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. PROFILES (Users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'INSPECTOR_ENGINEER',
  company_id UUID REFERENCES public.companies(id) ON DELETE SET NULL,
  avatar_url TEXT,
  phone_number VARCHAR(50),
  position VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. PROJECTS
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  package_title TEXT NOT NULL,
  project_name TEXT NOT NULL,
  location TEXT NOT NULL,
  province VARCHAR(100) NOT NULL,
  regency VARCHAR(100) NOT NULL,
  district VARCHAR(100),
  village VARCHAR(100),
  funding_source VARCHAR(100) NOT NULL,
  budget_year VARCHAR(10) NOT NULL,
  contract_number VARCHAR(100) NOT NULL,
  contract_date DATE NOT NULL,
  contract_value NUMERIC(18, 2) NOT NULL DEFAULT 0,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  execution_period_days INT NOT NULL,
  maintenance_period_days INT DEFAULT 180,
  status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
  
  -- Pihak Pengguna Jasa
  client_institution VARCHAR(255) NOT NULL,
  client_officer_name VARCHAR(255) NOT NULL,
  client_officer_position VARCHAR(150) NOT NULL,
  client_officer_nip VARCHAR(50),
  client_officer_phone VARCHAR(50),
  
  -- PPK
  ppk_name VARCHAR(255) NOT NULL,
  ppk_nip VARCHAR(50),
  ppk_position VARCHAR(150),
  ppk_phone VARCHAR(50),
  
  -- Penyedia Jasa Kontraktor
  contractor_name VARCHAR(255) NOT NULL,
  contractor_director VARCHAR(255),
  contractor_phone VARCHAR(50),
  contractor_address TEXT,
  
  -- Konsultan Pengawasan / MK
  consultant_name VARCHAR(255) NOT NULL,
  team_leader_name VARCHAR(255) NOT NULL,
  consultant_phone VARCHAR(50),
  
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. RKK DOCUMENTS
CREATE TABLE IF NOT EXISTS public.rkk_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  document_number VARCHAR(100) NOT NULL,
  rkk_number VARCHAR(100) NOT NULL,
  version VARCHAR(20) NOT NULL DEFAULT 'Rev.00',
  document_date DATE NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'DRAFT',
  prepared_by VARCHAR(150) NOT NULL,
  reviewed_by VARCHAR(150) NOT NULL,
  approved_by VARCHAR(150) NOT NULL,
  revision_notes TEXT,
  is_locked BOOLEAN DEFAULT FALSE,
  qr_verification_code VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. RKK COMMITMENTS (Bab 1)
CREATE TABLE IF NOT EXISTS public.rkk_commitments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  rkk_id UUID NOT NULL REFERENCES public.rkk_documents(id) ON DELETE CASCADE,
  company_name VARCHAR(255) NOT NULL,
  package_name TEXT NOT NULL,
  city VARCHAR(100) NOT NULL,
  commitment_date DATE NOT NULL,
  head_supervisor_name VARCHAR(255) NOT NULL,
  head_supervisor_position VARCHAR(150) NOT NULL,
  signature_url TEXT,
  commitment_points JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. HAZARD IDENTIFICATIONS & RISK CONTROLS (Bab 2.1)
CREATE TABLE IF NOT EXISTS public.hazard_identifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  rkk_id UUID NOT NULL REFERENCES public.rkk_documents(id) ON DELETE CASCADE,
  order_number INT NOT NULL,
  activity_description TEXT NOT NULL,
  work_stage VARCHAR(100) NOT NULL,
  supervision_activity TEXT NOT NULL,
  hazard_identification TEXT NOT NULL,
  risk_description TEXT NOT NULL,
  probability INT CHECK (probability BETWEEN 1 AND 5),
  severity INT CHECK (severity BETWEEN 1 AND 5),
  risk_score INT NOT NULL,
  risk_level VARCHAR(50) NOT NULL,
  initial_controls JSONB DEFAULT '[]'::jsonb,
  residual_probability INT,
  residual_severity INT,
  residual_risk_score INT,
  residual_risk_level VARCHAR(50),
  follow_up_controls TEXT,
  pic VARCHAR(150) NOT NULL,
  supporting_doc TEXT,
  status VARCHAR(50) DEFAULT 'SESUAI',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. REGULATIONS & STANDARDS (Bab 2.2)
CREATE TABLE IF NOT EXISTS public.regulations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  rkk_id UUID NOT NULL REFERENCES public.rkk_documents(id) ON DELETE CASCADE,
  order_number INT NOT NULL,
  method_description TEXT NOT NULL,
  regulation_title TEXT NOT NULL,
  number_and_year VARCHAR(100) NOT NULL,
  article_clause TEXT NOT NULL,
  notes TEXT,
  document_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. SUPERVISION TARGETS & PROGRAMS (Bab 2.3)
CREATE TABLE IF NOT EXISTS public.supervision_targets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  rkk_id UUID NOT NULL REFERENCES public.rkk_documents(id) ON DELETE CASCADE,
  order_number INT NOT NULL,
  activity_description TEXT NOT NULL,
  target TEXT NOT NULL,
  supervision_program TEXT NOT NULL,
  benchmark TEXT NOT NULL,
  pic VARCHAR(150) NOT NULL,
  schedule VARCHAR(100) NOT NULL,
  status VARCHAR(50) DEFAULT 'SEDANG_BERJALAN',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. PERSONNEL & CERTIFICATES (Bab 3.1)
CREATE TABLE IF NOT EXISTS public.personnel (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  nik VARCHAR(50),
  position VARCHAR(150) NOT NULL,
  education VARCHAR(100),
  field_of_expertise VARCHAR(150),
  years_of_experience INT DEFAULT 0,
  photo_url TEXT,
  cv_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.personnel_certificates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  personnel_id UUID NOT NULL REFERENCES public.personnel(id) ON DELETE CASCADE,
  certificate_number VARCHAR(100) NOT NULL,
  certificate_type VARCHAR(150) NOT NULL,
  issuing_body VARCHAR(150) NOT NULL,
  issue_date DATE NOT NULL,
  expiry_date DATE NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'AKTIF',
  file_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. SAFETY BUDGETS (Bab 3.2 - 9 Komponen SMKK)
CREATE TABLE IF NOT EXISTS public.safety_budgets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  rkk_id UUID NOT NULL REFERENCES public.rkk_documents(id) ON DELETE CASCADE,
  order_number INT NOT NULL,
  component_category VARCHAR(150) NOT NULL,
  item_description TEXT NOT NULL,
  volume NUMERIC(10, 2) NOT NULL DEFAULT 1,
  unit VARCHAR(50) NOT NULL,
  unit_price NUMERIC(15, 2) NOT NULL DEFAULT 0,
  total_price NUMERIC(15, 2) NOT NULL DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. ORGANIZATION MEMBERS & STRUCTURE (Bab 4.1)
CREATE TABLE IF NOT EXISTS public.organization_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  rkk_id UUID NOT NULL REFERENCES public.rkk_documents(id) ON DELETE CASCADE,
  position_title VARCHAR(150) NOT NULL,
  personnel_name VARCHAR(255) NOT NULL,
  reports_to_position VARCHAR(150),
  duties JSONB DEFAULT '[]'::jsonb,
  responsibilities JSONB DEFAULT '[]'::jsonb,
  authorities JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. SAFETY DOCUMENTS & SOPs (Bab 4.2)
CREATE TABLE IF NOT EXISTS public.safety_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  category VARCHAR(50) NOT NULL,
  doc_number VARCHAR(100) NOT NULL,
  title VARCHAR(255) NOT NULL,
  revision VARCHAR(20) DEFAULT '00',
  effective_date DATE NOT NULL,
  prepared_by VARCHAR(150) NOT NULL,
  reviewed_by VARCHAR(150) NOT NULL,
  approved_by VARCHAR(150) NOT NULL,
  status VARCHAR(50) DEFAULT 'APPROVED',
  file_url TEXT,
  content_summary TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. INSPECTIONS & PHOTOS (Bab 5 & Monitoring)
CREATE TABLE IF NOT EXISTS public.inspections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  inspection_number VARCHAR(100) NOT NULL,
  inspection_date DATE NOT NULL,
  location TEXT NOT NULL,
  activity TEXT NOT NULL,
  inspector_name VARCHAR(150) NOT NULL,
  condition_description TEXT NOT NULL,
  findings TEXT,
  identified_risk TEXT,
  corrective_action TEXT,
  pic VARCHAR(150),
  deadline DATE,
  status VARCHAR(50) DEFAULT 'OPEN',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.inspection_photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  inspection_id UUID REFERENCES public.inspections(id) ON DELETE CASCADE,
  photo_url TEXT NOT NULL,
  caption TEXT,
  photo_date DATE,
  location TEXT,
  coordinates VARCHAR(100),
  uploader_name VARCHAR(150),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. FINDINGS & CORRECTIVE ACTIONS
CREATE TABLE IF NOT EXISTS public.findings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  finding_number VARCHAR(100) NOT NULL,
  finding_date DATE NOT NULL,
  source VARCHAR(50) NOT NULL,
  location TEXT NOT NULL,
  description TEXT NOT NULL,
  priority VARCHAR(50) NOT NULL DEFAULT 'SEDANG',
  pic VARCHAR(150) NOT NULL,
  deadline DATE NOT NULL,
  corrective_action_plan TEXT NOT NULL,
  completion_proof_url TEXT,
  completion_date DATE,
  verifier_name VARCHAR(150),
  status VARCHAR(50) DEFAULT 'OPEN',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. JOB SAFETY ANALYSIS (JSA)
CREATE TABLE IF NOT EXISTS public.jsa (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  jsa_number VARCHAR(100) NOT NULL,
  job_name VARCHAR(255) NOT NULL,
  work_stage VARCHAR(100) NOT NULL,
  location TEXT NOT NULL,
  jsa_date DATE NOT NULL,
  prepared_by VARCHAR(150) NOT NULL,
  reviewed_by VARCHAR(150) NOT NULL,
  approved_by VARCHAR(150) NOT NULL,
  items JSONB DEFAULT '[]'::jsonb,
  status VARCHAR(50) DEFAULT 'APPROVED',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 16. WORK PERMITS (Izin Kerja)
CREATE TABLE IF NOT EXISTS public.work_permits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  permit_number VARCHAR(100) NOT NULL,
  permit_type VARCHAR(50) NOT NULL,
  location TEXT NOT NULL,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  applicant_name VARCHAR(150) NOT NULL,
  contractor_team VARCHAR(150) NOT NULL,
  workers_count INT DEFAULT 1,
  safety_checklist JSONB DEFAULT '[]'::jsonb,
  required_apd JSONB DEFAULT '[]'::jsonb,
  supervisor_sign TEXT,
  safety_officer_sign TEXT,
  client_approver_sign TEXT,
  status VARCHAR(50) DEFAULT 'APPROVED',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 17. REPORTS & TESTING
CREATE TABLE IF NOT EXISTS public.weekly_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  report_number VARCHAR(100) NOT NULL,
  week_number INT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  supervision_activities_summary TEXT NOT NULL,
  inspections_count INT DEFAULT 0,
  open_findings_count INT DEFAULT 0,
  closed_findings_count INT DEFAULT 0,
  permits_issued_count INT DEFAULT 0,
  safe_man_hours NUMERIC(10, 1) DEFAULT 0,
  incident_count INT DEFAULT 0,
  recommendations TEXT,
  prepared_by VARCHAR(150) NOT NULL,
  approved_by VARCHAR(150) NOT NULL,
  status VARCHAR(50) DEFAULT 'APPROVED',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.monthly_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  report_number VARCHAR(100) NOT NULL,
  month_name VARCHAR(50) NOT NULL,
  executive_summary TEXT NOT NULL,
  severity_rate NUMERIC(8, 2) DEFAULT 0,
  frequency_rate NUMERIC(8, 2) DEFAULT 0,
  zero_accident_status BOOLEAN DEFAULT TRUE,
  inspections_summary TEXT,
  findings_analysis TEXT,
  testing_commissioning_summary TEXT,
  kpi_score NUMERIC(5, 2) DEFAULT 88.5,
  recommendations TEXT,
  prepared_by VARCHAR(150) NOT NULL,
  approved_by VARCHAR(150) NOT NULL,
  status VARCHAR(50) DEFAULT 'APPROVED',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.testing_commissioning (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  item_number VARCHAR(100) NOT NULL,
  work_description TEXT NOT NULL,
  test_date DATE NOT NULL,
  location TEXT NOT NULL,
  method TEXT NOT NULL,
  applied_standard TEXT NOT NULL,
  test_result VARCHAR(50) NOT NULL,
  certificate_or_doc_ref TEXT,
  notes TEXT,
  recommendations TEXT,
  inspector_name VARCHAR(150) NOT NULL,
  status VARCHAR(50) DEFAULT 'COMPLETED',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.final_evaluations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  completion_date DATE NOT NULL,
  overall_compliance_score NUMERIC(5, 2) DEFAULT 92.0,
  total_inspections INT DEFAULT 0,
  total_findings INT DEFAULT 0,
  resolved_findings INT DEFAULT 0,
  zero_accident_achieved BOOLEAN DEFAULT TRUE,
  environmental_compliance TEXT,
  final_recommendations TEXT,
  evaluator_name VARCHAR(150) NOT NULL,
  client_review_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 18. AUDIT LOGS & NOTIFICATIONS
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_name VARCHAR(150) NOT NULL,
  user_role VARCHAR(50) NOT NULL,
  action VARCHAR(50) NOT NULL,
  module VARCHAR(100) NOT NULL,
  record_identifier TEXT,
  description TEXT NOT NULL,
  ip_address VARCHAR(50),
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) DEFAULT 'INFO',
  is_read BOOLEAN DEFAULT FALSE,
  link_to TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rkk_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rkk_commitments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hazard_identifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.regulations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supervision_targets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.personnel ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.personnel_certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.safety_budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.safety_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inspections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.findings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jsa ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.work_permits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weekly_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.monthly_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testing_commissioning ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.final_evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Base Policies (Users can read and write within their own company and assigned projects)
CREATE POLICY "Users view company data" ON public.companies
  FOR SELECT USING (true);

CREATE POLICY "Users view their own company projects" ON public.projects
  FOR ALL USING (
    auth.uid() IS NOT NULL AND (
      EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid()
        AND (profiles.role = 'SUPER_ADMIN' OR profiles.company_id = projects.company_id)
      )
    )
  );

CREATE POLICY "Users view related RKK" ON public.rkk_documents
  FOR ALL USING (
    auth.uid() IS NOT NULL AND (
      EXISTS (
        SELECT 1 FROM public.projects
        JOIN public.profiles ON profiles.company_id = projects.company_id
        WHERE projects.id = rkk_documents.project_id
        AND profiles.id = auth.uid()
      )
    )
  );
