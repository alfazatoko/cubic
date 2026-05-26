const fs = require('fs');
const content = fs.readFileSync('../SUPERPOWER.md', 'utf8');

const appendix = `

---

## 💡 10. Kebiasaan Khusus Developer & Arsitektur Terkini (Log Pembaruan)
Bagian ini berisi kebiasaan khusus dan arsitektur terbaru yang disepakati dari sesi-sesi sebelumnya:

* **Sistem Kategori Dinamis:** Aplikasi kini menggunakan sistem kategori dinamis yang bisa diubah oleh Owner (tidak lagi *hardcode*). 
  * Data kategori disimpan di localStorage \`alphaPro_categories\`.
  * Konfigurasi tipe kolom (apakah menggunakan 'Nominal & Admin' atau 'Modal & Jual') disimpan di \`alphaPro_categories_config\`. 
  * Untuk mengambil data kategori ini secara global, gunakan fungsi helper \`getCategories()\` dan \`getCategoriesConfig()\` dari \`src/lib/utils.ts\`.
* **Protokol Penamaan Kunci Penyimpanan (*Storage Keys*):** Meskipun nama toko telah di-*rebrand* menjadi **CUBIC CLOUD / KASIR CUBIC**, **DILARANG KERAS** mengubah *prefix* (awalan) kunci \`localStorage\` yang sudah ada (misalnya \`alphaPro_...\` atau \`alfaza_...\`). Mengubah ini akan menyebabkan hilangnya seluruh data transaksi, laporan, dan riwayat yang disimpan secara lokal oleh toko.
* **Manajemen Aset & Ikon:** Jika ada perubahan logo atau ikon utama (misal \`public/icon.png\`), wajib mengeksekusi \`npx @capacitor/assets generate\` agar logo Android dan PWA icons (manifest) terbarui secara otomatis dan sinkron secara menyeluruh.`;

fs.writeFileSync('../SUPERPOWER.md', content + appendix, 'utf8');
console.log('SUPERPOWER.md updated!');
