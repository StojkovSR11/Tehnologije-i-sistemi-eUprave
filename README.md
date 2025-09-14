# Go eGovernment - Sistem eUprave

## 📌 Opis projekta

Projekat predstavlja kompletnu eGovernment platformu sa mikroservisnom arhitekturom:

- **Zdravstvo servis** - upravljanje zdravstvenim podacima i pregledi
- **Predškolske ustanove servis** - upis dece u vrtiće
- **Angular Frontend** - frontend aplikacija
- **MongoDB** - perzistentno skladištenje podataka
- **Docker** - kontejnerizacija celokupnog sistema

## 🎯 Osnovna funkcionalnost

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

### Angular Frontend (Port 4200)

- Korisničko sučelje za građane
- Forma za zakazivanje pregleda
- Forma za upis deteta u vrtić
- Pregled notifikacija i obaveštenja
- Responsive design

## 🔗 Komunikacija između servisa

Predškolske ustanove servis poziva Zdravstvo servis da proveri zdravstveni status deteta pre odobravanja upisa.

## 🛠️ Tehnologije

- **Backend:** Go (Golang)
- **Frontend:** Angular 17+
- **Baza podataka:** MongoDB
- **HTTP framework:** Gin
- **Kontejnerizacija:** Docker & Docker Compose
- **Format:** JSON za API komunikaciju

## 🚀 Pokretanje

### Docker Compose (preporučeno)

```bash
# Pokretanje celokupnog sistema
docker-compose up -d

# Pristup aplikaciji
# Frontend: http://localhost:4200
# Zdravstvo API: http://localhost:8080
# Predškolske ustanove API: http://localhost:8081
# MongoDB: localhost:27017
```

### Lokalno pokretanje

```bash
# 1. Pokretanje MongoDB
docker run -d -p 27017:27017 --name mongodb mongo:latest

# 2. Pokretanje backend servisa
cd zdravstvo
go run main.go

cd ../predskolske-ustanove
go run main.go

# 3. Pokretanje Angular frontend-a
cd ../frontend
npm install
ng serve
```

## 📂 Struktura projekta

```
.
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
