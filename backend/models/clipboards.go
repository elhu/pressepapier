package models

import (
	"database/sql"
	"io"
)

// Clipboard represents clipboard records from the database
type Clipboard struct {
	ID       int
	Data     string
	HasFile  bool
	UserUUID string
}

// AllClipboards returns all clipboards for a given user
func (db *DB) AllClipboards(userUUID string) ([]*Clipboard, error) {
	rows, err := db.Query("SELECT id, data, file IS NOT NULL AS has_file FROM clipboards WHERE user_uuid = ? ORDER BY id DESC", userUUID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var id int
	var data string
	var hasFile int
	var results []*Clipboard
	for rows.Next() {
		err := rows.Scan(&id, &data, &hasFile)
		if err != nil {
			return nil, err
		}
		results = append(results, &Clipboard{id, data, hasFile == 1, userUUID})
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return results, nil
}

// CreateClipboardFile does the following:
// * Create the new entry for the user with the file
// * Trim the extra entries if user has more than 10 clipboards
// * Returns the new entry
func (db *DB) CreateClipboardFile(userUUID string, file io.Reader) (*Clipboard, error) {
	tx, err := db.Begin()
	if err != nil {
		return nil, err
	}
	fileData, err := io.ReadAll(file)
	if err != nil {
		return nil, err
	}

	stmt := `
	INSERT INTO clipboards (user_uuid, data, file)
	VALUES (?, ?, ?)
	`
	res, err := tx.Exec(stmt, userUUID, "file.png", fileData)
	if err != nil {
		tx.Rollback()
		return nil, err
	}
	newID, err := res.LastInsertId()
	if err != nil {
		tx.Rollback()
		return nil, err
	}
	err = db.TrimEntries(userUUID, tx)
	if err != nil {
		tx.Rollback()
		return nil, err
	}
	if err = tx.Commit(); err != nil {
		return nil, err
	}
	return &Clipboard{
		ID:       int(newID),
		HasFile:  true,
		UserUUID: userUUID,
	}, nil
}

func (db *DB) TrimEntries(userUUID string, tx *sql.Tx) error {
	row := tx.QueryRow("SELECT COUNT(*) FROM clipboards WHERE user_uuid = ?", userUUID)
	var cnt int
	if err := row.Scan(&cnt); err != nil {
		tx.Rollback()
		return err
	}

	if cnt > 10 {
		_, err := tx.Exec("DELETE FROM clipboards WHERE user_uuid = ? ORDER BY id ASC LIMIT ?", userUUID, cnt-10)
		if err != nil {
			tx.Rollback()
			return err
		}
	}
	return nil
}

// CreateClipboard does the following:
// * Create the new entry for the user
// * Trim the extra entries if user has more than 10 clipboards
// * Returns the new entry
func (db *DB) CreateClipboard(userUUID string, data string) (*Clipboard, error) {
	tx, err := db.Begin()
	if err != nil {
		return nil, err
	}

	stmt := `
	INSERT INTO clipboards (user_uuid, data)
	VALUES (?, ?)
	`
	res, err := tx.Exec(stmt, userUUID, data)
	if err != nil {
		tx.Rollback()
		return nil, err
	}
	newID, err := res.LastInsertId()
	if err != nil {
		tx.Rollback()
		return nil, err
	}

	err = db.TrimEntries(userUUID, tx)
	if err != nil {
		tx.Rollback()
		return nil, err
	}
	if err = tx.Commit(); err != nil {
		return nil, err
	}
	return &Clipboard{
		ID:       int(newID),
		Data:     data,
		UserUUID: userUUID,
	}, nil
}

// DeleteClipboard deletes the specified clipboard for the specified user
func (db *DB) DeleteClipboard(userUUID string, cbID int) error {
	stmt := `
	DELETE FROM clipboards
	WHERE user_uuid = ? AND id = ?
	`
	_, err := db.Exec(stmt, userUUID, cbID)
	return err
}
