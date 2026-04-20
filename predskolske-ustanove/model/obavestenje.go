package model

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Obavestenje struct {
	ID         primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	KorisnikID primitive.ObjectID `bson:"korisnikId" json:"korisnikId"`
	DeteID     string             `bson:"deteId" json:"deteId"`
	GrupaID    string             `bson:"grupaId" json:"grupaId"`
	Poruka     string             `bson:"poruka" json:"poruka"`
	CreatedAt  time.Time          `bson:"createdAt" json:"createdAt"`
}
