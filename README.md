# ⚡ GLITCH & ERROR TERMINAL - Službena Dokumentacija Sustava

## 📑 Sadržaj

1. [Uvod](#1-uvod)
2. [Tehnička Arhitektura](#2-tehnička-arhitektura)
3. [Implementacija Sučelja (UX/UI)](#3-implementacija-sučelja)
4. [Baza Podataka i Sigurnost](#4-baza-podataka-i-sigurnost)
5. [Automatizacija (Data Seeding)](#5-automatizacija)
6. [Instalacija i Pokretanje](#6-instalacija-i-pokretanje)
7. [Zaključak](#7-zaključak)

---

## 1. Uvod

**Glitch & Error Terminal** je progresivna web aplikacija (PWA) razvijena kao platforma za razmjenu tehničkih informacija. Projekt je nastao s ciljem rješavanja problema lošeg iskorištenja prostora na modernim ultra-wide monitorima, koristeći fluidni sustav mreža (Grid) i retro-futuristički estetski stil.

## 2. Tehnička Arhitektura

Sustav je izgrađen na **Serverless** modelu, što znači da nema potrebe za ručnim upravljanjem backend poslužiteljima.

### 2.1 Tehnološki Stog

- **React.js (v18+):** Glavna biblioteka za upravljanje sučeljem i komponentama.
- **Firebase Auth:** Upravljanje identitetima i sigurnim sesijama.
- **Cloud Firestore:** NoSQL baza podataka koja radi u stvarnom vremenu (Real-time).
- **CSS3 Grid & Flexbox:** Sustav za responzivni dizajn koji koristi 100% širine ekrana.

## 3. Implementacija Sučelja (UX/UI)

### 3.1 Full-Width Layout

Za razliku od klasičnih web stranica, Glitch & Error koristi trostupačnu arhitekturu:

- **Sidebar (Lijevo):** Korisnički modul, opcije identiteta i odjava.
- **Feed (Sredina):** Glavni tok informacija, koristi `1fr` jedinicu za dinamičko širenje.
- **Stats (Desno):** Terminalski podaci i sistemska statistika.

### 3.2 Identity Selector (Avatar API)

Implementiran je napredni sustav za odabir avatara koji koristi **DiceBear API**. Korisnici mogu birati između 48+ nasumično generiranih vektorskih grafika. Svaka promjena se sinkronizira s Firebase profilom i Firestore bazom u milisekundama.

## 4. Baza Podataka i Sigurnost

### 4.1 Struktura Podataka

Baza je optimizirana za brzo čitanje (Read-heavy):

- **Kolekcija `users`:** Sadrži UID, username, email i metapodatke o kreiranju računa.
- **Kolekcija `posts`:** Sadrži naslov, sadržaj, kategoriju, ID autora i vremensku oznaku (ServerTimestamp).

### 4.2 Sigurnosni Protokoli

Sigurnost je osigurana na strani klijenta i servera:

- **Ownership Check:** Gumb za brisanje (trash icon) se renderira isključivo ako se `auth.currentUser.uid` podudara s `post.authorId`.
- **Protected Routes:** Aplikacija ne dopušta pristup glavnom terminalu ako korisnik nije uspješno autentificiran.

## 5. Automatizacija (Data Seeding)

Za potrebe testiranja performansi pri velikom opterećenju, razvijen je modul `Seeder.jsx`. Ovaj modul omogućuje:

- Generiranje 100+ opširnih objava jednim klikom.
- Randomizaciju kategorija i naslova.
- Simulaciju stvarnog prometa na mreži.

## 6. Instalacija i Pokretanje

1.  **Kloniranje repozitorija:**
    ```bash
    git clone [https://github.com/tvoj-username/glitch-error.git](https://github.com/tvoj-username/glitch-error.git)
    ```
2.  **Instalacija paketa:**
    ```bash
    npm install
    ```
3.  **Konfiguracija Firebase-a:**
    Kreirajte `src/firebase.js` i umetnite svoje API ključeve iz Firebase konzole.
4.  **Pokretanje:**
    ```bash
    npm start
    ```

## 7. Zaključak

Projekt uspješno demonstrira sinergiju između React frontend-a i Firebase backend-a. Kroz implementaciju fluidnog dizajna, sustav nudi superiornu preglednost podataka na velikim ekranima, dok real-time statistika pruža korisnicima osjećaj žive i aktivne mreže.

---

**© 2026 GLITCH & ERROR TERMINAL // SYSTEM STATUS: STABLE**
