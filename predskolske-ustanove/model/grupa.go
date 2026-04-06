package model

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Grupa struct {
	ID        primitive.ObjectID `bson:"_id,omitempty" json:"id"`        // jedinstveni ID
	Naziv     string             `bson:"naziv" json:"naziv"`             // ime grupe
	VrticID   string             `bson:"vrticID" json:"vrticID"`         // veza na vrtić
	Kapacitet int                `bson:"kapacitet" json:"kapacitet"`     // maksimalan broj dece
	ListaDece []string           `bson:"listaDjece" json:"listaDece"`    // lista ID-eva dece
}