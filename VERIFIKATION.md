# Spielleiter-Dokument & Vor-Ort-Verifikation

**Achtung, Spoiler:** Dieses Dokument enthält alle Lösungen. Nicht an Teilnehmer weitergeben.

Die Rallye ist so gebaut, dass Antworten nur vor Ort ablesbar sind. Die als **[PRÜFEN]**
markierten Punkte beruhen auf Orts- und Geschichtswissen, das einmal vor Ort verifiziert werden
sollte, bevor die Rallye mit einer Gruppe gespielt wird. Koordinaten sind Näherungswerte und
sollten ebenfalls einmal abgelaufen werden (v.a. die GPS-Station 9).

## Lösungen im Überblick

| # | Station | Frage | Lösung | Status |
|---|---------|-------|--------|--------|
| 1 | Historisches Rathaus | Jahreszahl des Friedens | **1648** | sicher; [PRÜFEN]: ist die Zahl an Fassade/Tafel gut auffindbar? |
| 2 | Stadtweinhaus | Rundbögen der Arkade im EG | **5** | **[PRÜFEN]** – Bogenzahl vor Ort zählen! |
| 3 | St. Lamberti | Anzahl eiserner Körbe am Turm | **3** | sicher |
| 4 | Kiepenkerl | Traggestell auf dem Rücken | **Kiepe** (auch akzeptiert: Korb, Tragekorb) | sicher |
| 5 | Krameramtshaus | „Haus der …“ | **Niederlande** | sicher; [PRÜFEN]: Beschilderung gut sichtbar? |
| 6 | Dom, astronomische Uhr | Laufrichtung der Zeiger | **links / gegen den Uhrzeigersinn** | sicher; [PRÜFEN]: Zugang zum Chorumgang, Öffnungszeiten |
| 7 | Überwasserkirche | Was fehlt dem Turm? | **(Turm-)Spitze / Turmhelm** | sicher |
| 8 | Schloss | Heutige Einrichtung | **Universität (Münster)** (auch: Uni, WWU) | sicher; [PRÜFEN]: Beschilderung |
| 9 | Schlossgarten | GPS-Punkt erreichen | Koordinate 51.9650 N, 7.6110 O, Radius 40 m | **[PRÜFEN]** – Punkt ablaufen: frei zugänglich? Guter GPS-Empfang? |
| 9 | – Fallback | Codewort ohne GPS | **SCHLAUN** (Baumeister des Schlosses) | – |
| 10 | Aasee | Anzahl der Betonkugeln | **3** | sicher; [PRÜFEN]: genaue Lage der Kugeln vs. Koordinate |
| F | Finale | Losung der Depesche | **PAX OPTIMA RERUM** | sicher (Fragmente aus Stationen 3, 6, 9) |

## Vor-Ort-Checkliste

- [ ] **Station 1, Rathaus:** Ist „1648“ an einer Tafel/Beschriftung am oder neben dem Eingang
      zum Friedenssaal ablesbar? Falls nicht eindeutig: Fragetext in `src/data/stations.ts`
      anpassen (z.B. auf die Infotafel der Stadt verweisen).
- [ ] **Station 2, Stadtweinhaus:** Rundbögen der Erdgeschoss-Arkade zählen. Erwartet: 5.
      Falls abweichend: Antwort-Hash neu erzeugen (siehe unten) und Hinweise 2/3 anpassen.
- [ ] **Station 4, Kiepenkerl:** Steht die Statue frei zugänglich (kein Umbau/Markt)?
- [ ] **Station 6, Dom:** Öffnungszeiten prüfen; astronomische Uhr im Chorumgang zugänglich?
      Gottesdienstzeiten in die Tourplanung einbeziehen.
- [ ] **Station 9, Schlossgarten:** Zielpunkt (51.9650, 7.6110) ablaufen – liegt er auf einem
      frei zugänglichen Weg/einer Wiese? Ggf. Koordinate in `src/data/stations.ts` anpassen.
      GPS-Genauigkeit unter Bäumen testen; notfalls `radiusMeters` erhöhen.
- [ ] **Station 10, Aasee:** Koordinate der Kugeln prüfen (Nordostufer, Nähe Aaseeterrassen).
- [ ] **Alle Stationen:** Marker-Positionen auf der Karte stichprobenartig mit der Realität
      vergleichen (`coords` in `src/data/stations.ts`).
- [ ] **Gesamtroute einmal ablaufen:** Wegbeschreibungen (`directions`) auf Verständlichkeit
      und Baustellen prüfen; Gesamtdauer stoppen.

## Antwort-Hashes neu erzeugen

Antworten werden normalisiert (Kleinbuchstaben; ä→ae, ö→oe, ü→ue, ß→ss; alles außer a–z/0–9
entfernt) und als SHA-256-Hex-Hash in `src/data/stations.ts` hinterlegt. Neuen Hash erzeugen:

```bash
node -e "
const { createHash } = require('node:crypto');
const normalize = (s) => s.toLowerCase()
  .replaceAll('ä','ae').replaceAll('ö','oe').replaceAll('ü','ue').replaceAll('ß','ss')
  .replace(/[^a-z0-9]/g,'');
console.log(createHash('sha256').update(normalize(process.argv[1])).digest('hex'));
" "Neue Antwort"
```

Den ausgegebenen Hash in das `answerHashes`-Array der Station eintragen (mehrere Varianten
= mehrere Hashes).

## Hinweise zur Story

Die Rahmenhandlung (Schreiber Johann Vlemynck, „Bruderschaft der Friedensboten“,
Dr. Lene Cording) ist frei erfunden. Historisch verbürgt sind u.a.: Friedensschluss
Spanien–Niederlande im Friedenssaal (15. Mai 1648), Täuferkörbe an St. Lamberti,
niederländische Gesandtschaft im Krameramtshaus, astronomische Uhr im Dom (läuft
entgegen dem Uhrzeigersinn), fehlender Turmhelm der Überwasserkirche, Schlossbau durch
Johann Conrad Schlaun (1767–1787), „Giant Pool Balls“ von Claes Oldenburg (1977) sowie
die Friedens-Devise „Pax optima rerum“. Die App weist die Fiktion im Finale nicht
gesondert aus – wer mag, kann das in der Nachbesprechung auflösen.
