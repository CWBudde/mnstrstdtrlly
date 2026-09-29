# Die verlorene Depesche – Stadtrallye Münster

Eine mobile Web-App für eine Stadtrallye durch Münster, mit einer erfundenen Geschichte um den Westfälischen Frieden.

**Entwurfsstand:** Die Überarbeitung ist technisch umgesetzt und anhand schriftlicher Quellen und historischer Fotos vorbereitet. Begehung und unabhängiger Blindtest stehen aus. Die Veröffentlichung der neuen Route bleibt bis zu diesen Nachweisen gesperrt; [PLAN.md](PLAN.md) unterscheidet umgesetzte und begründet zurückgestellte Aufgaben.

Die Spur beginnt bei den Giant Pool Balls am **Aasee** und führt über einen GPS-Punkt auf der Promenade, Schloss, Überwasserkirche, Kiepenkerl, Dom, St. Lamberti, Krameramtshaus und Stadtweinhaus zum **Historischen Rathaus**. Das Finale funktioniert außen; ein Besuch im Friedenssaal ist optional und eintrittspflichtig. Die [Routenskizze](docs/evidence/route.svg) zeigt die Markerfolge, keine Gehwegnavigation. Plant vorläufig 2–3 Stunden mit Rätselpausen ein; die tatsächliche Dauer muss der Feldtest bestätigen.

Die Rätsel kombinieren beobachtbare Details mit einer Rechnung, Buchstabenentnahme oder Chiffre. Datierte Siegelcodes öffnen ein Meta-Rätsel am Rathaus. Detailbilder erscheinen in der App nicht, damit sie die Beobachtungen nicht vorwegnehmen. Das einleitende Stadtbild verlinkt seinen Wikimedia-Bildnachweis.

Ihr startet mit 1000 Punkten. Hinweise kosten 25 Punkte, falsche Antworten 10, Notfall-Auflösen und ein erfolgreicher GPS-Fallback jeweils 100. Nach je drei Fehlversuchen wird die Eingabe für 30, 60, 120, 240 und höchstens 300 Sekunden gesperrt. Kosten und Wartezeit bleiben beim Neuladen erhalten. Das Finale zeigt Punkte, Dauer und Notfall-Stationen. Fortschritt wird unter `mnstrstdtrlly:progress:v3` gespeichert; alte Spielstände gelten für die geänderte Route nicht mehr.

Der Dom nennt aktuell täglich 6:30–19:00 Uhr; Gottesdienste und örtliche Einschränkungen haben Vorrang. Quellen, Lösungen, Referenzfotos und die vorbereitete Begehungscheckliste stehen im [Spielleiter-Dokument](VERIFIKATION.md). Dieses enthält Spoiler und gehört nicht in Teilnehmerhände.

## Entwicklung und Prüfungen

React + TypeScript + Vite; Leaflet mit OpenStreetMap. Node.js 22.18 oder neuer verwenden.

```bash
npm ci
npm run dev
npm test
npm run build
npx playwright install --with-deps chromium
npm run test:e2e
npm run preview
```

Playwright testet den Produktionsbuild über `vite preview` auf Port 4173. Vor `test:e2e` muss `npm run build` laufen. Bei einer vorhandenen Chrome-/Chromium-Installation kann ihr Pfad über `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` gesetzt werden. Tests laufen mit einem Browser-Worker. Browserartefakte landen unter `output/playwright/`.

Vitest prüft Spielzustand, Speicherung, Sperrzeiten, Punkte, asynchrone Eingaben, Feldnachweise, Routeninvarianten, Chiffre und Spoiler. Playwright spielt die Rallye vollständig durch und prüft Reload, GPS-Ankunft/Fallback, Notfall-Bestätigung und den Wechsel zur Karte während einer Antwortprüfung. Die Testlösungen liegen außerhalb des App-Bundles in `tests/solutions.ts`; im App-Datensatz stehen ausschließlich normalisierte SHA-256-Antwort-Hashes. Das ist eine Spielmechanik, kein Schutz vor manipulierten Browsern.

## Freigabe und Deployment

Der [GitHub-Workflow](.github/workflows/deploy.yml) führt Unit-Tests, Build und Browser-Tests vor dem Deploy aus. Pull Requests und der Entwicklungsbranch werden geprüft. Nur `main` darf veröffentlichen; zusätzlich muss `npm run verify:release` die Feldnachweise und den Blindtest aus [field-verification.json](docs/evidence/field-verification.json) bestätigen. Mit dem aktuellen leeren Protokoll beendet dieser Befehl sich absichtlich mit Fehlerstatus und nennt die fehlenden Nachweise.

Die Nachweise müssen echte Begehungsfotos mit Datum sowie zwei Begehungsberichte und einen unabhängigen Blindtest enthalten. Das Schema und die Zielwerte sind in [VERIFIKATION.md](VERIFIKATION.md) erklärt. Historische Referenzfotos ersetzen diese Nachweise nicht. Merge und Veröffentlichung bleiben bis zur Feldfreigabe zurückgestellt.

Der freigegebene Build wird auf den `gh-pages`-Branch geschrieben. In den GitHub-Pages-Einstellungen ist dieser Branch als Quelle einzustellen. Die veröffentlichte App liegt unter <https://cwbudde.github.io/mnstrstdtrlly/>; der aktuelle lokale Entwurf wurde nicht veröffentlicht.
