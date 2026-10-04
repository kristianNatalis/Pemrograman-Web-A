"use strict";

/* ---------- Langkah 1: Seleksi Elemen Dasar ---------- */
const judulSitus = document.querySelector("header h1");

if (judulSitus) {
  console.log("Elemen Header:", judulSitus);
  console.log("Teks Header:", judulSitus.textContent);
}


/* ---------- Langkah 2: Tombol Dark Mode & Keyboard Shortcut ---------- */
const tombolTema = document.querySelector("#btn-tema");

function toggleTema() {
  document.body.classList.toggle("dark-mode");
}

if (tombolTema) {
  tombolTema.addEventListener("click", toggleTema);
}

// Shortcut keyboard: Tekan "D" untuk toggle Dark Mode
document.addEventListener("keydown", (e) => {
  const tag = e.target.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA") return; // Abaikan saat mengetik di form
  if (e.ctrlKey || e.metaKey || e.altKey) return;

  if (e.key.toLowerCase() === "d") {
    toggleTema();
  }
});


/* ---------- Langkah 3: Tombol Sembunyikan/Tampilkan Info Tambahan ---------- */
const tombolInfo = document.querySelector("#btn-info");
const kotakInfo = document.querySelector("#info-tambahan");

if (tombolInfo && kotakInfo) {
  tombolInfo.addEventListener("click", () => {
    kotakInfo.classList.toggle("tersembunyi");
  });
}


/* ---------- Langkah 4: Render Daftar Artikel dari Data JavaScript ---------- */
const daftarArtikel = [
  { 
    judul: "Fun Fact: Lahir di Pontianak", 
    tanggal: "2026-08-26",
    isi: "Saya lahir di Pontianak, kota yang dilewati garis khatulistiwa." 
  },
  { 
    judul: "Fun Fact: Suka Memasak", 
    tanggal: "2026-08-27",
    isi: "Selain ngoding, dapur adalah tempat saya bereksperimen dan mencoba resep baru." 
  },
  { 
    judul: "Fun Fact: Puisi dan Komik", 
    tanggal: "2026-08-28",
    isi: "Saya suka menulis puisi dan membaca komik, dengan prinsip hidup seize the day." 
  },
];

const containerArtikel = document.querySelector(".daftar-artikel");

if (containerArtikel) {
  daftarArtikel.forEach((data) => {
    const article = document.createElement("article");

    const judul = document.createElement("h3");
    judul.textContent = data.judul;

    const waktu = document.createElement("time");
    waktu.textContent = data.tanggal;

    const isi = document.createElement("p");
    isi.textContent = data.isi;

    // Tombol Like (Counter per artikel)
    const tombolLike = document.createElement("button");
    let jumlahLike = 0;
    tombolLike.textContent = `Like (${jumlahLike})`;
    tombolLike.classList.add("btn-like");
    tombolLike.addEventListener("click", () => {
      jumlahLike++;
      tombolLike.textContent = `Like (${jumlahLike})`;
    });

    // Tombol Hapus Artikel
    const tombolHapus = document.createElement("button");
    tombolHapus.textContent = "Hapus";
    tombolHapus.classList.add("btn-hapus");

    article.appendChild(judul);
    article.appendChild(waktu);
    article.appendChild(isi);
    article.appendChild(tombolLike);
    article.appendChild(tombolHapus);

    containerArtikel.appendChild(article);
  });

  // Event Delegation: Hapus artikel
  containerArtikel.addEventListener("click", (e) => {
    if (e.target.classList.contains("btn-hapus")) {
      e.target.closest("article").remove();
    }
  });

  // Efek Hover pada artikel via Event Delegation
  containerArtikel.addEventListener("mouseover", (e) => {
    const article = e.target.closest("article");
    if (article) article.classList.add("artikel-hover");
  });

  containerArtikel.addEventListener("mouseout", (e) => {
    const article = e.target.closest("article");
    if (article) article.classList.remove("artikel-hover");
  });
}


/* ---------- Langkah 5: Penanganan Form Komentar & Validasi DOM ---------- */
const formKomentar = document.querySelector("#form-komentar");
const daftarKomentar = document.querySelector("#daftar-komentar");
const kontainerKomentar = document.querySelector("#komentar");

if (formKomentar && daftarKomentar) {
  // Buat elemen tempat pesan error validasi (tanpa alert)
  const pesanError = document.createElement("p");
  pesanError.style.color = "#d9534f";
  pesanError.style.fontWeight = "bold";
  pesanError.style.marginTop = "8px";
  pesanError.classList.add("tersembunyi");
  formKomentar.appendChild(pesanError);

  // Buat tombol "Hapus Semua Komentar"
  const tombolHapusSemua = document.createElement("button");
  tombolHapusSemua.textContent = "Hapus Semua Komentar";
  tombolHapusSemua.style.marginTop = "10px";
  tombolHapusSemua.classList.add("tersembunyi");
  kontainerKomentar.appendChild(tombolHapusSemua);

  formKomentar.addEventListener("submit", (e) => {
    e.preventDefault();

    const inputNama = document.querySelector("#input-nama");
    const inputPesan = document.querySelector("#input-pesan");
    const nama = inputNama.value.trim();
    const pesan = inputPesan.value.trim();

    // Validasi input
    if (nama.length < 2 || pesan.length < 3) {
      pesanError.textContent = "Nama minimal 2 karakter dan pesan minimal 3 karakter!";
      pesanError.classList.remove("tersembunyi");
      return;
    }

    // Sembunyikan pesan error jika input valid
    pesanError.classList.add("tersembunyi");

    // Render item komentar baru
    const itemKomentar = document.createElement("li");
    itemKomentar.style.marginBottom = "8px";
    itemKomentar.innerHTML = `<strong>${nama}</strong>: ${pesan} `;

    // Tombol Hapus per Komentar
    const btnHapusKomen = document.createElement("button");
    btnHapusKomen.textContent = "Hapus";
    btnHapusKomen.style.marginLeft = "8px";
    btnHapusKomen.style.padding = "2px 8px";
    btnHapusKomen.style.fontSize = "12px";
    
    btnHapusKomen.addEventListener("click", () => {
      itemKomentar.remove();
      if (daftarKomentar.children.length === 0) {
        tombolHapusSemua.classList.add("tersembunyi");
      }
    });

    itemKomentar.appendChild(btnHapusKomen);
    daftarKomentar.appendChild(itemKomentar);

    // Tampilkan tombol "Hapus Semua Komentar" jika ada item
    tombolHapusSemua.classList.remove("tersembunyi");

    formKomentar.reset();
  });

  // Listener untuk Tombol Hapus Semua Komentar
  tombolHapusSemua.addEventListener("click", () => {
    daftarKomentar.innerHTML = "";
    tombolHapusSemua.classList.add("tersembunyi");
  });
}
