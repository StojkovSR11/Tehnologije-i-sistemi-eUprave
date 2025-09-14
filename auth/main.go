package main

import (
	"log"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

// JWT secret key (in production, this should be from environment variable)
var jwtSecret = []byte("egovernment-secret-key-2024")

// User represents a user in the system
type User struct {
	ID       string `json:"id" bson:"_id"`
	JMBG     string `json:"jmbg" bson:"jmbg"`
	Email    string `json:"email" bson:"email"`
	Password string `json:"password" bson:"password"`
	Name     string `json:"name" bson:"name"`
	Role     string `json:"role" bson:"role"` // citizen, doctor, admin
}

// LoginRequest represents login request payload
type LoginRequest struct {
	JMBG     string `json:"jmbg"`
	Password string `json:"password"`
}

// TokenResponse represents JWT token response
type TokenResponse struct {
	Token     string `json:"token"`
	ExpiresAt int64  `json:"expires_at"`
	User      User   `json:"user"`
}

// Claims represents JWT claims
type Claims struct {
	UserID string `json:"user_id"`
	JMBG   string `json:"jmbg"`
	Role   string `json:"role"`
	jwt.RegisteredClaims
}

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

// Generate JWT token
func generateToken(user User) (string, int64, error) {
	expirationTime := time.Now().Add(24 * time.Hour)
	claims := &Claims{
		UserID: user.ID,
		JMBG:   user.JMBG,
		Role:   user.Role,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expirationTime),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			Issuer:    "egovernment-auth",
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(jwtSecret)
	return tokenString, expirationTime.Unix(), err
}

// Validate JWT token
func validateToken(tokenString string) (*Claims, error) {
	claims := &Claims{}
	token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
		return jwtSecret, nil
	})

	if err != nil || !token.Valid {
		return nil, err
	}

	return claims, nil
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
			"service": "auth",
		})
	})

	// API routes group
	api := r.Group("/api/v1")
	{
		// Authentication endpoints
		api.POST("/login", loginHandler)
		api.POST("/register", registerHandler)
		api.POST("/validate", validateTokenHandler)
		api.POST("/refresh", refreshTokenHandler)
		api.GET("/user/:jmbg", getUserHandler)

		// SSO endpoints for other services
		api.GET("/sso/verify", verifyTokenHandler)
		api.POST("/sso/logout", logoutHandler)
	}

	log.Println("Auth service starting on port 8082")
	if err := r.Run(":8082"); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}

// Login handler
func loginHandler(c *gin.Context) {
	var req LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	// Mock user validation (in real implementation, check against database)
	user := User{
		ID:   "user_" + req.JMBG,
		JMBG: req.JMBG,
		Name: "Test User",
		Role: "citizen",
	}

	// Generate token
	token, expiresAt, err := generateToken(user)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
		return
	}

	c.JSON(http.StatusOK, TokenResponse{
		Token:     token,
		ExpiresAt: expiresAt,
		User:      user,
	})
}

// Register handler
func registerHandler(c *gin.Context) {
	c.JSON(http.StatusNotImplemented, gin.H{"message": "Registration not implemented yet"})
}

// Validate token handler
func validateTokenHandler(c *gin.Context) {
	tokenString := c.GetHeader("Authorization")
	if tokenString == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "No token provided"})
		return
	}

	// Remove "Bearer " prefix if present
	if len(tokenString) > 7 && tokenString[:7] == "Bearer " {
		tokenString = tokenString[7:]
	}

	claims, err := validateToken(tokenString)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"valid":   true,
		"user_id": claims.UserID,
		"jmbg":    claims.JMBG,
		"role":    claims.Role,
	})
}

// Refresh token handler
func refreshTokenHandler(c *gin.Context) {
	c.JSON(http.StatusNotImplemented, gin.H{"message": "Token refresh not implemented yet"})
}

// Get user handler
func getUserHandler(c *gin.Context) {
	jmbg := c.Param("jmbg")

	// Mock user data (in real implementation, fetch from database)
	user := User{
		ID:   "user_" + jmbg,
		JMBG: jmbg,
		Name: "Test User",
		Role: "citizen",
	}

	c.JSON(http.StatusOK, user)
}

// SSO verify token handler
func verifyTokenHandler(c *gin.Context) {
	tokenString := c.GetHeader("Authorization")
	if tokenString == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "No token provided"})
		return
	}

	// Remove "Bearer " prefix if present
	if len(tokenString) > 7 && tokenString[:7] == "Bearer " {
		tokenString = tokenString[7:]
	}

	claims, err := validateToken(tokenString)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"authenticated": true,
		"user_id":       claims.UserID,
		"jmbg":          claims.JMBG,
		"role":          claims.Role,
	})
}

// Logout handler
func logoutHandler(c *gin.Context) {
	// In a real implementation, you might want to blacklist the token
	c.JSON(http.StatusOK, gin.H{"message": "Logged out successfully"})
}
