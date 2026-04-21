package client

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"strings"
	"time"
)

// ZdravstvoClient poziva servis zdravstvo (mock) za provere pre odobrenja upisa.
type ZdravstvoClient struct {
	baseURL    string
	httpClient *http.Client
	skip       bool
}

func NewZdravstvoClient() *ZdravstvoClient {
	base := strings.TrimSuffix(os.Getenv("ZDRAVSTVO_SERVICE_URL"), "/")
	if base == "" {
		base = "http://localhost:8080"
	}
	skip := strings.EqualFold(os.Getenv("ZDRAVSTVO_SKIP"), "true")
	return &ZdravstvoClient{
		baseURL: base,
		httpClient: &http.Client{
			Timeout: 8 * time.Second,
		},
		skip: skip,
	}
}

type validacijaResp struct {
	JMBG           string `json:"jmbg"`
	KnjizicaVazeca bool   `json:"knjizicaVazeca"`
	Napomena       string `json:"napomena"`
}

type pregledResp struct {
	JMBG                  string `json:"jmbg"`
	ObavljenZaPredskolsko bool   `json:"obavljenZaPredskolsko"`
	Napomena              string `json:"napomena"`
}

type vakcinacijaResp struct {
	JMBG                 string `json:"jmbg"`
	VakcinacijaKompletna bool   `json:"vakcinacijaKompletna"`
	Napomena             string `json:"napomena"`
}

type dogadjajReq struct {
	JMBG    string `json:"jmbg"`
	DeteID  string `json:"deteId"`
	VrticID string `json:"vrticId"`
	Poruka  string `json:"poruka"`
}

// ProveraZdravstveneSpremnosti: tri GET poziva (3 razmene). Vraća false ako dete nije spremno — zahtev treba odbiti.
func (c *ZdravstvoClient) ProveraZdravstveneSpremnosti(jmbg string) (spreman bool, napomena string, err error) {
	if c.skip {
		return true, "", nil
	}
	jmbg = strings.TrimSpace(jmbg)
	if jmbg == "" {
		return false, "Dete nema JMBG", nil
	}

	v1, err := c.getValidacija(jmbg)
	if err != nil {
		return false, "", fmt.Errorf("zdravstvo validacija: %w", err)
	}
	if !v1.KnjizicaVazeca {
		msg := v1.Napomena
		if msg == "" {
			msg = "Zdravstvena knjižica nije validna za upis u vrtić"
		}
		return false, msg, nil
	}

	v2, err := c.getObavezniPregled(jmbg)
	if err != nil {
		return false, "", fmt.Errorf("zdravstvo obavezni pregled: %w", err)
	}
	if !v2.ObavljenZaPredskolsko {
		msg := v2.Napomena
		if msg == "" {
			msg = "Nije ispunjen uslov obaveznog zdravstvenog pregleda za predškolsko"
		}
		return false, msg, nil
	}

	v3, err := c.getVakcinacija(jmbg)
	if err != nil {
		return false, "", fmt.Errorf("zdravstvo vakcinacija: %w", err)
	}
	if !v3.VakcinacijaKompletna {
		msg := v3.Napomena
		if msg == "" {
			msg = "Vakcinacija nije kompletna za upis u predškolsku ustanovu"
		}
		return false, msg, nil
	}

	return true, "", nil
}

// EvidentirajOdobrenUpis — treća razmena (POST), best-effort (ne blokira ako zdravstvo ne odgovori).
func (c *ZdravstvoClient) EvidentirajOdobrenUpis(jmbg, deteID, vrticID string) {
	if c.skip {
		return
	}
	body, _ := json.Marshal(dogadjajReq{
		JMBG:    jmbg,
		DeteID:  deteID,
		VrticID: vrticID,
		Poruka:  "Odobren upis u vrtić (mock događaj iz predškolskog servisa)",
	})
	req, err := http.NewRequest(http.MethodPost, c.baseURL+"/api/v1/dogadjaji/upis-odobren", bytes.NewReader(body))
	if err != nil {
		return
	}
	req.Header.Set("Content-Type", "application/json")
	resp, err := c.httpClient.Do(req)
	if err != nil {
		return
	}
	defer resp.Body.Close()
	_, _ = io.Copy(io.Discard, resp.Body)
}

func (c *ZdravstvoClient) getValidacija(jmbg string) (*validacijaResp, error) {
	req, err := http.NewRequest(http.MethodGet, c.baseURL+"/api/v1/validacija/"+jmbg, nil)
	if err != nil {
		return nil, err
	}
	resp, err := c.httpClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusOK {
		b, _ := io.ReadAll(resp.Body)
		return nil, fmt.Errorf("status %d: %s", resp.StatusCode, string(b))
	}
	var out validacijaResp
	if err := json.NewDecoder(resp.Body).Decode(&out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *ZdravstvoClient) getObavezniPregled(jmbg string) (*pregledResp, error) {
	req, err := http.NewRequest(http.MethodGet, c.baseURL+"/api/v1/obavezni-pregled/"+jmbg, nil)
	if err != nil {
		return nil, err
	}
	resp, err := c.httpClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusOK {
		b, _ := io.ReadAll(resp.Body)
		return nil, fmt.Errorf("status %d: %s", resp.StatusCode, string(b))
	}
	var out pregledResp
	if err := json.NewDecoder(resp.Body).Decode(&out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *ZdravstvoClient) getVakcinacija(jmbg string) (*vakcinacijaResp, error) {
	req, err := http.NewRequest(http.MethodGet, c.baseURL+"/api/v1/vakcinacija/"+jmbg, nil)
	if err != nil {
		return nil, err
	}
	resp, err := c.httpClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusOK {
		b, _ := io.ReadAll(resp.Body)
		return nil, fmt.Errorf("status %d: %s", resp.StatusCode, string(b))
	}
	var out vakcinacijaResp
	if err := json.NewDecoder(resp.Body).Decode(&out); err != nil {
		return nil, err
	}
	return &out, nil
}
