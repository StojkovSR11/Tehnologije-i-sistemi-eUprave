package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"predskolske-ustanove/service"
)

type EvidencijaHandler struct {
	service *service.EvidencijaService
}

func NewEvidencijaHandler(s *service.EvidencijaService) *EvidencijaHandler {
	return &EvidencijaHandler{service: s}
}

func (h *EvidencijaHandler) DodajDogadjaj(c *gin.Context) {
	var req struct {
		DeteID       string `json:"deteID"`
		TipDogadjaja string `json:"tipDogadjaja"`
		Napomena     string `json:"napomena"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "neispravni podaci"})
		return
	}

	evidencija, err := h.service.DodajDogadjaj(req.DeteID, req.TipDogadjaja, req.Napomena)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, evidencija)
}

func (h *EvidencijaHandler) PregledEvidencije(c *gin.Context) {
	deteID := c.Query("deteID")
	od := c.Query("od")
	do := c.Query("do")

	evidencija, err := h.service.PregledEvidencije(deteID, od, do)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, evidencija)
}
