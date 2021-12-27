package main

import (
	"os"

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

	// Setup DB connection
	db, err := models.NewDB(os.Getenv("MYSQL_URL"))
	if err != nil {
		e.Logger.Fatal(err)
	}
	env := &utils.Env{db}

	// Middleware
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())
	e.Use(middleware.CORS())

	// Routes
	e.GET("/health-check", handlerWrapper(env, handlers.HealthCheck))

	authMiddleware, err := middlewares.FirebaseAuth()
	if err != nil {
		e.Logger.Fatal(err)
	}
	g := e.Group("/api", authMiddleware)
	g.GET("/clipboards", handlerWrapper(env, handlers.IndexClipboards))
	g.POST("/clipboards", handlerWrapper(env, handlers.CreateClipboards))
	g.POST("/clipboards/files", handlerWrapper(env, handlers.CreateClipboardsFiles))
	g.DELETE("/clipboards/:id", handlerWrapper(env, handlers.DeleteClipboards))

	// Start server
	port, found := os.LookupEnv("PORT")
	if !found {
		port = "1323"
	}
	e.Logger.Fatal(e.Start(":" + port))
}
