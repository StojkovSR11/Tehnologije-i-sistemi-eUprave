package service

import (
	"context"
	"errors"
	"regexp"
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"

	"predskolske-ustanove/model"
	"predskolske-ustanove/repository"
)

type DeteService struct {
	repo            *repository.DeteRepository
	vrticRepo       *repository.VrticRepository
	zahtevRepo      *repository.ZahtevRepository
	grupaRepo       *repository.GrupaRepository
	obavestenjeRepo *repository.ObavestenjeRepository
	evidencijaRepo  *repository.EvidencijaRepository
	ctx             context.Context
}

func NewDeteService(
	repo *repository.DeteRepository,
	vrticRepo *repository.VrticRepository,
	zahtevRepo *repository.ZahtevRepository,
	grupaRepo *repository.GrupaRepository,
	obavestenjeRepo *repository.ObavestenjeRepository,
	evidencijaRepo *repository.EvidencijaRepository,
) *DeteService {
	return &DeteService{
		repo:            repo,
		vrticRepo:       vrticRepo,
		zahtevRepo:      zahtevRepo,
		grupaRepo:       grupaRepo,
		obavestenjeRepo: obavestenjeRepo,
		evidencijaRepo:  evidencijaRepo,
		ctx:             context.Background(),
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

// Brisanje deteta: uklanjanje iz grupe, vraćanje slobodnog mesta u vrtiću, brisanje zahteva/obaveštenja/evidencije.
func (s *DeteService) DeleteDete(id string) error {
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return err
	}
	dete, err := s.repo.GetByID(objectID)
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return errors.New("dete ne postoji")
		}
		return err
	}
	deteHex := objectID.Hex()

	if dete.GrupaID != "" {
		grupaObjID, err := primitive.ObjectIDFromHex(dete.GrupaID)
		if err == nil {
			grupa, err := s.grupaRepo.GetByID(grupaObjID)
			if err == nil && grupa != nil {
				nova := make([]string, 0, len(grupa.ListaDece))
				for _, x := range grupa.ListaDece {
					if x != deteHex {
						nova = append(nova, x)
					}
				}
				grupa.ListaDece = nova
				if _, err := s.grupaRepo.Update(grupaObjID, grupa); err != nil {
					return err
				}
			}
		}
	}

	if dete.VrticID != "" {
		vrticOID, err := primitive.ObjectIDFromHex(dete.VrticID)
		if err == nil {
			vrtic, err := s.vrticRepo.GetByID(vrticOID)
			if err == nil && vrtic != nil {
				vrtic.BrojSlobodnihMesta++
				if vrtic.BrojSlobodnihMesta > vrtic.Kapacitet {
					vrtic.BrojSlobodnihMesta = vrtic.Kapacitet
				}
				if _, err := s.vrticRepo.Update(vrticOID, vrtic); err != nil {
					return err
				}
			}
		}
	}

	if _, err := s.zahtevRepo.DeleteByDeteID(objectID); err != nil {
		return err
	}
	if _, err := s.obavestenjeRepo.DeleteByDeteID(deteHex); err != nil {
		return err
	}
	if _, err := s.evidencijaRepo.DeleteByDeteID(deteHex); err != nil {
		return err
	}

	_, err = s.repo.Delete(objectID)
	return err
}
