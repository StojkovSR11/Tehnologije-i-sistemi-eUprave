package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"

	"predskolske-ustanove/service"
)

type ObavestenjeHandler struct {
	service *service.ObavestenjeService
}

func NewObavestenjeHandler(s *service.ObavestenjeService) *ObavestenjeHandler {
	return &ObavestenjeHandler{service: s}
}

func (h *ObavestenjeHandler) MojaObavestenja(c *gin.Context) {
	korisnikIDVal, exists := c.Get("korisnikID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "korisnik nije ulogovan"})
		return
	}

	korisnikID, ok := korisnikIDVal.(primitive.ObjectID)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "neispravan korisnik"})
		return
	}

	obavestenja, err := h.service.MojaObavestenja(korisnikID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "greska pri ucitavanju obavestenja"})
		return
	}

	c.JSON(http.StatusOK, obavestenja)
}
