package service

import (
	"context"
	"errors"

	"go.mongodb.org/mongo-driver/bson/primitive"
	"predskolske-ustanove/model"
	"predskolske-ustanove/repository"
)

type VrticService struct {
	repo *repository.VrticRepository
	ctx  context.Context
}

func NewVrticService(repo *repository.VrticRepository) *VrticService {
	return &VrticService{
		repo: repo,
		ctx:  context.Background(),
	}
}

// Kreiranje novog vrtića
func (s *VrticService) CreateVrtic(vrtic *model.Vrtic) (*model.Vrtic, error) {
	if vrtic.Naziv == "" || vrtic.Kapacitet <= 0 {
		return nil, errors.New("naziv i kapacitet su obavezni")
	}

	// sva mjesta su slobodna na pocetku
	vrtic.BrojSlobodnihMesta = vrtic.Kapacitet

	result, err := s.repo.Create(vrtic)
	if err != nil {
		return nil, err
	}

	vrtic.ID = result.InsertedID.(primitive.ObjectID)

	return vrtic, nil
}
// Preuzimanje svih vrtića
func (s *VrticService) GetAllVrtici() ([]model.Vrtic, error) {
	return s.repo.GetAll()
}

// Preuzimanje vrtića po ID-u
func (s *VrticService) GetVrticByID(id string) (*model.Vrtic, error) {
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, err
	}
	return s.repo.GetByID(objectID)
}

// Ažuriranje vrtića
func (s *VrticService) UpdateVrtic(id string, vrtic *model.Vrtic) (*model.Vrtic, error) {
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, err
	}

	_, err = s.repo.Update(objectID, vrtic)
	if err != nil {
		return nil, err
	}

	// ✅ Setujemo pravi ID da bi JSON odgovorio ispravno
	vrtic.ID = objectID
	return vrtic, nil
}

// Brisanje vrtića
func (s *VrticService) DeleteVrtic(id string) error {
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return err
	}
	_, err = s.repo.Delete(objectID)
	return err
}
