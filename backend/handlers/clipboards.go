package handlers

import (
	"net/http"

	"github.com/elhu/pressepapier/backend/renderings"
	"github.com/elhu/pressepapier/backend/utils"
	"github.com/labstack/echo/v4"
)

// IndexClipboards - returns all clipboards for a given user
func IndexClipboards(c echo.Context, e *utils.Env) error {
	cc := c.(*utils.Context)
	clipboards, err := e.DB.AllClipboards(cc.Token.UID)
	if err != nil {
		return err
	}
	resp := make([]renderings.ClipboardResponse, 0)
	for _, cb := range clipboards {
		resp = append(resp, renderings.ClipboardResponse{
			ID:   cb.ID,
			Data: cb.Data,
		})
	}
	return c.JSON(http.StatusOK, resp)
}
