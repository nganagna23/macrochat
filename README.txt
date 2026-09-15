LATOTO Macro Center Online

1. Buat project di Supabase.
2. Buka SQL Editor, jalankan schema.sql.
3. Ambil Project URL dan publishable/anon key dari project Supabase.
4. Buka index.html lalu ganti:
   SUPABASE_URL = "GANTI_DENGAN_SUPABASE_URL"
   SUPABASE_ANON_KEY = "GANTI_DENGAN_SUPABASE_PUBLISHABLE_KEY"
5. Upload folder ini ke hosting static (Netlify, Vercel, GitHub Pages, Cloudflare Pages, atau hosting sendiri).
6. Buka website dari Android.
7. Daftar/login.
8. Import XML. Macro tersimpan online per akun.
9. Di perangkat lain, login dengan akun yang sama untuk melihat database yang sama.

Catatan:
- Frontend memakai @supabase/supabase-js v2 dari CDN.
- Jangan pernah memasukkan service_role key ke frontend. Gunakan publishable/anon key.
- RLS pada schema membatasi setiap akun hanya dapat membaca/menulis macro miliknya.
- Parser XML mempertahankan macro dengan tscut serta macro tanpa tscut memakai metadata hk/hklp/ktflags.
- 4PK native belum dimasukkan ke versi online ini; kebutuhan 4PK memerlukan file .4pk nyata untuk analisis format.
