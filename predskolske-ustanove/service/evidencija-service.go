package service

import (
	"errors"
	"strings"
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"

	"predskolske-ustanove/model"
	"predskolske-ustanove/repository"
)

type EvidencijaService struct {
	repo     *repository.EvidencijaRepository
	deteRepo *repository.DeteRepository
}

func NewEvidencijaService(repo *repository.EvidencijaRepository, deteRepo *repository.DeteRepository) *EvidencijaService {
	return &EvidencijaService{
		repo:     repo,
		deteRepo: deteRepo,
	}
}

func (s *EvidencijaService) DodajDogadjaj(deteID, tipDogadjaja, napomena string) (*model.EvidencijaPrisustva, error) {
	deteID = strings.TrimSpace(deteID)
	if deteID == "" {
		return nil, errors.New("deteID je obavezan")
	}

	objectID, err := primitive.ObjectIDFromHex(deteID)
	if err != nil {
		return nil, errors.New("deteID nije ispravan")
	}

	dete, err := s.deteRepo.GetByID(objectID)
	if err != nil || dete == nil {
		return nil, errors.New("dete ne postoji")
	}
	if strings.TrimSpace(dete.VrticID) == "" {
		return nil, errors.New("dete nije upisano u vrtic")
	}

	tipDogadjaja = strings.ToUpper(strings.TrimSpace(tipDogadjaja))
	if tipDogadjaja != model.TipDolazak && tipDogadjaja != model.TipPreuzimanje {
		return nil, errors.New("tipDogadjaja mora biti DOLAZAK ili PREUZIMANJE")
	}

	poslednji, err := s.repo.GetPoslednjiZaDete(deteID)
	if err != nil {
		return nil, err
	}
	if poslednji == nil && tipDogadjaja != model.TipDolazak {
		return nil, errors.New("prvi događaj mora biti DOLAZAK")
	}
	if poslednji != nil {
		if poslednji.TipDogadjaja == model.TipDolazak && tipDogadjaja != model.TipPreuzimanje {
			return nil, errors.New("nakon DOLAZAK mora ići PREUZIMANJE")
		}
		if poslednji.TipDogadjaja == model.TipPreuzimanje && tipDogadjaja != model.TipDolazak {
			return nil, errors.New("nakon PREUZIMANJE mora ići DOLAZAK")
		}
	}

	evidencija := &model.EvidencijaPrisustva{
		ID:           primitive.NewObjectID(),
		DeteID:       deteID,
		VrticID:      dete.VrticID,
		TipDogadjaja: tipDogadjaja,
		Vreme:        time.Now(),
		Napomena:     strings.TrimSpace(napomena),
	}

	if err := s.repo.Create(evidencija); err != nil {
		return nil, err
	}

	return evidencija, nil
}

func (s *EvidencijaService) PregledEvidencije(deteID, od, do string) ([]model.EvidencijaPrisustva, error) {
	deteID = strings.TrimSpace(deteID)
	if deteID == "" {
		return nil, errors.New("deteID je obavezan")
	}

	if _, err := primitive.ObjectIDFromHex(deteID); err != nil {
		return nil, errors.New("deteID nije ispravan")
	}

	var odTime *time.Time
	if strings.TrimSpace(od) != "" {
		parsed, err := time.Parse(time.RFC3339, od)
		if err != nil {
			return nil, errors.New("parametar 'od' mora biti RFC3339 datum")
		}
		odTime = &parsed
	}

	var doTime *time.Time
	if strings.TrimSpace(do) != "" {
		parsed, err := time.Parse(time.RFC3339, do)
		if err != nil {
			return nil, errors.New("parametar 'do' mora biti RFC3339 datum")
		}
		doTime = &parsed
	}

	return s.repo.GetByFilter(deteID, odTime, doTime)
}

func (s *EvidencijaService) PregledEvidencijeZaRoditelja(korisnikID primitive.ObjectID, deteID string) ([]model.EvidencijaPrisustva, error) {
	deteID = strings.TrimSpace(deteID)
	if deteID == "" {
		return nil, errors.New("deteID je obavezan")
	}

	deteObjID, err := primitive.ObjectIDFromHex(deteID)
	if err != nil {
		return nil, errors.New("deteID nije ispravan")
	}

	dete, err := s.deteRepo.GetByID(deteObjID)
	if err != nil || dete == nil {
		return nil, errors.New("dete ne postoji")
	}
	if dete.KorisnikID != korisnikID {
		return nil, errors.New("nije dozvoljen pregled evidencije za tudje dete")
	}

	return s.repo.GetByFilter(deteID, nil, nil)
}
