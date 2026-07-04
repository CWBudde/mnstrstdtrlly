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

const RABICH = 'Foto: Dietmar Rabich / Wikimedia Commons / CC BY-SA 4.0';

/**
 * DIE VERLORENE DEPESCHE – Stadtrallye Münster
 *
 * Hintergrund: Oktober 1648. Wenige Tage bevor der Westfälische Frieden
 * von der Rathaustreppe verkündet wird, verschwindet eine Depesche aus der
 * Kanzlei der Gesandten. Der junge Schreiber Johann Vlemynck hat sie in
 * Sicherheit gebracht – vor Leuten, die am Krieg verdienten und den
 * Frieden in letzter Minute hintertreiben wollten. Er hinterließ eine
 * Spur aus Zeichen und Rätseln. Die fiktive „Bruderschaft der Friedensboten“
 * hat diese Spur über die Jahrhunderte gepflegt und an die wachsende Stadt
 * angepasst – deshalb führt sie heute auch zu Orten, die es 1648 noch
 * nicht gab. Die Stadtarchivarin Dr. Lene Cording hat Vlemyncks Tagebuch
 * wiederentdeckt. Ihr folgt seiner Spur.
 */
export const intro = {
  title: 'Die verlorene Depesche',
  subtitle: 'Eine Stadtrallye durch Münster · ca. 2–3 Stunden · ca. 5 km zu Fuß',
  text: `Münster, im Oktober 1648. Fünf Jahre lang haben Gesandte aus halb Europa in dieser Stadt verhandelt, um den Dreißigjährigen Krieg zu beenden. Nun, wenige Tage vor der feierlichen Verkündung des Friedens, verschwindet eine Depesche aus der Kanzlei – ein Schriftstück, das den Frieden besiegeln soll.

Was niemand weiß: Der junge Kanzleischreiber Johann Vlemynck hat sie selbst beiseitegeschafft. Männer mit schwarzen Siegelringen – Kriegsgewinnler, die am Elend verdienten – wollten sie vernichten. Vlemynck versteckte die Depesche und hinterließ für die Nachwelt eine Spur aus Rätseln quer durch die Stadt.

370 Jahre später stößt die Stadtarchivarin Dr. Lene Cording in einem vergessenen Bestand auf Vlemyncks Tagebuch – und auf die Spur, die eine geheimnisvolle „Bruderschaft der Friedensboten“ über die Jahrhunderte gepflegt hat.

Sie bittet euch: Folgt der Spur. Löst die Rätsel, die nur vor Ort zu knacken sind. Findet die verlorene Depesche – und die drei Worte, die sie enthält.`,
  practical: `Was ihr braucht: bequeme Schuhe, ein aufgeladenes Smartphone und offene Augen. Alle Antworten findet ihr direkt an den Stationen – Wissen aus dem Internet hilft euch nicht weiter. Wenn ihr feststeckt, gibt es zu jedem Rätsel gestaffelte Hinweise. Startpunkt ist das Historische Rathaus am Prinzipalmarkt; das Ziel liegt am Aasee.`,
  image: {
    file: 'Münster, Prinzipalmarkt -- 2014 -- 4689-93.jpg',
    alt: 'Der Prinzipalmarkt in Münster mit seinen Giebelhäusern',
    credit: RABICH,
  } as StationImage,
};

export const finaleText = `Dr. Cording strahlt: „Das ist sie. Die verlorene Depesche.“

In einer Blechkassette, von der Bruderschaft zuletzt in den 1970er-Jahren erneuert, liegt eine Abschrift von Vlemyncks Schriftstück. Drei lateinische Worte stehen darauf – die Devise des Westfälischen Friedens, zu lesen auf Stichen und Friedensmünzen jener Zeit, entlehnt dem römischen Dichter Silius Italicus:

**PAX OPTIMA RERUM** – „Der Friede ist das beste der Dinge.“

Vlemyncks letzter Tagebucheintrag, 24. Oktober 1648: „Heute ward der Friede zu Münster unterzeichnet. Die Glocken läuteten bis in die Nacht. Die Herren mit den schwarzen Siegeln sind abgereist, ihr Werk ist gescheitert. Was ich versteckte, gehört nun keinem Fürsten und keinem Kaufmann – es gehört der Stadt und allen, die nach uns kommen. Wer meine Spur bis hierher gelesen hat, der weiß: Der Friede ist das beste der Dinge. Man muss ihn nur suchen.“

Ihr habt die Spur gelesen. Die Rallye ist geschafft – Glückwunsch!

Wenn ihr mögt: Die Aaseeterrassen und das Kuhviertel sind nicht weit, und auf ein kaltes Getränk habt ihr euch jetzt redlich verdient.`;

export const stations: Station[] = [
  {
    id: 'rathaus',
    label: 'Station 1',
    name: 'Historisches Rathaus – Friedenssaal',
    coords: { lat: 51.9617, lng: 7.6286 },
    directions:
      'Startpunkt: Stellt euch vor das Historische Rathaus mit dem hohen gotischen Giebel, Prinzipalmarkt 10.',
    story: `Aus Vlemyncks Tagebuch: „Im Saale des Rathauses haben die Gesandten einander die Hände gereicht. Ich stand hinten an der Tür und hielt die Feder. Hier beginnt meine Spur – bei der Jahreszahl, die bald ganz Europa kennen wird. Wer sie am Hause findet, mag mir weiter folgen. Doch Vorsicht: Dies Haus trägt mehr als eine Zahl an seinem Leibe, und nicht jede meint den Frieden.“

Dr. Cording ergänzt: Im Friedenssaal dieses Rathauses wurde ein erster Teilfriede zwischen zwei kriegsmüden Mächten beschworen – der erste Baustein eines viel größeren Friedens, der die Stadt für immer berühmt machen sollte. Am und im Rathaus erinnert vieles an dieses eine, große Jahr – ihr müsst es nur finden. Aber das Haus ist alt und mehrfach verändert worden, also seht genau hin, welche Jahreszahl wirklich zum Frieden gehört.`,
    task: {
      kind: 'quiz',
      question:
        'Sucht am Rathaus (Fassade, Tafeln am Eingang oder im Durchgang) die Jahreszahl des großen Friedens, an den hier alles erinnert. Achtung: Am Haus findet ihr mindestens eine weitere Jahreszahl aus einer ganz anderen Epoche (einer späteren Erneuerung des Gebäudes) – die hat mit diesem Frieden nichts zu tun. Welche Jahreszahl ist die des Friedens?',
      placeholder: 'Jahreszahl (4 Ziffern)',
      answerHashes: ['a16c0ab260e30b22cd06fadf9a6a30c454ddc845925cc831796b2988874d6a5a'],
    },
    hints: [
      'Es gibt mehr als eine Jahreszahl am Haus. Die falsche Fährte sitzt eher oben, im Zierwerk des Giebels, aus einer viel älteren Zeit – die richtige eher auf Augenhöhe, näher am Eingang oder im Durchgang zum Friedenssaal.',
      'Gesucht ist das Jahr, in dem in Münster und Osnabrück der Westfälische Friede geschlossen wurde – er beendete einen der längsten Kriege der deutschen Geschichte.',
      'Der Krieg, den der Friede beendete, ist als „Dreißigjähriger Krieg“ bekannt – das mag euch helfen, die richtige Zahl von der falschen zu unterscheiden, auch wenn beide auf den ersten Blick „alt“ wirken.',
    ],
    image: {
      file: 'Münster, Prinzipalmarkt, Historisches Rathaus -- 2017 -- 6875.jpg',
      alt: 'Das Historische Rathaus mit gotischem Giebel am Prinzipalmarkt',
      credit: RABICH,
    },
    resolution: `Richtig: 1648. Vlemynck notiert schmunzelnd: „Wer sich von der älteren Zahl im Zierwerk des Giebels hat täuschen lassen, dem sei verziehen – dies Haus trägt die Spuren vieler Jahrhunderte, nicht nur des unseren.“ Unter der Zahl steht ein kleiner Pfeil nach Norden und die Worte: „Folge dem Markt der Kaufleute zu der Kirche, an der die Körbe des Schreckens hängen.“ – Werft im Vorbeigehen einen Blick auf die Bogengänge des Prinzipalmarkts: Unter diesen Arkaden wurde 1648 gefeilscht, verhandelt und spioniert.`,
  },
  {
    id: 'stadtweinhaus',
    label: 'Station 2',
    name: 'Stadtweinhaus',
    coords: { lat: 51.9619, lng: 7.6285 },
    directions:
      'Nur ein paar Schritte: Das Stadtweinhaus ist das prächtige Giebelhaus direkt links neben dem Rathaus.',
    story: `Aus dem Tagebuch: „Im Weinhause der Stadt, errichtet Anno 1615, lagerte der Wein für die hohen Herren. Manch ein Geheimnis wurde bei einem Kruge verraten – darum schreibe ich das Wichtigste fortan in Geheimschrift. Zur Übung, Leser: Ich rückte jeden Buchstaben um einen Platz weiter im Alphabet, so wie der Kellermeister die Fässer rückt. Lies nun, was in diesem Hause lagert:“

**X F J O**

Stellt euch beim Knobeln ruhig unter die Bögen des Stadtweinhauses – hier standen schon 1648 Gesandtendiener und tauschten Neuigkeiten.`,
    task: {
      kind: 'quiz',
      question:
        'Entschlüsselt Vlemyncks Geheimschrift: Welches Wort verbirgt sich hinter „XFJO“?',
      placeholder: 'Ein Wort',
      answerHashes: [
        '32b85c6ab5000619f7360cf6ba3df610b80c3245c994937a3fd6c8403b689584',
        'd310dc8fa66df7136de40b556b8d64f03b98afd989893b901492ed900e5b7444',
      ],
    },
    hints: [
      'Vlemynck hat jeden Buchstaben um einen Platz nach vorn verschoben – geht also einen Schritt im Alphabet zurück, für jeden der vier Buchstaben.',
      'Schreibt euch das Alphabet auf und schiebt jeden Buchstaben von „XFJO“ genau eine Stelle zurück. Probiert es am ersten Buchstaben aus, dann macht ihr mit den restlichen dreien weiter.',
      'Das Lösungswort ist ein Getränk, das in Fässern reift, nicht in Flaschen.',
    ],
    resolution: `Wein – richtig entschlüsselt! Vlemynck notiert: „Wer meine Schrift lesen kann, dem vertraue ich auch den Rest. Einer meiner treuesten Freunde war der Türmer. Geh nun zu St. Lamberti und sieh hinauf, wo die Körbe hängen.“`,
    image: {
      file: 'Münster, Stadtweinhaus und historisches Rathaus -- 2020 -- 4113.jpg',
      alt: 'Stadtweinhaus und Historisches Rathaus am Prinzipalmarkt',
      credit: RABICH,
    },
  },
  {
    id: 'lamberti',
    label: 'Station 3',
    name: 'St. Lamberti – die eisernen Körbe',
    coords: { lat: 51.9634, lng: 7.6282 },
    directions:
      'Geht den Prinzipalmarkt nach Norden bis zu seinem Ende. Vor euch erhebt sich die Lambertikirche mit ihrem durchbrochenen Turmhelm.',
    story: `Aus dem Tagebuch: „Über dem Markte hängen die Körbe, in denen man die Leiber der Wiedertäufer zur Schau stellte, hundert Jahre bevor ich schreibe. Sie mahnen: Wohin Fanatismus führt, das sieht man hier. Zähle die Körbe – ihre Zahl öffnet dir mein erstes Wort.“

1534/35 errichteten radikale Wiedertäufer in Münster ihr „Königreich“. Nach der Eroberung der Stadt wurden ihre Anführer hingerichtet und ihre Leichname in eisernen Körben am Turm von St. Lamberti aufgehängt. Die Körbe hängen bis heute dort – schaut hinauf.`,
    task: {
      kind: 'quiz',
      question: 'Wie viele eiserne Körbe (Käfige) hängen am Turm von St. Lamberti?',
      placeholder: 'Zahl',
      answerHashes: [
        '4e07408562bedb8b60ce05c1decfe3ad16b72230967de01f640b7e4729b49fce',
        '6b70e2d592dd17196b7940574ee89f31c354435338179245457ad54064ba7f77',
      ],
    },
    hints: [
      'Tretet ein Stück zurück (Richtung Prinzipalmarkt), dann seht ihr die Turmseite mit den Körben besser.',
      'Die Körbe hängen übereinander/nebeneinander an der Turmseite oberhalb des Zifferblatts.',
      'Es war eine kleine Führungsriege des Täuferreichs, die hier zur Schau gestellt wurde – mehr als einer, aber keine Handvoll. Zählt am Turm noch einmal ganz genau nach.',
    ],
    resolution: `Drei Körbe – für die drei Anführer Jan van Leiden, Bernd Knipperdolling und Bernd Krechting, hingerichtet 1536 vor dem Rathaus. Unter Vlemyncks Eintrag steht, dreifach unterstrichen, das erste Wort der Losung: **PAX**. Und weiter: „Geh nun dorthin, wo der Händler mit der Kiepe steht, und sieh ihm auf den Rücken.“`,
    fragment: 'PAX',
    image: {
      file: 'Münster, St.-Lamberti-Kirche -- 2014 -- 6860.jpg',
      alt: 'St. Lamberti mit ihrem durchbrochenen Turmhelm',
      credit: RABICH,
    },
  },
  {
    id: 'kiepenkerl',
    label: 'Station 4',
    name: 'Der Kiepenkerl',
    coords: { lat: 51.9645, lng: 7.627 },
    directions:
      'Von St. Lamberti haltet euch links an der Kirche vorbei über den Drubbel, dann rechts zum Spiekerhof. Auf dem kleinen Platz steht das Denkmal des Kiepenkerls.',
    story: `Aus dem Tagebuch: „Die Wanderhändler tragen Nachrichten schneller übers Land als jeder Kurier des Kaisers. Manche Botschaft, die den Frieden rettete, reiste in einem Rückenkorb unter Eiern und Leinen. Dem Manne, der hier steht, verdanke ich mein Leben – die Herren mit den schwarzen Siegeln suchten mich, und er trug mich als ‚Ware‘ aus dem Tore.“

Der Kiepenkerl ist das Denkmal der westfälischen Wanderhändler. Das Original von 1896 wurde im Krieg zerstört, seit 1953 steht hier eine Neufassung.`,
    task: {
      kind: 'quiz',
      question:
        'Seht euch die Statue genau an: Wie heißt das geflochtene Traggestell, das der Kiepenkerl auf dem Rücken trägt – und das ihm seinen Namen gibt?',
      placeholder: 'Ein Wort',
      answerHashes: [
        '63bac65feb26c83bc6d7d2fe066f9ff0200bc604940c372d8d2b9890ba4e743e',
        '4ac6b2ab86d9a50396f3f985255b777999868c2ffd62cd5827c231fac4f8d26c',
        '2a522092835694bf9145b3f15123c5cbff31e075067a8ace1420d18523db3275',
        '20c8396c5e55327220cacb2cfc2f988709286282c5e856ba03fe7b2d7e854f2a',
        '8b5f2aaa977db4278f96a830230fc9849608c1d095475abc85a1760c55f47a05',
        'f7dbd6e22e5288bc046f5d2e2d7814b1129774ca34a6364a3c2392b6261c232a',
      ],
    },
    hints: [
      'Schaut genau auf den Rücken der Statue: Dort trägt er ein geflochtenes Behältnis aus Weidenruten.',
      'Solche geflochtenen Rückentraggestelle nutzten Wanderhändler und Bauern jahrhundertelang, um Waren zu transportieren.',
      'Das Wort beginnt mit K und reimt sich auf „Wiege“ – fast jedenfalls.',
    ],
    resolution: `Die Kiepe! Vlemynck schreibt: „Folge nun den Freunden aus dem Westen. Sie wohnten im Hause der Krämer, gleich um die Ecke – und in ebenjenem Hause ward ihr Friede mit Spanien unterzeichnet, im Januar des großen Jahres.“`,
    image: {
      file: 'Kiepenkerl-Denkmal, Münster.jpg',
      alt: 'Das Kiepenkerl-Denkmal am Spiekerhof',
      credit: 'Foto: Wikimedia Commons (Lizenz siehe verlinkte Dateiseite)',
    },
  },
  {
    id: 'krameramtshaus',
    label: 'Station 5',
    name: 'Krameramtshaus – die Gäste aus dem Westen',
    coords: { lat: 51.965, lng: 7.6277 },
    directions:
      'Vom Kiepenkerl sind es nur wenige Schritte in den Alten Steinweg. Sucht das alte Giebelhaus mit den Flaggen (Hausnummer 6/7).',
    story: `Aus dem Tagebuch: „Die Gesandten der Generalstaaten wohnten im Hause des Krämeramtes. Ehrliche Leute; am 30. Tage des Januars ward in ihrem Hause der Friede mit Spanien unterzeichnet – der erste Stein im Gewölbe des großen Friedens. Bei ihnen ließ ich die Abschrift meiner Depesche zurück – doch die Spur führt weiter.“

Das Krameramtshaus von 1589 ist das älteste Gildehaus Münsters und eines der wenigen Gebäude der Altstadt, die den Zweiten Weltkrieg überstanden. Von 1646 bis 1648 wohnte hier die niederländische Gesandtschaft; am 30. Januar 1648 wurde in diesem Haus der spanisch-niederländische Friede unterzeichnet. Die heutige Nutzung des Hauses erinnert genau daran.`,
    task: {
      kind: 'quiz',
      question:
        'Lest die Beschilderung am Gebäude: Welchem Land ist dieses Haus heute gewidmet? (Es heißt „Haus der …“)',
      placeholder: 'Land',
      answerHashes: [
        '98ede48e954aefc2e2ca1545e28636c63f9253e576cbc823c3740567557bc2ed',
        '3330e99ff415001e9dd809429f22b39e516f938e3818f4b706267b8c4ce0f1e5',
        '95b958182cd9e1e52153c85d6a85120e5a56b8a3ef2173902456abe029d32dfc',
      ],
    },
    hints: [
      'Achtet auf Schilder und Flaggen am Eingang.',
      'Die Gesandten, die hier 1648 wohnten, kamen aus diesem Land – die offizielle Bezeichnung des Hauses steht direkt über oder neben dem Haupteingang.',
      'Prüft auch Fahne oder Wappen am Gebäude – sie gehören zum selben Land wie die Beschriftung.',
    ],
    resolution: `Haus der Niederlande – richtig. Vlemyncks nächster Eintrag: „Nun hinab zur Salzstraße. Dort, wo ein Herr vom Adel sein Haus auf ein winziges Grundstück zwängen ließ, liegt der nächste Nachtrag meiner Freunde.“`,
  },
  {
    id: 'erbdrostenhof',
    label: 'Station 6',
    name: 'Erbdrostenhof – das schräge Palais',
    coords: { lat: 51.9609, lng: 7.6322 },
    directions:
      'Vom Krameramtshaus zurück zum Prinzipalmarkt und weiter über den Roggenmarkt in die Salzstraße hinein (ca. 10 Minuten). Auf halber Strecke, hinter einem schmiedeeisernen Tor, liegt linker Hand das barocke Adelspalais mit der Hausnummer 38.',
    story: `Nachtrag der Bruderschaft, um 1760 den Papieren beigelegt: „Ein Jahrhundert nach Vlemynck bauten wir unsere Spur weiter, denn die Stadt wuchs, und mit ihr wuchsen die Verstecke. Hier, an der Salzstraße, ließ sich der Erbdrost der Fürstbischöfe ein Stadtpalais errichten – vom selben Baumeister, der später auch dem Fürstbischof selbst ein Schloss bauen sollte. Das Grundstück aber war winzig und spitz zulaufend wie ein Keil. Der Baumeister behalf sich mit einem Kniff, den nur sieht, wer vor dem ganzen Hause steht und nicht nur auf die Tür starrt.“

Der Erbdrostenhof (1753–1757) wurde von Johann Conrad Schlaun für den Erbdrosten Adolf Heidenreich Freiherr Droste zu Vischering auf ein kleines, schmales Eckgrundstück gebaut. Um trotzdem eine prächtige, repräsentative Schauseite zu bekommen, schwingt die gesamte Fassade in einer durchgehenden Kurve.`,
    task: {
      kind: 'quiz',
      question:
        'Tretet ein paar Schritte zurück und betrachtet die gesamte Fassade zur Salzstraße als Ganzes: Schwingt sie sich nach innen (wie eine Schale) oder nach außen (wie ein Bauch)?',
      placeholder: 'nach innen / nach außen',
      answerHashes: [
        '4132600988b436c919c7869e00a66b42ed30738a977e7904347fdbec8e6b71a4',
        '850dcd69d9020ae02acfe1bf33c31ba39236398a92944cd08f898013b97dbeb7',
        'a658c22493b4378c2dc826af6c606c711a53ca2321635cba23c016aa41576bc5',
        '760d80fd003ad247b2567750cb3b37f0b7a4ab6e6199b3fca5a737771d6076f2',
        'a14d9671a502fc762f8c1b25cbd506d63bd49ea3cdf0cb55599f3736e5020517',
        'b753d6644e0e6e11e5b6e11d2289c230cc90308b59864e9cd3c2333099c3db28',
      ],
    },
    hints: [
      'Schaut auf das ganze Gebäude, nicht nur auf den Mitteleingang – geht dafür auf die andere Straßenseite.',
      'Das Grundstück war zu klein und zu spitz für eine gerade Fassade. Der Baumeister ließ sie deshalb in einem großen Bogen schwingen.',
      'Stellt euch vor, die Fassade wäre eine Schüssel: Würde Regenwasser von ihrer Mitte weg- oder zu ihr hinlaufen? Das verrät euch die Wölbungsrichtung.',
    ],
    resolution: `Richtig: Die Fassade ist konkav gewölbt – nach innen, wie eine Schale. So gewann Schlaun trotz des winzigen Eckgrundstücks eine große, prächtige Schauseite. Die Bruderschaft schreibt weiter: „Nur wenige Schritte weiter, versteckt zwischen zwei Straßen, steht eine kleine Kirche desselben Baumeisters. Auch sie hat eine Besonderheit, die man erst sieht, wenn man einmal um sie herumgeht.“`,
  },
  {
    id: 'clemenskirche',
    label: 'Station 7',
    name: 'Clemenskirche – die vielen Ecken',
    coords: { lat: 51.9606, lng: 7.6319 },
    directions:
      'Vom Erbdrostenhof nur wenige Schritte weiter: Zwischen Salzstraße und Clemensstraße liegt, ein wenig verborgen, die kleine Klosterkirche mit der auffälligen Kuppel.',
    story: `Nachtrag der Bruderschaft: „Auch dieses Gotteshaus schuf der Baumeister des Erbdrostenhofs, für die Barmherzigen Brüder, die hier Kranke pflegten. Von außen scheint sie fast rund – doch ein Rund ist sie nicht. Geht einmal um sie herum und zählt, was zu zählen ist.“

Die Clemenskirche (1745–1753) ist als überkuppelter Zentralbau über kreisförmigem Grundriss entworfen, im Außenbau aber vielflächig ummantelt – ein Vieleck, das sich rund anfühlt, aber gerade Kanten hat.`,
    task: {
      kind: 'quiz',
      question:
        'Geht einmal um den Außenbau der Kirche herum und zählt die geraden Seiten (Ecken) der Außenmauer, auf der die kuppelbekrönte Rundung ruht. Wie viele sind es?',
      placeholder: 'Zahl',
      answerHashes: [
        'fb70ba265872a7640649f628ae57a3dae87c2cb21b49f078558379a232e50968',
        '6b51d431df5d7f141cbececcf79edf3dd861c3b4069f0b11661a3eefacbba918',
        '09eb02cfa39a99681e145965ceac64e71a429dc4af90fbaaae4c427448cdd857',
        '260c23161116c88dee0b022a6ac2072fb4c41e08930216d2117996571198cde3',
      ],
    },
    hints: [
      'Aus der Nähe wirkt die Wand fast rund – tretet zurück und schaut auf die einzelnen geraden Abschnitte zwischen den Fenstern.',
      'Es ist mehr als ein Achteck (8 Seiten), aber kein perfekter Kreis.',
      'Denkt an das Zifferblatt einer Uhr: Die Kirche hat für jede Stunde genau eine gerade Seite.',
    ],
    resolution: `Zwölf Seiten – ein Zwölfeck, das sich von Weitem rund anfühlt. Die Bruderschaft notiert: „Zurück auf den Hauptweg, zum Dom, wo die große Uhr steht.“`,
  },
  {
    id: 'dom',
    label: 'Station 8',
    name: 'St.-Paulus-Dom – die astronomische Uhr',
    coords: { lat: 51.9629, lng: 7.6257 },
    directions:
      'Von der Clemenskirche zurück Richtung Prinzipalmarkt und dann über die Gassen zum weiten Domplatz (ca. 10 Minuten). Betretet den Dom durch das Hauptportal (Eintritt frei; bitte Gottesdienstzeiten respektieren). Die astronomische Uhr findet ihr im südlichen Chorumgang, rechts hinter dem Hochaltar.',
    story: `Aus dem Tagebuch: „Im Dome steht die große Uhr, die Sonne, Mond und Sterne weist. Als Knabe stand ich staunend davor. Der Meister, der sie schuf, versteckte darin eine Eigenheit, die nur sieht, wer wirklich schaut. Wer sie kennt, kennt die Richtung meiner Spur.“

Die astronomische Uhr von 1540–1542 überstand Krieg und Zerstörung. Sie zeigt Planetenstände, Tierkreiszeichen und den Kalender bis weit in die Zukunft. Und sie hat eine berühmte Besonderheit.`,
    task: {
      kind: 'quiz',
      question:
        'Beobachtet das große Zifferblatt der astronomischen Uhr (notfalls ein paar Minuten): In welche Richtung wandern die Zeiger?',
      placeholder: 'z.B. „nach links“ / „nach rechts“',
      answerHashes: [
        'eef8b9fd5d437dd991ce2695fcce6c416ea3068e5b448963f0a7c3cbd9ad98eb',
        '9b49d0e234e3808a7ed66866ac6b69eccbf6832d65a1d621a96c813cffececdb',
        'fff15c41f88b721dbf0a6cb787c329336592f3152df8aa97ec890a9c4d9a7025',
        'e02fd66f710eae4fbafd2ebaccda35a949477122a004994e2e819a4e899f860f',
        'a3f69ef4e47cb868c83015514cce49c2da03c98ebbf44393d4890fe54638e33b',
        '840984adbbfc1abdc160ab1ee4e2101da4bdb83657f0a0212d8bb41c72485455',
        '2c375640af5fd08482a597b9e816776972b357eb7bea5076e074c68e70f2fcdc',
        'dde05db7580bea632e00155ca4687121e752166fc40d571f535c22dd61ad1406',
      ],
    },
    hints: [
      'Vergleicht die Zeigerstellung mit einer normalen Armbanduhr – läuft sie genauso oder andersherum?',
      'Die Uhr folgt dem scheinbaren Lauf der Sonne über den Himmel: von Ost über Süd nach West.',
      'Wartet ein, zwei Minuten und beobachtet einen der Zeiger ganz genau: Bewegt er sich auf der 12-Uhr-Position in Richtung der 1 oder in Richtung der 11?',
    ],
    image: {
      file: 'Münster, St.-Paulus-Dom, Astronomische Uhr -- 2019 -- 3822.jpg',
      alt: 'Die astronomische Uhr im St.-Paulus-Dom',
      credit: RABICH,
    },
    resolution: `Genau: Die Zeiger laufen linksherum, gegen den Uhrzeigersinn! Unter dem Eintrag steht Vlemyncks zweites Wort, in Spiegelschrift geschrieben: **OPTIMA**. Und weiter: „Geh nun über das Wasser – zu Unserer Lieben Frau, deren Turm sein Haupt verlor.“`,
    fragment: 'OPTIMA',
  },
  {
    id: 'ueberwasser',
    label: 'Station 9',
    name: 'Überwasserkirche – der Turm ohne Haupt',
    coords: { lat: 51.9636, lng: 7.6231 },
    directions:
      'Verlasst den Dom, überquert den Domplatz nach Westen und geht über die kleine Aa-Brücke. Vor euch steht die Überwasserkirche (Liebfrauenkirche).',
    story: `Aus dem Tagebuch: „Die Kirche über dem Wasser hat viel erlitten. Als die Wiedertäufer die Stadt hielten, brachen sie dem Turme sein Haupt ab, um Geschütze hinaufzuschaffen. Man hat ihm später ein neues Haupt gegeben – doch die Narbe jener Jahre vergisst die Stadt nicht.“

Dazu ein Nachtrag der Bruderschaft aus dem Jahr 1705: „Der große Orkan des vergangenen Herbstes hat dem Turme das Haupt abermals genommen. Die Herren der Stadt wollen es nicht erneuern. So bleibe er, wie der Krieg und der Sturm ihn hinterließen – ein Mahnmal, wie kein Baumeister es hätte ersinnen können.“

Vergleicht den Turm der Überwasserkirche mit dem Turm von St. Lamberti, den ihr vorhin gesehen habt. Was fällt auf?`,
    task: {
      kind: 'quiz',
      question:
        'Was fehlt dem Turm der Überwasserkirche, das die meisten anderen Kirchtürme (z.B. St. Lamberti) haben?',
      placeholder: 'Ein Wort',
      answerHashes: [
        '3333c82cc4d9b011e3802bc581c8ca3402400c4501add10bb2479f4ad53afdd3',
        '4854c1c67f524cbef4fd3a30e699d00b8fe2df1fb6e42d7f00bbdd7c431bd450',
        '58e9df4ded80af61265cebbe39869ec24701dab79ec3739e516c9fb855bef61e',
        '2e66a3b84d7d9c71bbadece61f7f604cbe228f52ea70a1f222c5a09b0cd76fa0',
        '292e7129df5d2282d799a9dc2e548cd7222b45c70352da0e2ddcb4af800ebf0a',
        '731a3a59776c25a69c136b92c952443bdd75ee6f6056f48533a8149c0b5c4211',
        'ab14d3faa25e917efe6e7135d4ecca197866738885a88b9b95d1a16d2bb5b323',
        '487974f860e43195964d110c6da95e1068b14f6873423ceb7705c412bc29f335',
        '69364142e40930ed64a9f3ee2570adf9e1971831f8d1d5f10046a66e1a71ba15',
        '53d264a1ed1d8194062078f82859a56b782abe5f573007ad8175168a76e73878',
      ],
    },
    hints: [
      'Schaut ganz nach oben und vergleicht die Silhouette mit der von St. Lamberti.',
      'Der Turm endet flach, wo andere Türme spitz zulaufen.',
      'Vergleicht die Turmspitze mit einem angespitzten Bleistift gegenüber einem abgebrochenen – wie nennt man das fehlende Stück ganz oben an einem Kirchturm?',
    ],
    resolution: `Richtig – dem Turm fehlt die Spitze (der Turmhelm). Die Täufer nahmen sie 1534 ab, um Geschütze aufzustellen; der wiederaufgebaute Helm wurde 1704 von einem Orkan zerstört und nie erneuert. Vlemynck: „Von hier wandte ich mich gen Westen, hinaus aus der alten Stadt.“ – Dr. Cording ergänzt: Der nächste Hinweis der Bruderschaft stammt aus der Zeit um 1780 und führt zum Schloss des Fürstbischofs.`,
    image: {
      file: 'Münster 20210319 085322.jpg',
      alt: 'Die Überwasserkirche mit ihrem flach endenden Turm',
      credit: 'Foto: Wikimedia Commons (Lizenz siehe verlinkte Dateiseite)',
    },
  },
  {
    id: 'schloss',
    label: 'Station 10',
    name: 'Fürstbischöfliches Schloss',
    coords: { lat: 51.9636, lng: 7.6134 },
    directions:
      'Folgt der Frauenstraße nach Westen, überquert die Promenade und geht weiter geradeaus – nach etwa 10–12 Minuten öffnet sich der weite Schlossplatz. Stellt euch vor die Mitte der Barockfassade.',
    story: `Aus den Papieren der Bruderschaft (um 1780): „Der Baumeister Schlaun hat dem Fürstbischof ein Schloss aus rotem Ziegel und hellem Sandstein gesetzt. Wir haben das Versteck der Depesche erneuert und die Spur hierher verlängert. Wer wissen will, wem das Haus einst dienen wird, der lese, was an seinen Toren geschrieben steht.“

Das Schloss wurde 1767–1787 nach Plänen von Johann Conrad Schlaun erbaut – der Fürstbischof zog nie richtig ein. Heute hat das Gebäude einen ganz anderen Hausherrn. Die Schilder am Eingang verraten ihn.`,
    task: {
      kind: 'quiz',
      question:
        'Lest die Beschilderung am Schloss: Welche Einrichtung hat hier heute ihren Sitz?',
      placeholder: 'Einrichtung',
      answerHashes: [
        '59d8b2e5ddb8810f5a5ae058c45ba95433219b31ece18839bbb643109735110c',
        '44d99bbbcf8712c6e266d4d7e6e6f4a14d0e9fe7e2e0a4a692e671ab2d094df5',
        '8d9315fc224d877fa15d9322ef9d26e9f6bf233d9d2290fdab0c232494bc945c',
        'c0911ed0bd0b58a1ae14a853a23af63534be14f223a85f34470fb67066e3c66b',
        '4d1080b7fe5c4c631b9bcfa5686f3b27a9d96a9d60711c2cc0c18060a07eec92',
        'cac4d9a125145d332b57b39ec561b12b3fc89ce06cefddbd8d6ae92ee2167db1',
      ],
    },
    hints: [
      'Achtet auf die offiziellen Schilder neben den Eingängen.',
      'Rund 45.000 junge Menschen „wohnen“ heute tagsüber in dieser Einrichtung – verteilt über die ganze Stadt.',
      'Achtet auf ein Kürzel auf den Schildern, das mit zwei großen W beginnt – es steht für den vollen Namen der Einrichtung.',
    ],
    resolution: `Richtig: die Universität Münster residiert heute im Schloss. Der letzte Eintrag der Bruderschaft lautet: „Hinter dem Schlosse liegt der Garten. Dort, wo unsere Zeichen dich hinführen, haben wir den toten Briefkasten angelegt. Kein Rätsel mehr – nun zählt allein der Ort.“ – Jetzt kommt euer GPS ins Spiel!`,
    image: {
      file: 'Münster, Fürstbischöfliches Schloss -- 2018 -- 1925-27-28.jpg',
      alt: 'Das Fürstbischöfliche Schloss, heute Sitz der Universität',
      credit: RABICH,
    },
  },
  {
    id: 'briefkasten',
    label: 'Station 11',
    name: 'Schlossgarten – der tote Briefkasten',
    coords: { lat: 51.965, lng: 7.611 },
    directions:
      'Geht links oder rechts um das Schloss herum in den Schlossgarten. Aktiviert die Ortung eures Handys – die App zeigt euch, wie weit ihr vom toten Briefkasten entfernt seid.',
    story: `Dr. Cording: „Die Bruderschaft nutzte im Schlossgarten einen toten Briefkasten – einen geheimen Übergabeort, den nur kannte, wer die Spur bis hierher gelesen hatte. Seine Lage haben wir aus den Papieren rekonstruiert. Findet den Punkt – euer Handy führt euch. Wenn ihr nah genug seid, öffnet sich der nächste Tagebucheintrag.“`,
    task: {
      kind: 'geo',
      description:
        'Findet den toten Briefkasten im Schlossgarten. Lauft los und beobachtet die Entfernungsanzeige – sie führt euch zum Ziel. Ihr müsst auf etwa 40 Meter herankommen.',
      target: { lat: 51.965, lng: 7.611 },
      radiusMeters: 40,
      fallbackHashes: [
        'ed9bf4c44601e28f37ea1ce3256264a2a7717899467d99d6d5587fd4d4efd0af',
        '69d61fe0b98d364c234d5f12eb704d3b24aca5e4286ed7f31bc09f4c0c4059c0',
      ],
      fallbackHint:
        'Kein GPS? Der Spielleiter kennt das Codewort (der Name des Baumeisters des Schlosses – siehe Begleitheft).',
    },
    hints: [
      'Erlaubt der Seite den Zugriff auf euren Standort (Browser-Abfrage bestätigen).',
      'Die Entfernung wird in Metern angezeigt – wird die Zahl kleiner, seid ihr richtig.',
      'Der Punkt liegt im Schlossgarten hinter (westlich) dem Schloss, etwas nördlich der Mittelachse.',
    ],
    resolution: `Ihr habt den toten Briefkasten gefunden! Im (fiktiven) Versteck: Vlemyncks drittes Wort – **RERUM** – und sein vorletzter Eintrag: „Die Depesche selbst brachte ich ans Wasser. Die Bruderschaft hat ihr Versteck zuletzt dorthin verlegt, wo drei steinerne Kugeln am Ufer des Sees ruhen. Zähle sie, und du bist am Ziel.“`,
    fragment: 'RERUM',
  },
  {
    id: 'aasee',
    label: 'Station 12',
    name: 'Aasee – die drei Kugeln',
    coords: { lat: 51.95711, lng: 7.61819 },
    directions:
      'Verlasst den Schlossgarten nach Süden und folgt der Promenade bzw. den Wegen Richtung Aasee (ca. 15 Minuten). Haltet am Nordostufer Ausschau nach den riesigen Betonkugeln an der Wiese (Nähe Aaseeterrassen/Annette-Allee).',
    story: `Dr. Cording: „Die ‚Giant Pool Balls‘ des Künstlers Claes Oldenburg stehen seit 1977 am Aasee – anfangs heftig umstritten, heute ein Wahrzeichen. Als die Bruderschaft ihr Versteck zum letzten Mal erneuerte, wählte sie diesen Ort: Kugeln wie überdimensionale Siegel, gut sichtbar und doch voller Geheimnis.“`,
    task: {
      kind: 'quiz',
      question: 'Ihr steht davor: Wie viele Betonkugeln liegen hier am Ufer des Aasees?',
      placeholder: 'Zahl',
      answerHashes: [
        '4e07408562bedb8b60ce05c1decfe3ad16b72230967de01f640b7e4729b49fce',
        '6b70e2d592dd17196b7940574ee89f31c354435338179245457ad54064ba7f77',
      ],
    },
    hints: [
      'Die Kugeln stehen als Gruppe auf der Wiese am Nordostufer.',
      'Jede Kugel hat etwa 3,5 Meter Durchmesser – zu übersehen sind sie nicht.',
      'Es sind genauso viele wie die Körbe am Lambertiturm.',
    ],
    resolution: `Drei Kugeln – wie drei Siegel, wie drei Körbe, wie drei Worte. Ihr habt alle Fragmente gesammelt. Setzt nun die Losung der verlorenen Depesche zusammen und sprecht sie aus!`,
  },
  {
    id: 'finale',
    label: 'Finale',
    name: 'Die verlorene Depesche',
    coords: { lat: 51.95711, lng: 7.61819 },
    directions:
      'Bleibt bei den Kugeln am Aasee – hier endet die Spur.',
    story: `Dr. Cording nimmt euch beiseite: „Vlemyncks Depesche trug drei lateinische Worte – die Devise des Westfälischen Friedens. Ihr habt auf eurem Weg alle drei Fragmente gefunden. Setzt sie in der richtigen Reihenfolge zusammen: Das erste fandet ihr bei den Körben, das zweite bei der Uhr, das dritte im toten Briefkasten.“`,
    task: {
      kind: 'quiz',
      question: 'Wie lautet die Losung der verlorenen Depesche? (drei Worte)',
      placeholder: 'Drei Worte',
      answerHashes: ['e3a810988017e402bc930a4b02bc6b2d3341e5c4d9dc2137a6518322780aeaeb'],
    },
    hints: [
      'Die drei Fragmente wurden euch nach den Stationen 3, 8 und 11 angezeigt – ihr findet sie auch oben in der Fragmentleiste.',
      'Es ist Latein und bedeutet: „Der Friede ist das beste der Dinge.“',
      'PAX … – jetzt nur noch die richtige Reihenfolge.',
    ],
    resolution: finaleText,
    image: {
      file: 'Münster, Skulptur -Giant Pool Balls- -- 2016 -- 2379.jpg',
      alt: 'Die Giant Pool Balls von Claes Oldenburg am Aasee',
      credit: RABICH,
    },
  },
];
