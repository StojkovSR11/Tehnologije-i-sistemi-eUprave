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
	var body struct {
    	JMBG     string `json:"jmbg"`
    	Email    string `json:"email"`
    	Ime      string `json:"ime"`
    	Prezime  string `json:"prezime"`
    	Password string `json:"password"`
    }
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "neispravni podaci"})
		return
	}

	// Parsiranje imena i prezimena iz jednog polja
	/*nameParts := strings.Fields(body.Name)
	var ime, prezime string
	if len(nameParts) >= 1 {
		ime = nameParts[0]
	}
	if len(nameParts) >= 2 {
		prezime = strings.Join(nameParts[1:], " ")
	}*/

	korisnik := model.Korisnik{
    	JMBG:     body.JMBG,
    	Email:    body.Email,
    	Password: body.Password, // hash-uj kasnije u servisu
    	Ime:      body.Ime,
    	Prezime:  body.Prezime,
    	//Uloga:    "citizen",
    }

// Ako je JMBG predefinisanog admina, postavi ulogu ADMIN
if body.JMBG == "0000000000000" {
    korisnik.Uloga = "ADMIN"
} else {
    korisnik.Uloga = "citizen"
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

	// Return only token (user data is now embedded in JWT)
	c.JSON(http.StatusOK, gin.H{
		"token": token,
	})
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
