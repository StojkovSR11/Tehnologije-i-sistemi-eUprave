package handler

import (
	"net/http"
	"predskolske-ustanove/model"
	"predskolske-ustanove/service"

	"github.com/gin-gonic/gin"
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

	novoDete, err := h.service.CreateDete(&dete)
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

// Brisanje deteta
func (h *DeteHandler) ObrisiDete(c *gin.Context) {
	id := c.Param("id")
	if err := h.service.DeleteDete(id); err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "dete obrisano"})
}
