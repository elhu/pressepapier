package main

import (
	"github.com/elhu/pressepapier/backend/handlers"
	"github.com/elhu/pressepapier/backend/middlewares"
	"github.com/elhu/pressepapier/backend/models"
	"github.com/elhu/pressepapier/backend/utils"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

type fnHandler func(echo.Context, *utils.Env) error

func handlerWrapper(env *utils.Env, handler fnHandler) echo.HandlerFunc {
	return func(c echo.Context) error {
		return handler(c, env)
	}
}

func main() {
	// Echo instance
	e := echo.New()

	// Middleware
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())

	// Routes
	e.GET("/health-check", handlerWrapper(env, handlers.HealthCheck))

	authMiddleware, err := middlewares.FirebaseAuth()
	if err != nil {
		e.Logger.Fatal(err)
	}
	g := e.Group("/api", authMiddleware)
	g.GET("/clipboards", handlers.HealthCheck)

	// Start server
	e.Logger.Fatal(e.Start(":1323"))
}
