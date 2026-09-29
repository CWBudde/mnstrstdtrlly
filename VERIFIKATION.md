# Spielleiter-Dokument und Vor-Ort-Verifikation

**Spoiler: Nur für die Spielleitung.** Stand: 29. September 2026; Entwurf für die neue Route.

Die Rätsel wurden anhand historischer Referenzfotos und schriftlicher Quellen vorbereitet. **Es hat keine Begehung stattgefunden.** Referenzfotos zeigen einen früheren Zustand; ihre Aufnahmedaten sind keine Begehungsdaten. Aktuelle Sichtbarkeit, Zugänglichkeit, Empfang, Schwierigkeit und Spieldauer sind noch nicht bestätigt.

Die Route führt Aasee → Promenade (GPS) → Schloss → Überwasser → Kiepenkerl → Dom → Lamberti → Krameramtshaus → Stadtweinhaus → Rathaus. Erbdrostenhof und Clemenskirche gehören nicht zur neuen Route.

## Lösungen und Belege

| Station / ID | Beobachtung und Umformung | Akzeptierte Antwort | Siegelcode |
|---|---|---|---|
| Aasee / `aasee` | B=3 Kugeln, F=1 umlaufende waagerechte Fuge; (B×F)²+B | **12** | 1977 · 21 |
| Promenade / GPS / `briefkasten` | Zielradius 40 m um 51.9612679, 7.6146837 | **GPS oder SIEGELBRUCH** | – |
| Schloss / `schloss` | C=4 kindliche Gesimsfiguren ohne Fama, A=5 Fensterachsen; 10C+A | **45** | – |
| Überwasser / `ueberwasser` | M=6 runde Medaillons ohne Heiligenschein, W=2 seitliche Wappen; M²−W | **34** | – |
| Kiepenkerl / `kiepenkerl` | Frontal: links STOCK, rechts PFEIFE; Endbuchstaben K/E → Alphabetpositionen | **11-05** | – |
| Dom-Uhr / `dom` | Letzte Ziffern von POSITUM ANNO 1696 + XI rechts der oberen XII: 96+11 | **107** | 1542 · 17 |
| Lamberti / `lamberti` | C=3 Körbe, P=11 große Steinfiguren am Westportal inklusive Mitte; C×P | **33** | – |
| Krameramtshaus / `krameramtshaus` | Unterschiedliche RENOVATUM-Jahre von oben: 1896, 1865, 1668; benachbarte Differenzen | **31-197** | 1648 · 08 |
| Stadtweinhaus / `stadtweinhaus` | 5 ganze Figuren in der Balkonbrüstung: XZHMY IJS KWNJIJS um 5 zurück | **SUCHT DEN FRIEDEN** | – |
| Rathaus / Finale / `finale` | Zeitlinie 1542→1648→1977 liefert Schlüssel 17/8/21. GRO / WXBQUI / MZMPH rückwärts entschlüsseln. | **PAX OPTIMA RERUM** | – |

Leerzeichen, Bindestriche, Groß-/Kleinschreibung und Akzente werden normalisiert. Die Wortliste beim Kiepenkerl macht die Bezeichnungen eindeutig. Ausgeschriebene Zahlwörter werden bei diesen neuen Rätseln nicht akzeptiert. Antwort-Hashes liegen in `src/data/stations.ts`; die Testlösungen stehen außerhalb des App-Bundles in `tests/solutions.ts`.

Der GPS-Fallback **SIEGELBRUCH** wird nur von der Spielleitung ausgegeben. Ein richtiges Codewort zählt als Notfall-Auflösung (100 Punkte). Es steht nicht im Spieltext. Nach jeweils drei falschen Eingaben gilt eine Denkpause von 30, 60, 120, 240 und höchstens 300 Sekunden; sie überlebt das Neuladen.

## Referenzfotos, Quellen und ausstehende Begehung

### Aasee (`aasee`)

Schriftliche Quelle: [Originalquelle](https://www.kunsthallemuenster.de/en/collection/giant-pool-balls/).
Referenzfoto: [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:M%C3%BCnster%2C_Skulptur_-Giant_Pool_Balls-_--_2016_--_2379.jpg), aufgenommen **2016-05-06**. Die konkrete Zählung/Inschrift wurde am Foto geprüft; die schriftliche Quelle belegt je nach Station nur den historischen Kontext.
Vor Ort zu prüfen: Durchgehende waagerechte Fugen heute eindeutig zählbar? Kurze senkrechte Fugen nicht mitzählen.

**Bekannte Schwäche / Freigabeblocker:** Die Fugenzahl steht nun nicht mehr im Spieltext, ist aber bereits auf leicht auffindbaren Fotos erkennbar. Die Ortsbindung und Schwierigkeit dieses Kandidaten sind deshalb nicht bestätigt. Im Blindtest gezielt einfache Bildrecherche versuchen; bleibt er damit leicht lösbar, muss er vor Freigabe durch ein vor Ort geprüftes, weniger exponiertes Detailrätsel ersetzt werden. Eine solche Beobachtung kann ohne Begehung nicht belastbar ausgewählt werden.

**Begehungsfoto / Datum:** ausstehend; keine Vor-Ort-Bestätigung vorhanden.

### Promenade / GPS (`briefkasten`)

Schriftliche Quelle: [Originalquelle](https://www.openstreetmap.org/way/732886826).
Referenz: OSM-Weg und Zielpunkt beim GPS; städtische Rathausinformationen beim Finale. Für das Meta-Rätsel ist keine Beobachtung im kostenpflichtigen Saal nötig.
Vor Ort zu prüfen: Öffentlicher Fußweg; Empfang, Baustellen und Querungen vor Ort prüfen.

**Begehungsfoto / Datum:** ausstehend; keine Vor-Ort-Bestätigung vorhanden.

### Schloss (`schloss`)

Schriftliche Quelle: [Originalquelle](https://www.uni-muenster.de/imperia/md/content/wwu/kuk/projekte/240927_infoblatt_schloss_unims_fin.pdf).
Referenzfoto: [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:M%C3%BCnster%2C_F%C3%BCrstbisch%C3%B6fliches_Schloss_--_2018_--_1930-31.jpg), aufgenommen **2018-04-06**. Die konkrete Zählung/Inschrift wurde am Foto geprüft; die schriftliche Quelle belegt je nach Station nur den historischen Kontext.
Vor Ort zu prüfen: Mittelrisalit klar abgrenzen; Figuren an Flügelenden ausschließen.

**Begehungsfoto / Datum:** ausstehend; keine Vor-Ort-Bestätigung vorhanden.

### Überwasser (`ueberwasser`)

Schriftliche Quelle: [Originalquelle](https://klosterlandschaft-westfalen-lippe.lwl.org/de/kloster-und-klosterorte/muenster-pfarrkirche-liebfrauen-ueberwasser-ehem-stiftskirche/).
Referenzfoto: [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:M%C3%BCnster%2C_%C3%9Cberwasserkirche%2C_Portal_--_2022_--_0419.jpg), aufgenommen **2022-03-10**. Die konkrete Zählung/Inschrift wurde am Foto geprüft; die schriftliche Quelle belegt je nach Station nur den historischen Kontext.
Vor Ort zu prüfen: Südliches Seitenportal nahe Westende, nicht Westzugang. Sichtbarkeit prüfen.

**Begehungsfoto / Datum:** ausstehend; keine Vor-Ort-Bestätigung vorhanden.

### Kiepenkerl (`kiepenkerl`)

Schriftliche Quelle: [Originalquelle](https://magazin.stadtmuseum-muenster.de/ereignisse/1953-das-kiepenkerldenkmal).
Referenzfoto: [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:M%C3%BCnster%2C_Kiepenkerl%2C_Statue_--_2018_--_3648.jpg), aufgenommen **2018-07-27**. Die konkrete Zählung/Inschrift wurde am Foto geprüft; die schriftliche Quelle belegt je nach Station nur den historischen Kontext.
Vor Ort zu prüfen: Links/rechts aus Sicht der Spielenden; Handobjekte prüfen, keine Korbinhalte erfinden.

**Begehungsfoto / Datum:** ausstehend; keine Vor-Ort-Bestätigung vorhanden.

### Dom-Uhr (`dom`)

Schriftliche Quelle: [Originalquelle](https://www.paulusdom.de/gotteshaus/kunstwerke/kunstwerke-des-st-paulus-domes/die-astronomische-uhr).
Referenzfoto: [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:M%C3%BCnster%2C_St.-Paulus-Dom%2C_Astronomische_Uhr_--_2019_--_3824.jpg), aufgenommen **2019-03-08**. Die konkrete Zählung/Inschrift wurde am Foto geprüft; die schriftliche Quelle belegt je nach Station nur den historischen Kontext.
Vor Ort zu prüfen: Inschrift von unten lesbar? Zoom zulässig; Zugang und Gottesdienstzeiten prüfen.

**Begehungsfoto / Datum:** ausstehend; keine Vor-Ort-Bestätigung vorhanden.

### Lamberti (`lamberti`)

Schriftliche Quelle: [Originalquelle](https://www.sanktlamberti.de/sankt-lamberti/kirchen-2/st-lamberti/das-westportal/).
Referenzfoto: [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:M%C3%BCnster%2C_St.-Lamberti-Kirche%2C_Westportal_--_2021_--_9082.jpg), aufgenommen **2021-11-18**. Die konkrete Zählung/Inschrift wurde am Foto geprüft; die schriftliche Quelle belegt je nach Station nur den historischen Kontext.
Vor Ort zu prüfen: Mosaikpersonen, Sockelgesichter und Ornament nicht mitzählen; Gerüste prüfen.

**Begehungsfoto / Datum:** ausstehend; keine Vor-Ort-Bestätigung vorhanden.

### Krameramtshaus (`krameramtshaus`)

Schriftliche Quelle: [Originalquelle](https://www.uni-muenster.de/HausDerNiederlande/Allgemeines/korn/).
Referenzfoto: [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:M%C3%BCnster%2C_Krameramtshaus_%28Haus_der_Niederlande%29_--_2014_--_6865.jpg), aufgenommen **2014-03-14**. Die konkrete Zählung/Inschrift wurde am Foto geprüft; die schriftliche Quelle belegt je nach Station nur den historischen Kontext.
Vor Ort zu prüfen: Symmetrische Wiederholungen einmal zählen; Zoom und heutige Lesbarkeit prüfen.

**Begehungsfoto / Datum:** ausstehend; keine Vor-Ort-Bestätigung vorhanden.

### Stadtweinhaus (`stadtweinhaus`)

Schriftliche Quelle: [Originalquelle](https://www.stadt-muenster.de/tourismus/sehenswertes/altstadt/rathaus-stadtweinhaus).
Referenzfoto: [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:M%C3%BCnster%2C_Stadtweinhaus%2C_Giebel_und_Balkon_--_2020_--_4099.jpg), aufgenommen **2020-12-17**. Die konkrete Zählung/Inschrift wurde am Foto geprüft; die schriftliche Quelle belegt je nach Station nur den historischen Kontext.
Vor Ort zu prüfen: Gesichtsmasken unter dem Balkon nicht mitzählen; Blumenschmuck kann Figuren verdecken.

**Begehungsfoto / Datum:** ausstehend; keine Vor-Ort-Bestätigung vorhanden.

### Rathaus / Finale (`finale`)

Schriftliche Quelle: [Originalquelle](https://www.stadt-muenster.de/tourismus/sehenswertes/altstadt/rathaus-stadtweinhaus).
Referenz: OSM-Weg und Zielpunkt beim GPS; städtische Rathausinformationen beim Finale. Für das Meta-Rätsel ist keine Beobachtung im kostenpflichtigen Saal nötig.
Vor Ort zu prüfen: Außenfinale ohne Eintritt; Friedenssaal optional. Treffpunkt und Arkaden prüfen.

**Begehungsfoto / Datum:** ausstehend; keine Vor-Ort-Bestätigung vorhanden.

## Koordinaten und Gehweg

Alle Marker stammen aus dem [OSM-Auszug](docs/evidence/osm-stations.json), abgerufen am **29.09.2026** über die öffentliche OSM-API. Knotenkoordinaten wurden unverändert übernommen; der Aasee-Marker ist der Mittelwert der äußeren Knoten der drei zur Kunstwerk-Relation gehörenden Kugeln (ohne doppelte Schlusspunkte). Objekte und Lizenzen stehen im Auszug. © OpenStreetMap-Mitwirkende, [ODbL](https://www.openstreetmap.org/copyright).

Die [Routenskizze](docs/evidence/route.svg) verbindet Marker schematisch. Die automatischen Tests belegen keine Kreuzung der Markerlinie und keine näher liegende übernächste Station. Die Markerlinie ist **keine Gehwegnavigation**; reale Gehwege, Querungen und Baustellen müssen abgelaufen werden. Die Luftlinien summieren sich auf rund 2,4 km; eine tatsächliche Weglänge oder Dauer wird erst bei der Begehung gemessen.

GPS-Ziel: [OSM-Knoten 2472513808](https://www.openstreetmap.org/node/2472513808) auf [Fußweg 732886826](https://www.openstreetmap.org/way/732886826), als Promenade/footway mit bicycle=no kartiert. Er liegt südlich der Gerichtsstraße und außerhalb des Botanischen Gartens. Das Fehlen einer Zugangsbeschränkung in OSM ist kein Vor-Ort-Nachweis für den aktuellen Zugang.

## Zugang und Öffnungszeiten

Recherche am 29.09.2026: Der [Dom](https://www.paulusdom.de/aktuelles/besucherinfos/) nennt täglich 6:30–19:00 Uhr und das barrierefreie Uhrenportal. Besichtigung während Gottesdiensten vermeiden; [aktuelle Gottesdienstordnung](https://www.paulusdom.de/aktuelles/gottesdienstordnung/) und örtliche Aushänge vor der Tour prüfen. Ist die Uhr unzugänglich, ausdrücklich Notfall-Auflösen nutzen; Hinweis 3 ersetzt keine Beobachtung.

Das Finale liegt außen am Rathaus. Der [Friedenssaal](https://www.stadt-muenster.de/tourismus/service-und-informationen) ist ein optionaler Besuch mit eigenen Zeiten und Eintritt. Für die Rallye ist keine Innenraumfrage nötig. Der [Botanische Garten](https://www.uni-muenster.de/BotanischerGarten/besucher-info/index.html) öffnet saisonabhängig; die Route und der GPS-Punkt erfordern keinen Eintritt in ihn.

## Begehung und Blindtest: Freigabeprotokoll

Diese Arbeiten sind in PLAN.md begründet zurückgestellt, bleiben für eine Veröffentlichung erforderlich:

- [ ] Begehung 1: je Station Detailfoto und Datum; Antwort, Koordinate, Zugang und GPS am Ziel bestätigen.
- [ ] Begehung 2: gesamte Route ablaufen, sichere Querungen/Wegbeschreibungen prüfen, Gehzeit und Gesamtdauer messen.
- [ ] Blindtest mit einem unabhängigen Team: 120–180 Minuten, höchstens zwei Notfall-Auflösungen, keine Station allein aus dem Spieltext oder einfacher Recherche lösbar.
- [ ] Aasee-Kandidat auf leichte Bildrecherche prüfen; bei bestätigter Fernlösbarkeit durch ein vor Ort belegtes Detail ersetzen.
- [ ] Insbesondere Lesbarkeit Dom/Krameramtshaus und Figurenabgrenzung Schloss/Lamberti mit unvorbereiteten Spielenden prüfen.
- [ ] Bei missverständlichen oder nicht lesbaren Details das Rätsel ersetzen; Fotos und Lösungen gemeinsam aktualisieren.

Nachweise unter `docs/evidence/` ablegen und [field-verification.json](docs/evidence/field-verification.json) ergänzen. Pro `stations.<id>` werden `date` (YYYY-MM-DD), `photo` (relativer PNG/JPEG/WebP-Pfad) und `answerVerified`, `coordsVerified`, `accessVerified` (je `true`) benötigt; für `briefkasten` zusätzlich `gpsTested: true`. `firstWalk` und `secondWalk` enthalten `date` und `report` (relativer Berichtspfad). `blindTest` enthält `date`, `report`, `durationMinutes`, `emergencySolves` und `remotelySolvableStations` (nach erfolgreichem Test `[]`). `version` bleibt `rally-v3`.

`npm run verify:release` prüft diese Einträge und die vorhandenen Nachweisdateien. Es attestiert keine Begehung: Die Spielleitung muss ihre Angaben verantworten. Mit dem aktuellen leeren Protokoll blockiert es die Veröffentlichung ausdrücklich. CI prüft technische Tests auch für den Entwicklungsbranch und Pull Requests; nur ein vollständig freigegebener main-Build wird publiziert. Merge auf main und Veröffentlichung sind bis zum erfolgreichen Feldtest zurückgestellt.

## Bilder und Fiktion

Detailfotos sind in der App ausgeblendet, damit sie die Vor-Ort-Beobachtung nicht schon am Bildschirm liefern. Nur das einleitende Stadtbild bleibt, mit Autor, Lizenz und Link in der App. Referenzbilder werden hier ausschließlich verlinkt, nicht als Begehungsfotos ausgegeben. Die Bruderschaft, Vlemynck und Dr. Cording sind erfundene Spielfiguren; die App kennzeichnet die Rahmenhandlung als Fiktion.
