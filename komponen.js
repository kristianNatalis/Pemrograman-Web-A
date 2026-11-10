class SalamPengguna extends HTMLElement {
  connectedCallback() {
    const nama = this.getAttribute("nama") || "Tamu";
    this.textContent = `Halo, ${nama}! Selamat datang di profil saya.`;
  }
}
customElements.define("salam-pengguna", SalamPengguna);

class KartuArtikel extends HTMLElement {
  #like = 0;

  static get observedAttributes() {
    return ["judul", "isi", "batas-like"];
  }

  connectedCallback() {
    this.render();
  }

  disconnectedCallback() {
    console.log("kartu-artikel dilepas dari halaman");
  }

  attributeChangedCallback() {
    if (this.isConnected) this.render();
  }

  render() {
    this.innerHTML = `
      <article class="kartu">
        <h3></h3>
        <p></p>
        <button type="button" class="btn-like"></button>
        <button type="button" class="btn-hapus">Hapus</button>
      </article>`;

    this.querySelector("h3").textContent = this.getAttribute("judul") ?? "";
    this.querySelector("p").textContent = this.getAttribute("isi") ?? "";

    const batas = parseInt(this.getAttribute("batas-like"), 10);
    const tombolLike = this.querySelector(".btn-like");

    const perbaruiTombol = () => {
      tombolLike.textContent = `Like (${this.#like})`;
      if (batas > 0 && this.#like >= batas) {
        tombolLike.disabled = true;
        tombolLike.textContent = `Like (${this.#like}) - batas tercapai`;
      }
    };

    perbaruiTombol();
    tombolLike.addEventListener("click", () => {
      this.#like++;
      perbaruiTombol();
    });

    this.querySelector(".btn-hapus").addEventListener("click", () => this.remove());
  }
}
customElements.define("kartu-artikel", KartuArtikel);

class KartuKomentar extends HTMLElement {
  static get observedAttributes() {
    return ["nama", "pesan"];
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    if (this.isConnected) this.render();
  }

  render() {
    this.innerHTML = `
      <div class="isi-kartu-komentar">
        <strong class="nama-komentar"></strong>
        <span class="isi-komentar"></span>
        <button type="button" class="btn-edit-komen">Edit</button>
        <button type="button" class="btn-hapus-komen">Hapus</button>
      </div>`;

    this.querySelector(".nama-komentar").textContent = this.getAttribute("nama") ?? "";
    this.querySelector(".isi-komentar").textContent = `: ${this.getAttribute("pesan") ?? ""}`;

    this.querySelector(".btn-edit-komen").addEventListener("click", () => {
      this.dispatchEvent(new CustomEvent("edit-komentar", { bubbles: true }));
    });
    this.querySelector(".btn-hapus-komen").addEventListener("click", () => {
      this.dispatchEvent(new CustomEvent("hapus-komentar", { bubbles: true }));
    });
  }
}
customElements.define("kartu-komentar", KartuKomentar);

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