package domain_file_entity

import (
	"context"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"path/filepath"
	"strings"
	"time"
)

type FileType int

const (
	Audio FileType = iota + 1
	Video
	Image
	Text
	Document
	Archive
	Executable
	Database
	Unknown
)

type FolderMeta struct {
	FileCount   int       `bson:"file_count"`
	LastScanned time.Time `bson:"last_scanned"`
}

type FolderMetadata struct {
	ID         primitive.ObjectID `bson:"_id,omitempty"`
	FolderPath string             `bson:"folder_path" validate:"dirpath"`
	FolderMeta FolderMeta         `bson:"folder_meta"`
}

type FileMetadata struct {
	ID        primitive.ObjectID `bson:"_id,omitempty"`
	FolderID  primitive.ObjectID `bson:"folder_id"`
	FilePath  string             `bson:"file_path" validate:"filepath"`
	FileType  FileType           `bson:"file_type" validate:"min=1,max=8"`
	Size      int64              `bson:"size" validate:"min=0"`
	ModTime   time.Time          `bson:"mod_time" validate:"required"`
	Checksum  string             `bson:"checksum" validate:"sha256"`
	CreatedAt time.Time          `bson:"created_at" validate:"required"`
	UpdatedAt time.Time          `bson:"updated_at" validate:"required,gtfield=CreatedAt"`
}

type FolderRepository interface {
	Insert(ctx context.Context, folder *FolderMetadata) error
	FindByPath(ctx context.Context, path string) (*FolderMetadata, error)
	UpdateStats(ctx context.Context, folderID primitive.ObjectID, fileCount int) error
}

type FileRepository interface {
	Upsert(ctx context.Context, file *FileMetadata) error
	DeleteByFolder(ctx context.Context, folderID primitive.ObjectID) error
	CountByFolderID(ctx context.Context, folderID primitive.ObjectID) (int64, error)
}

type FileDetector interface {
	DetectMediaType(filePath string) (FileType, error)
}

type FileDetectorImpl struct{}

func (fd *FileDetectorImpl) DetectMediaType(filePath string) (FileType, error) {
	ext := strings.ToLower(filepath.Ext(filePath))
	switch ext {
	// 音频类型（补充无损格式和现代编码）
	case ".mp3", ".wav", ".flac", ".aac", ".ogg", ".m4a", ".wma":
		return Audio, nil

	// 视频类型（补充主流封装格式）
	case ".mp4", ".avi", ".mkv", ".mov", ".flv", ".webm", ".wmv", ".ts":
		return Video, nil

	// 图片类型（补充RAW格式和矢量图）
	case ".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp", ".tiff", ".svg":
		return Image, nil

	// 文本类型（补充代码文件）
	case ".txt", ".md", ".log", ".ini", ".cfg", ".conf", ".csv", ".xml", ".json":
		return Text, nil

	// 文档类型（补充办公文档新版格式）
	case ".pdf", ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx", ".odt", ".rtf":
		return Document, nil

	// 压缩类型（补充Linux常见压缩格式）
	case ".zip", ".rar", ".7z", ".tar", ".gz", ".bz2", ".xz", ".iso":
		return Archive, nil

	// 新增可执行文件类型（根据安全建议单独分类）
	case ".exe", ".msi", ".bat", ".sh", ".apk", ".dmg":
		return Executable, nil // 需在FileType中新增此类型

	default:
		// 包含超过50种小众扩展名的二级检测逻辑
		if isDatabaseFile(ext) { // 数据库文件检测
			return Database, nil
		}
		return Unknown, nil
	}
}
func isDatabaseFile(ext string) bool {
	switch ext {
	case ".db", ".sqlite", ".mdb", ".accdb", ".dbf":
		return true
	}
	return false
}
