package main

// Mock evidencija: samo JMBG-ovi koje eksplicitno navodimo ovde imaju poseban ishod (npr. ne prolaze).
// Svaki drugi JMBG (nije u mapi) — za demonstraciju tretira se kao da je zdravstvena evidencija u redu.
var mockZdravstvenaEvidencija = map[string]struct {
	KnjizicaVazeca          bool
	ObavljenObavezniPregled bool
	VakcinacijaKompletna    bool
	NapomenaKnjizica        string
	NapomenaPregled         string
	NapomenaVakcinacija     string
}{
	"1111111111111": {true, false, true, "", "Nije evidentiran obavezni sistematski pregled pred upisom u vrtić", ""},
	"2222222222222": {false, true, true, "Zdravstvena knjižica nije u redu ili nije ažurirana", "", ""},
	"3333333333333": {true, true, false, "", "", "Vakcinacija nije kompletna za uzrast deteta"},
}

func mockZaJMBG(jmbg string) (knjizica, pregled, vakcinacija bool, napKnj, napPr, napVak string) {
	e, ok := mockZdravstvenaEvidencija[jmbg]
	if !ok {
		// Nije na listi izuzetaka — smatramo da dete ispunjava uslove (tipičan slučaj u demo toku).
		return true, true, true, "", "", ""
	}
	return e.KnjizicaVazeca, e.ObavljenObavezniPregled, e.VakcinacijaKompletna, e.NapomenaKnjizica, e.NapomenaPregled, e.NapomenaVakcinacija
}
