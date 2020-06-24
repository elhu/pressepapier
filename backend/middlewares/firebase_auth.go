package middlewares

import (
	"context"
	"net/http"
	"os"
	"strings"

	firebase "firebase.google.com/go/v4"
	"github.com/elhu/pressepapier/backend/contexts"
	"github.com/labstack/echo/v4"
	"google.golang.org/api/option"
)

// FirebaseAuth handles firebase authentication and adds currentUser info to context
func FirebaseAuth() (echo.MiddlewareFunc, error) {
	opt := option.WithCredentialsJSON([]byte(os.Getenv("FIREBASE_CONFIG")))
	app, err := firebase.NewApp(context.Background(), nil, opt)
	if err != nil {
		return nil, err
	}

	auth, err := app.Auth(context.Background())
	if err != nil {
		return nil, err
	}

	authMiddleware := func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			header := c.Request().Header.Get(echo.HeaderAuthorization)
			idToken := strings.TrimSpace(strings.Replace(header, "Bearer", "", 1))
			token, err := auth.VerifyIDToken(context.Background(), idToken)
			if err != nil {
				return c.JSON(http.StatusInternalServerError, err.Error())
			}
			rc := &contexts.Context{
				Context: c,
				Token:   token,
			}
			return next(rc)
		}
	}
	return authMiddleware, nil
}
