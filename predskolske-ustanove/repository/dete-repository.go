package repository

import (
	"context"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"

	"predskolske-ustanove/model"
)

type DeteRepository struct {
	collection *mongo.Collection
	ctx        context.Context
}

func NewDeteRepository(db *mongo.Database) *DeteRepository {
	return &DeteRepository{
		collection: db.Collection("deca"),
		ctx:        context.Background(),
	}
}

func (r *DeteRepository) Create(dete *model.Dete) (*model.Dete, error) {
	dete.ID = primitive.NewObjectID()

	_, err := r.collection.InsertOne(r.ctx, dete)
	if err != nil {
		return nil, err
	}

	return dete, nil
}

func (r *DeteRepository) GetAll() ([]model.Dete, error) {
	cursor, err := r.collection.Find(r.ctx, bson.M{})
	if err != nil {
		return []model.Dete{}, err
	}
	defer cursor.Close(r.ctx)

	//var deca []model.Dete

	deca := []model.Dete{}

	for cursor.Next(r.ctx) {
		var d model.Dete
		if err := cursor.Decode(&d); err != nil {
			return []model.Dete{}, err
		}
		deca = append(deca, d)
	}
	return deca, nil
}

func (r *DeteRepository) GetByID(id primitive.ObjectID) (*model.Dete, error) {
	var d model.Dete
	err := r.collection.FindOne(r.ctx, bson.M{"_id": id}).Decode(&d)
	if err != nil {
		return nil, err
	}
	return &d, nil
}

func (r *DeteRepository) Update(id primitive.ObjectID, dete *model.Dete) (*mongo.UpdateResult, error) {
	update := bson.M{
		"$set": bson.M{
			"jmbg":       dete.JMBG,
			"ime":        dete.Ime,
			"prezime":    dete.Prezime,
			"datumRodj":  dete.DatumRodj,
			"vrticID":    dete.VrticID,
			"grupaID":    dete.GrupaID,
			"korisnik_id": dete.KorisnikID,
		},
	}
	return r.collection.UpdateByID(r.ctx, id, update)
}


func (r *DeteRepository) GetByKorisnikID(korisnikID primitive.ObjectID) ([]model.Dete, error) {
	filter := bson.M{"korisnik_id": korisnikID}

	cursor, err := r.collection.Find(r.ctx, filter)
	if err != nil {
		return []model.Dete{}, err
	}
	defer cursor.Close(r.ctx)

	deca := []model.Dete{}

	for cursor.Next(r.ctx) {
		var d model.Dete
		if err := cursor.Decode(&d); err != nil {
			return []model.Dete{}, err
		}
		deca = append(deca, d)
	}

	return deca, nil
}



func (r *DeteRepository) Delete(id primitive.ObjectID) (*mongo.DeleteResult, error) {
	return r.collection.DeleteOne(r.ctx, bson.M{"_id": id})
}
