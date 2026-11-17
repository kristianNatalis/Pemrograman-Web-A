

const API = "https://jsonplaceholder.typicode.com";



class SalamPengguna extends HTMLElement {
  connectedCallback() {
    const nama = this.getAttribute("nama") || "Tamu";
    this.textContent = `Halo, ${nama}! Selamat datang di profil saya.`;
  }
}
customElements.define("salam-pengguna", SalamPengguna);



class TombolTema extends HTMLElement {
  connectedCallback() {
    if (localStorage.getItem("tema") === "dark") {
      document.body.classList.add("dark-mode");
    }
    this.render();
  }

  render() {
    this.innerHTML = `<button type="button" id="btn-tema"></button>`;
    this.perbaruiTeks();
    this.querySelector("button").addEventListener("click", () => this.toggle());
  }

  toggle() {
    document.body.classList.toggle("dark-mode");
    const gelap = document.body.classList.contains("dark-mode");
    localStorage.setItem("tema", gelap ? "dark" : "light");
    this.perbaruiTeks();
  }

  perbaruiTeks() {
    const gelap = document.body.classList.contains("dark-mode");
    this.querySelector("button").textContent = gelap ? "Mode Terang" : "Mode Gelap";
  }
}
customElements.define("tombol-tema", TombolTema);



const templateKartu = document.createElement("template");
templateKartu.innerHTML = `
  <style>
    :host { display: block; }
    .kartu {
      height: 100%;
      border: 1px solid var(--kartu-garis, #e0d5f5);
      border-radius: var(--kartu-radius, 8px);
      padding: 16px;
      background: var(--kartu-latar, #ffffff);
      color: var(--kartu-teks, inherit);
      transition: background-color .15s ease;
    }
    .kartu:hover { background: var(--kartu-hover, #eef4fb); }
    slot[name="judul"] { display: block; margin-bottom: 6px; }
    ::slotted(h3) { font-size: 1.1rem; line-height: 1.3; }
    .aksi { margin-top: 8px; }
    button {
      cursor: pointer;
      padding: 6px 14px;
      margin-right: 8px;
      border: 1px solid var(--tombol-garis, #8a0394);
      border-radius: 6px;
      background: var(--tombol-latar, #ffffff);
      color: var(--tombol-teks, inherit);
      font: inherit;
    }
    button:disabled { opacity: .6; cursor: not-allowed; }
  </style>
  <article class="kartu">
    <slot name="judul">Tanpa judul</slot>
    <slot>Tanpa isi</slot>
    <div class="aksi">
      <button type="button" class="btn-like" part="tombol-like">Like (0)</button>
      <button type="button" class="btn-hapus" part="tombol-hapus">Hapus</button>
    </div>
  </article>`;

class KartuArtikel extends HTMLElement {
  #like = 0;      // state jumlah like milik tiap kartu
  #batas = 0;     // batas like , dari atribut batas-like
  #tombolLike;    // referensi tombol di dalam shadow tree

  
  static get observedAttributes() {
    return ["like", "batas-like"];
  }

  constructor() {
    super();
    // Shadow tree & listener dibuat SEKALI di constructor supaya listener
    // tidak terpasang ganda saat elemen dipindahkan.
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(templateKartu.content.cloneNode(true));

    this.#tombolLike = this.shadowRoot.querySelector(".btn-like");

    this.#tombolLike.addEventListener("click", () => {
      this.#like++;
      this.#perbaruiTombol();
      // bubbles + composed event menjalar ke atas DAN menembus batas shadow
      this.dispatchEvent(new CustomEvent("suka", {
        detail: { jumlah: this.#like },
        bubbles: true,
        composed: true,
      }));
    });

    this.shadowRoot.querySelector(".btn-hapus").addEventListener("click", () => {
      // Komponen hanya MELAPOR halaman yang memutuskan menghapus.
      this.dispatchEvent(new CustomEvent("hapus-artikel", {
        bubbles: true,
        composed: true,
      }));
    });
  }

  disconnectedCallback() {
    console.log("kartu-artikel dilepas dari halaman");
  }

  attributeChangedCallback(nama, lama, baru) {
    if (nama === "like") this.#like = Number(baru) || 0;
    if (nama === "batas-like") this.#batas = parseInt(baru, 10) || 0;
    this.#perbaruiTombol();
  }

  #perbaruiTombol() {
    const habis = this.#batas > 0 && this.#like >= this.#batas;
    this.#tombolLike.textContent = habis
      ? `Like (${this.#like}) - batas tercapai`
      : `Like (${this.#like})`;
    this.#tombolLike.disabled = habis;
  }
}
customElements.define("kartu-artikel", KartuArtikel);



function buatKartu(post, batasLike) {
  const kartu = document.createElement("kartu-artikel");
  kartu.dataset.id = post.id;
  if (batasLike) kartu.setAttribute("batas-like", batasLike);

  const judul = document.createElement("h3");
  judul.slot = "judul";                    
  judul.className = "color-text";
  judul.textContent = post.title;

  const isi = document.createElement("p"); 
  isi.textContent = post.body;

  kartu.append(judul, isi);
  return kartu;
}

class DaftarArtikel extends HTMLElement {
  #sudahMuat = false;

  connectedCallback() {
    // Hindari pengambilan data ganda bila elemen dipindahkan
    if (this.#sudahMuat) return;
    this.#sudahMuat = true;
    this.muat();
  }

  async muat() {
    // indikator loading 
    const spinner = document.createElement("span");
    spinner.className = "spinner";
    this.replaceChildren(spinner, " Memuat artikel...");

    const batas = Number(this.getAttribute("batas")) || 5;
    const batasLike = this.getAttribute("batas-like");

    try {
      const res = await fetch(`${API}/posts?_limit=${batas}`);
      if (!res.ok) throw new Error("Status: " + res.status);
      const data = await res.json();

      this.replaceChildren(...data.map((p) => buatKartu(p, batasLike)));

      // Beri tahu halaman bahwa kartu sudah siap 
      this.dispatchEvent(new CustomEvent("artikel-dimuat", {
        detail: { jumlah: data.length },
        bubbles: true,
      }));
    } catch (error) {
      console.error("Gagal mengambil data:", error);
      const pesan = document.createElement("p");
      pesan.textContent = "Gagal memuat artikel, silakan coba lagi.";
      const ulang = document.createElement("button");
      ulang.type = "button";
      ulang.textContent = "Coba lagi";
      ulang.addEventListener("click", () => this.muat());
      this.replaceChildren(pesan, ulang);
    }
  }
}
customElements.define("daftar-artikel", DaftarArtikel);



const templateKomentar = document.createElement("template");
templateKomentar.innerHTML = `
  <style>
    :host { display: block; margin-bottom: 8px; }
    .komentar {
      display: flex;
      flex-wrap: wrap;
      align-items: baseline;
      gap: 6px;
      padding: 6px 10px;
      border-left: 4px solid var(--komentar-aksen, #8a0394);
      border-radius: 0 6px 6px 0;
      background: var(--komentar-latar, transparent);
    }
    .teks { flex: 1; min-width: 0; overflow-wrap: anywhere; }
    ::slotted([slot="nama"]) { margin-right: 2px; }
    button {
      cursor: pointer;
      padding: 2px 8px;
      border: 1px solid var(--tombol-garis, #8a0394);
      border-radius: 6px;
      background: var(--tombol-latar, #ffffff);
      color: var(--tombol-teks, inherit);
      font: inherit;
      font-size: 12px;
    }
    button:disabled { opacity: .6; cursor: not-allowed; }
  </style>
  <div class="komentar">
    <div class="teks">
      <slot name="nama">Anonim</slot>:
      <slot>(kosong)</slot>
    </div>
    <button type="button" class="btn-edit-komen">Edit</button>
    <button type="button" class="btn-hapus-komen">Hapus</button>
  </div>`;

class KartuKomentar extends HTMLElement {
  #tombolHapus;

  // atribut dipasang halaman saat DELETE sedang berjalan
  static get observedAttributes() {
    return ["sibuk"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(templateKomentar.content.cloneNode(true));
    this.#tombolHapus = this.shadowRoot.querySelector(".btn-hapus-komen");

    this.shadowRoot.querySelector(".btn-edit-komen").addEventListener("click", () => {
      this.dispatchEvent(new CustomEvent("edit-komentar", {
        bubbles: true,
        composed: true,
      }));
    });

    this.#tombolHapus.addEventListener("click", () => {
      this.dispatchEvent(new CustomEvent("hapus-komentar", {
        detail: { id: this.dataset.id },
        bubbles: true,
        composed: true,
      }));
    });
  }

  attributeChangedCallback() {
    const sibuk = this.hasAttribute("sibuk");
    this.#tombolHapus.disabled = sibuk;
    this.#tombolHapus.textContent = sibuk ? "Menghapus..." : "Hapus";
  }
}
customElements.define("kartu-komentar", KartuKomentar);
