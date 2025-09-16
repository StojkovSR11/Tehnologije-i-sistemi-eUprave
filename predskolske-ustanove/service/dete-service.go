package service

import (
	"context"
	"errors"
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
func (s *DeteService) CreateDete(dete *model.Dete) (*model.Dete, error) {
	if dete.JMBG == "" || dete.Ime == "" || dete.Prezime == "" {
		return nil, errors.New("sva polja su obavezna")
	}

	// Primer: dodatna validacija datuma rođenja
	if dete.DatumRodj.After(time.Now()) {
		return nil, errors.New("datum rođenja ne može biti u budućnosti")
	}

	_, err := s.repo.Create(dete)
	if err != nil {
		return nil, err
	}
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

// Brisanje deteta
func (s *DeteService) DeleteDete(id string) error {
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return err
	}
	_, err = s.repo.Delete(objectID)
	return err
}
