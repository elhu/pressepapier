package handlers

import (
	"net/http"

	"github.com/elhu/pressepapier/backend/renderings"
	"github.com/elhu/pressepapier/backend/utils"
	"github.com/labstack/echo/v4"
)

// HealthCheck - Health Check Handler
func HealthCheck(c echo.Context, e *utils.Env) error {
	resp := renderings.HealthCheckResponse{
		Message: "Alive!",
	}
	return c.JSON(http.StatusOK, resp)
}
