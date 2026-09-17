# Panduan Setup Database Supabase - RKK-MK

Aplikasi **RKK-MK** (Sistem Manajemen Rencana Keselamatan Konstruksi Konsultansi Pengawasan / Manajemen Penyelenggaraan Konstruksi) menggunakan PostgreSQL melalui Supabase.

## Langkah Konfigurasi

1. Buat proyek baru di [Supabase Dashboard](https://supabase.com).
2. Buka menu **SQL Editor** pada dashboard Supabase.
3. Buka file `supabase/schema.sql` pada proyek ini, salin seluruh isi skrip, tempelkan ke SQL Editor Supabase, lalu jalankan (**Run**).
4. (Opsional) Jalankan juga isi skrip `supabase/seed.sql` untuk data inisial.
5. Buka menu **Project Settings** > **API** di Supabase:
   - Salin **Project URL**
   - Salin **anon public key**
6. Pada environment file `.env` atau pengaturan Vercel / Google AI Studio:
   ```env
   VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
7. Aplikasi siap digunakan baik dengan live Supabase maupun mode simulasi terintegrasi.
