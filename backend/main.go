package main

import (
	"github.com/elhu/pressepapier/backend/handlers"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func main() {
	// Echo instance
	e := echo.New()

	// Middleware
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())

	// Routes
	e.GET("/health-check", handlers.HealthCheck)

	// Start server
	e.Logger.Fatal(e.Start(":1323"))
}
