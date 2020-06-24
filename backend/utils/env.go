package utils

import (
	"github.com/elhu/pressepapier/backend/models"
)

// Env holds long-lived shared variables
type Env struct {
	DB *models.DB
}
