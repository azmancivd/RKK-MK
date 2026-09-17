-- Seed data for Master Data and sample company/project template
-- Permen PUPR No. 10 Tahun 2021 Lampiran D.1

INSERT INTO public.companies (
  id, name, business_entity, nib, address, province, regency, district, phone, email, website, director_name, authorized_rep_name
) VALUES (
  'a0000000-0000-0000-0000-000000000001',
  'PT Mitra Pengawas Konstruksi Prima',
  'PT',
  '9120003456789',
  'Jl. Sudirman No. 45, Gedung Graha Rekayasa Lt. 4',
  'DKI Jakarta',
  'Jakarta Selatan',
  'Setiabudi',
  '021-5234567',
  'info@mitrapengawas.co.id',
  'https://mitrapengawas.co.id',
  'Ir. Bambang Trihatmojo, M.Eng.',
  'Ir. Hendra Wijaya, ST., MT.'
) ON CONFLICT (id) DO NOTHING;
