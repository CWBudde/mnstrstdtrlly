# Korrekturplan: „Die verlorene Depesche“

Stand: Review des `main`-Stands (inkl. PR #1 und Commit 4078064), September 2026.

**Fazit des Reviews:** Die Kritik ist berechtigt. Die App-Technik funktioniert. Inhaltlich trägt
die Rallye aber nicht:

- **Route:** Die Route pendelt in der Altstadt hin und her.
- **Rätsel:** Fast alle Rätsel sind ohne Ortsbesuch lösbar, oft steht die Lösung schon im Text.
- **Fakten und Wege:** Mehrere Fragen und Wegbeschreibungen sind sachlich falsch oder lassen
  sich vor Ort nicht beantworten.

Dieser Plan listet die Befunde auf und legt die Korrekturen fest. Die Befunde wurden gegen
öffentliche Quellen geprüft (siehe unten). Was sich nur vor Ort klären lässt, ist mit
**[VOR ORT]** markiert.

---

## 1. Befunde

### 1.1 Route: Zickzack statt Linie

Aktuelle Reihenfolge mit Luftlinien aus den `coords` in `src/data/stations.ts`:

| Etappe | Luftlinie | Richtung |
|---|---|---|
| Rathaus → Stadtweinhaus | 23 m | – |
| Stadtweinhaus → Lamberti | 168 m | Nord |
| Lamberti → Kiepenkerl | 147 m | West |
| Kiepenkerl → Krameramtshaus | 73 m (laut Code, real deutlich mehr) | **Ost, zurück** |
| Krameramtshaus → Erbdrostenhof | 550 m | **Ost/Südost** |
| Erbdrostenhof → Clemenskirche | 39 m | – |
| Clemenskirche → Dom | 496 m | **West, quer über den Prinzipalmarkt zurück** |
| Dom → Überwasser | 194 m | West |
| Überwasser → Schloss | 665 m | West |
| Schloss → Schlossgarten (GPS) | 226 m | Nordwest |
| Schlossgarten → Aasee | 1006 m | **Südost, zurück** |

Probleme:

- **Lamberti und Prinzipalmarkt mehrfach:** Man läuft dreimal an St. Lamberti bzw. über den
  Prinzipalmarkt.
  - Das Krameramtshaus liegt **direkt am Chor von St. Lamberti** (Alter Steinweg 6/7, östlich
    der Kirche), nicht „wenige Schritte vom Kiepenkerl“.
  - Die Route geht also Lamberti → West zum Kiepenkerl → zurück nach Ost an Lamberti vorbei →
    weiter nach Südost zur Salzstraße → wieder quer zurück nach West zum Dom.
- **Barockinsel als Stichweg:** Erbdrostenhof und Clemenskirche (aus PR #1) liegen östlich
  abseits. Sie sind als Hin-und-zurück-Stichweg von über 1 km eingebaut.
- **Umweg am Ende:** Schlossgarten → Aasee läuft wieder zurück nach Südost.
- **Falsche Koordinate:** Die Koordinate des Krameramtshauses (51.965, 7.6277) liegt rund 200 m
  zu weit nördlich. Das verschleiert den Zickzack auf der Karte.

### 1.2 Rätsel: zu einfach, oft ohne Ortsbesuch lösbar

Maßstab: Ein Team, das zu Hause sitzt, darf eine Station höchstens durch Zufall lösen können.
Das erfüllt derzeit **keine einzige Station**.

| # | Station | Warum zu einfach |
|---|---|---|
| 1 | Rathaus | „1648“ kennt jeder. Die Story nennt das Jahr, Hinweis 2 umschreibt es direkt. |
| 2 | Stadtweinhaus | Caesar +1 auf 4 Buchstaben, Verfahren im Text erklärt. Kein Ortsbezug (verstößt gegen „strikt vor Ort“). |
| 3 | Lamberti | „3 Käfige“ ist Allgemeinwissen. Hinweis 3: „mehr als einer, aber keine Handvoll“. |
| 4 | Kiepenkerl | Die Lösung „Kiepe“ steckt im Namen, und die Frage sagt das sogar („… das ihm seinen Namen gibt“). |
| 5 | Krameramtshaus | Die Story nennt die niederländische Gesandtschaft. Die Lösung „Niederlande“ ist damit vorgegeben. |
| 6 | Erbdrostenhof | Binär (innen/außen). Unbegrenzte Versuche machen das zum Münzwurf. |
| 7 | Clemenskirche | Hinweis 3 („für jede Stunde eine Seite“) verrät 12. |
| 8 | Dom | Binär (links/rechts). Bekannte Trivia, im Text als „berühmte Besonderheit“ angekündigt. |
| 9 | Überwasser | Der Stationsname „Turm ohne Haupt“ und die Story („brachen dem Turme sein Haupt ab“) verraten die Lösung. |
| 10 | Schloss | Dass die Universität im Schloss sitzt, ist Allgemeinwissen. |
| 11 | GPS | Das Fallback-Codewort SCHLAUN steht in der Story der direkt vorangehenden Station. Damit ist GPS komplett umgehbar. |
| 12 | Aasee | Die Resolution von Station 11 sagt „wo **drei** steinerne Kugeln … ruhen“. Hinweis 3 sagt „genauso viele wie die Körbe“. |
| F | Finale | Die Fragmente stehen im Klartext in der Leiste, die Reihenfolge wird im Text genannt. |

Strukturelle Ursachen:

- Jedes Rätsel ist genau **eine** Beobachtung mit genau einer Antwort. Es gibt keine Rechen-,
  Kombinations- oder Verknüpfungsschritte.
- Hinweis 3 ist faktisch immer die Lösung, und Hinweise kosten nichts.
- Falsche Antworten haben keine Folgen, deshalb lassen sich binäre Fragen durchprobieren.
- Das Finale verlangt keine Leistung. Es reicht, die drei angezeigten Wörter abzutippen.

### 1.3 Sachlich falsche oder vor Ort nicht lösbare Inhalte

| # | Station | Problem | Beleg |
|---|---|---|---|
| 1 | Rathaus | Frage und Hinweise behaupten eine zweite, „falsche“ Jahreszahl am Giebel. Die Frage nennt sie „aus einer späteren Erneuerung“, Hinweis 1 dagegen „aus einer viel älteren Zeit“, also widersprüchlich. Eine Jahreszahl am Giebel ist nirgends belegt, ebenso wenig eine von außen lesbare „1648“. Der Friedenssaal ist eintrittspflichtig. **Wahrscheinlich vor Ort gar nicht lösbar.** | baukunst-nrw, Wikipedia „Rathaus Münster“: keine Inschrift/Jahreszahl belegt. [VOR ORT] |
| 5 | Krameramtshaus | Die Wegbeschreibung „vom Kiepenkerl wenige Schritte in den Alten Steinweg“ ist falsch, das Haus liegt am Chor von St. Lamberti. Die Koordinate ist falsch (s. 1.1). | stadt-muenster.de, baukunst-nrw |
| 7 | Clemenskirche | Die Quellen widersprechen sich: „im Außenbau zwölfeckig ummantelt“ (baukunst-nrw/Wikipedia) gegen „geschwungenes, unregelmäßiges Sechseck“ (andere Quelle). „Einmal um die Kirche herumgehen“ ist fraglich, da sie mit Kloster/Spital zusammengebaut wurde. Die Antwort 12 ist damit nicht belastbar. | baukunst-nrw, Wikipedia, kulturreise-ideen. [VOR ORT] |
| 8 | Dom | Die Uhr hat **nur einen Zeiger** (Sonnenzeiger) auf einem **24-Stunden-Zifferblatt** ohne Minutenzeiger. Frage („die Zeiger wandern“) und Anweisung („ein paar Minuten beobachten“) sind falsch: Der Zeiger bewegt sich 0,25° pro Minute, das sieht man nicht. Hinweis 3 („auf der 12-Uhr-Position Richtung 1 oder 11“) passt nicht zum Zifferblatt: XII Mittag steht oben, die Stunden I–XII laufen zweimal. Die Laufrichtung „links herum“ selbst stimmt. | paulusdom.de, MünsterWiki, Sternfreunde Münster (PDF) |
| 10 | Schloss | Hinweis 3 („Kürzel mit zwei großen W“) ist veraltet: Seit 1. Oktober 2023 heißt die Hochschule „Universität Münster“, die Beschilderung wurde umgestellt. | uni-muenster.de (Umbenennung) |
| 11 | Schlossgarten | Der GPS-Punkt (51.965, 7.611) liegt hinter dem Schloss, im Bereich von Schlossgarten und Botanischem Garten. Der Botanische Garten schließt im Winter um 16 Uhr, im Sommer um 19 Uhr. Falls der Punkt innerhalb liegt, ist die Station abends nicht erreichbar. | LWL „Gärten in Westfalen“, muenster-guide. [VOR ORT] |
| 12 | Aasee | Die Kugeln sind aus **Beton**, nicht „steinern“ (Resolution Station 11). | Kunsthalle Münster |
| 4 | Kiepenkerl | Anachronismus: Vlemynck schreibt 1648 „dem Manne, der hier steht, verdanke ich mein Leben“ über ein Denkmal, das es erst seit 1896 gibt (Neuguss 1953). | Stadtmuseum Münster, Wikipedia |
| – | Intro | „370 Jahre später“ passt zu 2018, nicht zu heute. | – |
| 6 | Erbdrostenhof | Die Wegbeschreibung „über den Roggenmarkt in die Salzstraße“ ist ungeprüft; der Roggenmarkt liegt nördlich von Lamberti. | [VOR ORT] |

Nachgeprüft und korrekt:

- Das Stadtweinhaus liegt nördlich neben dem Rathaus, also „links“ vom Markt aus gesehen.
- 3 Täuferkäfige.
- Friedensschluss im Krameramtshaus am 30.01.1648.
- Die Fassade des Erbdrostenhofs ist konkav.
- Der Turmhelm der Überwasserkirche wurde 1704 zerstört.
- Kiepenkerl: Original 1896, Neuguss 1953.
- Schloss 1767–87.
- Giant Pool Balls: 1977, 3 Kugeln.
- Pax optima rerum nach Silius Italicus.

---

## 2. Korrekturen

### 2.1 Neue Route: eine Linie von West nach Ost, Start am Aasee

**Vorschlag:** Die Rallye läuft **rückwärts**. Sie beginnt am Aasee und endet im Friedenssaal.

- **Geografie:** Das ergibt eine durchgehende Linie ohne Doppelwege.
- **Erzählung:** Dramaturgisch ist es stärker. Die Bruderschaft hat die Spur über Jahrhunderte
  an neue Orte verlegt, und die Spieler schälen die Schichten von 1977 zurück bis 1648.
- **Finale:** Der Höhepunkt liegt dort, wo 1648 tatsächlich Frieden beschworen wurde.
- **Wunsch „Aasee“:** Er bleibt erfüllt, nur liegt der Aasee jetzt am Anfang statt am Ende.

| # | Station | Zeitschicht |
|---|---|---|
| 1 | Aasee, Giant Pool Balls: Start, die Kassette ist leer, die Spur führt zurück | 1977 |
| 2 | Schlossgarten (GPS, toter Briefkasten) | Bruderschaft |
| 3 | Fürstbischöfliches Schloss | 1767–87 |
| 4 | Überwasserkirche | Nachtrag 1705 |
| 5 | Kiepenkerl (Spiekerhof) | Nachtrag 19./20. Jh., Anachronismus auflösen |
| 6 | Dom, astronomische Uhr | 1540–42 |
| 7 | St. Lamberti (Täuferkäfige) | 1536 |
| 8 | Krameramtshaus (direkt am Lamberti-Chor) | Jan. 1648 |
| 9 | Erbdrostenhof (Salzstraße) | 1753–57, optional |
| 10 | Stadtweinhaus | 1615/1648 |
| F | Historisches Rathaus / Friedenssaal: Finale | Okt. 1648 |

Laufweg:

- Der Weg geht Aasee → Schlossgarten → Schloss → Frauenstraße → Überwasser → Spiekerhof →
  Domplatz → Lamberti/Krameramtshaus.
- Danach geht es über die Kirchherrngasse zur Salzstraße und über die Salzstraße zurück zum
  Prinzipalmarkt → Stadtweinhaus → Rathaus.
- Die Schleife Krameramtshaus → Salzstraße → Prinzipalmarkt ist **[VOR ORT]** zu bestätigen.
  Wird sie zum Stichweg, entfällt der Erbdrostenhof.

Was sich ändert:

- **Clemenskirche entfällt.** Die Antwort ist nicht belastbar, und ein Umrunden ist fraglich
  (s. 1.3).
- **Erbdrostenhof** bleibt nur, wenn die Schleife ohne Rückweg funktioniert.
- **Koordinaten:** Alle `coords` werden neu aus OpenStreetMap erhoben, nicht geschätzt. Sie
  werden bei der Begehung mit dem Handy stichprobenartig gegengeprüft.
- **Karte:** Auf `MapView` die Gesamtlinie prüfen. Sie darf sich nicht selbst kreuzen.
- **Alternative**, falls der Aasee doch das Ziel bleiben soll: dieselbe Linie in Gegenrichtung.
  Das Finale läge dann wieder an den Kugeln, die Story bliebe vorwärts erzählt.

### 2.2 Rätseldesign: Regeln für jede Station

Jedes Rätsel muss **alle** diese Regeln erfüllen, sonst wird es ersetzt:

1. **Ortsbindung:** Die Lösung erfordert mindestens eine Beobachtung, die man nur vor Ort
   machen kann. Dazu zählen:
   - eine Inschrift,
   - ein Zählwert an einem unscheinbaren Detail,
   - eine Figur oder ein Wappen,
   - eine Beziehung zwischen zwei Objekten.

   Kein Allgemeinwissen und nichts, was auf der ersten Suchseite steht.
2. **Kein Spoiler im Text:** Die Lösung steht nicht in Stationsname, Wegbeschreibung, Story,
   Frage, früheren Resolutions oder Hinweisen. Das wird automatisch geprüft (s. 2.5).
3. **Mindestens zwei Denkschritte:** Beobachten **und** Umformen. Beispiele:
   - zwei Zählwerte kombinieren,
   - Buchstaben aus einer Inschrift anhand einer Zahl auswählen,
   - einen Chiffrierschlüssel vom Ort ablesen.
4. **Keine binären Fragen:** Entweder mindestens rund 10 plausible Antworten oder die Frage
   in eine Kombination einbetten.
5. **Hinweise verraten nicht die Lösung:**
   - Hinweis 1 lenkt den Blick.
   - Hinweis 2 erklärt den Denkschritt.
   - Hinweis 3 macht die Lösung nur noch mechanisch ableitbar, nennt sie aber nicht.

   Für „ich stehe vor verschlossener Tür“ gibt es einen separaten, klar gekennzeichneten
   **Notfall-Auflösen**-Button. Er kostet Punkte und wird im Finale angezeigt.
6. **Belegt:** Zu jeder Antwort gibt es in `VERIFIKATION.md` ein Foto der Begehung (Datum) und
   möglichst eine schriftliche Quelle. Ohne Begehungsfoto kommt keine Station in `main`.

Konkrete Richtung pro Station. Alle Details sind Kandidaten und müssen **[VOR ORT]** gefunden
und fotografiert werden. Hier wird nichts mehr am Schreibtisch erfunden.

- **Stadtweinhaus:** Die Chiffre bleibt als Mechanik. Der Schlüssel kommt aber vom Ort, etwa
  die Verschiebung aus einer Zahl am Gebäude oder ein Schlüsselwort aus der Inschrift am
  Sentenzbogen bzw. Balkon. Statt 4 Buchstaben wird ein Satz verschlüsselt, der zur nächsten
  Station führt.
- **Lamberti:** Die Käfige bleiben als Einstieg. Die Lösung ist aber eine Kombination, z. B.
  Anzahl Käfige × eine zweite Zählung am Turm oder Portal. Alternativ bildet eine Zahl den
  Index in eine Inschrift.
- **Dom-Uhr:** Nicht mehr „Richtung“ fragen, sondern etwas ablesen, das nur vor der Uhr
  sichtbar ist. Kandidaten:
  - Stundenzahl ganz unten bzw. oben auf dem 24-h-Zifferblatt,
  - eine Figur im Figurenspiel,
  - das Endjahr der Kalenderscheibe.

  Den genauen Stand liefert die Begehung. Öffnungs- und Gottesdienstzeiten gehören in die
  Planung.
- **Überwasser:** Stationsname und Story dürfen das „fehlende Haupt“ nicht verraten. Besser
  ist ein Detail am Portal oder an der Fassade, der Turmstumpf dient nur als Story-Kulisse.
- **Kiepenkerl:** Statt „Kiepe“ nach einem Detail der Figur fragen, das man nur beim
  Umrunden sieht (Tiere, Pfeife, Inhalt der Kiepe). Das Anachronismus-Problem löst die Story:
  Hier spricht die Bruderschaft, nicht Vlemynck.
- **Krameramtshaus:** Statt „Haus der …“ ein Datum oder Wappen am Giebel verwenden, z. B. ob
  das Baujahr 1589 außen steht, das mit einer anderen Zahl verrechnet wird.
- **Schloss:** Nicht nach der Nutzung fragen, sondern nach einem Fassadendetail: Wappen,
  Figuren im Giebel oder eine Inschrift am Mittelrisalit.
- **GPS:** Das Fallback-Codewort darf nicht im Spieltext stehen. Es wird nur im
  Spielleiter-Dokument ausgegeben oder aus einer Beobachtung am GPS-Ort gebildet (z. B. ein
  Schild in der Nähe). Den Zielpunkt auf einen öffentlich jederzeit zugänglichen Weg legen,
  nicht in den Botanischen Garten.
- **Rathaus/Finale:** Das Finale wird zum Meta-Rätsel (s. 2.3). Eine Frage nach „1648“ gibt es
  nicht mehr.

### 2.3 Finale als echtes Meta-Rätsel

- **Keine Klartext-Fragmente mehr:** Die Stationen liefern keine lateinischen Wörter mehr,
  sondern **Zahlen oder Buchstaben**, die in der Fragmentleiste als Codes erscheinen.
- **Losung verschlüsselt:** „PAX OPTIMA RERUM“ oder ein neuer Satz liegt verschlüsselt vor,
  etwa als Buchstabengitter oder Zahlen-Chiffre. Die gesammelten Codes sind der Schlüssel,
  die Reihenfolge ergibt sich aus der Story (Jahreszahlen der Stationen), nicht aus einer
  Ansage im Text.
- **Letzte Beobachtung im Friedenssaal:** Optional gibt es eine letzte Beobachtung im
  Friedenssaal (eintrittspflichtig) mit einer Ausweichfrage außen. [VOR ORT]

### 2.4 Mechanik (App)

- **Anti-Brute-Force:** Nach 3 falschen Antworten folgt eine Wartezeit von 30 s, danach
  eskalierend. Das ist rein clientseitig und genügt für ein faires Spiel.
- **Punkte und Wertung:**
  - Startwert minus Hinweise, Fehlversuche und Notfall-Auflösungen.
  - Anzeige im Finale mit Dauer (`startedAt`/`finishedAt` existieren bereits).
- **Hinweise:** Wie in 2.2 Regel 5 beschrieben, mit separatem Notfall-Button.
- **Fortschritt:** Der Speicherschlüssel wird auf `…:v2` erhöht, weil sich Stationen und IDs
  ändern.

### 2.5 Qualitätssicherung

- **Spoiler-Test** (`npm test`, z. B. mit Vitest): Für jede Station wird der gesamte bis dahin
  sichtbare Text normalisiert, also Intro, Namen, Wege, Stories, Fragen, Hinweise und frühere
  Resolutions. Dann wird geprüft, ob ein Teilstring bzw. ein Wort- oder Zahl-Token einem
  `answerHash` entspricht. Das hätte „Kiepe“, „drei Kugeln“ und „SCHLAUN“ gefunden.
- **Routen-Test:** Die Stationsfolge darf sich auf der Karte nicht selbst kreuzen, und keine
  Station darf näher an einer übernächsten liegen als an der nächsten.
- **Headless-Durchlauf** (Playwright) in CI wie bisher, ergänzt um Wartezeit und Punkte.
- **Begehung vor dem Merge:** eine Person läuft die Route komplett ab mit Stoppuhr, Fotos und
  GPS-Test. Die Checkliste in `VERIFIKATION.md` wird dabei abgehakt.
- **Blindtest:** Ein Team, das den Inhalt nicht kennt, spielt die Rallye. Zielwerte:
  - 2–3 Stunden,
  - höchstens 1–2 Notfall-Auflösungen,
  - keine Station „von zu Hause“ lösbar.

---

## 3. Umsetzungsschritte

1. **Entscheidung Richtung:** Start am Aasee und Finale im Rathaus (empfohlen) oder
   umgekehrt.
2. **Sofortkorrekturen der Fakten** (unabhängig vom Umbau, kleine PR):
   - Rathausfrage entschärfen: keine erfundene zweite Jahreszahl.
   - Dom-Frage und -Hinweise auf den einen Sonnenzeiger und das 24-h-Zifferblatt umstellen.
   - Hinweis „WW“ entfernen.
   - Wegbeschreibung und Koordinate des Krameramtshauses korrigieren.
   - „steinerne“ → „Beton-“.
   - Spoiler „drei Kugeln“ und das Codewort SCHLAUN aus dem Spieltext entfernen.
   - Clemenskirche entfernen.
   - „370 Jahre“ korrigieren.
3. **Koordinaten** aller Stationen aus OSM neu erheben.
4. **Begehung Nr. 1:** Details für die neuen Rätsel sammeln (Fotos, Inschriften, Zählwerte,
   Zugänglichkeit, Öffnungszeiten). Die Kandidaten aus 2.2 dienen als Suchliste.
5. **Rätsel neu schreiben** nach den Regeln aus 2.2, Meta-Rätsel nach 2.3. Story auf
   Rückwärts-Erzählung umbauen (Bruderschafts-Schichten).
6. **App-Mechanik** aus 2.4 und Tests aus 2.5 umsetzen.
7. **`VERIFIKATION.md`** neu schreiben: pro Station Lösung, Quelle, Begehungsfoto und Datum.
8. **Begehung Nr. 2 und Blindtest**, danach Feinschliff und Merge.

## Quellen des Reviews

- Stadtweinhaus nördlich des Rathauses:
  [stadt-muenster.de – Rathaus & Stadtweinhaus](https://www.stadt-muenster.de/tourismus/sehenswertes/altstadt/rathaus-stadtweinhaus),
  [Wikipedia – Stadtweinhaus](https://de.wikipedia.org/wiki/Stadtweinhaus)
- Rathaus, keine belegte Giebel-Jahreszahl:
  [baukunst-nrw – Historisches Rathaus](https://www.baukunst-nrw.de/objekte/130-historisches-rathaus-muenster),
  [Wikipedia – Rathaus Münster](https://de.wikipedia.org/wiki/Rathaus_M%C3%BCnster)
- Krameramtshaus am Lamberti-Chor:
  [stadt-muenster.de – Krameramtshaus](https://www.stadt-muenster.de/tourismus/sehenswertes/altstadt/krameramtshaus.html),
  [baukunst-nrw – Anbau Krameramtshaus](https://www.baukunst-nrw.de/objekte/945-anbau-an-das-krameramtshaus),
  [Kongreßstadt Münster 1648](https://www.muenster.de/stadt/kongress1648/02_stadt/stadt5_2.html)
- Clemenskirche:
  [baukunst-nrw](https://www.baukunst-nrw.de/objekte/905-clemenskirche-muenster),
  [Wikipedia](https://de.wikipedia.org/wiki/Clemenskirche_(M%C3%BCnster)),
  [kulturreise-ideen – Schlaun in Münster](https://www.kulturreise-ideen.de/architektur/architekten/Tour-johann-conrad-schlaun-in-muenster.html)
- Astronomische Uhr (ein Sonnenzeiger, 24 h, links herum):
  [paulusdom.de](https://www.paulusdom.de/gotteshaus/kunstwerke/kunstwerke-des-st-paulus-domes/die-astronomische-uhr),
  [MünsterWiki](https://muensterwiki.de/index.php/Astronomische_Uhr),
  [Sternfreunde Münster (PDF)](https://www.sternfreunde-muenster.de/pdf/domuhr3201832019.pdf)
- Erbdrostenhof (konkave Fassade, diagonal auf Eckgrundstück):
  [Deutsche Stiftung Denkmalschutz](https://www.denkmalschutz.de/denkmal/erbdrostenhof.html),
  [baukunst-nrw](https://www.baukunst-nrw.de/objekte/906-erbdrostenhof)
- Umbenennung der Universität 2023:
  [uni-muenster.de – FAQ Umbenennung](https://www.uni-muenster.de/kommunikation/en/FAQ_umbenennung.html),
  [uni-muenster.de – Ministerium genehmigt Umbenennung](https://www.uni-muenster.de/news/view.php?cmdid=13302)
- Botanischer Garten hinter dem Schloss, Öffnungszeiten:
  [LWL – Gärten in Westfalen](https://www.gaerten-in-westfalen.de/de/garten-und-parks-in-westfalen-lippe/zu-den-garten-und-parks-in-westfalen-lippe/munster-botanischer-garten-und-schlossgarten/),
  [muenster-guide.de](https://www.muenster-guide.de/sehenswuerdigkeiten/botanischer-garten/)
- Kiepenkerl (1896, zerstört 1945, Neuguss 1953):
  [Stadtmuseum Münster](https://magazin.stadtmuseum-muenster.de/ereignisse/1953-das-kiepenkerldenkmal),
  [Wikipedia](https://de.wikipedia.org/wiki/Kiepenkerl_(M%C3%BCnster))
