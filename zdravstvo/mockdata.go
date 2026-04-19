package main

// Mock evidencija: samo JMBG-ovi koje eksplicitno navodimo ovde imaju poseban ishod (npr. ne prolaze).
// Svaki drugi JMBG (nije u mapi) — za demonstraciju tretira se kao da je zdravstvena evidencija u redu.
var mockZdravstvenaEvidencija = map[string]struct {
	KnjizicaVazeca          bool
	ObavljenObavezniPregled bool
	NapomenaKnjizica        string
	NapomenaPregled         string
}{
	"1111111111111": {true, false, "", "Nije evidentiran obavezni sistematski pregled pred upisom u vrtić"},
	"2222222222222": {false, true, "Zdravstvena knjižica nije u redu ili nije ažurirana", ""},
}

func mockZaJMBG(jmbg string) (knjizica, pregled bool, napKnj, napPr string) {
	e, ok := mockZdravstvenaEvidencija[jmbg]
	if !ok {
		// Nije na listi izuzetaka — smatramo da dete ispunjava uslove (tipičan slučaj u demo toku).
		return true, true, "", ""
	}
	return e.KnjizicaVazeca, e.ObavljenObavezniPregled, e.NapomenaKnjizica, e.NapomenaPregled
}
