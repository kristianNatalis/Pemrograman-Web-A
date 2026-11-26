const BASE = "https://jsonplaceholder.typicode.com";

function pesanDariStatus(status) {
  if (status === 404) return "Data tidak ditemukan di server.";
  if (status === 400) return "Data yang dikirim tidak valid.";
  if (status >= 500) return "Server sedang bermasalah, coba lagi nanti.";
  return "Terjadi kesalahan tidak terduga.";
}

function cekResponse(response) {
  if (!response.ok) {
    const error = new Error("Status: " + response.status);
    error.status = response.status;
    throw error;
  }
}

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

document.addEventListener("keydown", (e) => {
  const tag = e.target.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA") return;
  if (e.ctrlKey || e.metaKey || e.altKey) return;

  if (e.key.toLowerCase() === "d") {
    const tombol = document.querySelector("tombol-tema");
    if (tombol) tombol.toggle();
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

document.body.classList.toggle("tamu", !sudahLogin());

async function muatProfilPengguna() {
  const salam = document.querySelector("salam-pengguna");
  const email = document.querySelector("#email-profil");
  const foto = document.querySelector("#foto-profil");
  try {
    const res = await fetchAman(`${API}/auth/me`);
    if (!res.ok) throw new Error("Status: " + res.status);
    const user = await res.json();

    if (salam) salam.setAttribute("nama", user.firstName);
    if (email) email.textContent = user.email;
    if (foto && user.image) {
      foto.src = user.image;
      foto.classList.remove("tersembunyi");
    }
  } catch (error) {
    console.error("Gagal memuat profil pengguna:", error);
  }
}
if (sudahLogin()) muatProfilPengguna();

const tombolLogout = document.querySelector("#btn-logout");
if (tombolLogout) tombolLogout.addEventListener("click", logout);

const infoSesi = document.querySelector("#info-sesi");
if (infoSesi) {
  const data = bacaToken(ambilToken() || "");
  if (data && data.exp) infoSesi.setAttribute("exp", data.exp);
  else infoSesi.classList.add("tersembunyi");

  infoSesi.addEventListener("sesi-habis", () => {
    hapusToken();
    location.replace("login.html?sesi=habis");
  });
}

const containerArtikel = document.querySelector(".daftar-artikel");

function ambilLike() {
  return JSON.parse(localStorage.getItem("like")) || {};
}
function simpanLike(obj) {
  localStorage.setItem("like", JSON.stringify(obj));
}

if (containerArtikel) {
  containerArtikel.addEventListener("suka", (e) => {
    const kartu = e.target;
    const judul = kartu.querySelector('[slot="judul"]').textContent;
    console.log(`"${judul}" disuka: ${e.detail.jumlah} kali`);

    const like = ambilLike();
    like[kartu.dataset.id] = e.detail.jumlah;
    simpanLike(like);
  });

  containerArtikel.addEventListener("hapus-artikel", (e) => {
    const kartu = e.target;
    const like = ambilLike();
    delete like[kartu.dataset.id];
    simpanLike(like);
    kartu.remove();
  });

  containerArtikel.addEventListener("artikel-dimuat", () => {
    const like = ambilLike();
    containerArtikel.querySelectorAll("kartu-artikel").forEach((kartu) => {
      const tersimpan = like[kartu.dataset.id];
      if (tersimpan) kartu.setAttribute("like", tersimpan);
    });
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

async function kirimKomentarKeServer(nama, pesan) {
  const response = await fetch(BASE + "/comments", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: nama, body: pesan, postId: 1 }),
  });
  cekResponse(response);
  return await response.json();
}

async function perbaruiKomentarKeServer(id, nama, pesan) {
  const response = await fetch(`${BASE}/comments/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: nama, body: pesan }),
  });
  cekResponse(response);
  return await response.json();
}

async function hapusKomentarDiServer(id) {
  const response = await fetch(`${BASE}/comments/${id}`, { method: "DELETE" });
  cekResponse(response);
}

function isiKomentar(kartu, nama, pesan) {
  let elNama = kartu.querySelector('[slot="nama"]');
  let elPesan = kartu.querySelector(":scope > span");
  if (!elNama) {
    elNama = document.createElement("strong");
    elNama.slot = "nama";
    elPesan = document.createElement("span");
    kartu.append(elNama, elPesan);
  }
  elNama.textContent = nama;
  elPesan.textContent = pesan;
}

function bacaKomentar(kartu) {
  return {
    nama: kartu.querySelector('[slot="nama"]').textContent,
    pesan: kartu.querySelector(":scope > span").textContent,
  };
}

if (formKomentar && daftarKomentar) {
  const inputNama = document.querySelector("#input-nama");
  const inputPesan = document.querySelector("#input-pesan");
  const tombolKirim = formKomentar.querySelector('button[type="submit"]');

  let komentarDiedit = null;

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
    const itemKomentar = document.createElement("kartu-komentar");
    itemKomentar.dataset.id = k.id;
    if (k.kunci !== undefined) itemKomentar.dataset.kunci = k.kunci;
    isiKomentar(itemKomentar, k.nama, k.pesan);

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

    tombolKirim.disabled = true;
    tombolKirim.textContent = "Mengirim...";

    try {
      if (komentarDiedit) {
        await perbaruiKomentarKeServer(komentarDiedit.dataset.id, nama, pesan);
        isiKomentar(komentarDiedit, nama, pesan);
        ubahKomentarTersimpan(komentarDiedit.dataset.kunci, nama, pesan);
        komentarDiedit = null;
      } else {
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

  daftarKomentar.addEventListener("edit-komentar", (e) => {
    const kartu = e.target;
    komentarDiedit = kartu;
    const { nama, pesan } = bacaKomentar(kartu);
    inputNama.value = nama;
    inputPesan.value = pesan;
    tombolKirim.textContent = "Simpan Perubahan";
    inputNama.focus();
  });

  daftarKomentar.addEventListener("hapus-komentar", async (e) => {
    const kartu = e.target;
    kartu.setAttribute("sibuk", "");
    try {
      await hapusKomentarDiServer(e.detail.id);
      if (komentarDiedit === kartu) {
        komentarDiedit = null;
        formKomentar.reset();
        tombolKirim.textContent = "Kirim";
      }
      kartu.remove();
      hapusKomentarTersimpan(kartu.dataset.kunci);
      if (daftarKomentar.children.length === 0) {
        tombolHapusSemua.classList.add("tersembunyi");
      }
    } catch (error) {
      tampilkanError(error);
      console.error(error);
      kartu.removeAttribute("sibuk");
    }
  });

  tombolHapusSemua.addEventListener("click", () => {
    daftarKomentar.replaceChildren();
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
      "Hapus semua data tersimpan (tema, komentar, like)? Anda juga akan keluar dari akun.");
    if (konfirmasi) {
      localStorage.clear();
      sessionStorage.clear();
      location.reload();
    }
  });
}
