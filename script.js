const BASE = "https://jsonplaceholder.typicode.com";

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

function simpanKomentar(nama, pesan) {
  const daftar = ambilKomentar();
  const id = Date.now();
  daftar.push({ id, nama, pesan });
  localStorage.setItem("komentar", JSON.stringify(daftar));
  return id;
}

function hapusKomentarTersimpan(id) {
  const daftar = ambilKomentar().filter((k) => k.id !== id);
  localStorage.setItem("komentar", JSON.stringify(daftar));
}

if (formKomentar && daftarKomentar) {
  const inputNama = document.querySelector("#input-nama");
  const inputPesan = document.querySelector("#input-pesan");

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

  function renderKomentar(k) {
    const itemKomentar = document.createElement("li");
    itemKomentar.style.marginBottom = "8px";

    const strong = document.createElement("strong");
    strong.textContent = k.nama;
    itemKomentar.appendChild(strong);
    itemKomentar.appendChild(document.createTextNode(`: ${k.pesan} `));

    const btnHapusKomen = document.createElement("button");
    btnHapusKomen.textContent = "Hapus";
    btnHapusKomen.style.marginLeft = "8px";
    btnHapusKomen.style.padding = "2px 8px";
    btnHapusKomen.style.fontSize = "12px";

    btnHapusKomen.addEventListener("click", () => {
      itemKomentar.remove();
      hapusKomentarTersimpan(k.id);
      if (daftarKomentar.children.length === 0) {
        tombolHapusSemua.classList.add("tersembunyi");
      }
    });

    itemKomentar.appendChild(btnHapusKomen);
    daftarKomentar.appendChild(itemKomentar);
    tombolHapusSemua.classList.remove("tersembunyi");
  }

  async function muatKomentarAwal() {
    try {
      const response = await fetch(BASE + "/posts/1/comments?_limit=3");
      if (!response.ok) throw new Error("Status: " + response.status);
      const daftar = await response.json();
      daftar.forEach((k) => {
        renderKomentar({ id: "api-" + k.id, nama: k.name, pesan: k.body });
      });
    } catch (error) {
      console.error("Gagal memuat komentar awal:", error);
    } finally {
      ambilKomentar().forEach(renderKomentar);
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

  formKomentar.addEventListener("submit", (e) => {
    e.preventDefault();

    const nama = inputNama.value.trim();
    const pesan = inputPesan.value.trim();

    if (nama.length < 2 || pesan.length < 3) {
      pesanError.textContent = "Nama minimal 2 karakter dan pesan minimal 3 karakter!";
      pesanError.classList.remove("tersembunyi");
      return;
    }

    pesanError.classList.add("tersembunyi");

    const id = simpanKomentar(nama, pesan);
    renderKomentar({ id, nama, pesan });

    formKomentar.reset();
    sessionStorage.removeItem("draftNama");
    sessionStorage.removeItem("draftPesan");
  });

  tombolHapusSemua.addEventListener("click", () => {
    daftarKomentar.innerHTML = "";
    localStorage.removeItem("komentar");
    tombolHapusSemua.classList.add("tersembunyi");
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
