package main

import (
	"context"
	"log"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"

	zdravstvoclient "predskolske-ustanove/client"
	"predskolske-ustanove/handler"
	"predskolske-ustanove/repository"
	"predskolske-ustanove/service"

	"predskolske-ustanove/middleware"
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
	//clientOptions := options.Client().ApplyURI("mongodb://localhost:27017")
	clientOptions := options.Client().ApplyURI("mongodb://admin:password@mongodb:27017/egovernment?authSource=admin")
	client, err := mongo.Connect(ctx, clientOptions)
	if err != nil {
		log.Fatal("Greska pri povezivanju sa MongoDB:", err)
	}
	db := client.Database("predskolske_ustanove")

	// Inicijalizacija repository-ja
	deteRepo := repository.NewDeteRepository(db)
	vrticRepo := repository.NewVrticRepository(db)
	zahtevRepo := repository.NewZahtevRepository(db)
	grupaRepo := repository.NewGrupaRepository(db)
	evidencijaRepo := repository.NewEvidencijaRepository(db)
	obavestenjeRepo := repository.NewObavestenjeRepository(db)

	// Inicijalizacija service-ja
	deteService := service.NewDeteService(deteRepo)
	vrticService := service.NewVrticService(vrticRepo)
	zdravstvoClient := zdravstvoclient.NewZdravstvoClient()
	zahtevService := service.NewZahtevService(zahtevRepo, deteRepo, vrticRepo, zdravstvoClient)
	obavestenjeService := service.NewObavestenjeService(obavestenjeRepo)
	grupaService := service.NewGrupaService(grupaRepo, deteRepo, zahtevRepo, vrticRepo, obavestenjeService)
	evidencijaService := service.NewEvidencijaService(evidencijaRepo, deteRepo)

	// Inicijalizacija handler-a
	deteHandler := handler.NewDeteHandler(deteService)
	vrticHandler := handler.NewVrticHandler(vrticService)
	zahtevHandler := handler.NewZahtevHandler(zahtevService)
	grupaHandler := handler.NewGrupaHandler(grupaService)
	evidencijaHandler := handler.NewEvidencijaHandler(evidencijaService)
	obavestenjeHandler := handler.NewObavestenjeHandler(obavestenjeService)

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

		// Zahtev (read/update za admin tok)
		api.GET("/zahtev/:id", zahtevHandler.ZahtevPoID)
		api.GET("/zahtev", zahtevHandler.SviZahtevi)
		api.PUT("/zahtev/:id", zahtevHandler.AzurirajZahtev)
		api.DELETE("/zahtev/:id", zahtevHandler.ObrisiZahtev)

		api.PUT("/zahtev/:id/odobri", zahtevHandler.OdobriZahtev)
		api.PUT("/zahtev/:id/odbij", zahtevHandler.OdbijZahtev)

		// Grupa
		api.POST("/grupa", grupaHandler.KreirajGrupu)
		api.GET("/grupa/:id", grupaHandler.GrupaPoID)
		api.GET("/grupe/:vrticID", grupaHandler.SveGrupe)
		api.PUT("/grupa/:id", grupaHandler.AzurirajGrupu)
		api.DELETE("/grupa/:id", grupaHandler.ObrisiGrupu)

		api.POST("/grupa/dodaj-dete", grupaHandler.DodajDeteUGrupu)

		// Evidencija prisustva
		api.POST("/prisustvo/dogadjaj", evidencijaHandler.DodajDogadjaj)
		api.GET("/prisustvo", evidencijaHandler.PregledEvidencije)
	}

	auth := api.Group("/")
	auth.Use(middleware.JWTAuthMiddleware())
	{
		auth.GET("/moja-deca", deteHandler.MojaDeca)
		auth.POST("/moje-dete", deteHandler.KreirajMojeDete)
		auth.POST("/zahtev", zahtevHandler.KreirajZahtev)
		auth.GET("/obavestenja/moja", obavestenjeHandler.MojaObavestenja)
	}

	log.Println("Predskolske ustanove service starting on port 8081")
	if err := r.Run(":8081"); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}
