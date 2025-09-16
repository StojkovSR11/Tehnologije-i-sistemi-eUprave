package handler

import (
	"auth/model"
	"auth/service"
	"net/http"

	"github.com/gin-gonic/gin"
)

type KorisnikHandler struct {
	service *service.KorisnikService
}

func NewKorisnikHandler(s *service.KorisnikService) *KorisnikHandler {
	return &KorisnikHandler{service: s}
}

// Registracija korisnika
func (h *KorisnikHandler) RegistrujKorisnika(c *gin.Context) {
	var korisnik model.Korisnik
	if err := c.ShouldBindJSON(&korisnik); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "neispravni podaci"})
		return
	}

	novi, err := h.service.RegistrujKorisnika(&korisnik)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "greska pri registraciji"})
		return
	}

	c.JSON(http.StatusCreated, novi)
}

// Login korisnika
func (h *KorisnikHandler) Login(c *gin.Context) {
	var body struct {
		JMBG     string `json:"jmbg"`
		Password string `json:"password"`
	}
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "neispravni podaci"})
		return
	}

	token, err := h.service.Login(body.JMBG, body.Password)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"token": token})
}

// Vrati sve korisnike
func (h *KorisnikHandler) Svi(c *gin.Context) {
	korisnici, err := h.service.VratiSve()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "greska pri ucitavanju korisnika"})
		return
	}
	c.JSON(http.StatusOK, korisnici)
}

// Obrisi korisnika
func (h *KorisnikHandler) Obrisi(c *gin.Context) {
	jmbg := c.Param("jmbg")
	if jmbg == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "nedostaje jmbg"})
		return
	}

	err := h.service.Obrisi(jmbg)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "korisnik obrisan"})
}
