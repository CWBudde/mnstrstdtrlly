# Die verlorene Depesche – Stadtrallye Münster

Eine interaktive Stadtrallye durch Münster (Westfalen) für Erwachsene, als mobile Web-App.

**Story:** Oktober 1648 – kurz vor der Verkündung des Westfälischen Friedens verschwindet eine
Depesche aus der Kanzlei der Gesandten. Der Kanzleischreiber Johann Vlemynck hat sie vor
Kriegsgewinnlern in Sicherheit gebracht und eine Spur aus Rätseln durch die Stadt gelegt.
370 Jahre später folgt ihr dieser Spur.

## Eckdaten

- **Dauer:** ca. 2–3 Stunden, ca. 5 km zu Fuß
- **Route:** Historisches Rathaus → Stadtweinhaus → St. Lamberti → Kiepenkerl →
  Krameramtshaus → Erbdrostenhof → Clemenskirche → St.-Paulus-Dom → Überwasserkirche →
  Schloss → Schlossgarten (GPS-Suche) → Aasee-Kugeln (Finale)
- **Rätsel:** 10 Vor-Ort-Rätsel + 1 Chiffre + 1 GPS-Suche + Finalrätsel; die Antworten sind
  direkt an den Stationen ablesbar (Inschriften, Zählaufgaben, Beobachtung) oder aus der
  Story heraus lösbar
- **Bilder:** Stationsfotos werden zur Laufzeit von Wikimedia Commons geladen (überwiegend
  Dietmar Rabich, CC BY-SA 4.0; Bildnachweis in der App verlinkt)
- **Mechanik:** richtige Antwort schaltet die nächste Station frei; je Rätsel bis zu 3 gestaffelte
  Hinweise; Fortschritt wird im Browser gespeichert (localStorage) und bleibt auch nach einem
  Neuladen der Seite erhalten; Karte (OpenStreetMap) zeigt nur bereits erreichte Stationen, den
  bisher zurückgelegten Weg als Linie sowie den eigenen Live-Standort
- **Öffnungszeiten beachten:** Station 6 führt in den Dom (astronomische Uhr im Chorumgang,
  Eintritt frei). Außerhalb der Öffnungszeiten bzw. während Gottesdiensten hilft Hinweis 3
  quasi zur Lösung.

## Entwicklung

React + TypeScript + Vite, Karte mit Leaflet/OpenStreetMap.

```bash
npm install
npm run dev       # Entwicklungsserver
npm run build     # Produktions-Build nach dist/
npm run preview   # Build lokal testen
```

Die Lösungen liegen nicht im Klartext im Bundle, sondern als SHA-256-Hashes der normalisierten
Antworten (`src/lib/answers.ts`). Alle Lösungen im Klartext stehen im Spielleiter-Dokument
[VERIFIKATION.md](VERIFIKATION.md).

## Deployment (GitHub Pages)

Der Workflow [.github/workflows/deploy.yml](.github/workflows/deploy.yml) baut die App bei jedem
Push auf `main` und veröffentlicht sie auf GitHub Pages:
<https://cwbudde.github.io/mnstrstdtrlly/>

Einmalig nötig: In den Repository-Einstellungen unter **Settings → Pages** als Source
**„GitHub Actions“** auswählen.

## Vor dem ersten Einsatz

Die Rallye setzt bewusst auf Details, die nur vor Ort ablesbar sind. Einige Fakten und alle
Koordinaten sollten einmal vor Ort geprüft werden – die Checkliste dafür steht in
[VERIFIKATION.md](VERIFIKATION.md). Antworten/Koordinaten lassen sich zentral in
`src/data/stations.ts` anpassen (neue Antwort-Hashes: siehe Anleitung in VERIFIKATION.md).
