package middleware

import (
	"net/http"
	"os"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func jwtSecretBytes() []byte {
	// U docker-compose-u imamo JWT_SECRET, a auth service trenutno koristi hardkodovan "tajna123".
	// Ovo omogućava kompatibilnost i u lokalnom i u docker okruženju.
	secret := os.Getenv("JWT_SECRET")
	if secret == "" {
		secret = "tajna123"
	}
	return []byte(secret)
}

// JWTAuthMiddleware proverava token
func JWTAuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization header nije prosledjen"})
			c.Abort()
			return
		}

		// Token se obično šalje kao "Bearer <token>"
		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Neispravan Authorization header"})
			c.Abort()
			return
		}

		tokenStr := parts[1]

		// Parsiranje i validacija tokena
		token, err := jwt.Parse(tokenStr, func(token *jwt.Token) (interface{}, error) {
			// Provera da li je metoda potpisivanja očekivana
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, jwt.ErrTokenSignatureInvalid
			}
			return jwtSecretBytes(), nil
		})
		if err != nil || !token.Valid {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Nevalidan token"})
			c.Abort()
			return
		}

		// Izvuci korisnikID iz tokena
		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Nevalidni claim-i u tokenu"})
			c.Abort()
			return
		}

		// Token iz auth servisa sadrži claim "id" (ObjectID hex string), dok predskolske-ustanove
		// prvobitno očekuje claim "korisnikID". Prihvatamo oba (fallback).
		var korisnikIDHex string
		if v, ok := claims["korisnikID"].(string); ok && v != "" {
			korisnikIDHex = v
		} else if v, ok := claims["id"].(string); ok && v != "" {
			korisnikIDHex = v
		}

		if korisnikIDHex == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Nedostaje korisnikID/id u tokenu"})
			c.Abort()
			return
		}

		korisnikID, err := primitive.ObjectIDFromHex(korisnikIDHex)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "korisnikID nije validan ObjectID"})
			c.Abort()
			return
		}

		// Stavi korisnikID u context
		c.Set("korisnikID", korisnikID)

		c.Next()
	}
}