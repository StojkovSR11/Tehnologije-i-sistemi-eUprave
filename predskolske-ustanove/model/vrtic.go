package model

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Vrtic struct {
	ID                primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	Naziv             string             `bson:"naziv" json:"naziv"`
	Kapacitet         int                `bson:"kapacitet" json:"kapacitet"`
	BrojSlobodnihMesta int               `bson:"brojSlobodnihMesta" json:"brojSlobodnihMesta"`
}
