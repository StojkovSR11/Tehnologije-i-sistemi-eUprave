# Sistem eUprave – Zdravstvo i Predškolske ustanove

## 📌 Opis projekta

Ovaj projekat simulira deo nacionalnog sistema **eUprave** kroz mikroservisnu arhitekturu.  
Tim ima **2 člana**, a svaki razvija poseban servis u skladu sa temom:

- **Servis Zdravstvo** – upravljanje zdravstvenim pregledima i dokumentacijom.
- **Servis Predškolske ustanove** – elektronski upis dece u vrtiće.

Svi servisi koriste **SSO (Single Sign-On)** metod autentifikacije i međusobno komuniciraju preko **REST API-ja**.

---

## 🎯 Funkcionalnosti

### Servis Zdravstvo

- Zakazivanje lekarskih pregleda
- Generisanje elektronskog uputa (PDF)
- Validacija zdravstvene knjižice / osiguranja
- Slanje SMS/e-mail notifikacija pacijentu o terminu
- Evidencija dolaska pacijenta (check-in sistem)

### Servis Predškolske ustanove

- Elektronski upis deteta u vrtić
- Provera slobodnih mesta u vrtiću
- Automatska dodela mesta (kriterijumi: adresa, starost deteta)
- Generisanje potvrde o upisu (PDF)
- Slanje obaveštenja roditeljima o statusu prijave

---

## 🔗 Razmena podataka između servisa

1. Validacija zdravstvene knjižice deteta prilikom upisa u vrtić.
2. Provera da li dete ima obavljen obavezni pregled.
3. Deljenje potvrda i statusa između sistema (zdravstvo ↔ predškolske ustanove).

---

## 🛠️ Tehnologije

- **Backend:** Go / Node.js / Java (po izboru)
- **Frontend (opciono):** Angular / React / Svelte
- **Autentifikacija:** Keycloak (OAuth2, OpenID Connect, JWT)
- **Kontejnerizacija:** Docker
- **Baze podataka:** MongoDB / PostgreSQL / Neo4j (zavisno od servisa)

---

## 📂 Struktura repozitorijuma
