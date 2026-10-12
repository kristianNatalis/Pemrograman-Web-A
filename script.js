"use strict";


const form = document.querySelector("#form-pmb");
const fields = [...form.querySelectorAll("[data-validasi]")]; // 13 isian
const radioJk = form.querySelectorAll('input[name="jk"]');
const barKekuatan = document.querySelector("#kekuatan-bar");
const kotakSukses = document.querySelector("#sukses");


const aturanKhusus = {
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
  },
  password(input) {
    const p = input.value;
    if (!/[A-Z]/.test(p)) return "Password harus mengandung huruf besar";
    if (!/[a-z]/.test(p)) return "Password harus mengandung huruf kecil";
    if (!/[0-9]/.test(p)) return "Password harus mengandung angka";
    return "";
  },
  konfirmasi(input) {
    if (input.value !== document.querySelector("#password").value) {
      return "Konfirmasi password tidak sama dengan password";
    }
    return "";
  },
};


function ambilPesan(input) {
  const v = input.validity;
  if (v.valueMissing) return input.dataset.kosong || "Kolom ini wajib diisi";
  if (v.tooShort) return `Minimal ${input.minLength} karakter`;
  if (v.typeMismatch) return input.dataset.format || "Format tidak valid";
  if (v.patternMismatch) return input.title;
  if (v.badInput) return "Isian tidak valid";
  if (v.rangeUnderflow) return `Nilai minimal ${input.min}`;
  if (v.rangeOverflow) return `Nilai maksimal ${input.max}`;
  const khusus = aturanKhusus[input.id];
  return khusus ? khusus(input) : "";
}


function validasiField(input) {
  input.setCustomValidity("");
  const pesan = ambilPesan(input);
  input.setCustomValidity(pesan);

  const idError = "error-" + (input.type === "radio" ? input.name : input.id);
  document.querySelector("#" + idError).textContent = pesan;

  input.classList.toggle("salah", pesan !== "");
  input.classList.toggle("benar", pesan === "");
}

function updateKekuatan(p) {
  let skor = 0;
  if (p.length >= 8) skor++;
  if (/[A-Z]/.test(p)) skor++;
  if (/[a-z]/.test(p)) skor++;
  if (/[0-9]/.test(p)) skor++;
  if (/[^A-Za-z0-9]/.test(p)) skor++;
  barKekuatan.style.width = (p ? (skor / 5) * 100 : 0) + "%";
  barKekuatan.className = skor <= 2 ? "lemah" : skor <= 4 ? "sedang" : "kuat";
}


fields.forEach((field) => {
  ["input", "change"].forEach((evt) => {
    field.addEventListener(evt, () => {
      kotakSukses.hidden = true;
      validasiField(field);
    });
  });
});


radioJk.forEach((r) => r.addEventListener("change", () => validasiField(radioJk[0])));


const inputPassword = document.querySelector("#password");
const inputKonfirmasi = document.querySelector("#konfirmasi");
inputPassword.addEventListener("input", () => {
  updateKekuatan(inputPassword.value);
  if (inputKonfirmasi.value !== "") validasiField(inputKonfirmasi);
});


/* ---------- Mode gelap ---------- */
const tombolTema = document.querySelector("#btn-tema");

tombolTema.addEventListener("click", () => {
  const gelap = document.body.classList.toggle("dark-mode");
  tombolTema.textContent = gelap ? "Mode Terang" : "Mode Gelap";
});


/* ---------- Tampilkan / sembunyikan info tambahan ---------- */
const tombolInfo = document.querySelector("#btn-info");
const kotakInfo = document.querySelector("aside");

tombolInfo.addEventListener("click", () => {
  kotakInfo.classList.toggle("tersembunyi");
});


/* ---------- Daftar pendaftar (dirender dari array) ---------- */
const daftarPendaftar = [];
let idBerikutnya = 1;

const containerPendaftar = document.querySelector(".daftar-pendaftar");
const teksKosong = document.querySelector("#kosong");

function renderPendaftar() {
  containerPendaftar.innerHTML = "";
  teksKosong.hidden = daftarPendaftar.length > 0;

  daftarPendaftar.forEach((data) => {
    const item = document.createElement("article");

    const nama = document.createElement("h3");
    nama.textContent = data.nama;

    const waktu = document.createElement("time");
    waktu.textContent = data.waktu;

    const detail = document.createElement("p");
    detail.textContent = `${data.prodi} (jalur ${data.jalur})`;

    const tombolHapus = document.createElement("button");
    tombolHapus.type = "button";
    tombolHapus.className = "btn-hapus";
    tombolHapus.dataset.id = data.id;
    tombolHapus.textContent = "Hapus";

    item.append(nama, waktu, detail, tombolHapus);
    containerPendaftar.appendChild(item);
  });
}

// satu listener di container untuk semua tombol Hapus
containerPendaftar.addEventListener("click", (e) => {
  const tombol = e.target.closest(".btn-hapus");
  if (!tombol) return;
  const id = Number(tombol.dataset.id);
  const indeks = daftarPendaftar.findIndex((d) => d.id === id);
  if (indeks !== -1) daftarPendaftar.splice(indeks, 1);
  renderPendaftar();
});

renderPendaftar();


form.addEventListener("submit", (e) => {
  e.preventDefault();

  fields.forEach(validasiField);
  const pertamaSalah = fields.find((f) => !f.checkValidity());
  if (pertamaSalah) {
    pertamaSalah.focus();
    return;
  }

  const nama = document.querySelector("#nama").value.trim();
  const prodi = document.querySelector("#prodi").value;
  const jalur = document.querySelector("#jalur").value;

  daftarPendaftar.push({
    id: idBerikutnya++,
    nama,
    prodi,
    jalur,
    waktu: new Date().toLocaleString("id-ID"),
  });
  renderPendaftar();

  form.reset();
  kotakSukses.textContent = `Pendaftaran berhasil! Terima kasih, ${nama}. Pilihan prodi: ${prodi}.`;
  kotakSukses.hidden = false;
});


document.querySelector(".btn-reset").addEventListener("click", () => (kotakSukses.hidden = true));
form.addEventListener("reset", () => {

  setTimeout(() => {
    fields.forEach((f) => {
      f.setCustomValidity("");
      f.classList.remove("benar", "salah");
    });
    form.querySelectorAll(".pesan-error").forEach((s) => (s.textContent = ""));
    updateKekuatan("");
  }, 0);
});