package repository

import (
	"context"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"

	"predskolske-ustanove/model"
)

type ObavestenjeRepository struct {
	collection *mongo.Collection
	ctx        context.Context
}

func NewObavestenjeRepository(db *mongo.Database) *ObavestenjeRepository {
	return &ObavestenjeRepository{
		collection: db.Collection("obavestenja"),
		ctx:        context.Background(),
	}
}

func (r *ObavestenjeRepository) Create(obavestenje *model.Obavestenje) error {
	_, err := r.collection.InsertOne(r.ctx, obavestenje)
	return err
}

func (r *ObavestenjeRepository) GetByKorisnikID(korisnikID primitive.ObjectID) ([]model.Obavestenje, error) {
	opts := options.Find().SetSort(bson.D{{Key: "createdAt", Value: -1}})
	cursor, err := r.collection.Find(r.ctx, bson.M{"korisnikId": korisnikID}, opts)
	if err != nil {
		return []model.Obavestenje{}, err
	}
	defer cursor.Close(r.ctx)

	rezultat := []model.Obavestenje{}
	for cursor.Next(r.ctx) {
		var ob model.Obavestenje
		if err := cursor.Decode(&ob); err != nil {
			return []model.Obavestenje{}, err
		}
		rezultat = append(rezultat, ob)
	}

	return rezultat, nil
}

// DeleteByDeteID briše obaveštenja vezana za dete (hex ID).
func (r *ObavestenjeRepository) DeleteByDeteID(deteIDHex string) (*mongo.DeleteResult, error) {
	return r.collection.DeleteMany(r.ctx, bson.M{"deteId": deteIDHex})
}
