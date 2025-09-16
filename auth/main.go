package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"

	"auth/handler"
	"auth/repository"
	"auth/service"
)

func main() {
	// Povezivanje na MongoDB
	mongoURI := os.Getenv("MONGODB_URI")
	if mongoURI == "" {
		mongoURI = "mongodb://localhost:27017"
	}

	clientOptions := options.Client().ApplyURI(mongoURI)
	client, err := mongo.NewClient(clientOptions)
	if err != nil {
		log.Fatal(err)
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	err = client.Connect(ctx)
	if err != nil {
		log.Fatal(err)
	}
	defer client.Disconnect(ctx)

	db := client.Database("egovernment") // ili iz .env
	userCollection := db.Collection("korisnici")

	// Kreiranje repo, servisa i handlera
	userRepo := repository.NewKorisnikRepository(userCollection)
	jwtSecret := "tajna123" // može i iz env
	userService := service.NewKorisnikService(userRepo, jwtSecret)
	userHandler := handler.NewKorisnikHandler(userService)

	// Inicijalizacija Gin routera
	router := gin.Default()
	router.Use(CORSMiddleware())

	// Rute
	router.POST("/register", userHandler.RegistrujKorisnika)
	router.POST("/login", userHandler.Login)
	router.GET("/korisnici", userHandler.Svi)
	router.DELETE("/korisnici/:jmbg", userHandler.Obrisi)

	// Health check
	router.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "ok"})
	})

	port := os.Getenv("PORT")
	if port == "" {
		port = "8082"
	}

	log.Println("Auth service running on port", port)
	srv := &http.Server{
		Addr:    ":" + port,
		Handler: router,
	}

	log.Fatal(srv.ListenAndServe())
}

// CORSMiddleware dozvoljava frontend pristup
func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Header("Access-Control-Allow-Origin", "*") // ili http://localhost:4200
		c.Header("Access-Control-Allow-Credentials", "true")
		c.Header("Access-Control-Allow-Headers", "Content-Type, Authorization")
		c.Header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}
