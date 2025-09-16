package model

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
)

// Korisnik predstavlja korisnika sistema
type Korisnik struct {
	ID       primitive.ObjectID `bson:"_id,omitempty" json:"id"` // MongoDB ObjectID
	JMBG     string             `bson:"jmbg" json:"jmbg"`
	Email    string             `bson:"email" json:"email"`
	Password string             `bson:"password" json:"password"` // hashovana sifra
	Ime      string             `bson:"ime" json:"ime"`
	Prezime  string             `bson:"prezime" json:"prezime"`
	Uloga    string             `bson:"uloga" json:"uloga"` // "admin", "citizen", "doctor"...
}
