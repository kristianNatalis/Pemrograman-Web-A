## Jawaban Latihan Soal Evaluasi Mandiri

### 1. Mengapa validasi client-side tidak boleh menjadi satu-satunya lapisan validasi

Validasi client-side berjalan di perangkat pengguna, sehingga bisa dilewati dengan mudah, misalnya:

- Menghapus atribut `required` atau `pattern` lewat DevTools, atau mematikan JavaScript di browser.
- Mengirim request langsung ke server menggunakan Postman, curl, atau script tanpa melewati form.

Karena itu server wajib memvalidasi ulang semua data yang diterima. Tujuannya untuk menjaga keamanan (mencegah SQL injection, XSS, dan manipulasi data) serta menjaga integritas data. Validasi client-side hanya berfungsi untuk kenyamanan pengguna, yaitu agar kesalahan input terdeteksi lebih cepat sebelum data dikirim.

### 2. Atribut validasi bawaan HTML5 dan fungsinya

| Atribut | Fungsi |
|---|---|
| `required` | Field wajib diisi dan tidak boleh kosong |
| `minlength` / `maxlength` | Membatasi panjang teks minimal / maksimal |
| `pattern` | Isian harus cocok dengan regular expression, misalnya `08[0-9]{8,11}` untuk nomor HP |
| `min` / `max` | Membatasi nilai minimal / maksimal pada angka atau tanggal, misalnya nilai rapor 60–100 |
| `type` (`email`, `number`, `date`) | Browser mengecek format sesuai tipenya, misalnya email harus mengandung `@` |

### 3. Perbedaan `input.checkValidity()` dan `input.reportValidity()`

Keduanya mengembalikan `true` jika field valid dan `false` jika tidak valid, serta memicu event `invalid` pada field yang bermasalah. Perbedaannya ada pada tampilan ke pengguna:

- `checkValidity()` hanya mengecek validitas dan tidak menampilkan apa pun. Cocok jika pesan error ingin ditampilkan sendiri, seperti pada form ini (`fields.find((f) => !f.checkValidity())`).
- `reportValidity()` mengecek validitas sekaligus menampilkan balon pesan error bawaan browser dan memfokuskan kursor ke field yang salah.

### 4. Fungsi `setCustomValidity("")` (string kosong)

`setCustomValidity("")` menghapus pesan error kustom pada field, sehingga field kembali dianggap valid (`validity.customError` menjadi `false`).

Hal ini penting karena selama pesan kustom masih terpasang (string tidak kosong), field tetap dianggap tidak valid. `checkValidity()` akan terus bernilai `false` dan form tidak bisa dikirim, meskipun pengguna sudah memperbaiki isiannya. Pada form ini, fungsi `validasiField()` selalu memanggil `input.setCustomValidity("")` terlebih dahulu, kemudian menghitung pesan yang baru dan memasangnya kembali.

### 5. Aturan validasi agar "Tanggal Lahir" tidak boleh berada di masa depan

Aturannya: bandingkan tanggal yang diisi dengan tanggal hari ini. Jika tanggal lahir lebih besar dari hari ini, tampilkan pesan error dan batalkan pengiriman form.

Pseudocode:

```
FUNGSI validasiTanggalLahir(input):
    JIKA input kosong:
        KEMBALIKAN "Tanggal lahir wajib diisi"

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

Implementasi dalam JavaScript:

```js
function validasiTanggalLahir(input) {
  if (!input.value) return "Tanggal lahir wajib diisi";
  const lahir = new Date(input.value);
  const sekarang = new Date();
  if (lahir > sekarang) return "Tanggal lahir tidak boleh di masa depan";
  return "";
}
```

Sebagai lapisan tambahan, atribut `max` pada input tanggal dapat diisi dengan tanggal hari ini lewat JavaScript agar date picker langsung menolak tanggal masa depan. Validasi yang sama tetap harus dilakukan ulang di sisi server.
