package repository_auth

import (
	"context"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_auth"

	"github.com/amitshekhariitbhu/go-backend-clean-architecture/mongo"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type userRepository struct {
	database   mongo.Database
	collection string
}

func NewUserRepository(db mongo.Database, collection string) domain_auth.UserRepository {
	return &userRepository{
		database:   db,
		collection: collection,
	}
}

func (ur *userRepository) Create(c context.Context, user *domain_auth.User) error {
	collection := ur.database.Collection(ur.collection)

	_, err := collection.InsertOne(c, user)

	return err
}

func (ur *userRepository) Fetch(c context.Context) ([]domain_auth.User, error) {
	collection := ur.database.Collection(ur.collection)

	opts := options.Find().SetProjection(bson.D{{Key: "password", Value: 0}})
	cursor, err := collection.Find(c, bson.D{}, opts)

	if err != nil {
		return nil, err
	}

	var users []domain_auth.User

	err = cursor.All(c, &users)
	if users == nil {
		return []domain_auth.User{}, err
	}

	return users, err
}

func (ur *userRepository) GetByEmail(c context.Context, email string) (domain_auth.User, error) {
	collection := ur.database.Collection(ur.collection)
	var user domain_auth.User
	err := collection.FindOne(c, bson.M{"email": email}).Decode(&user)
	return user, err
}

func (ur *userRepository) GetByID(c context.Context, id string) (domain_auth.User, error) {
	collection := ur.database.Collection(ur.collection)

	var user domain_auth.User

	idHex, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return user, err
	}

	err = collection.FindOne(c, bson.M{"_id": idHex}).Decode(&user)
	return user, err
}
