/**
 * ==============================================================================
 * Shiba Calculator - Script (script.js)
 * Logika perhitungan kalkulator web dengan tema Shiba Inu.
 * ==============================================================================
 */

// ==============================================================================
// STRUKTUR DATA (Sesuai spesifikasi persis)
// ==============================================================================
let angka1 = null;           // (number) Nilai angka pertama
let angka2 = null;           // (number) Nilai angka kedua
let operasi = '';            // (string: + - * /) Operator matematika yang aktif
let hasil = null;            // (number) Hasil kalkulasi
let pesan = '';              // (string) Pesan validasi / error
let inputSaatIni = '';       // (string) Angka yang sedang diketik pengguna
let ekspresi = '';           // (string) Baris teks ekspresi operasi (contoh: "124 * 56")
let riwayat = [];            // (array) Daftar maksimal 10 riwayat perhitungan

// Flag pembantu untuk menandai apakah tombol '=' baru saja ditekan
let setelahSamaDengan = false;

// ==============================================================================
// ELEMEN DOM
// ==============================================================================
const elEkspresi = document.getElementById('baris-ekspresi');
const elHasil = document.getElementById('baris-hasil');
const elPesanError = document.getElementById('pesan-error');

// Panel Riwayat
const elPanelRiwayat = document.getElementById('panel-riwayat');
const elDaftarRiwayat = document.getElementById('daftar-riwayat');
const btnHistoryToggle = document.getElementById('btn-history-toggle');
const btnHistoryClose = document.getElementById('btn-history-close');
const btnClearHistory = document.getElementById('btn-clear-history');

// Panel Panduan Pengguna (User Guide)
const elPanelPanduan = document.getElementById('panel-panduan');
const btnGuideToggle = document.getElementById('btn-guide-toggle');
const btnGuideClose = document.getElementById('btn-guide-close');

// ==============================================================================
// FUNGSI VALIDASI
// ==============================================================================

/**
 * Memvalidasi apakah operasi dapat dipilih.
 * Error jika pengguna menekan operator sebelum memasukkan angka.
 * @returns {boolean} true jika valid, false jika gagal
 */
function validasiOperasi() {
    if (angka1 === null && (inputSaatIni === '' || inputSaatIni === '-')) {
        pesan = "Error: Please enter a number first";
        return false;
    }
    return true;
}

/**
 * Memvalidasi kondisi sebelum menghitung hasil dengan tombol '='.
 * Error jika angka kedua belum diisi atau terjadi pembagian dengan nol.
 * @returns {boolean} true jika valid, false jika gagal
 */
function validasiHitung() {
    // Validasi kelengkapan kedua angka
    if (angka1 === null || operasi === '' || inputSaatIni === '' || inputSaatIni === '-') {
        pesan = "Error: Please fill in both numbers";
        return false;
    }

    const nilaiAngka2 = konversiKeAngka(inputSaatIni);
    if (isNaN(nilaiAngka2)) {
        pesan = "Error: Please fill in both numbers";
        return false;
    }

    // Validasi pembagian dengan angka nol
    if (operasi === '/' && nilaiAngka2 === 0) {
        pesan = "Error: Cannot divide by zero";
        return false;
    }

    return true;
}

// ==============================================================================
// FUNGSI PERHITUNGAN DAN PEMBULATAN
// ==============================================================================

/**
 * Melakukan operasi aritmatika berdasarkan operasi yang dipilih (+, -, *, /).
 * Menggunakan struktur switch-case dan membulatkan maksimal 10 angka di belakang koma.
 */
function hitung() {
    switch (operasi) {
        case '+':
            hasil = angka1 + angka2;
            break;
        case '-':
            hasil = angka1 - angka2;
            break;
        case '*':
            hasil = angka1 * angka2;
            break;
        case '/':
            hasil = angka1 / angka2;
            break;
        default:
            hasil = angka2;
            break;
    }

    // Membulatkan maksimal 10 angka di belakang koma untuk menghindari floating-point precision issue
    // Contoh: 0.1 + 0.2 menghasilkan 0.3
    hasil = Math.round(hasil * 1e10) / 1e10;
}

// ==============================================================================
// FUNGSI FORMAT DAN KONVERSI
// ==============================================================================

/**
 * Mengonversi string input berformat koma menjadi number dengan titik untuk kalkulasi JS.
 * @param {string} strAngka
 * @returns {number}
 */
function konversiKeAngka(strAngka) {
    if (!strAngka || strAngka === '-') return 0;
    return parseFloat(strAngka.replace(',', '.'));
}

/**
 * Mengonversi number menjadi format tampilan dengan koma sebagai pemisah desimal.
 * @param {number|null} nilai
 * @returns {string}
 */
function formatTampilan(nilai) {
    if (nilai === null || nilai === undefined || isNaN(nilai)) return '0';
    if (Object.is(nilai, -0)) return '0';
    return nilai.toString().replace(/\./g, ',');
}

// ==============================================================================
// FUNGSI UPDATE TAMPILAN
// ==============================================================================

/**
 * Memperbarui tampilan layar kalkulator (baris ekspresi, baris hasil, pesan error).
 */
function updateTampilan() {
    // 1. Update baris ekspresi
    elEkspresi.textContent = ekspresi;

    // 2. Update baris hasil / input aktif
    let teksTampilan = '0';
    if (hasil !== null && inputSaatIni === '') {
        teksTampilan = formatTampilan(hasil);
    } else if (inputSaatIni !== '') {
        teksTampilan = inputSaatIni;
    } else if (angka1 !== null) {
        teksTampilan = formatTampilan(angka1);
    }
    elHasil.textContent = teksTampilan;

    // Penyesuaian ukuran font dinamis agar angka panjang tidak meluap
    if (teksTampilan.length > 13) {
        elHasil.style.fontSize = '24px';
    } else if (teksTampilan.length > 9) {
        elHasil.style.fontSize = '32px';
    } else {
        elHasil.style.fontSize = '44px';
    }

    // 3. Tampilkan atau sembunyikan pesan error merah
    if (pesan !== '') {
        elPesanError.textContent = pesan;
        elPesanError.classList.add('show');
    } else {
        elPesanError.textContent = '';
        elPesanError.classList.remove('show');
    }
}

/**
 * Membersihkan pesan error merah pada aksi tombol berikutnya.
 */
function bersihkanPesanError() {
    if (pesan !== '') {
        pesan = '';
    }
}

// ==============================================================================
// FUNGSI LOGIKA INPUT PENGGUNA
// ==============================================================================

/**
 * Menambahkan angka ke inputSaatIni.
 * Menolak nol di depan ganda, dan memulai kalkulasi baru setelah '='.
 * @param {string} digit - Karakter angka '0' - '9'
 */
function tambahAngka(digit) {
    bersihkanPesanError();

    // Jika setelah '=', mengetik angka baru memulai perhitungan baru
    if (setelahSamaDengan) {
        angka1 = null;
        angka2 = null;
        operasi = '';
        hasil = null;
        ekspresi = '';
        inputSaatIni = '';
        setelahSamaDengan = false;
    }

    // Tangani angka dengan tanda negatif di depan
    if (inputSaatIni === '-0') {
        if (digit === '0') {
            updateTampilan();
            return;
        }
        inputSaatIni = '-' + digit;
        updateTampilan();
        return;
    }

    // Tolak angka nol di depan ganda (contoh: "0" ditekan "0" tetap "0")
    if (inputSaatIni === '0') {
        if (digit === '0') {
            updateTampilan();
            return;
        }
        // Gantikan nol awal dengan angka 1-9 (menolak "05")
        inputSaatIni = digit;
        updateTampilan();
        return;
    }

    inputSaatIni += digit;
    updateTampilan();
}

/**
 * Menambahkan koma desimal ke inputSaatIni.
 * Menolak koma ganda.
 */
function tambahKoma() {
    bersihkanPesanError();

    // Jika setelah '=', mengetik koma memulai perhitungan baru dari "0,"
    if (setelahSamaDengan) {
        angka1 = null;
        angka2 = null;
        operasi = '';
        hasil = null;
        ekspresi = '';
        inputSaatIni = '0,';
        setelahSamaDengan = false;
        updateTampilan();
        return;
    }

    // Tolak koma ganda jika sudah ada koma
    if (inputSaatIni.includes(',')) {
        updateTampilan();
        return;
    }

    // Jika input masih kosong, awali dengan "0,"
    if (inputSaatIni === '') {
        inputSaatIni = '0,';
    } else if (inputSaatIni === '-') {
        inputSaatIni = '-0,';
    } else {
        inputSaatIni += ',';
    }

    updateTampilan();
}

/**
 * Memilih atau mengganti operasi (+, -, *, /).
 * Menekan operasi lagi sebelum angka kedua akan mengganti operasi.
 * @param {string} simbolOperasi - Operator: '+', '-', '*', atau '/'
 */
function pilihOperasi(simbolOperasi) {
    bersihkanPesanError();

    // Jika setelah '=', hasil dapat dilanjutkan dengan memilih operasi baru
    if (setelahSamaDengan) {
        if (hasil !== null) {
            angka1 = hasil;
            hasil = null;
        }
        setelahSamaDengan = false;
    }

    // Validasi: Operasi tanpa angka
    if (!validasiOperasi()) {
        updateTampilan();
        return;
    }

    // Jika angka 1 belum diisi dan pengguna sudah mengetik input saat ini
    if (angka1 === null && inputSaatIni !== '') {
        angka1 = konversiKeAngka(inputSaatIni);
        operasi = simbolOperasi;
        ekspresi = `${formatTampilan(angka1)} ${operasi}`;
        inputSaatIni = '';
    } 
    // Jika angka 1 sudah ada namun angka 2 belum diketik: ganti operasi
    else if (angka1 !== null && inputSaatIni === '') {
        operasi = simbolOperasi;
        ekspresi = `${formatTampilan(angka1)} ${operasi}`;
    } 
    // Jika angka 1 sudah ada dan angka 2 sudah diketik, hitung perantara (chaining)
    else if (angka1 !== null && inputSaatIni !== '') {
        if (!validasiHitung()) {
            updateTampilan();
            return;
        }
        angka2 = konversiKeAngka(inputSaatIni);
        hitung();
        tambahRiwayat();

        angka1 = hasil;
        hasil = null;
        operasi = simbolOperasi;
        ekspresi = `${formatTampilan(angka1)} ${operasi}`;
        inputSaatIni = '';
    }

    updateTampilan();
}

/**
 * Menghitung hasil akhir saat tombol '=' ditekan.
 * Melakukan validasi, menyimpan ke riwayat, dan memperbarui layar.
 */
function tekanSamaDengan() {
    bersihkanPesanError();

    // Jika perhitungan baru saja selesai dan '=' ditekan lagi tanpa input baru, abaikan
    if (setelahSamaDengan && inputSaatIni === '') {
        return;
    }

    // Validasi: '=' tanpa angka 2 atau pembagian dengan nol
    if (!validasiHitung()) {
        updateTampilan();
        return;
    }

    angka2 = konversiKeAngka(inputSaatIni);
    hitung();

    // Format ekspresi di layar atas (contoh: "124 * 56")
    ekspresi = `${formatTampilan(angka1)} ${operasi} ${formatTampilan(angka2)}`;

    // Simpan ke riwayat perhitungan
    tambahRiwayat();

    // Tandai bahwa perhitungan selesai
    setelahSamaDengan = true;
    inputSaatIni = '';

    updateTampilan();
}

/**
 * Mengosongkan semua data kalkulator kecuali riwayat (Tombol 'C').
 */
function bersihkanSemua() {
    bersihkanPesanError();
    angka1 = null;
    angka2 = null;
    operasi = '';
    hasil = null;
    pesan = '';
    inputSaatIni = '';
    ekspresi = '';
    setelahSamaDengan = false;
    updateTampilan();
}

/**
 * Menghapus satu digit terakhir pada input saat ini (Tombol 'del').
 */
function hapusDigit() {
    bersihkanPesanError();

    if (setelahSamaDengan) {
        bersihkanSemua();
        return;
    }

    if (inputSaatIni.length > 0) {
        inputSaatIni = inputSaatIni.slice(0, -1);
        // Jika hanya tersisa tanda minus atau minus nol, bersihkan input
        if (inputSaatIni === '-' || inputSaatIni === '-0') {
            inputSaatIni = '';
        }
        updateTampilan();
    }
}

/**
 * Menukar tanda positif/negatif pada input saat ini (Tombol '+/-').
 */
function ubahTanda() {
    bersihkanPesanError();

    // Jika baru saja mendapatkan hasil '=', ubah tanda pada hasil
    if (setelahSamaDengan && hasil !== null) {
        hasil = -hasil;
        if (angka1 !== null) {
            angka1 = hasil;
        }
        updateTampilan();
        return;
    }

    if (inputSaatIni === '' || inputSaatIni === '0') {
        return;
    }

    if (inputSaatIni.startsWith('-')) {
        inputSaatIni = inputSaatIni.substring(1);
    } else {
        inputSaatIni = '-' + inputSaatIni;
    }

    updateTampilan();
}

// ==============================================================================
// FUNGSI RIWAYAT PERHITUNGAN
// ==============================================================================

/**
 * Menyimpan perhitungan terakhir ke dalam array riwayat (maksimal 10 data).
 * Format persis: "124 * 56 = 6944"
 */
function tambahRiwayat() {
    const teksRiwayat = `${formatTampilan(angka1)} ${operasi} ${formatTampilan(angka2)} = ${formatTampilan(hasil)}`;
    
    // Simpan ke urutan paling atas
    riwayat.unshift(teksRiwayat);

    // Batasi riwayat maksimal 10 perhitungan terakhir
    if (riwayat.length > 10) {
        riwayat.pop();
    }

    renderRiwayat();
}

/**
 * Merender daftar riwayat ke dalam panel HTML.
 */
function renderRiwayat() {
    elDaftarRiwayat.innerHTML = '';

    if (riwayat.length === 0) {
        elDaftarRiwayat.innerHTML = '<p class="history-empty">No history yet</p>';
        return;
    }

    riwayat.forEach((item) => {
        const itemEl = document.createElement('div');
        itemEl.className = 'history-item';
        itemEl.textContent = item;
        elDaftarRiwayat.appendChild(itemEl);
    });
}

/**
 * Menghapus seluruh riwayat perhitungan.
 */
function hapusRiwayat() {
    riwayat = [];
    renderRiwayat();
}

/**
 * Membuka panel riwayat perhitungan.
 */
function bukaRiwayat() {
    tutupPanduan();
    elPanelRiwayat.classList.add('open');
    elPanelRiwayat.setAttribute('aria-hidden', 'false');
}

/**
 * Menutup panel riwayat perhitungan.
 */
function tutupRiwayat() {
    elPanelRiwayat.classList.remove('open');
    elPanelRiwayat.setAttribute('aria-hidden', 'true');
}

// ==============================================================================
// FUNGSI PANDUAN PENGGUNA (USER GUIDE)
// ==============================================================================

/**
 * Membuka panel panduan pengguna.
 */
function bukaPanduan() {
    tutupRiwayat();
    if (elPanelPanduan) {
        elPanelPanduan.classList.add('open');
        elPanelPanduan.setAttribute('aria-hidden', 'false');
    }
}

/**
 * Menutup panel panduan pengguna.
 */
function tutupPanduan() {
    if (elPanelPanduan) {
        elPanelPanduan.classList.remove('open');
        elPanelPanduan.setAttribute('aria-hidden', 'true');
    }
}

// ==============================================================================
// EVENT LISTENERS
// ==============================================================================

// Event listener untuk klik pada tombol keypad
document.querySelector('.keypad-grid').addEventListener('click', (event) => {
    const btn = event.target.closest('.btn');
    if (!btn) return;

    const angka = btn.dataset.number;
    const op = btn.dataset.operator;
    const aksi = btn.dataset.action;

    if (angka !== undefined) {
        tambahAngka(angka);
    } else if (op !== undefined) {
        pilihOperasi(op);
    } else if (aksi === 'comma') {
        tambahKoma();
    } else if (aksi === 'equals') {
        tekanSamaDengan();
    } else if (aksi === 'clear') {
        bersihkanSemua();
    } else if (aksi === 'delete') {
        hapusDigit();
    } else if (aksi === 'toggle-sign') {
        ubahTanda();
    }
});

// Event listener untuk panel riwayat
if (btnHistoryToggle) btnHistoryToggle.addEventListener('click', bukaRiwayat);
if (btnHistoryClose) btnHistoryClose.addEventListener('click', tutupRiwayat);
if (btnClearHistory) btnClearHistory.addEventListener('click', hapusRiwayat);

// Event listener untuk panel panduan pengguna
if (btnGuideToggle) btnGuideToggle.addEventListener('click', bukaPanduan);
if (btnGuideClose) btnGuideClose.addEventListener('click', tutupPanduan);

// Menutup drawer panel jika menekan tombol Escape
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        if (elPanelRiwayat && elPanelRiwayat.classList.contains('open')) {
            tutupRiwayat();
        }
        if (elPanelPanduan && elPanelPanduan.classList.contains('open')) {
            tutupPanduan();
        }
    }
});

// Dukungan Input Keyboard untuk kenyamanan pengguna
document.addEventListener('keydown', (event) => {
    const key = event.key;

    // Jika salah satu drawer panel sedang terbuka, jangan tangani tombol angka kalkulator
    if (elPanelRiwayat && elPanelRiwayat.classList.contains('open')) return;
    if (elPanelPanduan && elPanelPanduan.classList.contains('open')) return;

    if (key >= '0' && key <= '9') {
        tambahAngka(key);
    } else if (key === ',' || key === '.') {
        tambahKoma();
    } else if (key === '+' || key === '-') {
        pilihOperasi(key);
    } else if (key === '*') {
        pilihOperasi('*');
    } else if (key === '/') {
        event.preventDefault(); // Mencegah quick search pada browser
        pilihOperasi('/');
    } else if (key === 'Enter' || key === '=') {
        event.preventDefault();
        tekanSamaDengan();
    } else if (key === 'Backspace') {
        hapusDigit();
    } else if (key === 'Escape' || key.toLowerCase() === 'c') {
        bersihkanSemua();
    }
});

// Inisialisasi tampilan awal saat halaman dimuat
updateTampilan();
renderRiwayat();
