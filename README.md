# LATOTO Macro Center 2.0

Website tema gelap untuk menyimpan dan mengelola macro Perfect Keyboard / MTW secara online.

## Fitur
- Login + daftar hanya dengan nama dan password.
- Database PostgreSQL/Neon online per akun.
- Tambah, edit, hapus, cari, filter, copy macro.
- Import XML Perfect Keyboard / MTW.
- Import `.4pk` sebagai inspeksi teks; format 4PK adalah macro-set native Perfect Keyboard, sehingga XML export adalah jalur paling lengkap untuk ekstraksi browser.
- Export XML.
- Backup / Restore JSON.
- Tema gelap.
- Data antar perangkat tersimpan di cloud database, bukan IndexedDB lokal.

## Deploy ke Vercel
1. Upload/extract folder ini sebagai project Vercel.
2. Di Vercel, hubungkan database Neon/Postgres pada project.
3. Set environment variable `DATABASE_URL` dari database.
4. Set `SESSION_SECRET` dengan string acak panjang. (Versi ini tidak menaruh secret di kode.)
5. Jalankan isi `setup.sql` sekali di SQL Editor database.
6. Redeploy.

Vercel saat ini mendukung integrasi Neon/Postgres untuk project dan pengaturan environment variable di dashboard. Lihat dokumentasi resmi Vercel/Neon bila ingin menghubungkan database.

## Catatan 4PK
`.4pk` adalah Perfect Keyboard Macro Set. Format tersebut bukan XML publik biasa. Parser website melakukan ekstraksi teks yang dapat dibaca untuk inspeksi; bila macro penting memiliki trigger/step binary yang tidak terbaca, export `.4pk` ke XML dari Perfect Keyboard sebelum import.
