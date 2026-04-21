package service

import (
	"context"
	"errors"

	"go.mongodb.org/mongo-driver/bson/primitive"
	"predskolske-ustanove/model"
	"predskolske-ustanove/repository"
)

type VrticService struct {
	repo       *repository.VrticRepository
	deteRepo   *repository.DeteRepository
	zahtevRepo *repository.ZahtevRepository
	grupaRepo  *repository.GrupaRepository
	ctx        context.Context
}

func NewVrticService(
	repo *repository.VrticRepository,
	deteRepo *repository.DeteRepository,
	zahtevRepo *repository.ZahtevRepository,
	grupaRepo *repository.GrupaRepository,
) *VrticService {
	return &VrticService{
		repo:       repo,
		deteRepo:   deteRepo,
		zahtevRepo: zahtevRepo,
		grupaRepo:  grupaRepo,
		ctx:        context.Background(),
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

// Brisanje vrtića — nije dozvoljeno ako postoje povezani podaci (deca, zahtevi, grupe).
func (s *VrticService) DeleteVrtic(id string) error {
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return err
	}

	idHex := objectID.Hex()

	nDeca, err := s.deteRepo.CountByVrticID(idHex)
	if err != nil {
		return err
	}
	if nDeca > 0 {
		return errors.New("nije moguce obrisati vrtic: postoji dete upisano u ovaj vrtic")
	}

	nZahteva, err := s.zahtevRepo.CountByVrticID(objectID)
	if err != nil {
		return err
	}
	if nZahteva > 0 {
		return errors.New("nije moguce obrisati vrtic: postoje zahtevi vezani za ovaj vrtic")
	}

	nGrupa, err := s.grupaRepo.CountByVrticID(idHex)
	if err != nil {
		return err
	}
	if nGrupa > 0 {
		return errors.New("nije moguce obrisati vrtic: postoje grupe za ovaj vrtic")
	}

	_, err = s.repo.Delete(objectID)
	return err
}
