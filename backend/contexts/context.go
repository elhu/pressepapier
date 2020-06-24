package contexts

import (
	"firebase.google.com/go/v4/auth"
	"github.com/labstack/echo/v4"
)

// Context for all requests
type Context struct {
	echo.Context
	Token *auth.Token
}
