package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// ValidacijaKnjiziceResponse — razmena 1 (GET): provera knjižice deteta
type ValidacijaKnjiziceResponse struct {
	JMBG            string `json:"jmbg"`
	KnjizicaVazeca  bool   `json:"knjizicaVazeca"`
	Napomena        string `json:"napomena,omitempty"`
}

// ObavezniPregledResponse — razmena 2 (GET): obavezan pregled pred upisom u vrtić
type ObavezniPregledResponse struct {
	JMBG                      string `json:"jmbg"`
	ObavljenZaPredskolsko     bool   `json:"obavljenZaPredskolsko"`
	Napomena                  string `json:"napomena,omitempty"`
}

// DogadjajUpisOdobrenRequest — razmena 3 (POST): evidencija događaja nakon odobrenja (mock)
type DogadjajUpisOdobrenRequest struct {
	JMBG    string `json:"jmbg"`
	DeteID  string `json:"deteId"`
	VrticID string `json:"vrticId"`
	Poruka  string `json:"poruka,omitempty"`
}

func handleValidacija(c *gin.Context) {
	jmbg := c.Param("jmbg")
	knj, _, napKnj, _ := mockZaJMBG(jmbg)
	c.JSON(http.StatusOK, ValidacijaKnjiziceResponse{
		JMBG:           jmbg,
		KnjizicaVazeca: knj,
		Napomena:       napKnj,
	})
}

func handleObavezniPregled(c *gin.Context) {
	jmbg := c.Param("jmbg")
	_, preg, _, napPr := mockZaJMBG(jmbg)
	c.JSON(http.StatusOK, ObavezniPregledResponse{
		JMBG:                  jmbg,
		ObavljenZaPredskolsko: preg,
		Napomena:              napPr,
	})
}

func handleDogadjajUpisOdobren(c *gin.Context) {
	var req DogadjajUpisOdobrenRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "neispravno telo zahteva"})
		return
	}
	// Mock: samo potvrda prijema (nema baze)
	c.JSON(http.StatusOK, gin.H{
		"status":  "primljeno",
		"service": "zdravstvo",
		"poruka":  "Mock evidencija: događaj upisa zabeležen za JMBG " + req.JMBG,
	})
}
