package models

// Clipboard represents clipboard records from the database
type Clipboard struct {
	ID       int
	Data     string
	UserUUID string
}

// AllClipboards returns all clipboards for a given user
func (db *DB) AllClipboards(userUUID string) ([]*Clipboard, error) {
	rows, err := db.Query("SELECT id, data FROM clipboards WHERE user_uuid = ? ORDER BY id DESC", userUUID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var id int
	var data string
	var results []*Clipboard
	for rows.Next() {
		err := rows.Scan(&id, &data)
		if err != nil {
			return nil, err
		}
		results = append(results, &Clipboard{id, data, userUUID})
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return results, nil
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

	row := tx.QueryRow("SELECT COUNT(*) FROM clipboards WHERE user_uuid = ?", userUUID)
	var cnt int
	if err = row.Scan(&cnt); err != nil {
		tx.Rollback()
		return nil, err
	}

	if cnt > 10 {
		_, err := tx.Exec("DELETE FROM clipboards WHERE user_uuid = ? ORDER BY id ASC LIMIT ?", userUUID, cnt-10)
		if err != nil {
			tx.Rollback()
			return nil, err
		}
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
