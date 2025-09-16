package model

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
	"time"
)

type ZahtevZaUpis struct {
	ID              primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	DeteID          primitive.ObjectID `bson:"dete_id" json:"deteId,string"`
	VrticID         primitive.ObjectID `bson:"vrtic_id" json:"vrticId,string"`
	Status          string             `bson:"status" json:"status"` 
	DatumPodnosenja time.Time          `bson:"datumPodnosenja" json:"datumPodnosenja"`
}
