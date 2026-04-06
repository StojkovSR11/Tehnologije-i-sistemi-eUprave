package handler

import (
	"net/http"
	"predskolske-ustanove/model"
	"predskolske-ustanove/service"

	"github.com/gin-gonic/gin"
)

type GrupaHandler struct {
	service *service.GrupaService
}

func NewGrupaHandler(s *service.GrupaService) *GrupaHandler {
	return &GrupaHandler{service: s}
}

// Kreiranje grupe
func (h *GrupaHandler) KreirajGrupu(c *gin.Context) {
	var grupa model.Grupa
	if err := c.ShouldBindJSON(&grupa); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "neispravni podaci"})
		return
	}

	novaGrupa, err := h.service.CreateGrupa(&grupa)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, novaGrupa)
}

// Sve grupe za vrtic
func (h *GrupaHandler) SveGrupe(c *gin.Context) {
	vrticID := c.Param("vrticID")

	grupe, err := h.service.GetAllGrupeZaVrtic(vrticID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "greska pri ucitavanju grupa"})
		return
	}

	c.JSON(http.StatusOK, grupe)
}

// Grupa po ID
func (h *GrupaHandler) GrupaPoID(c *gin.Context) {
	id := c.Param("id")

	grupa, err := h.service.GetGrupaByID(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "grupa ne postoji"})
		return
	}

	c.JSON(http.StatusOK, grupa)
}

// Azuriranje grupe
func (h *GrupaHandler) AzurirajGrupu(c *gin.Context) {
	id := c.Param("id")

	var grupa model.Grupa
	if err := c.ShouldBindJSON(&grupa); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "neispravni podaci"})
		return
	}

	updated, err := h.service.UpdateGrupa(id, &grupa)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "greska pri azuriranju"})
		return
	}

	c.JSON(http.StatusOK, updated)
}

// Brisanje grupe
func (h *GrupaHandler) ObrisiGrupu(c *gin.Context) {
	id := c.Param("id")

	if err := h.service.DeleteGrupa(id); err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "grupa obrisana"})
}

// 🔥 Dodavanje deteta u grupu
func (h *GrupaHandler) DodajDeteUGrupu(c *gin.Context) {

	var request struct {
		DeteID  string `json:"deteID"`
		GrupaID string `json:"grupaID"`
	}

	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "neispravni podaci"})
		return
	}

	err := h.service.AddDeteToGrupa(request.DeteID, request.GrupaID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "dete dodato u grupu"})
}