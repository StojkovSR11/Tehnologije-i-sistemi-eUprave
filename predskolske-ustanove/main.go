package main

import (
	"context"
	"log"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"

	"predskolske-ustanove/handler"
	"predskolske-ustanove/repository"
	"predskolske-ustanove/service"
)

// CORS middleware
func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}

func main() {
	// MongoDB konekcija
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	clientOptions := options.Client().ApplyURI("mongodb://localhost:27017")
	client, err := mongo.Connect(ctx, clientOptions)
	if err != nil {
		log.Fatal("Greska pri povezivanju sa MongoDB:", err)
	}
	db := client.Database("predskolske_ustanove")

	// Inicijalizacija repository-ja
	deteRepo := repository.NewDeteRepository(db)
	vrticRepo := repository.NewVrticRepository(db)
	zahtevRepo := repository.NewZahtevRepository(db)

	// Inicijalizacija service-ja
	deteService := service.NewDeteService(deteRepo)
	vrticService := service.NewVrticService(vrticRepo)
	zahtevService := service.NewZahtevService(zahtevRepo, deteRepo, vrticRepo)


	// Inicijalizacija handler-a
	deteHandler := handler.NewDeteHandler(deteService)
	vrticHandler := handler.NewVrticHandler(vrticService)
	zahtevHandler := handler.NewZahtevHandler(zahtevService)

	// Gin router
	r := gin.Default()
	r.Use(CORSMiddleware())

	// Health check
	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"status":  "ok",
			"service": "predskolske-ustanove",
		})
	})

	// API rute
	api := r.Group("/api/v1")
	{
		// Detet
		api.POST("/dete", deteHandler.KreirajDete)
		api.GET("/dete/:id", deteHandler.DetePoID)
		api.GET("/dete", deteHandler.SvaDeca)
		api.PUT("/dete/:id", deteHandler.AzurirajDete)
		api.DELETE("/dete/:id", deteHandler.ObrisiDete)

		// Vrtic
		api.POST("/vrtic", vrticHandler.KreirajVrtic)
		api.GET("/vrtic/:id", vrticHandler.VrticPoID)
		api.GET("/vrtic", vrticHandler.SviVrtici)
		api.PUT("/vrtic/:id", vrticHandler.AzurirajVrtic)
		api.DELETE("/vrtic/:id", vrticHandler.ObrisiVrtic)

		// Zahtev
		api.POST("/zahtev", zahtevHandler.KreirajZahtev)
		api.GET("/zahtev/:id", zahtevHandler.ZahtevPoID)
		api.GET("/zahtev", zahtevHandler.SviZahtevi)
		api.PUT("/zahtev/:id", zahtevHandler.AzurirajZahtev)
		api.DELETE("/zahtev/:id", zahtevHandler.ObrisiZahtev)
	}

	log.Println("Predskolske ustanove service starting on port 8081")
	if err := r.Run(":8081"); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}
