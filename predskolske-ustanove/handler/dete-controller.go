package handler

import (
	"net/http"
	"predskolske-ustanove/model"
	"predskolske-ustanove/service"

	"github.com/gin-gonic/gin"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type DeteHandler struct {
	service *service.DeteService
}

func NewDeteHandler(s *service.DeteService) *DeteHandler {
	return &DeteHandler{service: s}
}

// Kreiranje deteta
func (h *DeteHandler) KreirajDete(c *gin.Context) {
	var dete model.Dete
	if err := c.ShouldBindJSON(&dete); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "neispravni podaci"})
		return
	}

	if dete.KorisnikID.IsZero() {
		c.JSON(http.StatusBadRequest, gin.H{"error": "korisnikId je obavezan"})
		return
	}

	novoDete, err := h.service.CreateDete(&dete, dete.KorisnikID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "greska pri kreiranju deteta"})
		return
	}

	c.JSON(http.StatusCreated, novoDete)
}

// Vrati sve
func (h *DeteHandler) SvaDeca(c *gin.Context) {
	decа, err := h.service.GetAllDeca()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "greska pri ucitavanju dece"})
		return
	}
	c.JSON(http.StatusOK, decа)
}

// Vrati po ID-u
func (h *DeteHandler) DetePoID(c *gin.Context) {
	id := c.Param("id")
	dete, err := h.service.GetDeteByID(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "dete ne postoji"})
		return
	}
	c.JSON(http.StatusOK, dete)
}

// Ažuriranje deteta
func (h *DeteHandler) AzurirajDete(c *gin.Context) {
	id := c.Param("id")
	var dete model.Dete
	if err := c.ShouldBindJSON(&dete); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "neispravni podaci"})
		return
	}

	updatedDete, err := h.service.UpdateDete(id, &dete)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "greska pri azuriranju"})
		return
	}
	c.JSON(http.StatusOK, updatedDete)
}


// Vrati decu za trenutno ulogovanog korisnika
func (h *DeteHandler) MojaDeca(c *gin.Context) {
	// Pretpostavljamo da middleware za JWT stavlja korisnikID u context
	korisnikIDVal, exists := c.Get("korisnikID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "korisnik nije ulogovan"})
		return
	}

	korisnikID, ok := korisnikIDVal.(primitive.ObjectID)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "neispravan korisnikID"})
		return
	}

	deca, err := h.service.GetDecuZaKorisnika(korisnikID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "greska pri ucitavanju dece"})
		return
	}

	c.JSON(http.StatusOK, deca)
}

// Kreiranje deteta za logovanog korisnika
func (h *DeteHandler) KreirajMojeDete(c *gin.Context) {
	var dete model.Dete
	if err := c.ShouldBindJSON(&dete); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "neispravni podaci"})
		return
	}

	korisnikIDVal, exists := c.Get("korisnikID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "korisnik nije ulogovan"})
		return
	}

	korisnikID := korisnikIDVal.(primitive.ObjectID)

	novoDete, err := h.service.CreateDete(&dete, korisnikID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, novoDete)
}



// Brisanje deteta — samo ulogovani roditelj može obrisati sopstveno dete.
func (h *DeteHandler) ObrisiDete(c *gin.Context) {
	korisnikIDVal, exists := c.Get("korisnikID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "korisnik nije ulogovan"})
		return
	}
	korisnikID, ok := korisnikIDVal.(primitive.ObjectID)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "neispravan korisnikID"})
		return
	}

	id := c.Param("id")
	dete, err := h.service.GetDeteByID(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "dete ne postoji"})
		return
	}
	if dete.KorisnikID != korisnikID {
		c.JSON(http.StatusForbidden, gin.H{"error": "nije dozvoljeno brisati tudje dete"})
		return
	}

	if err := h.service.DeleteDete(id); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "dete obrisano"})
}
