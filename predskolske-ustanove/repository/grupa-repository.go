package repository

import (
	"context"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"

	"predskolske-ustanove/model"
)

type GrupaRepository struct {
	collection *mongo.Collection
	ctx        context.Context
}

func NewGrupaRepository(db *mongo.Database) *GrupaRepository {
	return &GrupaRepository{
		collection: db.Collection("grupe"),
		ctx:        context.Background(),
	}
}

// Dohvati sve grupe za dati vrtic
func (r *GrupaRepository) GetAll(vrticID string) ([]model.Grupa, error) {
	filter := bson.M{"vrticID": vrticID}
	cursor, err := r.collection.Find(r.ctx, filter)
	/*if err != nil {
		return nil, err
	}*/

	if err != nil {
    	return []model.Grupa{}, err
    }

	defer cursor.Close(r.ctx)

	//var grupe []model.Grupa

	grupe := []model.Grupa{}

	for cursor.Next(r.ctx) {
		var g model.Grupa
		if err := cursor.Decode(&g); err != nil {
			return []model.Grupa{}, err
		}
		grupe = append(grupe, g)
	}

	return grupe, nil
}

// Dohvati grupu po ID-u
func (r *GrupaRepository) GetByID(id primitive.ObjectID) (*model.Grupa, error) {
	var g model.Grupa
	err := r.collection.FindOne(r.ctx, bson.M{"_id": id}).Decode(&g)
	if err != nil {
		return nil, err
	}
	return &g, nil
}

// Kreiraj novu grupu
func (r *GrupaRepository) Create(grupa *model.Grupa) (*mongo.InsertOneResult, error) {
	return r.collection.InsertOne(r.ctx, grupa)
}

// Ažuriraj grupu
func (r *GrupaRepository) Update(id primitive.ObjectID, grupa *model.Grupa) (*mongo.UpdateResult, error) {
	update := bson.M{
		"$set": bson.M{
			"naziv":      grupa.Naziv,
			"vrticID":    grupa.VrticID,
			"kapacitet":  grupa.Kapacitet,
			"listaDjece": grupa.ListaDece,
		},
	}
	return r.collection.UpdateByID(r.ctx, id, update)
}

// Obriši grupu
func (r *GrupaRepository) Delete(id primitive.ObjectID) (*mongo.DeleteResult, error) {
	return r.collection.DeleteOne(r.ctx, bson.M{"_id": id})
}