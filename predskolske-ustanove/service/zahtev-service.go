package service

import (
	"context"
	"errors"
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
	"predskolske-ustanove/model"
	"predskolske-ustanove/repository"
)

type ZahtevService struct {
	repo      *repository.ZahtevRepository
	deteRepo  *repository.DeteRepository
	vrticRepo *repository.VrticRepository
	ctx       context.Context
}

func NewZahtevService(zahtevRepo *repository.ZahtevRepository,
	deteRepo *repository.DeteRepository,
	vrticRepo *repository.VrticRepository) *ZahtevService {
	return &ZahtevService{
		repo:      zahtevRepo,
		deteRepo:  deteRepo,
		vrticRepo: vrticRepo,
		ctx:       context.Background(),
	}
}

// Kreiranje novog zahteva za upis
func (s *ZahtevService) CreateZahtev(zahtev *model.ZahtevZaUpis) (*model.ZahtevZaUpis, error) {
	// Provera da li je prosleđen DeteID i VrticID
	if zahtev.DeteID.IsZero() || zahtev.VrticID.IsZero() {
		return nil, errors.New("DeteID i VrticID su obavezni")
	}

	// Opcionalno: proveri da li dete i vrtic postoje u bazi
	if _, err := s.deteRepo.GetByID(zahtev.DeteID); err != nil {
		return nil, errors.New("dete ne postoji")
	}
	if _, err := s.vrticRepo.GetByID(zahtev.VrticID); err != nil {
		return nil, errors.New("vrtic ne postoji")
	}

	zahtev.Status = "NA_CEKANJU"
	zahtev.DatumPodnosenja = time.Now()

	_, err := s.repo.Create(zahtev)
	if err != nil {
		return nil, err
	}
	return zahtev, nil
}

// Preuzimanje svih zahteva
func (s *ZahtevService) GetAllZahtevi() ([]model.ZahtevZaUpis, error) {
	return s.repo.GetAll()
}

// Preuzimanje zahteva po ID-u
func (s *ZahtevService) GetZahtevByID(id string) (*model.ZahtevZaUpis, error) {
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, err
	}
	return s.repo.GetByID(objectID)
}

// Ažuriranje zahteva
func (s *ZahtevService) UpdateZahtev(id string, zahtev *model.ZahtevZaUpis) (*model.ZahtevZaUpis, error) {
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, err
	}
	_, err = s.repo.Update(objectID, zahtev)
	if err != nil {
		return nil, err
	}
	return zahtev, nil
}

// Brisanje zahteva
func (s *ZahtevService) DeleteZahtev(id string) error {
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return err
	}
	_, err = s.repo.Delete(objectID)
	return err
}
