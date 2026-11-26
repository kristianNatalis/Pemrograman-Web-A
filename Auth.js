"use strict";

const API = "https://dummyjson.com";
const KUNCI = "token-blog";

function simpanToken(token, ingat = false) {
  hapusToken();
  sessionStorage.removeItem("modeTamu");
  (ingat ? localStorage : sessionStorage).setItem(KUNCI, token);
}

function ambilToken() {
  return sessionStorage.getItem(KUNCI) ?? localStorage.getItem(KUNCI);
}

function hapusToken() {
  sessionStorage.removeItem(KUNCI);
  localStorage.removeItem(KUNCI);
}

function sudahLogin() {
  return ambilToken() !== null;
}

function bacaToken(token) {
  try {
    const payload = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
}

async function login(username, password, ingat = false) {
  const res = await fetch(`${API}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Login gagal");
  simpanToken(data.accessToken, ingat);
  return data;
}

function logout() {
  hapusToken();
  sessionStorage.removeItem("modeTamu");
  location.href = "Login.html";
}

function wajibLogin(tujuan = "Login.html") {
  if (sessionStorage.getItem("modeTamu") === "true") return true;
  if (!sudahLogin()) {
    document.documentElement.style.visibility = "hidden";
    location.replace(tujuan);
    return false;
  }
  return true;
}

async function fetchAman(url, opsi = {}) {
  const token = ambilToken();
  if (!token) {
    location.replace("Login.html");
    throw new Error("Belum login");
  }
  const res = await fetch(url, {
    ...opsi,
    headers: { ...opsi.headers, Authorization: `Bearer ${token}` },
  });
  if (res.status === 401 || res.status === 403) {
    hapusToken();
    location.replace("Login.html?sesi=habis");
    throw new Error("Sesi berakhir");
  }
  return res;
}
