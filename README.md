# LATOTO Macro Center

Static/PWA website ready for Vercel or any static hosting.

## Fitur
- Import `.xml` Perfect Keyboard / MTW langsung dari `<mtw_export_macros>`.
- Ambil `macroText` dan `trigger/tscut`.
- Macro tanpa `tscut` tetap disimpan dengan raw hotkey metadata (`hk`, `hklp`, `hkx`, `hkxlp`, `ktflags`, `trigtype`).
- Import `.txt` dari format daftar Macro/Trigger/MacroText.
- CRUD: tambah, edit, hapus satu, hapus semua.
- Search trigger/hotkey/nama/isi.
- Filter text trigger/hotkey/none.
- Copy macro.
- Export TXT / JSON dan restore JSON.
- IndexedDB agar dataset besar lebih aman daripada localStorage.
- PWA sederhana untuk pemasangan di Android.
- File `.4pk` diterima dan dikenali sebagai file 4PK/OLE bila signature-nya cocok; native extraction sengaja belum dilakukan tanpa sample 4PK nyata untuk memverifikasi struktur internal.

## Deploy ke Vercel
Upload folder ini sebagai project static. Tidak membutuhkan build command.

## LiveChat bridge
Website ini menyiapkan database/ekspor JSON sebagai fondasi. Untuk mengisi DOM `chat-latoto.hokibgs.com`, gunakan userscript/extension terpisah karena browser tidak mengizinkan halaman website biasa mengendalikan DOM cross-origin.
