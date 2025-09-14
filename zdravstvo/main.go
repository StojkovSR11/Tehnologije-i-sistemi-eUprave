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
			"service": "zdravstvo",
		})
	})

	// API routes group
	api := r.Group("/api/v1")
	{
		// Placeholder routes - will be implemented in later tasks
		api.POST("/pregledi", func(c *gin.Context) {
			c.JSON(http.StatusNotImplemented, gin.H{"message": "Not implemented yet"})
		})
		api.POST("/uputi", func(c *gin.Context) {
			c.JSON(http.StatusNotImplemented, gin.H{"message": "Not implemented yet"})
		})
		api.GET("/validacija/:jmbg", func(c *gin.Context) {
			c.JSON(http.StatusNotImplemented, gin.H{"message": "Not implemented yet"})
		})
		api.GET("/notifikacije/:jmbg", func(c *gin.Context) {
			c.JSON(http.StatusNotImplemented, gin.H{"message": "Not implemented yet"})
		})
		api.PUT("/pregledi/:id/checkin", func(c *gin.Context) {
			c.JSON(http.StatusNotImplemented, gin.H{"message": "Not implemented yet"})
		})
	}

	log.Println("Zdravstvo service starting on port 8080")
	if err := r.Run(":8080"); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}
