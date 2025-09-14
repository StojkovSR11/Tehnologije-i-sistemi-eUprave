# Go eGovernment - Sistem eUprave

## 📌 Opis projekta

Projekat predstavlja kompletnu eGovernment platformu sa mikroservisnom arhitekturom:

- **Auth servis** - SSO autentifikacija za sve servise
- **Zdravstvo servis** - upravljanje zdravstvenim podacima i pregledi
- **Predškolske ustanove servis** - upis dece u vrtiće
- **Frontend sa Nginx** - web interfejs sa proxy rutiranjem
- **MongoDB** - perzistentno skladištenje podataka
- **Docker** - kontejnerizacija celokupnog sistema

## 🎯 Osnovna funkcionalnost

### Auth servis (Port 8082)

- JWT-based SSO autentifikacija
- Registracija i prijava korisnika
- Validacija tokena za druge servise
- Role-based access control (građanin, doktor, admin)
- Centralizovano upravljanje korisnicima
- REST API za autentifikaciju

### Zdravstvo servis (Port 8080)

- Zakazivanje lekarskih pregleda
- Generisanje elektronskih uputa
- Validacija zdravstvene knjižice
- Slanje notifikacija pacijentima
- Check-in sistem za preglede
- REST API za pristup podacima

### Predškolske ustanove servis (Port 8081)

- Elektronski upis deteta u vrtić
- Provera slobodnih mesta u vrtićima
- Automatska dodela mesta
- Generisanje potvrde o upisu
- Slanje obaveštenja roditeljima
- Komunikacija sa Zdravstvo servisom za validaciju

### Angular Frontend sa Nginx (Port 4200)

- Angular 17 aplikacija sa standalone komponentama
- SSO login interfejs sa JWT autentifikacijom
- Forma za zakazivanje pregleda sa validacijom
- Forma za upis deteta u vrtić sa real-time validacijom
- Pregled notifikacija i obaveštenja
- Responsive design sa modernim UI
- HTTP klijent za komunikaciju sa backend servisima
- Nginx proxy za API rutiranje

## 🔗 Komunikacija između servisa

- **Auth servis** - centralizovana autentifikacija za sve servise
- **Predškolske ustanove** poziva **Zdravstvo servis** za validaciju zdravstvenog statusa deteta
- **Svi servisi** koriste **Auth servis** za validaciju JWT tokena
- **Frontend** komunicira sa svim servisima preko Nginx proxy-ja

## 🛠️ Tehnologije

- **Backend:** Go (Golang)
- **Frontend:** Angular 17 sa TypeScript
- **Autentifikacija:** JWT (JSON Web Tokens)
- **Baza podataka:** MongoDB
- **HTTP framework:** Gin (backend), Angular HttpClient (frontend)
- **Proxy server:** Nginx
- **Kontejnerizacija:** Docker & Docker Compose
- **Format:** JSON za API komunikaciju
- **Build sistem:** Angular CLI, Node.js

## 🚀 Pokretanje

### Docker Compose (preporučeno)

```bash
# Pokretanje celokupnog sistema
docker-compose up -d

# Pristup aplikaciji
# Frontend: http://localhost:4200
# Auth API: http://localhost:8082
# Zdravstvo API: http://localhost:8080
# Predškolske ustanove API: http://localhost:8081
# MongoDB: localhost:27017
```

### Lokalno pokretanje

```bash
# 1. Pokretanje MongoDB
docker run -d -p 27017:27017 --name mongodb mongo:latest

# 2. Pokretanje backend servisa
cd auth
go run main.go

cd ../zdravstvo
go run main.go

cd ../predskolske-ustanove
go run main.go

# 3. Pokretanje frontend-a sa Nginx
cd ../frontend
# Koristiti Docker ili servirati statični HTML direktno
```

## 📂 Struktura projekta

```
.
├── auth/
│   ├── main.go
│   ├── go.mod
│   └── Dockerfile
├── zdravstvo/
│   ├── main.go
│   ├── models/
│   ├── handlers/
│   ├── services/
│   ├── go.mod
│   └── Dockerfile
├── predskolske-ustanove/
│   ├── main.go
│   ├── models/
│   ├── handlers/
│   ├── services/
│   ├── go.mod
│   └── Dockerfile
├── frontend/
│   ├── src/
│   ├── angular.json
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml
├── .gitignore
└── README.md
```

## 🎯 Cilj

Ovaj projekat demonstrira:

- Kompletnu eGovernment platformu sa mikroservisima
- Angular frontend sa Go backend servisima
- MongoDB integraciju za perzistentno skladištenje
- Docker kontejnerizaciju celokupnog sistema
- REST API komunikaciju između servisa
- Realnu arhitekturu pogodnu za produkciju
