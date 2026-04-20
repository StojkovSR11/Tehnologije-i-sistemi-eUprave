package repository

import (
	"context"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"

	"predskolske-ustanove/model"
)

type ZahtevRepository struct {
	collection *mongo.Collection
	ctx        context.Context
}

func NewZahtevRepository(db *mongo.Database) *ZahtevRepository {
	return &ZahtevRepository{
		collection: db.Collection("zahtevi"),
		ctx:        context.Background(),
	}
}

func (r *ZahtevRepository) Create(zahtev *model.ZahtevZaUpis) (*mongo.InsertOneResult, error) {
	return r.collection.InsertOne(r.ctx, zahtev)
}

func (r *ZahtevRepository) GetAll() ([]model.ZahtevZaUpis, error) {
	cursor, err := r.collection.Find(r.ctx, bson.M{})
	if err != nil {
		return []model.ZahtevZaUpis{}, err
	}
	defer cursor.Close(r.ctx)

	//var zahtevi []model.ZahtevZaUpis

	zahtevi := []model.ZahtevZaUpis{}

	for cursor.Next(r.ctx) {
		var z model.ZahtevZaUpis
		if err := cursor.Decode(&z); err != nil {
			return []model.ZahtevZaUpis{}, err
		}
		zahtevi = append(zahtevi, z)
	}
	return zahtevi, nil
}

func (r *ZahtevRepository) GetByID(id primitive.ObjectID) (*model.ZahtevZaUpis, error) {
	var z model.ZahtevZaUpis
	err := r.collection.FindOne(r.ctx, bson.M{"_id": id}).Decode(&z)
	if err != nil {
		return nil, err
	}
	return &z, nil
}

func (r *ZahtevRepository) GetByDeteAndVrtic(deteID, vrticID primitive.ObjectID) (*model.ZahtevZaUpis, error) {
	var z model.ZahtevZaUpis
	err := r.collection.FindOne(r.ctx, bson.M{
		"dete_id":  deteID,
		"vrtic_id": vrticID,
	}).Decode(&z)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, nil
		}
		return nil, err
	}
	return &z, nil
}

func (r *ZahtevRepository) GetAktivanByDete(deteID primitive.ObjectID) (*model.ZahtevZaUpis, error) {
	var z model.ZahtevZaUpis
	err := r.collection.FindOne(r.ctx, bson.M{
		"dete_id": deteID,
		"status": bson.M{
			"$in": []string{model.StatusNaCekanju, model.StatusOdobren},
		},
	}).Decode(&z)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, nil
		}
		return nil, err
	}
	return &z, nil
}

func (r *ZahtevRepository) Update(id primitive.ObjectID, zahtev *model.ZahtevZaUpis) (*mongo.UpdateResult, error) {
	update := bson.M{
		"$set": bson.M{
			"dete_id":         zahtev.DeteID,
			"vrtic_id":        zahtev.VrticID,
			"status":          zahtev.Status,
			"datumPodnosenja": zahtev.DatumPodnosenja,
			"napomena":        zahtev.Napomena,
		},
	}
	return r.collection.UpdateByID(r.ctx, id, update)
}

func (r *ZahtevRepository) Delete(id primitive.ObjectID) (*mongo.DeleteResult, error) {
	return r.collection.DeleteOne(r.ctx, bson.M{"_id": id})
}
