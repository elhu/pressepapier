package contexts

import "github.com/labstack/echo"

// Context for all requests
type Context struct {
	echo.Context
	Token *fa.token
}
