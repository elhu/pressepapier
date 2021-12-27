package handlers

import (
	"net/http"
	"strconv"

	"github.com/elhu/pressepapier/backend/bindings"
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

// CreateClipboards - insert new clipboard, trims list and returns new entry
func CreateClipboards(c echo.Context, e *utils.Env) error {
	cc := c.(*utils.Context)
	newClipboard := &bindings.Clipboard{}
	if err := cc.Bind(newClipboard); err != nil {
		return err
	}
	cb, err := e.DB.CreateClipboard(cc.Token.UID, newClipboard.Data)
	if err != nil {
		return err
	}
	resp := renderings.ClipboardResponse{
		ID:   cb.ID,
		Data: cb.Data,
	}
	return c.JSON(http.StatusCreated, resp)
}

// CreateClipboards - insert new clipboard, trims list and returns new entry
func CreateClipboardsFiles(c echo.Context, e *utils.Env) error {
	cc := c.(*utils.Context)
	file, err := cc.FormFile("file")
	if err != nil {
		return err
	}
	src, err := file.Open()
	if err != nil {
		return err
	}
	defer src.Close()

	cb, err := e.DB.CreateClipboardFile(cc.Token.UID, src)
	if err != nil {
		return err
	}
	resp := renderings.ClipboardResponse{
		ID:   cb.ID,
		Data: cb.Data,
	}
	return c.JSON(http.StatusCreated, resp)
}

// DeleteClipboards - deletes the specified clipboard
func DeleteClipboards(c echo.Context, e *utils.Env) error {
	cc := c.(*utils.Context)
	id, err := strconv.Atoi(cc.Param("id"))
	if err != nil {
		return err
	}
	if err = e.DB.DeleteClipboard(cc.Token.UID, id); err != nil {
		return err
	}
	return c.NoContent(http.StatusOK)
}
