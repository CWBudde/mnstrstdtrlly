import type { LatLng } from '../lib/geo';

export interface QuizTask {
  kind: 'quiz';
  question: string;
  /** Platzhalter für das Eingabefeld, z.B. "Zahl" oder "Ein Wort". */
  placeholder: string;
  /** SHA-256-Hashes der normalisierten akzeptierten Antworten. */
  answerHashes: string[];
}

export interface GeoTask {
  kind: 'geo';
  description: string;
  target: LatLng;
  /** Auslöse-Radius in Metern. */
  radiusMeters: number;
  /** Fallback-Codewort (Hashes), falls GPS nicht funktioniert. */
  fallbackHashes: string[];
  fallbackHint: string;
}

export interface StationImage {
  /** Wikimedia-Commons-Dateiname ohne "File:"-Präfix. */
  file: string;
  alt: string;
  credit: string;
}

export interface Station {
  id: string;
  /** Nummer im Spiel (1-basiert), Finale hat keine. */
  label: string;
  name: string;
  coords: LatLng;
  /** Wegbeschreibung von der vorherigen Station hierher. */
  directions: string;
  /** Tagebuch-/Story-Text, der an der Station gezeigt wird. */
  story: string;
  task: QuizTask | GeoTask;
  hints: string[];
  /** Text nach dem Lösen – führt die Geschichte weiter. */
  resolution: string;
  /** Optional: Fragment der Losung, das diese Station preisgibt. */
  fragment?: string;
  /** Optional: Foto der Station (Wikimedia Commons, wird zur Laufzeit geladen). */
  image?: StationImage;
}

// Coordinates: docs/evidence/osm-stations.json. Field confirmation remains a release gate.

export const intro = {
  "title": "Die verlorene Depesche",
  "subtitle": "Eine Stadtrallye durch Münster · plant 2–3 Stunden mit Rätselpausen ein",
  "text": "Münster, Oktober 1648. Ein Kanzleischreiber namens Johann Vlemynck bringt eine Depesche vor Männern mit schwarzen Siegelringen in Sicherheit. Seine fiktive Bruderschaft der Friedensboten trägt das Versteck über die Jahrhunderte an neue Orte.\n\nHeute entdeckt die Stadtarchivarin Dr. Lene Cording die letzten Aufzeichnungen. Am Aasee liegt eine leere Kassette. Ihr verfolgt die Spur von dort zurück zu ihren älteren Schichten, bis zum Historischen Rathaus. Welche Teile stammen von Vlemynck, welche von seinen Nachfolgern?\n\nLest die Stadt: kleine Fassadendetails, Gegenstände und Inschriften liefern eure Schlüssel. Einige Stationen hinterlassen einen Siegelcode mit der Datierung des zugehörigen Blattes. Hebt diese Codes für die verschlüsselte Depesche auf. Historische Orte und Kunstwerke sind real; die Figuren und ihre Geschichte sind erfunden.",
  "practical": "Start ist an den Giant Pool Balls am Nordostufer des Aasees. Ihr endet außen am Historischen Rathaus am Prinzipalmarkt. Bequeme Schuhe, ein geladenes Smartphone, ein Stift und Papier helfen. Für hoch angebrachte Details könnt ihr die Kamera vergrößern. Der Dom ist laut Besucherinformation täglich von 6:30 bis 19:00 Uhr geöffnet; während Gottesdiensten wartet bitte oder nutzt Notfall-Auflösen. Ein Besuch im Friedenssaal ist optional und eintrittspflichtig. Ihr startet mit 1000 Punkten: ein Hinweis kostet 25, eine falsche Antwort 10, eine Notfall-Auflösung 100 Punkte. Nach mehreren Fehlversuchen gibt es eine Denkpause. GPS-Codewort und Notfall-Auflösen werden in der Wertung vermerkt.",
  "image": {
    "file": "Münster, Prinzipalmarkt -- 2014 -- 4689-93.jpg",
    "alt": "Der Prinzipalmarkt in Münster",
    "credit": "Foto: Dietmar Rabich / Wikimedia Commons / CC BY-SA 4.0"
  }
};

export const finaleText = "Dr. Cording öffnet die Kassette: „Ihr habt die Schichten der Bruderschaft gelesen und die Depesche entschlüsselt.“\n\n**PAX OPTIMA RERUM** – „Der Friede ist das beste der Dinge.“\n\nDie Losung erinnert an die Friedensdevise nach Silius Italicus. Hier am Rathaus wurde 1648 der spanisch-niederländische Friede beschworen. In unserer erfundenen Geschichte bewahrte Vlemynck die Worte vor den Männern mit den schwarzen Siegelringen. Ihr habt sie der Stadt zurückgebracht.\n\nDie Spur ist vollständig. Wenn ihr den Friedenssaal besuchen möchtet, prüft bitte seine heutigen Öffnungszeiten und den Eintritt. Eure Wertung folgt unten.";

export const stations: Station[] = [
  {
    "id": "aasee",
    "label": "Station 1",
    "name": "Aasee – die leere Kassette",
    "coords": {
      "lat": 51.9570094,
      "lng": 7.6182738
    },
    "directions": "Beginnt bei den Giant Pool Balls auf der Wiese am Nordostufer des Aasees, nahe der Promenade. Geht einmal um die Gruppe, ohne auf die Kunstwerke zu klettern.",
    "story": "Letztes Blatt der Bruderschaft, 1977: „Wir legten die Kassette ans Wasser, doch ihr Siegel wandert nicht mit dem Versteck. Die Spur muss nun rückwärts gelesen werden.“\n\nDr. Cording zeigt euch die leere Kassette. Auf ihrem Deckel ist eine Rechenvorschrift eingeritzt. Die Betonkugeln liefern die Größen; die Fugen gehören zum Kunstwerk, Graffiti und Kratzer zählen nicht.",
    "task": {
      "kind": "quiz",
      "question": "Zählt die Kugeln der Gruppe: B. Geht um eine Kugel und zählt ihre durchgehend umlaufenden waagerechten Fugen: F. Kurze senkrechte Fugen, Kratzer und Graffiti ignoriert ihr. Multipliziert B mit F, quadriert das Produkt und addiert B. Gebt das Ergebnis ein.",
      "placeholder": "Ergebnis als Zahl",
      "answerHashes": [
        "6b51d431df5d7f141cbececcf79edf3dd861c3b4069f0b11661a3eefacbba918"
      ]
    },
    "hints": [
      "Verfolgt die waagerechten Fugen rund um eine Kugel. Eine Fuge zählt nur, wenn sie durchgehend umläuft.",
      "Zählt die durchgehenden waagerechten Fugen, nicht die Flächenbereiche zwischen ihnen.",
      "Schreibt eure Beobachtungen als B und F auf. Rechnet zuerst B × F, dann dieses Ergebnis mal sich selbst und zum Schluss plus B."
    ],
    "resolution": "Die Kassette gibt ihren ersten Siegelcode frei. Die Datierung gehört zum Blatt der Bruderschaft, nicht zur Rätsellösung. Der nächste Übergabeort liegt auf dem Weg zum Schloss; folgt der Promenade.",
    "fragment": "1977 · 21"
  },
  {
    "id": "briefkasten",
    "label": "Station 2",
    "name": "Promenade – der tote Briefkasten",
    "coords": {
      "lat": 51.9612679,
      "lng": 7.6146837
    },
    "directions": "Folgt der Promenade vom Aasee nach Norden in Richtung Schloss. Das GPS-Ziel liegt auf dem Fußweg südlich der Gerichtsstraße, nahe der Kastellstraße. Bleibt auf dem öffentlichen Weg; ihr müsst weder den Schlossgarten noch den Botanischen Garten betreten.",
    "story": "Dr. Cording: „Ein toter Briefkasten ist ein vereinbarter Übergabeort. Die Bruderschaft hinterließ hier keine echte Dose: Unsere Suche rekonstruiert nur den Ort aus den Papieren. Wenn ihr ankommt, erscheint ihr nächster Vermerk.“",
    "task": {
      "kind": "geo",
      "description": "Aktiviert die Ortung und folgt der Entfernung zum Übergabepunkt auf der Promenade. Sobald ihr im Zielradius seid, öffnet sich der Vermerk. Überquert Straßen nur an sicheren Übergängen.",
      "target": {
        "lat": 51.9612679,
        "lng": 7.6146837
      },
      "radiusMeters": 40,
      "fallbackHashes": [
        "953a05696ba67a93f6c4da2e8ec1f3293de90bc6f4971072e1dbfa347b25550a"
      ],
      "fallbackHint": "Wenn GPS ausfällt, fragt die Spielleitung nach dem Codewort."
    },
    "hints": [
      "Erlaubt eurem Browser den Zugriff auf den Standort.",
      "Sinkt die Entfernung, nähert ihr euch dem Übergabeort. Vergleicht auch die angezeigte Richtung.",
      "Der Zielpunkt liegt auf dem Fußweg der Promenade südlich der Gerichtsstraße; bleibt außerhalb umzäunter Gärten."
    ],
    "resolution": "Der Vermerk enthält eine Skizze der Schlossfassade: „Sucht die Mitte, nicht die Flügel. Die kleinen Wächter und die senkrechten Lichtbahnen bewahren die nächste Zahl.“ Geht weiter zur Stadtseite des Schlosses."
  },
  {
    "id": "schloss",
    "label": "Station 3",
    "name": "Fürstbischöfliches Schloss – die Wächter",
    "coords": {
      "lat": 51.9634388,
      "lng": 7.6132424
    },
    "directions": "Geht auf der Promenade weiter zur Gerichtsstraße. Quert sie am sicheren Übergang und folgt dem Weg zum Schlossplatz. Betrachtet die mittlere, vorspringende Fassade von der Stadtseite; bleibt vor dem Gebäude.",
    "story": "Blatt der Bruderschaft aus der Zeit des Schlossbaus: „Vlemynck hat dieses Haus nie gesehen. Wir haben seine Spur erneuert, als die Stadt über ihre alten Grenzen wuchs. Die Mitte der Fassade ist unser Schlüssel.“\n\nSucht das Gesims über dem Mittelteil. Die geflügelte erwachsene Figur in der Mitte und die Figur ganz oben gehören nicht zu den kleinen Wächtern.",
    "task": {
      "kind": "quiz",
      "question": "Zählt nur die kindlichen Figuren auf dem Gesims des Mittelrisalits: C. Zählt dann die senkrechten Fensterachsen dieses vorspringenden Mittelteils: A. Eine Achse ist eine übereinanderliegende Reihe von Öffnungen, keine einzelne Scheibe. Bildet die Zahl 10 × C + A.",
      "placeholder": "Zweistellige Zahl",
      "answerHashes": [
        "811786ad1ae74adfdd20dd0372abaaebc6246e343aebd01da0bfc4c02bf0106c"
      ]
    },
    "hints": [
      "Grenzt zuerst den vorspringenden Mittelteil ab. Figuren an den Enden der Schlossflügel zählen nicht.",
      "Für C zählt ihr die kleinen Figuren neben der erwachsenen Mittelfigur. Für A schaut ihr entlang der senkrechten Reihen nach unten.",
      "Nehmt C als Zehnerstelle und A als Einerstelle. Prüft dabei, dass ihr keine Fensterreihe doppelt gezählt habt."
    ],
    "resolution": "Die Wächter geben den Weg nach Osten frei. Ein älteres Blatt wartet bei der Kirche jenseits der Aa. Folgt der Frauenstraße in die Altstadt."
  },
  {
    "id": "ueberwasser",
    "label": "Station 4",
    "name": "Überwasserkirche – das Bild über der Tür",
    "coords": {
      "lat": 51.964029,
      "lng": 7.6229834
    },
    "directions": "Geht vom Schlossplatz über den sicheren Übergang zur Frauenstraße und folgt ihr nach Osten bis zur Überwasserkirche. Sucht das südliche Seitenportal nahe dem Westende der Kirche, mit dem Relief über den Bronzetüren; nicht den großen Westzugang.",
    "story": "Nachtrag der Bruderschaft, 1705: „Ein Sturm verändert die Stadt. Wir haben die Spur an Steinbilder gebunden, damit ein beschädigtes Dach sie nicht auslöscht. Lest den Kranz um die Gestalt über dieser Tür.“\n\nDr. Cording bittet euch, runde Embleme und seitliche Wappenschilde getrennt zu erfassen. Der Heiligenschein ist kein Emblem.",
    "task": {
      "kind": "quiz",
      "question": "Zählt die runden Emblem-Medaillons um die mittlere Gestalt im Relief über dem Südportal: M. Zählt die davon getrennten Wappenschilde links und rechts des Reliefs: W. Quadriert M und zieht W ab.",
      "placeholder": "Ergebnis als Zahl",
      "answerHashes": [
        "86e50149658661312a9e0b35558d84f6c6d3da797f552a9657fe0558ca40cdef"
      ]
    },
    "hints": [
      "Bleibt am südlichen Seitenportal. Die gesuchten Embleme liegen um das zentrale Relief; die Schilde stehen außerhalb davon.",
      "Kreise mit einem eigenen Symbol zählen als Medaillons. Der Kreis direkt am Kopf zählt nicht.",
      "Rechnet M × M und danach minus W. Beide Größen müsst ihr selbst am Relief zählen."
    ],
    "resolution": "Das Relief bestätigt den Nachtrag. Die Bruderschaft führt euch zum Spiekerhof: Ein späterer Bote hält den nächsten Schlüssel in seinen Händen."
  },
  {
    "id": "kiepenkerl",
    "label": "Station 5",
    "name": "Kiepenkerl – die Hände des Boten",
    "coords": {
      "lat": 51.964143,
      "lng": 7.6261908
    },
    "directions": "Geht vom Überwasserkirchplatz über die Aa-Brücke am Spiekerhof nach Osten zum Kiepenkerl-Denkmal. Stellt euch frontal vor die Figur, sodass ihr ihr Gesicht seht.",
    "story": "Spätes Blatt der Bruderschaft: „Vlemynck begegnete keinem Denkmal. Erst unsere Nachfolger wählten diesen Boten als Hüter der Spur. Seine Hände erzählen, wie man durch die Stadt zieht und eine Pause macht.“\n\nDie Reihenfolge richtet sich nach eurem Blick auf die Figur, nicht nach ihrer eigenen linken und rechten Seite.",
    "task": {
      "kind": "quiz",
      "question": "Welche Gegenstände hält die Figur in den Händen? Nutzt diese Wortliste, damit die Begriffe eindeutig sind: STOCK, BUCH, PFEIFE, SCHLÜSSEL, BECHER, SEIL. Wählt erst den Gegenstand auf eurer linken, dann auf eurer rechten Seite. Nehmt jeweils den letzten Buchstaben und seine Position im Alphabet (A=1 bis Z=26). Schreibt beide Positionen zweistellig, getrennt durch einen Bindestrich.",
      "placeholder": "Zahlenpaar, z. B. 02-24",
      "answerHashes": [
        "47c5fbf51c636da0b48309ad799e2e4d0443b9c25b055c6b762d6b6f6d95fc52"
      ]
    },
    "hints": [
      "Der Korb auf dem Boden und das Traggestell auf dem Rücken sind nicht gesucht. Schaut ausschließlich auf die Hände.",
      "Ordnet die Gegenstände von links nach rechts aus eurer Sicht zu. Nehmt erst danach die Endbuchstaben ihrer Wörter aus der Liste.",
      "Zählt die Position jedes Endbuchstabens im Alphabet ab. Einstellige Ergebnisse bekommen eine führende Null; vertauscht das Zahlenpaar nicht."
    ],
    "resolution": "Der Bote weist euch zur großen Uhr im Dom. Ihr braucht nicht auf einen Zeigersprung zu warten: Die beschrifteten Plattformen und die Ziffern selbst tragen den Schlüssel."
  },
  {
    "id": "dom",
    "label": "Station 6",
    "name": "St.-Paulus-Dom – zwei Zahlen der Uhr",
    "coords": {
      "lat": 51.9627282,
      "lng": 7.6255123
    },
    "directions": "Geht vom Spiekerhof nach Süden über den Domplatz zum St.-Paulus-Dom. Betretet ihn über einen geöffneten Zugang; das Uhrenportal ist barrierefrei. Die astronomische Uhr steht im südlichen Chorumgang. Während Gottesdiensten bitte warten; bei geschlossenem Zugang gibt es Notfall-Auflösen.",
    "story": "Blatt bei der Uhr, datiert 1542: „Zeit wird hier zum Bild. Wer die gewöhnliche Reihenfolge annimmt, liest den Schlüssel falsch.“ Eine spätere Hand ergänzte: „Auch die Plattform der beiden Gestalten rechts trägt eine Zahl.“\n\nDr. Cording: „Lest die Inschrift unter der rechten oberen Figurengruppe und den äußeren Stundenring. Andere Beschriftungen der Uhr sind für diesen Schlüssel nicht nötig.“",
    "task": {
      "kind": "quiz",
      "question": "Lest die Jahreszahl nach POSITUM ANNO an der rechten oberen Plattform. Nehmt nur ihre letzten beiden Ziffern als Zahl. Geht dann auf dem Stundenring von der XII ganz oben genau eine Ziffer im Uhrzeigersinn weiter. Wandelt diese römische Stundenziffer in eine Zahl um und addiert sie zur Zahl aus der Inschrift.",
      "placeholder": "Summe als Zahl",
      "answerHashes": [
        "3346f2bbf6c34bd2dbe28bd1bb657d0e9c37392a1d5ec9929e6a5df4763ddc2d"
      ]
    },
    "hints": [
      "Die Plattform rechts oben steht außerhalb des großen Zifferblatts. Vergrößert die Inschrift bei Bedarf mit eurer Kamera.",
      "Gesucht ist der äußere Ring mit römischen Stundenziffern; beginnt ganz oben. Lasst euch nicht von der Reihenfolge einer gewöhnlichen Uhr täuschen.",
      "Streicht die ersten beiden Ziffern der Jahreszahl. Addiert dazu den Wert der Ziffer unmittelbar rechts neben der obersten XII."
    ],
    "resolution": "Ihr habt das Blatt der Uhr gelesen und seinen Siegelcode geborgen. Nun führt die Spur vom Domplatz zum Westportal von St. Lamberti.",
    "fragment": "1542 · 17"
  },
  {
    "id": "lamberti",
    "label": "Station 7",
    "name": "St. Lamberti – Himmel und Portal",
    "coords": {
      "lat": 51.9627845,
      "lng": 7.6287341
    },
    "directions": "Verlasst den Dom und geht über den Domplatz und den Roggenmarkt zum Westportal von St. Lamberti. Von außen könnt ihr sowohl den Turm als auch die stehenden Steinfiguren am Portal betrachten; die Kirche muss dafür nicht geöffnet sein.",
    "story": "Vlemyncks Notiz: „Das sichtbare Gedächtnis der Stadt reicht weiter zurück als unser Streit. Oben hängen seine dunklen Zeichen; unten stehen die Zeugen aus Stein. Nur gemeinsam öffnen sie den Weg.“\n\nZählt die große Figurenreihe direkt am Westportal. Gemalte Personen in den Mosaiken, kleine Gesichter an Sockeln und weitere Verzierungen gehören nicht dazu.",
    "task": {
      "kind": "quiz",
      "question": "Zählt die eisernen Körbe am Turm: C. Zählt alle großen stehenden Steinfiguren in der Reihe unmittelbar um die Türen des Westportals, einschließlich der Mittelfigur: P. Multipliziert C mit P.",
      "placeholder": "Produkt als Zahl",
      "answerHashes": [
        "c6f3ac57944a531490cd39902d0f777715fd005efac9a30622d5f5205e7f6894"
      ]
    },
    "hints": [
      "Schaut zuerst zum Turm und danach auf die Steinfiguren links, rechts und in der Mitte des Westportals.",
      "Zählt pro Seite jede große stehende Figur einmal. Die gemalten Personen oberhalb der Türen sind keine Steinfiguren.",
      "Addiert die Figuren beider Seiten und die Mittelfigur zu P. Multipliziert diese Summe mit eurer Korbzahl C."
    ],
    "resolution": "Die Zeichen passen zusammen. Folgt der Kirche bis hinter ihren Chor: Dort bewahrt das Haus der Krämer das nächste Blatt. Der kurze Weg um die Kirche gehört zur Spur."
  },
  {
    "id": "krameramtshaus",
    "label": "Station 8",
    "name": "Krameramtshaus – die erneuerten Steine",
    "coords": {
      "lat": 51.962972,
      "lng": 7.6298732
    },
    "directions": "Geht an St. Lamberti vorbei zur Ostseite hinter dem Chor. Am Beginn des Alten Steinwegs steht das Krameramtshaus, Alter Steinweg 6/7. Betrachtet den Giebel vom öffentlichen Platz; Kamera-Zoom hilft bei den Inschriften.",
    "story": "Blatt der Gesandten, Januar 1648: „Unser Friede beginnt mit einer Unterschrift. Die Hüter nach uns werden den Stein erneuern; ihre Abstände sind das Zeichen, das ihr lesen müsst.“\n\nAuf dem Giebel haben spätere Hände mehrfach RENOVATUM hinterlassen. Symmetrisch wiederholte Angaben gehören jeweils zur selben Erneuerung.",
    "task": {
      "kind": "quiz",
      "question": "Lest alle unterschiedlichen Jahreszahlen hinter RENOVATUM am Giebel von oben nach unten. Gleiche Jahreszahlen zählen nur einmal. Berechnet den Abstand der obersten zur nächsten und anschließend den Abstand der nächsten zur untersten Jahreszahl. Gebt die beiden positiven Abstände in dieser Reihenfolge mit Bindestrich ein.",
      "placeholder": "Zwei Abstände mit Bindestrich",
      "answerHashes": [
        "2f489e92d7b4b8c9c75493a8c9a8d44048fdb6f014ae262d9083bdff6e1af726"
      ]
    },
    "hints": [
      "Sucht die RENOVATUM-Felder in verschiedenen Höhen, nicht das Baujahr aus einem Geschichtstext.",
      "Notiert die unterschiedlichen Jahreszahlen. Links und rechts wiederholte Zahlen schreibt ihr nur einmal auf.",
      "Zieht von der Zahl des höchsten Feldes die nächste ab. Rechnet danach nächste minus unterste. Verbindet die Ergebnisse mit einem Bindestrich."
    ],
    "resolution": "Der letzte Siegelcode ist geborgen. Die Datierung des Blattes unterscheidet sich von den späteren Erneuerungszahlen. Geht nun am Prinzipalmarkt nach Süden zum Stadtweinhaus.",
    "fragment": "1648 · 08"
  },
  {
    "id": "stadtweinhaus",
    "label": "Station 9",
    "name": "Stadtweinhaus – die Schrift des Rates",
    "coords": {
      "lat": 51.9617146,
      "lng": 7.6282775
    },
    "directions": "Geht am Prinzipalmarkt nach Süden zum Stadtweinhaus, dem nördlichen Nachbargebäude des Rathauses. Betrachtet seinen steinernen Balkon von der Marktseite aus, ohne unter Absperrungen zu treten.",
    "story": "Vlemynck: „Was der Rat in offener Rede verkündet, halte ich im Brief verschlossen. Mein Schlüssel liegt vor den Augen aller, doch wer nur die Masken betrachtet, zählt das Falsche.“\n\nAuf dem Blatt steht **XZHMY IJS KWNJIJS**. Der Schlüssel ist die Anzahl der vollständigen menschlichen Figuren in der steinernen Balkonbrüstung. Gesichtsmasken unter dem Balkon zählen nicht.",
    "task": {
      "kind": "quiz",
      "question": "Zählt die vollständigen menschlichen Figuren in der Balkonbrüstung. Verschiebt jeden Buchstaben der Geheimschrift um genau diese Anzahl rückwärts im Alphabet; nach A folgt rückwärts Z. Gebt den ganzen entschlüsselten Satz ein.",
      "placeholder": "Entschlüsselter Satz",
      "answerHashes": [
        "e8a33196b9056fcf21acd39e80a264fac25392af754ff413c00f46c76fc9a448"
      ]
    },
    "hints": [
      "Schaut auf die Figuren in der Brüstung, nicht auf die Reliefköpfe unter ihr.",
      "Schreibt A bis Z auf. Geht vom verschlüsselten Buchstaben so viele Schritte rückwärts, wie ihr Figuren gezählt habt.",
      "Entschlüsselt zuerst das Anfangswort, danach die beiden weiteren Gruppen. Leerzeichen ändern den Schlüssel nicht."
    ],
    "resolution": "Die Schrift ist offen. Tragt die datierten Siegelcodes wenige Schritte weiter zum Historischen Rathaus. Dort liegt die letzte verschlossene Seite."
  },
  {
    "id": "finale",
    "label": "Finale",
    "name": "Historisches Rathaus – die Depesche",
    "coords": {
      "lat": 51.9616002,
      "lng": 7.6281828
    },
    "directions": "Geht die wenigen Schritte vom Stadtweinhaus zum Historischen Rathaus, Prinzipalmarkt 10. Das Finale lässt sich draußen unter den Arkaden lösen. Für einen anschließenden Besuch im Friedenssaal gelten dessen Öffnungszeiten und Eintrittspreise.",
    "story": "Dr. Cording: „Die datierten Blätter gehören zu unterschiedlichen Schichten. Legt sie auf einer Zeitlinie ab: vom ältesten erhaltenen Blatt bis zur jüngsten Ergänzung. Erst dann tragen ihre Siegel die Schrift.“\n\nAuf der Depesche stehen die Gruppen **GRO WXBQUI MZMPH**. Jeder gesammelte Siegelcode gehört zu einer Gruppe der Depesche. Die Codes werden in der Reihenfolge eurer Zeitlinie benutzt; der Weg durch die Stadt ist dafür nicht entscheidend.",
    "task": {
      "kind": "quiz",
      "question": "Entschlüsselt jede Gruppe mit dem passenden Siegelcode: verschiebt ihre Buchstaben um den Codewert rückwärts im Alphabet, mit Umlauf von A nach Z. Welche vollständige Losung ergibt sich?",
      "placeholder": "Die vollständige Losung",
      "answerHashes": [
        "e3a810988017e402bc930a4b02bc6b2d3341e5c4d9dc2137a6518322780aeaeb"
      ]
    },
    "hints": [
      "Die Datierungen stehen zusammen mit euren Siegelcodes in der Fragmentleiste. Rekonstruiert zuerst die Zeitlinie.",
      "Die ältere Aufzeichnung steht vor der jüngeren. Ordnet die Codewerte in dieser Reihenfolge den Gruppen von links nach rechts zu.",
      "Nutzt pro Gruppe denselben Schritt zurück im Alphabet, bis alle Buchstaben übersetzt sind. Den Satz selbst müsst ihr entschlüsseln."
    ],
    "resolution": "Dr. Cording öffnet die Kassette: „Ihr habt die Schichten der Bruderschaft gelesen und die Depesche entschlüsselt.“\n\n**PAX OPTIMA RERUM** – „Der Friede ist das beste der Dinge.“\n\nDie Losung erinnert an die Friedensdevise nach Silius Italicus. Hier am Rathaus wurde 1648 der spanisch-niederländische Friede beschworen. In unserer erfundenen Geschichte bewahrte Vlemynck die Worte vor den Männern mit den schwarzen Siegelringen. Ihr habt sie der Stadt zurückgebracht.\n\nDie Spur ist vollständig. Wenn ihr den Friedenssaal besuchen möchtet, prüft bitte seine heutigen Öffnungszeiten und den Eintritt. Eure Wertung folgt unten."
  }
];
