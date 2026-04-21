package handler

import (
	"log"
	"net/http"
	"predskolske-ustanove/model"
	"predskolske-ustanove/service"

	"github.com/gin-gonic/gin"
)

type VrticHandler struct {
	service *service.VrticService
}

func NewVrticHandler(s *service.VrticService) *VrticHandler {
	return &VrticHandler{service: s}
}

// Kreiranje vrtica
func (h *VrticHandler) KreirajVrtic(c *gin.Context) {
	var vrtic model.Vrtic
	if err := c.ShouldBindJSON(&vrtic); err != nil {
		log.Println("JSON bind error:", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "neispravni podaci"})
		return
	}
	log.Println("Vrtic primljen:", vrtic)

	novoVrtic, err := h.service.CreateVrtic(&vrtic)
	if err != nil {
		log.Println("Service error:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "greska pri kreiranju vrtica"})
		return
	}
	c.JSON(http.StatusCreated, novoVrtic)
}

// Vrati sve vrtice
func (h *VrticHandler) SviVrtici(c *gin.Context) {
	vrtici, err := h.service.GetAllVrtici()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "greska pri ucitavanju vrtica"})
		return
	}
	c.JSON(http.StatusOK, vrtici)
}

// Vrati vrtic po ID-u
func (h *VrticHandler) VrticPoID(c *gin.Context) {
	id := c.Param("id")
	vrtic, err := h.service.GetVrticByID(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "vrtic ne postoji"})
		return
	}
	c.JSON(http.StatusOK, vrtic)
}

// Ažuriranje vrtica
func (h *VrticHandler) AzurirajVrtic(c *gin.Context) {
	id := c.Param("id")
	var vrtic model.Vrtic
	if err := c.ShouldBindJSON(&vrtic); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "neispravni podaci"})
		return
	}

	updatedVrtic, err := h.service.UpdateVrtic(id, &vrtic)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "greska pri azuriranju"})
		return
	}
	c.JSON(http.StatusOK, updatedVrtic)
}

// Brisanje vrtica
func (h *VrticHandler) ObrisiVrtic(c *gin.Context) {
	id := c.Param("id")
	if err := h.service.DeleteVrtic(id); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "vrtic obrisan"})
}
