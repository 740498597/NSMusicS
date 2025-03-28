package repository_file_entity_audio_interface

import (
	"context"
	"fmt"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_file_entity/type_audio/domain_file_entity_audio_interface"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_file_entity/type_audio/domain_file_entity_audio_models"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/mongo"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type albumRepository struct {
	db         mongo.Database
	collection string
}

func NewAlbumRepository(db mongo.Database, collection string) domain_file_entity_audio_interface.AlbumRepository {
	return &albumRepository{
		db:         db,
		collection: collection,
	}
}

func (r *albumRepository) Upsert(ctx context.Context, album *domain_file_entity_audio_models.AlbumMetadata) error {
	coll := r.db.Collection(r.collection)
	filter := bson.M{"_id": album.ID}
	update := bson.M{"$set": album}

	opts := options.Update().SetUpsert(true)
	_, err := coll.UpdateOne(ctx, filter, update, opts)
	if err != nil {
		return fmt.Errorf("album upsert failed: %w", err)
	}
	return nil
}

func (r *albumRepository) BulkUpsert(ctx context.Context, albums []*domain_file_entity_audio_models.AlbumMetadata) (int, error) {
	coll := r.db.Collection(r.collection)

	var successCount int
	for _, album := range albums {
		filter := bson.M{"_id": album.ID}
		update := bson.M{"$set": album}

		_, err := coll.UpdateOne(
			ctx,
			filter,
			update,
			options.Update().SetUpsert(true),
		)

		if err != nil {
			return successCount, fmt.Errorf("bulk upsert失败于索引%d: %w", successCount, err)
		}
		successCount++
	}
	return successCount, nil
}

func (r *albumRepository) DeleteByID(ctx context.Context, id primitive.ObjectID) error {
	coll := r.db.Collection(r.collection)
	_, err := coll.DeleteOne(ctx, bson.M{"_id": id})
	if err != nil {
		return fmt.Errorf("album delete by ID failed: %w", err)
	}
	return nil
}

func (r *albumRepository) DeleteByName(ctx context.Context, name string) error {
	coll := r.db.Collection(r.collection)
	_, err := coll.DeleteOne(ctx, bson.M{"name": name})
	if err != nil {
		return fmt.Errorf("album delete by name failed: %w", err)
	}
	return nil
}

func (r *albumRepository) GetByID(ctx context.Context, id primitive.ObjectID) (*domain_file_entity_audio_models.AlbumMetadata, error) {
	coll := r.db.Collection(r.collection)
	result := coll.FindOne(ctx, bson.M{"_id": id})

	var album domain_file_entity_audio_models.AlbumMetadata
	if err := result.Decode(&album); err != nil {
		if domain.IsNotFound(err) {
			return nil, nil
		}
		return nil, fmt.Errorf("get album by ID failed: %w", err)
	}
	return &album, nil
}

func (r *albumRepository) GetByName(ctx context.Context, name string) (*domain_file_entity_audio_models.AlbumMetadata, error) {
	coll := r.db.Collection(r.collection)
	result := coll.FindOne(ctx, bson.M{"name": name})

	var album domain_file_entity_audio_models.AlbumMetadata
	if err := result.Decode(&album); err != nil {
		if domain.IsNotFound(err) {
			return nil, nil
		}
		return nil, fmt.Errorf("get album by name failed: %w", err)
	}
	return &album, nil
}

func (r *albumRepository) GetByArtist(ctx context.Context, artistID string) ([]*domain_file_entity_audio_models.AlbumMetadata, error) {
	coll := r.db.Collection(r.collection)
	filter := bson.M{
		"$or": []bson.M{
			{"artist_id": artistID},
			{"album_artist_id": artistID},
		},
	}

	cursor, err := coll.Find(ctx, filter)
	if err != nil {
		return nil, fmt.Errorf("get albums by artist failed: %w", err)
	}
	defer cursor.Close(ctx)

	var albums []*domain_file_entity_audio_models.AlbumMetadata
	if err := cursor.All(ctx, &albums); err != nil {
		return nil, fmt.Errorf("decode album results failed: %w", err)
	}

	return albums, nil
}

func (r *albumRepository) UpdateSongCount(
	ctx context.Context,
	albumID primitive.ObjectID,
	increment int,
) (int64, error) {
	coll := r.db.Collection(r.collection)

	result, err := coll.UpdateByID(
		ctx,
		albumID,
		bson.M{"$inc": bson.M{"song_count": increment}},
	)

	if err != nil {
		return 0, fmt.Errorf("歌曲计数更新失败: %w", err)
	}

	return result.ModifiedCount, nil
}

func (r *albumRepository) GetByMBID(ctx context.Context, mbzID string) (*domain_file_entity_audio_models.AlbumMetadata, error) {
	coll := r.db.Collection(r.collection)
	result := coll.FindOne(ctx, bson.M{"mbz_album_id": mbzID})

	var album domain_file_entity_audio_models.AlbumMetadata
	if err := result.Decode(&album); err != nil {
		return nil, fmt.Errorf("通过MBID获取专辑失败: %w", err)
	}
	return &album, nil
}

func (r *albumRepository) GetByFilter(
	ctx context.Context,
	filter interface{},
) (*domain_file_entity_audio_models.AlbumMetadata, error) {
	coll := r.db.Collection(r.collection)

	// 类型安全验证
	bsonFilter, ok := filter.(bson.M)
	if !ok {
		return nil, fmt.Errorf("invalid filter type: %T", filter)
	}

	// 执行查询
	result := coll.FindOne(ctx, bsonFilter)

	// 处理结果
	var album domain_file_entity_audio_models.AlbumMetadata
	if err := result.Decode(&album); err != nil {
		if domain.IsNotFound(err) {
			return nil, fmt.Errorf("未找到: %w", err)
		}
		return nil, fmt.Errorf("专辑查询失败: %w", err)
	}

	return &album, nil
}
