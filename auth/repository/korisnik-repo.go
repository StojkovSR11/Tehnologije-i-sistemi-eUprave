package repository

import (
	"context"
	"errors"
	"time"

	"auth/model"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

type KorisnikRepository struct {
	Collection *mongo.Collection
}

// Konstruktor
func NewKorisnikRepository(c *mongo.Collection) *KorisnikRepository {
	return &KorisnikRepository{
		Collection: c,
	}
}

// Dodaj korisnika
func (r *KorisnikRepository) Dodaj(k model.Korisnik) (*model.Korisnik, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	_, err := r.Collection.InsertOne(ctx, k)
	if err != nil {
		return nil, err
	}

	return &k, nil
}

// Pronađi korisnika po JMBG
func (r *KorisnikRepository) PronadjiPoJMBG(jmbg string) (*model.Korisnik, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var korisnik model.Korisnik
	err := r.Collection.FindOne(ctx, bson.M{"jmbg": jmbg}).Decode(&korisnik)
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return nil, nil
		}
		return nil, err
	}

	return &korisnik, nil
}

// Vrati sve korisnike
func (r *KorisnikRepository) Svi() ([]model.Korisnik, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	cursor, err := r.Collection.Find(ctx, bson.M{})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var korisnici []model.Korisnik
	for cursor.Next(ctx) {
		var k model.Korisnik
		if err := cursor.Decode(&k); err != nil {
			return nil, err
		}
		korisnici = append(korisnici, k)
	}

	return korisnici, nil
}

// Obrisi korisnika po JMBG
func (r *KorisnikRepository) ObrisiPoJMBG(jmbg string) error {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	res, err := r.Collection.DeleteOne(ctx, bson.M{"jmbg": jmbg})
	if err != nil {
		return err
	}
	if res.DeletedCount == 0 {
		return errors.New("korisnik nije pronadjen")
	}
	return nil
}
