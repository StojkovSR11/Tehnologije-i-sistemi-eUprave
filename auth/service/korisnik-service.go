package service

import (
	"errors"
	"time"

	"auth/model"
	"auth/repository"

	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

type KorisnikService struct {
	repo      *repository.KorisnikRepository
	jwtSecret []byte
}

func NewKorisnikService(repo *repository.KorisnikRepository, secret string) *KorisnikService {
	return &KorisnikService{
		repo:      repo,
		jwtSecret: []byte(secret),
	}
}

// Registracija korisnika (dodavanje novog u bazu)
func (s *KorisnikService) RegistrujKorisnika(k *model.Korisnik) (*model.Korisnik, error) {
	// Hash sifre
	hashed, err := bcrypt.GenerateFromPassword([]byte(k.Password), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}
	k.Password = string(hashed)

	return s.repo.Dodaj(*k)
}

// Login korisnika i generisanje JWT tokena
func (s *KorisnikService) Login(jmbg, password string) (string, error) {
	korisnik, err := s.repo.PronadjiPoJMBG(jmbg)
	if err != nil {
		return "", err
	}
	if korisnik == nil {
		return "", errors.New("korisnik ne postoji")
	}

	// Provjera sifre
	err = bcrypt.CompareHashAndPassword([]byte(korisnik.Password), []byte(password))
	if err != nil {
		return "", errors.New("pogresna sifra")
	}

	// Generisanje JWT tokena sa svim korisničkim podacima
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
	    "id":       korisnik.ID.Hex(),
		"jmbg":     korisnik.JMBG,
		"email":    korisnik.Email,
		"ime":      korisnik.Ime,
		"prezime":  korisnik.Prezime,
		"name":     korisnik.Ime + " " + korisnik.Prezime,
		"uloga":    korisnik.Uloga,
		"role":     korisnik.Uloga,
		"exp":      time.Now().Add(time.Hour * 2).Unix(),
		"iat":      time.Now().Unix(),
	})

	tokenString, err := token.SignedString(s.jwtSecret)
	if err != nil {
		return "", err
	}

	return tokenString, nil
}

// Vrati sve korisnike
func (s *KorisnikService) VratiSve() ([]model.Korisnik, error) {
	return s.repo.Svi()
}

// Obrisi korisnika
func (s *KorisnikService) Obrisi(jmbg string) error {
	return s.repo.ObrisiPoJMBG(jmbg)
}
