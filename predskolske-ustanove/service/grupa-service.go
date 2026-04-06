package service

import (
	"context"
	"errors"

	"go.mongodb.org/mongo-driver/bson/primitive"
	"predskolske-ustanove/model"
	"predskolske-ustanove/repository"
)

type GrupaService struct {
	grupaRepo *repository.GrupaRepository
	deteRepo  *repository.DeteRepository
	ctx       context.Context
}

func NewGrupaService(grupaRepo *repository.GrupaRepository, deteRepo *repository.DeteRepository) *GrupaService {
	return &GrupaService{
		grupaRepo: grupaRepo,
		deteRepo:  deteRepo,
		ctx:       context.Background(),
	}
}

//
// 1️⃣ Dohvati sve grupe za vrtić
//
func (s *GrupaService) GetAllGrupeZaVrtic(vrticID string) ([]model.Grupa, error) {
	return s.grupaRepo.GetAll(vrticID)
}

//
// 2️⃣ Dohvati grupu po ID-u
//
func (s *GrupaService) GetGrupaByID(id string) (*model.Grupa, error) {
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, err
	}
	return s.grupaRepo.GetByID(objectID)
}

//
// 3️⃣ Kreiraj grupu
//
func (s *GrupaService) CreateGrupa(grupa *model.Grupa) (*model.Grupa, error) {
	if grupa.Naziv == "" || grupa.VrticID == "" || grupa.Kapacitet <= 0 {
		return nil, errors.New("sva polja su obavezna i kapacitet mora biti veci od 0")
	}

	result, err := s.grupaRepo.Create(grupa)
	if err != nil {
		return nil, err
	}

	grupa.ID = result.InsertedID.(primitive.ObjectID)
	return grupa, nil
}

//
// 4️⃣ Ažuriraj grupu
//
func (s *GrupaService) UpdateGrupa(id string, grupa *model.Grupa) (*model.Grupa, error) {
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, err
	}

	_, err = s.grupaRepo.Update(objectID, grupa)
	if err != nil {
		return nil, err
	}

	return grupa, nil
}

//
// 5️⃣ Obriši grupu
//
func (s *GrupaService) DeleteGrupa(id string) error {
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return err
	}

	_, err = s.grupaRepo.Delete(objectID)
	return err
}

//
// 🔥 6️⃣ Dodaj dete u grupu (GLAVNA LOGIKA)
//
func (s *GrupaService) AddDeteToGrupa(deteID string, grupaID string) error {

	// konverzija ID-eva
	deteObjID, err := primitive.ObjectIDFromHex(deteID)
	if err != nil {
		return err
	}

	grupaObjID, err := primitive.ObjectIDFromHex(grupaID)
	if err != nil {
		return err
	}

	// 1. Dohvati dete
	dete, err := s.deteRepo.GetByID(deteObjID)
	if err != nil {
		return err
	}
	if dete == nil {
		return errors.New("dete ne postoji")
	}

	// 2. Provera da li je već u grupi
	if dete.GrupaID != "" {
		return errors.New("dete je vec rasporedjeno u grupu")
	}

	// 3. Dohvati grupu
	grupa, err := s.grupaRepo.GetByID(grupaObjID)
	if err != nil {
		return err
	}
	if grupa == nil {
		return errors.New("grupa ne postoji")
	}

	// 4. Provera kapaciteta
	if len(grupa.ListaDece) >= grupa.Kapacitet {
		return errors.New("grupa je puna")
	}

	// 5. Dodaj dete u grupu
	grupa.ListaDece = append(grupa.ListaDece, deteID)

	// 6. Postavi grupu detetu
	dete.GrupaID = grupaID

	// 7. Sačuvaj promene
	_, err = s.grupaRepo.Update(grupaObjID, grupa)
	if err != nil {
		return err
	}

	_, err = s.deteRepo.Update(deteObjID, dete)
	if err != nil {
		return err
	}

	return nil
}

//
// ➕ 7️⃣ Ukloni dete iz grupe
//
func (s *GrupaService) RemoveDeteFromGrupa(deteID string, grupaID string) error {

	deteObjID, err := primitive.ObjectIDFromHex(deteID)
	if err != nil {
		return err
	}

	grupaObjID, err := primitive.ObjectIDFromHex(grupaID)
	if err != nil {
		return err
	}

	// dohvat
	dete, err := s.deteRepo.GetByID(deteObjID)
	if err != nil {
		return err
	}

	grupa, err := s.grupaRepo.GetByID(grupaObjID)
	if err != nil {
		return err
	}

	// uklanjanje iz liste
	novaLista := []string{}
	for _, id := range grupa.ListaDece {
		if id != deteID {
			novaLista = append(novaLista, id)
		}
	}
	grupa.ListaDece = novaLista

	// reset deteta
	dete.GrupaID = ""

	// update
	_, err = s.grupaRepo.Update(grupaObjID, grupa)
	if err != nil {
		return err
	}

	_, err = s.deteRepo.Update(deteObjID, dete)
	if err != nil {
		return err
	}

	return nil
}