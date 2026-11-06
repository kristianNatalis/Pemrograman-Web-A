const BASE = "https://jsonplaceholder.typicode.com";

/* B.6 — Pesan berbeda berdasarkan status code */
function pesanDariStatus(status) {
  if (status === 404) return "Data tidak ditemukan di server.";
  if (status === 400) return "Data yang dikirim tidak valid.";
  if (status >= 500) return "Server sedang bermasalah, coba lagi nanti.";
  return "Terjadi kesalahan tidak terduga.";
}

/* Lempar error yang membawa status code, dipakai POST, PATCH, dan DELETE */
function cekResponse(response) {
  if (!response.ok) {
    const error = new Error("Status: " + response.status);
    error.status = response.status;
    throw error;
  }
}

/* Tampilkan pesan error sesuai status code (B.6) */
function tampilkanError(error) {
  if (error.status) {
    alert(pesanDariStatus(error.status));
  } else {
    alert("Terjadi kesalahan jaringan, periksa koneksi Anda.");
  }
}

const judulSitus = document.querySelector("header h1");

if (judulSitus) {
  console.log("Elemen Header:", judulSitus);
  console.log("Teks Header:", judulSitus.textContent);
}

const tombolTema = document.querySelector("#btn-tema");

function toggleTema() {
  document.body.classList.toggle("dark-mode");
  const temaSekarang = document.body.classList.contains("dark-mode")
    ? "dark" : "light";
  localStorage.setItem("tema", temaSekarang);
}

function muatPreferensiTema() {
  const tema = localStorage.getItem("tema");
  if (tema === "dark") {
    document.body.classList.add("dark-mode");
  }
}
muatPreferensiTema();

if (tombolTema) {
  tombolTema.addEventListener("click", toggleTema);
}

document.addEventListener("keydown", (e) => {
  const tag = e.target.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA") return;
  if (e.ctrlKey || e.metaKey || e.altKey) return;

  if (e.key.toLowerCase() === "d") {
    toggleTema();
  }
});

const tombolInfo = document.querySelector("#btn-info");
const kotakInfo = document.querySelector("#info-tambahan");

if (tombolInfo && kotakInfo) {
  if (localStorage.getItem("infoTersembunyi") === "true") {
    kotakInfo.classList.add("tersembunyi");
  }

  tombolInfo.addEventListener("click", () => {
    kotakInfo.classList.toggle("tersembunyi");
    localStorage.setItem(
      "infoTersembunyi",
      kotakInfo.classList.contains("tersembunyi")
    );
  });
}

async function ujiFetch() {
  const response = await fetch(BASE + "/posts?_limit=3");
  
  let data;
  try {
    data = await response.json();
  } catch (error) {
    console.error("Gagal parsing JSON:", error);
    return;
  }
  
  console.log(data);
}
function simpanLike(judulArtikel, jumlah) {
  const semuaLike = JSON.parse(localStorage.getItem("semuaLike")) || {};
  semuaLike[judulArtikel] = jumlah;
  localStorage.setItem("semuaLike", JSON.stringify(semuaLike));
}

/* B.4 — PATCH jumlah like ke server (endpoint /posts/id sebagai simulasi) */
async function perbaruiLikeKeServer(postId, jumlahLike) {
  try {
    const response = await fetch(`${BASE}/posts/${postId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ likes: jumlahLike }),
    });
    cekResponse(response);
    console.log("Like berhasil diperbarui di server");
  } catch (error) {
    console.error("Gagal memperbarui like:", error);
    tampilkanError(error);
  }
}

const containerArtikel = document.querySelector(".daftar-artikel");

async function muatArtikelDariAPI() {
  const loading = document.querySelector("#loading");
  if (loading) loading.style.display = "block";

  try {
    const response = await fetch(BASE + "/posts?_limit=5");
    if (!response.ok) {
      throw new Error("Status: " + response.status);
    }
    const daftarPost = await response.json();

    const semuaLike = JSON.parse(localStorage.getItem("semuaLike")) || {};

    daftarPost.forEach((post) => {
      const article = document.createElement("article");

      const judul = document.createElement("h3");
      judul.textContent = post.title;

      const isi = document.createElement("p");
      isi.textContent = post.body;

      const tombolLike = document.createElement("button");
      let jumlahLike = semuaLike[post.title] || 0;
      tombolLike.textContent = `Like (${jumlahLike})`;
      tombolLike.classList.add("btn-like");
      tombolLike.addEventListener("click", () => {
        jumlahLike++;
        tombolLike.textContent = `Like (${jumlahLike})`;
        simpanLike(post.title, jumlahLike);
        perbaruiLikeKeServer(post.id, jumlahLike);
      });

      const tombolHapus = document.createElement("button");
      tombolHapus.textContent = "Hapus";
      tombolHapus.classList.add("btn-hapus");

      article.appendChild(judul);
      article.appendChild(isi);
      article.appendChild(tombolLike);
      article.appendChild(tombolHapus);

      containerArtikel.appendChild(article);
    });
  } catch (error) {
    containerArtikel.innerHTML =
      "<p>Gagal memuat artikel, silakan coba lagi nanti.</p>";
    console.error("Gagal mengambil data:", error);
  } finally {
    if (loading) loading.style.display = "none";
  }
}

if (containerArtikel) {
  muatArtikelDariAPI();

  containerArtikel.addEventListener("click", (e) => {
    if (e.target.classList.contains("btn-hapus")) {
      e.target.closest("article").remove();
    }
  });

  containerArtikel.addEventListener("mouseover", (e) => {
    const article = e.target.closest("article");
    if (article) article.classList.add("artikel-hover");
  });

  containerArtikel.addEventListener("mouseout", (e) => {
    const article = e.target.closest("article");
    if (article) article.classList.remove("artikel-hover");
  });
}

async function muatProfilPenulis() {
  const namaEl = document.querySelector("#nama-penulis");
  const emailEl = document.querySelector("#email-penulis");
  if (!namaEl || !emailEl) return;

  try {
    const response = await fetch(BASE + "/users/1");
    if (!response.ok) throw new Error("Status: " + response.status);
    const user = await response.json();
    namaEl.textContent = user.name;
    emailEl.textContent = user.email;
  } catch (error) {
    console.error("Gagal memuat profil penulis:", error);
  }
}
muatProfilPenulis();

const formKomentar = document.querySelector("#form-komentar");
const daftarKomentar = document.querySelector("#daftar-komentar");
const kontainerKomentar = document.querySelector("#komentar");

function ambilKomentar() {
  return JSON.parse(localStorage.getItem("komentar")) || [];
}

function simpanKomentar(k) {
  const daftar = ambilKomentar();
  daftar.push(k);
  localStorage.setItem("komentar", JSON.stringify(daftar));
}

function ubahKomentarTersimpan(kunci, nama, pesan) {
  const daftar = ambilKomentar().map((k) =>
    String(k.kunci) === String(kunci) ? { ...k, nama, pesan } : k
  );
  localStorage.setItem("komentar", JSON.stringify(daftar));
}

function hapusKomentarTersimpan(kunci) {
  const daftar = ambilKomentar().filter((k) => String(k.kunci) !== String(kunci));
  localStorage.setItem("komentar", JSON.stringify(daftar));
}

/* B.2 — kirim komentar baru dengan POST */
async function kirimKomentarKeServer(nama, pesan) {
  const response = await fetch(BASE + "/comments", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: nama, body: pesan, postId: 1 }),
  });
  cekResponse(response);
  return await response.json(); // server membalas data + id baru
}

/* Tugas mandiri — edit komentar dengan PATCH */
async function perbaruiKomentarKeServer(id, nama, pesan) {
  const response = await fetch(`${BASE}/comments/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: nama, body: pesan }),
  });
  cekResponse(response);
  return await response.json();
}

/* B.5 — hapus komentar dengan DELETE */
async function hapusKomentarDiServer(id) {
  const response = await fetch(`${BASE}/comments/${id}`, { method: "DELETE" });
  cekResponse(response);
}

if (formKomentar && daftarKomentar) {
  const inputNama = document.querySelector("#input-nama");
  const inputPesan = document.querySelector("#input-pesan");
  const tombolKirim = formKomentar.querySelector('button[type="submit"]');

  let komentarDiedit = null; // <li> yang sedang diedit (null = mode tambah)

  const pesanError = document.createElement("p");
  pesanError.style.color = "#d9534f";
  pesanError.style.fontWeight = "bold";
  pesanError.style.marginTop = "8px";
  pesanError.classList.add("tersembunyi");
  formKomentar.appendChild(pesanError);

  const tombolHapusSemua = document.createElement("button");
  tombolHapusSemua.textContent = "Hapus Semua Komentar";
  tombolHapusSemua.style.marginTop = "10px";
  tombolHapusSemua.classList.add("tersembunyi");
  kontainerKomentar.appendChild(tombolHapusSemua);

  function buatTombolKecil(teks, kelas) {
    const tombol = document.createElement("button");
    tombol.textContent = teks;
    tombol.classList.add(kelas);
    tombol.style.marginLeft = "8px";
    tombol.style.padding = "2px 8px";
    tombol.style.fontSize = "12px";
    return tombol;
  }

  /* B.3 — dataset.id menyimpan id dari server */
  function renderKomentar(k) {
    const itemKomentar = document.createElement("li");
    itemKomentar.style.marginBottom = "8px";
    itemKomentar.dataset.id = k.id;
    if (k.kunci !== undefined) itemKomentar.dataset.kunci = k.kunci;

    const strong = document.createElement("strong");
    strong.classList.add("nama-komentar");
    strong.textContent = k.nama;

    const isi = document.createElement("span");
    isi.classList.add("isi-komentar");
    isi.textContent = `: ${k.pesan} `;

    itemKomentar.appendChild(strong);
    itemKomentar.appendChild(isi);
    itemKomentar.appendChild(buatTombolKecil("Edit", "btn-edit-komen"));
    itemKomentar.appendChild(buatTombolKecil("Hapus", "btn-hapus-komen"));

    daftarKomentar.appendChild(itemKomentar);
    tombolHapusSemua.classList.remove("tersembunyi");
  }

  async function muatKomentarAwal() {
    try {
      const response = await fetch(BASE + "/posts/1/comments?_limit=3");
      if (!response.ok) throw new Error("Status: " + response.status);
      const daftar = await response.json();
      daftar.forEach((k) => {
        renderKomentar({ id: k.id, nama: k.name, pesan: k.body });
      });
    } catch (error) {
      console.error("Gagal memuat komentar awal:", error);
    } finally {
      ambilKomentar().forEach((k) => renderKomentar({ ...k, kunci: k.kunci ?? k.id }));
    }
  }
  muatKomentarAwal();

  inputNama.value = sessionStorage.getItem("draftNama") || "";
  inputPesan.value = sessionStorage.getItem("draftPesan") || "";
  inputNama.addEventListener("input", () => {
    sessionStorage.setItem("draftNama", inputNama.value);
  });
  inputPesan.addEventListener("input", () => {
    sessionStorage.setItem("draftPesan", inputPesan.value);
  });

  formKomentar.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nama = inputNama.value.trim();
    const pesan = inputPesan.value.trim();

    if (nama.length < 2 || pesan.length < 3) {
      pesanError.textContent = "Nama minimal 2 karakter dan pesan minimal 3 karakter!";
      pesanError.classList.remove("tersembunyi");
      return;
    }

    pesanError.classList.add("tersembunyi");

    // indikator loading: tombol dinonaktifkan agar tidak terklik dua kali
    tombolKirim.disabled = true;
    tombolKirim.textContent = "Mengirim...";

    try {
      if (komentarDiedit) {
        // PATCH komentar yang diedit
        await perbaruiKomentarKeServer(komentarDiedit.dataset.id, nama, pesan);
        komentarDiedit.querySelector(".nama-komentar").textContent = nama;
        komentarDiedit.querySelector(".isi-komentar").textContent = `: ${pesan} `;
        ubahKomentarTersimpan(komentarDiedit.dataset.kunci, nama, pesan);
        komentarDiedit = null;
      } else {
        // POST komentar baru, tampilkan respons server (B.3)
        const hasil = await kirimKomentarKeServer(nama, pesan);
        const k = { id: hasil.id, kunci: Date.now(), nama: hasil.name, pesan: hasil.body };
        renderKomentar(k);
        simpanKomentar(k);
        console.log("Komentar tersimpan di server, id:", hasil.id);
      }

      formKomentar.reset();
      sessionStorage.removeItem("draftNama");
      sessionStorage.removeItem("draftPesan");
    } catch (error) {
      tampilkanError(error);
      console.error(error);
    } finally {
      tombolKirim.disabled = false;
      tombolKirim.textContent = komentarDiedit ? "Simpan Perubahan" : "Kirim";
    }
  });

  /* Edit & DELETE lewat event delegation */
  daftarKomentar.addEventListener("click", async (e) => {
    const li = e.target.closest("li");
    if (!li) return;

    // Edit: tampilkan kembali isi komentar pada form
    if (e.target.classList.contains("btn-edit-komen")) {
      komentarDiedit = li;
      inputNama.value = li.querySelector(".nama-komentar").textContent;
      inputPesan.value = li.querySelector(".isi-komentar").textContent
        .replace(/^: /, "").trim();
      tombolKirim.textContent = "Simpan Perubahan";
      inputNama.focus();
      return;
    }

    // Hapus
    if (e.target.classList.contains("btn-hapus-komen")) {
      const tombol = e.target;
      tombol.disabled = true;
      tombol.textContent = "Menghapus...";
      try {
        await hapusKomentarDiServer(li.dataset.id);
        if (komentarDiedit === li) {
          komentarDiedit = null;
          formKomentar.reset();
          tombolKirim.textContent = "Kirim";
        }
        li.remove();
        hapusKomentarTersimpan(li.dataset.kunci);
        if (daftarKomentar.children.length === 0) {
          tombolHapusSemua.classList.add("tersembunyi");
        }
      } catch (error) {
        tampilkanError(error);
        console.error(error);
        tombol.disabled = false;
        tombol.textContent = "Hapus";
      }
    }
  });

  tombolHapusSemua.addEventListener("click", () => {
    daftarKomentar.innerHTML = "";
    localStorage.removeItem("komentar");
    tombolHapusSemua.classList.add("tersembunyi");
    komentarDiedit = null;
    tombolKirim.textContent = "Kirim";
  });
}

const tombolReset = document.querySelector("#btn-reset");
if (tombolReset) {
  tombolReset.addEventListener("click", () => {
    const konfirmasi = confirm(
      "Hapus semua data tersimpan (tema, like, komentar)?");
    if (konfirmasi) {
      localStorage.clear();
      sessionStorage.clear();
      location.reload();
    }
  });
}
