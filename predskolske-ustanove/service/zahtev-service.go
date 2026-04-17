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

	// Provera da li dete postoji
	if _, err := s.deteRepo.GetByID(zahtev.DeteID); err != nil {
		return nil, errors.New("dete ne postoji")
	}

	// Provera da li vrtic postoji
	if _, err := s.vrticRepo.GetByID(zahtev.VrticID); err != nil {
		return nil, errors.New("vrtic ne postoji")
	}

	postojeciZahtev, err := s.repo.GetByDeteAndVrtic(zahtev.DeteID, zahtev.VrticID)
	if err != nil {
		return nil, err
	}
	if postojeciZahtev != nil {
		return nil, errors.New("zahtev za ovo dete i vrtic vec postoji")
	}

	// Default vrijednosti
	zahtev.Status = model.StatusNaCekanju
	zahtev.DatumPodnosenja = time.Now()
	zahtev.Napomena = ""

	// Čuvanje u bazu
	result, err := s.repo.Create(zahtev)
	if err != nil {
		return nil, err
	}


	zahtev.ID = result.InsertedID.(primitive.ObjectID)

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


func (s *ZahtevService) OdobriZahtev(id string) (*model.ZahtevZaUpis, error) {

	// 1. konverzija ID-a
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, err
	}

	// 2. pronadji zahtev
	zahtev, err := s.repo.GetByID(objectID)
	if err != nil {
		return nil, errors.New("zahtev ne postoji")
	}

	// 3. provjera statusa
	if zahtev.Status != model.StatusNaCekanju {
		return nil, errors.New("zahtev nije u stanju cekanja")
	}

	// 4. pronadji vrtic
	vrtic, err := s.vrticRepo.GetByID(zahtev.VrticID)
	if err != nil {
		return nil, errors.New("vrtic ne postoji")
	}

	// 4.1 pronadji dete koje se upisuje
	dete, err := s.deteRepo.GetByID(zahtev.DeteID)
	if err != nil {
		return nil, errors.New("dete ne postoji")
	}

	// 5. provjera slobodnih mjesta
	if vrtic.BrojSlobodnihMesta <= 0 {
		zahtev.Status = model.StatusOdbijen
		zahtev.Napomena = "Nema slobodnih mjesta"

		_, err := s.repo.Update(zahtev.ID, zahtev)
		if err != nil {
			return nil, err
		}

		return zahtev, nil
	}

	// 6. smanji broj mjesta
	vrtic.BrojSlobodnihMesta -= 1

	// 7. sacuvaj vrtic
	_, err = s.vrticRepo.Update(vrtic.ID, vrtic)
	if err != nil {
		return nil, err
	}

	// 8. odobri zahtev
	zahtev.Status = model.StatusOdobren
	zahtev.Napomena = ""

	_, err = s.repo.Update(zahtev.ID, zahtev)
	if err != nil {
		return nil, err
	}

	// 9. uspostavi vezu dete-vrtic; grupa ostaje za naknadnu raspodelu
	dete.VrticID = zahtev.VrticID.Hex()
	_, err = s.deteRepo.Update(dete.ID, dete)
	if err != nil {
		return nil, err
	}

	return zahtev, nil
}


func (s *ZahtevService) OdbijZahtev(id string, napomena string) (*model.ZahtevZaUpis, error) {

	// 1. konverzija ID iz stringa u ObjectID
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, err
	}

	// 2. dohvat zahteva iz baze
	zahtev, err := s.repo.GetByID(objectID)
	if err != nil {
		return nil, errors.New("zahtev ne postoji")
	}

	// 3. provjera da li je zahtev na cekanju
	if zahtev.Status != model.StatusNaCekanju {
		return nil, errors.New("zahtev nije u stanju cekanja")
	}

	// 4. postavljanje statusa na odbijen
	zahtev.Status = model.StatusOdbijen
	zahtev.Napomena = napomena // opcionalna napomena

	// 5. update zahteva u bazi
	_, err = s.repo.Update(zahtev.ID, zahtev)
	if err != nil {
		return nil, err
	}

	return zahtev, nil
}