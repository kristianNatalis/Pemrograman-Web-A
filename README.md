## Jawaban Latihan Soal Evaluasi Mandiri

### 1. Mengapa validasi client-side tidak boleh menjadi satu-satunya lapisan validasi

Validasi client-side berjalan di perangkat pengguna, sehingga bisa dilewati dengan mudah, misalnya:

- Menghapus atribut `required` atau `pattern` lewat DevTools, atau mematikan JavaScript di browser.
- Mengirim request langsung ke server menggunakan Postman, curl, atau script tanpa melewati form.

Karena itu server wajib memvalidasi ulang semua data yang diterima. Tujuannya untuk menjaga keamanan (mencegah SQL injection, XSS, dan manipulasi data) serta menjaga integritas data. Validasi client-side hanya berfungsi untuk kenyamanan pengguna, yaitu agar kesalahan input terdeteksi lebih cepat sebelum data dikirim.

Pada proyek ini, hal tersebut dicantumkan sebagai catatan di bawah form. Proyek ini hanya berisi front-end, sehingga validasi ulang di sisi server tidak diimplementasikan.

### 2. Atribut validasi bawaan HTML5 dan fungsinya

| Atribut | Fungsi | Contoh pada form ini |
|---|---|---|
| `required` | Field wajib diisi dan tidak boleh kosong | Semua field bertanda `*` |
| `minlength` / `maxlength` | Membatasi panjang teks minimal / maksimal | Nama (3–50 karakter), password (minimal 8 karakter) |
| `pattern` | Isian harus cocok dengan regular expression | Nomor HP `08[0-9]{8,11}`, username `[a-z0-9_]{4,15}` |
| `min` / `max` | Membatasi nilai minimal / maksimal | Nilai rapor 60–100 |
| `type` (`email`, `number`, `date`, `tel`) | Browser mengecek format sesuai tipenya | Email harus mengandung `@` |

### 3. Perbedaan `input.checkValidity()` dan `input.reportValidity()`

Keduanya mengembalikan `true` jika field valid dan `false` jika tidak valid, serta memicu event `invalid` pada field yang bermasalah. Perbedaannya ada pada tampilan ke pengguna:

- `checkValidity()` hanya mengecek validitas dan tidak menampilkan apa pun. Cocok jika pesan error ingin ditampilkan sendiri.
- `reportValidity()` mengecek validitas sekaligus menampilkan balon pesan error bawaan browser dan memfokuskan kursor ke field yang salah.

Pada form ini keduanya dipakai di handler submit. `checkValidity()` digunakan untuk mencari field pertama yang tidak valid, lalu `reportValidity()` dipanggil pada field tersebut agar pesan errornya ditampilkan:

```js
const pertamaSalah = fields.find((f) => !f.checkValidity());
if (pertamaSalah) {
  pertamaSalah.reportValidity();
  return;
}
```

### 4. Fungsi `setCustomValidity("")` (string kosong)

`setCustomValidity("")` menghapus pesan error kustom pada field, sehingga field kembali dianggap valid (`validity.customError` menjadi `false`).

Hal ini penting karena selama pesan kustom masih terpasang (string tidak kosong), field tetap dianggap tidak valid. `checkValidity()` akan terus bernilai `false` dan form tidak bisa dikirim, meskipun pengguna sudah memperbaiki isiannya.

Pada form ini, fungsi `validasiField()` selalu memanggil `input.setCustomValidity("")` terlebih dahulu, kemudian menghitung pesan yang baru dan memasangnya kembali:

```js
function validasiField(input) {
  input.setCustomValidity("");          // hapus error lama
  const pesan = ambilPesan(input);      // hitung error yang baru
  input.setCustomValidity(pesan);       // pasang kembali ("" jika valid)
  // ...
}
```

### 5. Aturan validasi agar "Tanggal Lahir" tidak boleh berada di masa depan

Aturannya: bandingkan tanggal yang diisi dengan tanggal hari ini. Jika tanggal lahir lebih besar dari hari ini, tampilkan pesan error dan batalkan pengiriman form.

Pseudocode:

```
FUNGSI validasiTanggalLahir(input):
    JIKA input kosong:
        KEMBALIKAN "Kolom ini wajib diisi"

    lahir    <- ubah nilai input menjadi tanggal
    sekarang <- tanggal dan waktu saat ini

    JIKA lahir > sekarang:
        KEMBALIKAN "Tanggal lahir tidak boleh di masa depan"

    KEMBALIKAN ""        // string kosong berarti valid

SAAT field tanggal berubah ATAU form dikirim:
    pesan <- validasiTanggalLahir(field)
    field.setCustomValidity(pesan)
    tampilkan pesan pada elemen error
    JIKA pesan tidak kosong:
        batalkan pengiriman form
```

Implementasi pada form ini (`aturanKhusus.tgl` di `script.js`). Pengecekan kosong ditangani oleh atribut `required`, dan aturan tambahan berupa usia minimal 15 tahun juga disertakan:

```js
tgl(input) {
  const lahir = new Date(input.value);
  const sekarang = new Date();
  if (lahir > sekarang) return "Tanggal lahir tidak boleh di masa depan";
  let umur = sekarang.getFullYear() - lahir.getFullYear();
  const sudahUlangTahun =
    sekarang.getMonth() > lahir.getMonth() ||
    (sekarang.getMonth() === lahir.getMonth() && sekarang.getDate() >= lahir.getDate());
  if (!sudahUlangTahun) umur--;
  if (umur < 15) return "Usia minimal 15 tahun";
  return "";
}
```

Sebagai lapisan tambahan, atribut `max` pada input tanggal dapat diisi dengan tanggal hari ini agar date picker langsung menolak tanggal masa depan. Validasi yang sama tetap harus dilakukan ulang di sisi server.
