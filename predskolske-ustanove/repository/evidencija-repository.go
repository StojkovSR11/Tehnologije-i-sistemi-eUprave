package repository

import (
	"context"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"

	"predskolske-ustanove/model"
)

type EvidencijaRepository struct {
	collection *mongo.Collection
	ctx        context.Context
}

func NewEvidencijaRepository(db *mongo.Database) *EvidencijaRepository {
	return &EvidencijaRepository{
		collection: db.Collection("evidencija_prisustva"),
		ctx:        context.Background(),
	}
}

func (r *EvidencijaRepository) Create(evidencija *model.EvidencijaPrisustva) error {
	_, err := r.collection.InsertOne(r.ctx, evidencija)
	return err
}

// GetPoslednjiZaDete vraća poslednji evidentirani događaj za dete.
func (r *EvidencijaRepository) GetPoslednjiZaDete(deteID string) (*model.EvidencijaPrisustva, error) {
	filter := bson.M{"deteId": deteID}
	opts := options.FindOne().SetSort(bson.D{{Key: "vreme", Value: -1}})

	var e model.EvidencijaPrisustva
	err := r.collection.FindOne(r.ctx, filter, opts).Decode(&e)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, nil
		}
		return nil, err
	}
	return &e, nil
}

func (r *EvidencijaRepository) GetByFilter(deteID string, od, do *time.Time) ([]model.EvidencijaPrisustva, error) {
	filter := bson.M{}
	if deteID != "" {
		filter["deteId"] = deteID
	}

	if od != nil || do != nil {
		vremeFilter := bson.M{}
		if od != nil {
			vremeFilter["$gte"] = *od
		}
		if do != nil {
			vremeFilter["$lte"] = *do
		}
		filter["vreme"] = vremeFilter
	}

	opts := options.Find().SetSort(bson.D{{Key: "vreme", Value: -1}})
	cursor, err := r.collection.Find(r.ctx, filter, opts)
	if err != nil {
		return []model.EvidencijaPrisustva{}, err
	}
	defer cursor.Close(r.ctx)

	rezultat := []model.EvidencijaPrisustva{}
	for cursor.Next(r.ctx) {
		var e model.EvidencijaPrisustva
		if err := cursor.Decode(&e); err != nil {
			return []model.EvidencijaPrisustva{}, err
		}
		rezultat = append(rezultat, e)
	}

	return rezultat, nil
}

// DeleteByDeteID briše evidenciju prisustva za dete.
func (r *EvidencijaRepository) DeleteByDeteID(deteIDHex string) (*mongo.DeleteResult, error) {
	return r.collection.DeleteMany(r.ctx, bson.M{"deteId": deteIDHex})
}
