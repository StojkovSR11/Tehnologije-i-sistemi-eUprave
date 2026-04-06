package repository

import (
	"context"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"

	"predskolske-ustanove/model"
)

type VrticRepository struct {
	collection *mongo.Collection
	ctx        context.Context
}

func NewVrticRepository(db *mongo.Database) *VrticRepository {
	return &VrticRepository{
		collection: db.Collection("vrtici"),
		ctx:        context.Background(),
	}
}

func (r *VrticRepository) Create(vrtic *model.Vrtic) (*mongo.InsertOneResult, error) {
	return r.collection.InsertOne(r.ctx, vrtic)
}

func (r *VrticRepository) GetAll() ([]model.Vrtic, error) {
	cursor, err := r.collection.Find(r.ctx, bson.M{})
	if err != nil {
		return []model.Vrtic{}, err
	}
	defer cursor.Close(r.ctx)

	//var vrtici []model.Vrtic

	vrtici := []model.Vrtic{}

	for cursor.Next(r.ctx) {
		var v model.Vrtic
		if err := cursor.Decode(&v); err != nil {
			return []model.Vrtic{}, err
		}
		vrtici = append(vrtici, v)
	}
	return vrtici, nil
}

func (r *VrticRepository) GetByID(id primitive.ObjectID) (*model.Vrtic, error) {
	var v model.Vrtic
	err := r.collection.FindOne(r.ctx, bson.M{"_id": id}).Decode(&v)
	if err != nil {
		return nil, err
	}
	return &v, nil
}

func (r *VrticRepository) Update(id primitive.ObjectID, vrtic *model.Vrtic) (*mongo.UpdateResult, error) {
	update := bson.M{
		"$set": bson.M{
			"naziv":           vrtic.Naziv,
			"kapacitet":       vrtic.Kapacitet,
			"brojSlobodnihMesta": vrtic.BrojSlobodnihMesta,
		},
	}
	return r.collection.UpdateByID(r.ctx, id, update)
}

func (r *VrticRepository) Delete(id primitive.ObjectID) (*mongo.DeleteResult, error) {
	return r.collection.DeleteOne(r.ctx, bson.M{"_id": id})
}
