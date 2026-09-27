# Kalkulator Tambah/Kurang - JavaScript

Praktikum Pemrograman Berbasis Web - Laporan 3 (JavaScript)

## Identitas

- Nama: Kristian Natalis
- NIM: 255314019
- Program Studi: Informatika
- Fakultas Sains dan Teknologi
- Universitas Sanata Dharma, Yogyakarta
- Dosen Pengampu: Ir. Kartono Pinaryanto S.T., M.Cs.

## Deskripsi

Aplikasi web sederhana yang dapat melakukan operasi **penjumlahan** dan **pengurangan** terhadap dua buah bilangan. Dibangun menggunakan HTML untuk antarmuka dan JavaScript (ditulis secara embed di dalam file HTML yang sama) untuk logika perhitungannya.

## Fitur

- Input dua buah bilangan (Bilangan 1 dan Bilangan 2)
- Tombol **Tambah** untuk menjumlahkan kedua bilangan
- Tombol **Kurang** untuk mengurangkan kedua bilangan
- Validasi input: menampilkan `alert` apabila salah satu kolom kosong atau diisi dengan karakter yang bukan angka
- Hasil perhitungan langsung ditampilkan pada kolom Hasil

## Struktur File

```
.
├── kalkulator.html   # Halaman utama berisi HTML + JavaScript
└── README.md
```

## Cara Menjalankan

1. Clone atau unduh repository ini.
2. Buka file `kalkulator.html` menggunakan web browser (Chrome, Edge, Firefox, dll).
3. Isi kolom **Bilangan 1** dan **Bilangan 2** dengan angka.
4. Klik tombol **Tambah** untuk menjumlahkan, atau **Kurang** untuk mengurangkan.
5. Hasil akan otomatis muncul pada kolom **Hasil**.

## Cuplikan Logika Program

```javascript
function tambah() {
  var input1 = document.getElementById("bilangan1").value;
  var input2 = document.getElementById("bilangan2").value;

  if (isNaN(input1) || isNaN(input2) || input1 === "" || input2 === "") {
    alert("Bilangan 1 dan Bilangan 2 harus diisi angka!");
    return;
  }

  var bilangan1 = Number(input1);
  var bilangan2 = Number(input2);
  var hasil = bilangan1 + bilangan2;
  document.getElementById("hasil").value = hasil;
}
```

Fungsi `kurang()` bekerja dengan pola yang sama, hanya operatornya diganti menjadi pengurangan (`-`).

## Screenshot

_(sisipkan screenshot tampilan program di sini)_

## Lisensi

Proyek ini dibuat untuk keperluan tugas praktikum mata kuliah Pemrograman Berbasis Web.
