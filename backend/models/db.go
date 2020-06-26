package models

import (
	"database/sql"

	// Load myqsl driver
	_ "github.com/go-sql-driver/mysql"
)

// Datastore is a generic interface to abstract the database
type Datastore interface {
	AllClipboards() ([]*Clipboard, error)
}

// DB holds the database connection
type DB struct {
	*sql.DB
}

// NewDB instantiates a new database connection pool
func NewDB(dataSourceName string) (*DB, error) {
	db, err := sql.Open("mysql", dataSourceName)
	if err != nil {
		return nil, err
	}
	if err = db.Ping(); err != nil {
		return nil, err
	}
	return &DB{db}, nil
}
