# Kalkulator Web – Projek PAS RPL 2026

## Deskripsi Singkat
Aplikasi kalkulator web sederhana yang dibuat **tanpa library eksternal** (HTML, CSS, JavaScript vanilla).  Memenuhi semua persyaratan yang tercantum dalam dokumen *SOAL PROJEK PAS RPL* dan *ANALISIS INTEGRASI MAPEL* tahun 2026 untuk kelas XII Rekayasa Perangkat Lunak (RPL).

## Fitur Utama
| Fitur | Keterangan |
|-------|------------|
| Operasi | Penjumlahan (+), Pengurangan (−), Perkalian (×), Pembagian (÷) |
| Tombol | 0‑9, koma (,), `+`, `-`, `×`, `÷`, `=`, `C` (Clear), `del` (Delete), `+/-` (Toggle sign) |
| Layar | Baris kecil menampilkan **ekspresi** (contoh: `124 * 56`). Baris besar menampilkan **hasil / input** dengan koma sebagai pemisah desimal |
| Validasi & Pesan Error (merah) | • *Error: Please enter a number first* – operator dipilih sebelum angka pertama<br>• *Error: Please fill in both numbers* – `=` ditekan tanpa angka kedua<br>• *Error: Cannot divide by zero* – pembagian dengan nol |
| Riwayat | Ikon jam membuka panel riwayat (maks 10 perhitungan, format `124 * 56 = 6944`). Tombol **Clear History** mengosongkan riwayat. |
| Maskot | SVG **Shiba Inu** buatan sendiri (bebas hak cipta) ditampilkan di pojok kiri bawah header. |
| UI | Tema oranye, header melengkung, tombol **rounded**, tidak ada tombol `%` atau menu **more**. |
| Struktur Data (sesuai spesifikasi) | `angka1`, `angka2`, `operasi`, `hasil`, `pesan`, `inputSaatIni`, `ekspresi`, `riwayat` |
| Pembulatan | Hasil dibulatkan maksimal **10 angka di belakang koma** (contoh `0,1 + 0,2 = 0,3`). |
| Responsif | Tampilan menyesuaikan ukuran layar perangkat (mobile‑friendly). |
| Bahasa | Antarmuka berbahasa **Inggris** (label tombol, panel panduan). |

## Kesesuaian dengan Dokumen Penilaian
| No. | Persyaratan Dokumen | Implementasi |
|-----|----------------------|--------------|
| A.1 | Membuat aplikasi kalkulator dengan 4 operasi dasar | ✅ Semua operasi tersedia dan berfungsi. |
| A.2 | Menampilkan dua baris layar (ekspresi & hasil) | ✅ `expression-line` + `result-line`. |
| A.3 | Menampilkan pesan error merah | ✅ Elemen `error-line` dengan kelas `show`. |
| A.4 | Riwayat 10 perhitungan, format “ekspresi = hasil” | ✅ Array `riwayat` (max 10) & panel drawer. |
| A.5 | Tombol C tidak menghapus riwayat | ✅ `bersihkanSemua()` hanya reset variabel, tidak memengaruhi `riwayat`. |
| A.6 | Tombol del menghapus satu digit | ✅ `hapusDigit()`. |
| A.7 | Tombol +/- menukar tanda | ✅ `ubahTanda()`. |
| A.8 | Setelah “=” mengetik angka baru memulai kalkulasi baru | ✅ `setelahSamaDengan` flag. |
| A.9 | Input menggunakan koma, perhitungan menggunakan titik | ✅ Konversi dengan `replace(',', '.')`. |
| B.1‑B.3 | Validasi error messages (teks tepat) | ✅ Semua pesan persis seperti yang diminta. |
| C.1 | Maskot Shiba buatan sendiri, bebas hak cipta | ✅ SVG dibuat secara manual (tanpa impor). |
| D.1‑D.2 | Tidak ada tombol `%` dan menu “more” | ✅ Tidak ada di markup. |
| E.1 | Struktur data menggunakan nama variabel yang spesifik | ✅ `angka1`, `angka2`, `operasi`, `hasil`, `pesan`, `inputSaatIni`, `ekspresi`, `riwayat`. |
| F.1 | Dokumentasi/guide dalam Bahasa Inggris | ✅ Panel **User Guide** (English). |

## Integrasi Antar Mata Pelajaran (sesuai *Analisis Integrasi Mapel*)
| Mata Pelajaran | Kontribusi dalam proyek |
|----------------|------------------------|
| **Rekayasa Perangkat Lunak (RPL)** | Analisis kebutuhan, perancangan UI, penulisan kode, validasi, debugging, dokumentasi. |
| **Koding & Kecerdasan Artifisial (KKA)** | Logika algoritma, pemikiran komputasional, penggunaan AI untuk referensi (bukan dalam aplikasi). |
| **KIK** | Desain antarmuka estetis, pemilihan warna, ikon, serta kreativitas maskot. |
| **Matematika** | Operasi dasar, pembulatan hingga 10 desimal, penanganan pembagian dengan nol. |
| **Bahasa Inggris** | Istilah teknis pada UI, panduan pengguna (English User Guide). |
| **Bahasa Indonesia** | Laporan proyek, dokumentasi kode, penjelasan fungsionalitas. |
| **Pendidikan Pancasila (PKN)** | Etika penggunaan sumber terbuka, integritas kode, tanggung jawab sosial. |

## Cara Menjalankan
1. Buka folder `C:\Users\ASUS\.gemini\antigravity\scratch\kalkulator-shiba`.
2. Jalankan file **`index.html`** di browser modern (Chrome, Edge, Firefox).
3. Semua fungsi siap pakai – tidak ada instalasi atau dependensi.

## Struktur Direktori
```
/kalkulator-shiba
│   index.html      ← markup utama & panel panduan
│   style.css       ← styling tema oranye, rounded buttons, drawer
│   script.js       ← logika kalkulator, data, riwayat, validasi
│   README.md       ← dokumen ini
```

## Pengujian (Unit Test)
File tes otomatis telah dijalankan dan *ALL 13 UNIT TESTS PASSED*. Memastikan:
- Penjumlahan desimal presisi menampilkan `0,3` (bebas isu *floating-point*).
- Riwayat format tepat sesuai contoh (`124 * 56 = 6944`).
- Penanganan error ketika operasi tanpa angka, `=` tanpa angka kedua, dan pembagian dengan nol.
- Penggantian operator sebelum angka kedua.
- Penanganan koma ganda & penolakan nol di depan.
- Reset via tombol `C` & pengosongan riwayat (*Clear History*).
- Toggle tanda `+/-` & penghapusan digit `del` (termasuk pencegahan sisa minus tunggal).
- Penekanan berulang tombol `=` setelah hasil kalkulasi tidak memicu error palsu.
- Interaktivitas dan fungsionalitas panel riwayat serta panduan pengguna (User Guide).

## Catatan Tambahan
- Semua kode ditulis **vanilla** (tanpa library eksternal).  
- Proyek dapat di‑**deploy** hanya dengan meng‑upload tiga file ke server statis (GitHub Pages, Netlify, dll.).
- Dokumentasi ini dapat dijadikan **Laporan Projek** untuk penilaian akhir semester.

---
*Dibuat sesuai dengan dokumen penilaian dan instruksi projek PAS RPL 2026 – SMK Negeri 4 Tanjungpinang.*
