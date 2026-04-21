package service

import (
	"context"
	"errors"
	"regexp"
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
	"predskolske-ustanove/model"
	"predskolske-ustanove/repository"
)

type DeteService struct {
	repo *repository.DeteRepository
	ctx  context.Context
}

func NewDeteService(repo *repository.DeteRepository) *DeteService {
	return &DeteService{
		repo: repo,
		ctx:  context.Background(),
	}
}

// Kreiranje novog deteta
func (s *DeteService) CreateDete(dete *model.Dete, korisnikID primitive.ObjectID) (*model.Dete, error) {
	if dete.JMBG == "" || dete.Ime == "" || dete.Prezime == "" {
		return nil, errors.New("sva polja su obavezna")
	}
	if !regexp.MustCompile(`^\d{13}$`).MatchString(dete.JMBG) {
		return nil, errors.New("unesite JMBG od 13 cifara")
	}

	if dete.DatumRodj.After(time.Now()) {
		return nil, errors.New("datum rodjenja ne moze biti u buducnosti")
	}

	// postavi korisnika iz tokena
	dete.KorisnikID = korisnikID

	result, err := s.repo.Create(dete)
	if err != nil {
		return nil, err
	}

	dete.ID = result.ID
	return dete, nil
}

// Preuzimanje svih dece
func (s *DeteService) GetAllDeca() ([]model.Dete, error) {
	return s.repo.GetAll()
}

// Preuzimanje deteta po ID-u
func (s *DeteService) GetDeteByID(id string) (*model.Dete, error) {
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, err
	}
	return s.repo.GetByID(objectID)
}

// Ažuriranje deteta
func (s *DeteService) UpdateDete(id string, dete *model.Dete) (*model.Dete, error) {
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, err
	}
	_, err = s.repo.Update(objectID, dete)
	if err != nil {
		return nil, err
	}
	return dete, nil
}

func (s *DeteService) GetDecuZaKorisnika(korisnikID primitive.ObjectID) ([]model.Dete, error) {
	return s.repo.GetByKorisnikID(korisnikID)
}

// Brisanje deteta
func (s *DeteService) DeleteDete(id string) error {
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return err
	}
	_, err = s.repo.Delete(objectID)
	return err
}
