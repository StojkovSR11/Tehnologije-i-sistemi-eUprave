package service

import (
	"fmt"
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"

	"predskolske-ustanove/model"
	"predskolske-ustanove/repository"
)

type ObavestenjeService struct {
	repo *repository.ObavestenjeRepository
}

func NewObavestenjeService(repo *repository.ObavestenjeRepository) *ObavestenjeService {
	return &ObavestenjeService{repo: repo}
}

func (s *ObavestenjeService) KreirajObavestenjeZaDodeluGrupe(
	korisnikID primitive.ObjectID,
	deteID, deteImePrezime, grupaID, grupaNaziv, vrticNaziv string,
) error {
	poruka := fmt.Sprintf(
		"Vaše dete %s je raspoređeno u grupu '%s' u vrtiću '%s'.",
		deteImePrezime, grupaNaziv, vrticNaziv,
	)

	obavestenje := &model.Obavestenje{
		ID:         primitive.NewObjectID(),
		KorisnikID: korisnikID,
		DeteID:     deteID,
		GrupaID:    grupaID,
		Poruka:     poruka,
		CreatedAt:  time.Now(),
	}

	return s.repo.Create(obavestenje)
}

func (s *ObavestenjeService) MojaObavestenja(korisnikID primitive.ObjectID) ([]model.Obavestenje, error) {
	return s.repo.GetByKorisnikID(korisnikID)
}
