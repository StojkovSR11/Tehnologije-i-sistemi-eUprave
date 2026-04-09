package middleware

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

var jwtSecret = []byte("mojTajniJWT123") // zameni sa tvojim pravim tajnim kljucem

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
			return jwtSecret, nil
		})
		if err != nil || !token.Valid {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Nevalidan token"})
			c.Abort()
			return
		}

		// Izvuci korisnikID iz tokena
		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok || claims["korisnikID"] == nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Nevalidni claim-i u tokenu"})
			c.Abort()
			return
		}

		korisnikIDHex, ok := claims["korisnikID"].(string)
		if !ok {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "korisnikID nije string"})
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