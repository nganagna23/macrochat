# LATOTO Macro Center 2.0 — Dark Online

Website tema gelap untuk menyimpan dan mengelola macro Perfect Keyboard / MTW secara online.

## Fitur
- Daftar/login hanya dengan nama dan password.
- Penyimpanan macro online per akun menggunakan PostgreSQL/Neon.
- Tambah, edit, hapus, cari, filter, copy macro.
- Import XML Perfect Keyboard / MTW.
- Import `.4pk` dengan ekstraksi teks yang terbaca sebagai **mode inspeksi**.
- Export XML.
- Backup / Restore JSON.
- Tema gelap responsive desktop/mobile.
- Session login menggunakan cookie HTTP-only.
- Schema database otomatis dibuat saat API pertama kali dipanggil.

## Upload ke Vercel
1. Extract ZIP ini.
2. Upload folder project ke Vercel atau import repository tersebut.
3. Hubungkan database Neon/Postgres ke project.
4. Pastikan salah satu environment variable berikut tersedia: `DATABASE_URL`, `POSTGRES_URL`, atau `POSTGRES_PRISMA_URL`.
5. Redeploy.

Tidak perlu menjalankan `setup.sql` secara manual karena API akan membuat tabel yang diperlukan secara otomatis. File `setup.sql` tetap disertakan sebagai opsi backup/manual.

## Catatan `.4pk`
`.4pk` adalah format native Perfect Keyboard. Parser web tidak berpura-pura mengetahui struktur proprietary binary secara penuh. Website mengambil string yang dapat dibaca untuk inspeksi dan menyimpannya sebagai entri. Untuk import macro secara lengkap, export macro dari Perfect Keyboard ke XML terlebih dahulu, lalu gunakan Import XML.
