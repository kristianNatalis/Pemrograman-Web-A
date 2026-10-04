"use strict";

/* ---------- Langkah 1: seleksi elemen dasar ---------- */
const judulSitus = document.querySelector("header h1");

if (judulSitus) {
  console.log(judulSitus);
  console.log(judulSitus.textContent); // sebelumnya typo: jusulSitus
}


/* ---------- Langkah 2: tombol Dark Mode ---------- */
const tombolTema = document.querySelector("#btn-tema");

function toggleTema() {
  document.body.classList.toggle("dark-mode");
}

if (tombolTema) {
  tombolTema.addEventListener("click", toggleTema);
}

// keyboard shortcut dark mode (tekan "d")
document.addEventListener("keydown", (e) => {
  // jangan aktif saat sedang mengetik di input / textarea
  const tag = e.target.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA") return;
  if (e.ctrlKey || e.metaKey || e.altKey) return;

  if (e.key.toLowerCase() === "d") {
    toggleTema();
  }
});


/* ---------- Langkah 3: tombol tampilkan/sembunyikan info tambahan ---------- */
// Yang disembunyikan: Tentang saya, Hobi, Kemampuan, Portofolio
const tombolInfo = document.querySelector("#btn-info");
const kotakInfo = document.querySelector("#info-tambahan");

if (tombolInfo && kotakInfo) {
  tombolInfo.addEventListener("click", () => {
    kotakInfo.classList.toggle("tersembunyi");
  });
}


/* ---------- Langkah 4: render daftar artikel dari data JavaScript ---------- */
const daftarArtikel = [
  { judul: "Fun Fact: Lahir di Pontianak", tanggal: "2026-08-26",
    isi: "Saya lahir di Pontianak, kota yang dilewati garis khatulistiwa." },
  { judul: "Fun Fact: Suka Memasak", tanggal: "2026-08-27",
    isi: "Selain ngoding, dapur adalah tempat saya bereksperimen dan mencoba resep baru." },
  { judul: "Fun Fact: Puisi dan Komik", tanggal: "2026-08-28",
    isi: "Saya suka menulis puisi dan membaca komik, dengan prinsip hidup seize the day." },
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

    // tombol like (counter per artikel)
    const tombolLike = document.createElement("button");
    let jumlahLike = 0;
    tombolLike.textContent = `Like (${jumlahLike})`;
    tombolLike.classList.add("btn-like");
    tombolLike.addEventListener("click", () => {
      jumlahLike++;
      tombolLike.textContent = `Like (${jumlahLike})`;
    });

    // tombol hapus (ditangani lewat event delegation di bawah)
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

  // event delegation: hanya tombol Hapus yang menghapus artikel
  containerArtikel.addEventListener("click", (e) => {
    if (e.target.classList.contains("btn-hapus")) {
      e.target.closest("article").remove();
    }
  });

  // efek hover pada artikel
  containerArtikel.addEventListener("mouseover", (e) => {
    const article = e.target.closest("article");
    if (article) article.classList.add("artikel-hover");
  });
  containerArtikel.addEventListener("mouseout", (e) => {
    const article = e.target.closest("article");
    if (article) article.classList.remove("artikel-hover");
  });
}


/* ---------- Form komentar ---------- */
const formKomentar = document.querySelector("#form-komentar");
const daftarKomentar = document.querySelector("#daftar-komentar");

if (formKomentar && daftarKomentar) {
  formKomentar.addEventListener("submit", (e) => {
    e.preventDefault();

    const nama = document.querySelector("#input-nama").value.trim();
    const pesan = document.querySelector("#input-pesan").value.trim();

    if (nama === "" || pesan === "") {
      alert("Nama dan komentar wajib diisi!");
      return;
    }

    // render komentar ke DOM (harus DI DALAM listener, karena nama & pesan
    // hanya dikenal di sini)
    const itemKomentar = document.createElement("li");
    itemKomentar.textContent = `${nama}: ${pesan}`;
    daftarKomentar.appendChild(itemKomentar);

    formKomentar.reset();
  });
}