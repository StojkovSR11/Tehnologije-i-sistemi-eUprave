package main

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
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
	// Initialize Gin router
	r := gin.Default()

	// Add CORS middleware
	r.Use(CORSMiddleware())

	// Health check endpoint
	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"status":  "ok",
			"service": "predskolske-ustanove",
		})
	})

	// API routes group
	api := r.Group("/api/v1")
	{
		// Placeholder routes - will be implemented in later tasks
		api.POST("/zahtevi", func(c *gin.Context) {
			c.JSON(http.StatusNotImplemented, gin.H{"message": "Not implemented yet"})
		})
		api.GET("/vrtici", func(c *gin.Context) {
			c.JSON(http.StatusNotImplemented, gin.H{"message": "Not implemented yet"})
		})
		api.POST("/zahtevi/:id/odobri", func(c *gin.Context) {
			c.JSON(http.StatusNotImplemented, gin.H{"message": "Not implemented yet"})
		})
		api.GET("/potvrde/:id", func(c *gin.Context) {
			c.JSON(http.StatusNotImplemented, gin.H{"message": "Not implemented yet"})
		})
		api.GET("/obavestenja/:jmbg", func(c *gin.Context) {
			c.JSON(http.StatusNotImplemented, gin.H{"message": "Not implemented yet"})
		})
	}

	log.Println("Predskolske ustanove service starting on port 8081")
	if err := r.Run(":8081"); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}
