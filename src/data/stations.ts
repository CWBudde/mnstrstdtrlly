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
}

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
  practical: `Was ihr braucht: bequeme Schuhe, ein aufgeladenes Smartphone und offene Augen. Alle Antworten findet ihr direkt an den Stationen – Wissen aus dem Internet hilft euch nicht weiter. Wenn ihr feststeckt, gibt es zu jedem Rätsel gestaffelte Hinweise. Startpunkt ist das Historische Rathaus am Prinzipalmarkt.`,
};

export const finaleText = `Dr. Cording strahlt: „Das ist sie. Die verlorene Depesche.“

In einer Blechkassette, von der Bruderschaft zuletzt in den 1970er-Jahren erneuert, liegt eine Abschrift von Vlemyncks Schriftstück. Drei lateinische Worte stehen darauf – dieselben, die 1648 auf die Gedenkmünzen des Friedens geprägt wurden:

**PAX OPTIMA RERUM** – „Der Friede ist das beste der Dinge.“

Vlemyncks letzter Tagebucheintrag, 25. Oktober 1648: „Heute ward der Friede von der Treppe des Rathauses verkündet. Die Glocken läuteten bis in die Nacht. Die Herren mit den schwarzen Siegeln sind abgereist, ihr Werk ist gescheitert. Was ich versteckte, gehört nun keinem Fürsten und keinem Kaufmann – es gehört der Stadt und allen, die nach uns kommen. Wer meine Spur bis hierher gelesen hat, der weiß: Der Friede ist das beste der Dinge. Man muss ihn nur suchen.“

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
    story: `Aus Vlemyncks Tagebuch: „Im Saale des Rathauses haben die Gesandten einander die Hände gereicht. Ich stand hinten an der Tür und hielt die Feder. Hier beginnt meine Spur – bei der Jahreszahl, die bald ganz Europa kennen wird. Wer sie am Hause findet, mag mir weiter folgen.“

Dr. Cording ergänzt: Im Friedenssaal dieses Rathauses wurde am 15. Mai 1648 der Friede zwischen Spanien und den Niederlanden beschworen – der erste Baustein des Westfälischen Friedens. Am und im Rathaus erinnert vieles an das große Jahr.`,
    task: {
      kind: 'quiz',
      question:
        'Sucht am Rathaus (Fassade, Tafeln am Eingang oder im Durchgang) die Jahreszahl des großen Friedens, an den hier alles erinnert. Welche Jahreszahl ist es?',
      placeholder: 'Jahreszahl (4 Ziffern)',
      answerHashes: ['a16c0ab260e30b22cd06fadf9a6a30c454ddc845925cc831796b2988874d6a5a'],
    },
    hints: [
      'Schaut euch die Beschilderung und Gedenktafeln rund um den Eingang zum Friedenssaal genau an.',
      'Der Dreißigjährige Krieg dauerte von 1618 bis … ? Das Ende ist die gesuchte Zahl.',
      'Die Zahl beginnt mit 16 und endet mit 48.',
    ],
    resolution: `Richtig: 1648. In Vlemyncks Tagebuch steht unter der Zahl ein kleiner Pfeil nach Norden und die Worte: „Folge dem Markt der Kaufleute zu der Kirche, an der die Körbe des Schreckens hängen.“ – Werft im Vorbeigehen einen Blick auf die Bogengänge des Prinzipalmarkts: Unter diesen Arkaden wurde 1648 gefeilscht, verhandelt und spioniert.`,
  },
  {
    id: 'stadtweinhaus',
    label: 'Station 2',
    name: 'Stadtweinhaus',
    coords: { lat: 51.9619, lng: 7.6285 },
    directions:
      'Nur ein paar Schritte: Das Stadtweinhaus ist das prächtige Giebelhaus direkt links neben dem Rathaus.',
    story: `Aus dem Tagebuch: „Im Weinhause der Stadt lagerte der Wein für die hohen Herren. Manch ein Geheimnis wurde bei einem Kruge verraten. Ich habe dort gezählt, was das Haus zur Straße hin trägt – merke dir die Zahl, du wirst sie brauchen.“

1648 wurden im Stadtweinhaus die Weinvorräte der Stadt verwahrt – und mancher Gesandtendiener plauderte hier mehr aus, als seinem Herrn lieb war.`,
    task: {
      kind: 'quiz',
      question:
        'Stellt euch vor das Stadtweinhaus: Wie viele Rundbögen hat die Bogenhalle (Arkade) im Erdgeschoss zur Straße hin?',
      placeholder: 'Zahl',
      answerHashes: [
        'ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d',
        'fe534ca1a40bb873c3d3ada3ce564af791c6e5c15f62d3fa6713ee45ab1c1100',
      ],
    },
    hints: [
      'Zählt nur die Bögen im Erdgeschoss des Stadtweinhauses selbst, nicht die der Nachbarhäuser.',
      'Es sind weniger als sieben.',
      'Mehr als vier, weniger als sechs.',
    ],
    resolution: `Gut gezählt! Vlemynck notiert: „So viele Bögen, so viele treue Freunde hatte ich in der Stadt. Einer von ihnen war der Türmer. Geh nun zu St. Lamberti und sieh hinauf, wo die Körbe hängen.“`,
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
      'Es sind so viele wie die Anführer des Täuferreichs: Jan van Leiden, Bernd Knipperdolling und Bernd Krechting.',
    ],
    resolution: `Drei Körbe – für drei Anführer. Unter Vlemyncks Eintrag steht, dreifach unterstrichen, das erste Wort der Losung: **PAX**. Und weiter: „Geh nun dorthin, wo der Händler mit der Kiepe steht, und sieh ihm auf den Rücken.“`,
    fragment: 'PAX',
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
      'Der Name des Händlers verrät den Namen des Korbs.',
      '„…kerl“ ist der Mann. Wie heißt der erste Teil seines Namens?',
      'Das Wort beginnt mit K und reimt sich auf „Wiege“ – fast jedenfalls.',
    ],
    resolution: `Die Kiepe! Vlemynck schreibt: „Folge nun den Freunden aus dem Westen. Sie wohnten im Hause der Krämer, gleich um die Ecke – ihre Herren schlossen als Erste Frieden mit Spanien.“`,
  },
  {
    id: 'krameramtshaus',
    label: 'Station 5',
    name: 'Krameramtshaus – die Gäste aus dem Westen',
    coords: { lat: 51.965, lng: 7.6277 },
    directions:
      'Vom Kiepenkerl sind es nur wenige Schritte in den Alten Steinweg. Sucht das alte Giebelhaus mit den Flaggen (Hausnummer 6/7).',
    story: `Aus dem Tagebuch: „Die Gesandten der Generalstaaten wohnten im Hause des Krämeramtes. Ehrliche Leute; ihr Friede mit Spanien war der erste Stein im Gewölbe. Bei ihnen ließ ich die Abschrift meiner Depesche zurück – doch die Spur führt weiter.“

Das Krameramtshaus von 1589 ist das älteste Gildehaus Münsters. Während des Friedenskongresses wohnte hier die Gesandtschaft der Niederlande – und heute erinnert die Nutzung des Hauses genau daran.`,
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
      'Die Gesandten, die hier 1648 wohnten, kamen aus diesem Land.',
      'Das Land liegt westlich von Deutschland, seine Farbe ist Oranje.',
    ],
    resolution: `Haus der Niederlande – richtig. Vlemyncks nächster Eintrag: „Nun zum Herzen des Bistums. In der großen Kirche steht eine Uhr, die klüger ist als wir alle. Doch sieh genau hin: Sie geht ihren eigenen Weg.“`,
  },
  {
    id: 'dom',
    label: 'Station 6',
    name: 'St.-Paulus-Dom – die astronomische Uhr',
    coords: { lat: 51.9629, lng: 7.6257 },
    directions:
      'Geht zurück Richtung Süden und haltet euch rechts, über die Gassen zum weiten Domplatz. Betretet den Dom durch das Hauptportal (Eintritt frei; bitte Gottesdienstzeiten respektieren). Die astronomische Uhr findet ihr im Chorumgang, rechts hinter dem Hochaltar.',
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
      'Vergleicht die Zeigerstellung mit einer normalen Armbanduhr.',
      'Die Uhr folgt dem scheinbaren Lauf der Sonne von Ost nach West – aus Sicht des Betrachters „falsch“ herum.',
      'Sie läuft entgegen dem Uhrzeigersinn – also nach links.',
    ],
    resolution: `Genau: Die Zeiger laufen linksherum, gegen den Uhrzeigersinn! Unter dem Eintrag steht Vlemyncks zweites Wort, in Spiegelschrift geschrieben: **OPTIMA**. Und weiter: „Geh nun über das Wasser – zu Unserer Lieben Frau, deren Turm sein Haupt verlor.“`,
    fragment: 'OPTIMA',
  },
  {
    id: 'ueberwasser',
    label: 'Station 7',
    name: 'Überwasserkirche – der Turm ohne Haupt',
    coords: { lat: 51.9636, lng: 7.6231 },
    directions:
      'Verlasst den Dom, überquert den Domplatz nach Westen und geht über die kleine Aa-Brücke. Vor euch steht die Überwasserkirche (Liebfrauenkirche).',
    story: `Aus dem Tagebuch: „Die Kirche über dem Wasser trägt ihre Wunde mit Würde. Als die Wiedertäufer die Stadt hielten, brachen sie dem Turme sein Haupt ab, um Geschütze hinaufzuschaffen. So blieb er bis heute – ein Mahnmal wider den Krieg, wie kein Baumeister es hätte ersinnen können.“

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
      'Gesucht ist das spitze „Dach“ eines Kirchturms.',
    ],
    resolution: `Richtig – dem Turm fehlt die Spitze (der Turmhelm). Vlemynck: „Von hier wandte ich mich gen Westen, hinaus aus der alten Stadt. Die Bruderschaft hat meine Spur später dorthin verlängert, wo der Fürstbischof sein neues Schloss errichten ließ.“ – Dr. Cording bestätigt: Der nächste Hinweis der Bruderschaft stammt aus der Zeit um 1780 und führt zum Schloss.`,
  },
  {
    id: 'schloss',
    label: 'Station 8',
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
      'Das Schloss ist der Hauptsitz der … Münster.',
    ],
    resolution: `Richtig: die Universität Münster residiert heute im Schloss. Der letzte Eintrag der Bruderschaft lautet: „Hinter dem Schlosse liegt der Garten. Dort, wo unsere Zeichen dich hinführen, haben wir den toten Briefkasten angelegt. Kein Rätsel mehr – nun zählt allein der Ort.“ – Jetzt kommt euer GPS ins Spiel!`,
  },
  {
    id: 'briefkasten',
    label: 'Station 9',
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
    label: 'Station 10',
    name: 'Aasee – die drei Kugeln',
    coords: { lat: 51.9557, lng: 7.6118 },
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
    coords: { lat: 51.9557, lng: 7.6118 },
    directions:
      'Bleibt bei den Kugeln am Aasee – hier endet die Spur.',
    story: `Dr. Cording nimmt euch beiseite: „Vlemyncks Depesche trug drei lateinische Worte – dieselben, die 1648 auf die Gedenkmünzen des Friedens geprägt wurden. Ihr habt auf eurem Weg alle drei Fragmente gefunden. Setzt sie in der richtigen Reihenfolge zusammen: Das erste fandet ihr bei den Körben, das zweite bei der Uhr, das dritte im toten Briefkasten.“`,
    task: {
      kind: 'quiz',
      question: 'Wie lautet die Losung der verlorenen Depesche? (drei Worte)',
      placeholder: 'Drei Worte',
      answerHashes: ['e3a810988017e402bc930a4b02bc6b2d3341e5c4d9dc2137a6518322780aeaeb'],
    },
    hints: [
      'Die drei Fragmente wurden euch nach den Stationen 3, 6 und 9 angezeigt – ihr findet sie auch oben in der Fragmentleiste.',
      'Es ist Latein und bedeutet: „Der Friede ist das beste der Dinge.“',
      'PAX … – jetzt nur noch die richtige Reihenfolge.',
    ],
    resolution: finaleText,
  },
];
