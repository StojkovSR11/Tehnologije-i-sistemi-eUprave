package handler

import (
	"net/http"
	"predskolske-ustanove/model"
	"predskolske-ustanove/service"

	"github.com/gin-gonic/gin"
)

type ZahtevHandler struct {
	service *service.ZahtevService
}

func NewZahtevHandler(s *service.ZahtevService) *ZahtevHandler {
	return &ZahtevHandler{service: s}
}

// Kreiranje zahteva
func (h *ZahtevHandler) KreirajZahtev(c *gin.Context) {
	var zahtev model.ZahtevZaUpis
	if err := c.ShouldBindJSON(&zahtev); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "neispravni podaci"})
		return
	}

	noviZahtev, err := h.service.CreateZahtev(&zahtev)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "greska pri kreiranju zahteva"})
		return
	}
	c.JSON(http.StatusCreated, noviZahtev)
}

// Vrati sve zahteve
func (h *ZahtevHandler) SviZahtevi(c *gin.Context) {
	zahtevi, err := h.service.GetAllZahtevi()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "greska pri ucitavanju zahteva"})
		return
	}
	c.JSON(http.StatusOK, zahtevi)
}

// Vrati zahtev po ID-u
func (h *ZahtevHandler) ZahtevPoID(c *gin.Context) {
	id := c.Param("id")
	zahtev, err := h.service.GetZahtevByID(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "zahtev ne postoji"})
		return
	}
	c.JSON(http.StatusOK, zahtev)
}

// Ažuriranje zahteva
func (h *ZahtevHandler) AzurirajZahtev(c *gin.Context) {
	id := c.Param("id")
	var zahtev model.ZahtevZaUpis
	if err := c.ShouldBindJSON(&zahtev); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "neispravni podaci"})
		return
	}

	updatedZahtev, err := h.service.UpdateZahtev(id, &zahtev)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "greska pri azuriranju"})
		return
	}
	c.JSON(http.StatusOK, updatedZahtev)
}

// Brisanje zahteva
func (h *ZahtevHandler) ObrisiZahtev(c *gin.Context) {
	id := c.Param("id")
	if err := h.service.DeleteZahtev(id); err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "zahtev obrisan"})
}


func (h *ZahtevHandler) OdobriZahtev(c *gin.Context) {
	id := c.Param("id")

	zahtev, err := h.service.OdobriZahtev(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, zahtev)
}


func (h *ZahtevHandler) OdbijZahtev(c *gin.Context) {
	id := c.Param("id")

	var body struct {
		Napomena string `json:"napomena"`
	}

	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "neispravni podaci"})
		return
	}

	zahtev, err := h.service.OdbijZahtev(id, body.Napomena)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, zahtev)
}
