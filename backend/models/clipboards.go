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
