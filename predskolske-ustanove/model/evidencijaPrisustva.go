package model

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

const (
	TipDolazak     = "DOLAZAK"
	TipPreuzimanje = "PREUZIMANJE"
)

type EvidencijaPrisustva struct {
	ID           primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	DeteID       string             `bson:"deteId" json:"deteId"`
	VrticID      string             `bson:"vrticId" json:"vrticId"`
	TipDogadjaja string             `bson:"tipDogadjaja" json:"tipDogadjaja"`
	Vreme        time.Time          `bson:"vreme" json:"vreme"`
	Napomena     string             `bson:"napomena,omitempty" json:"napomena,omitempty"`
}
