package model

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
	"time"
)

type Dete struct {
	ID        primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	JMBG      string             `bson:"jmbg" json:"jmbg"`
	Ime       string             `bson:"ime" json:"ime"`
	Prezime   string             `bson:"prezime" json:"prezime"`
	DatumRodj time.Time          `bson:"datumRodj" json:"datumRodj"`
	KorisnikID  primitive.ObjectID `bson:"korisnik_id" json:"korisnikId"` // veza ka Korisnik
	VrticID    string            `bson:"vrticID,omitempty" json:"vrticID,omitempty"`
	GrupaID    string            `bson:"grupaID,omitempty" json:"grupaID,omitempty"` // ID grupe kojoj dete pripada
}
