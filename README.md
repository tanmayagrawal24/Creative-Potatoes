# Creative Potatoes — Website

Die Website liegt als einfache, statische Seite vor. Es gibt keine Datenbank und
kein Login. Alle Texte stehen in wenigen übersichtlichen Dateien, die sich mit
jedem Texteditor bearbeiten lassen.

Diese Anleitung ist für Menschen ohne Programmiererfahrung geschrieben.

---

## Inhalt

1. [Node.js — bereits erledigt](#1-nodejs--bereits-erledigt)
2. [Die Website lokal starten](#2-die-website-lokal-starten)
3. [Wo welcher Text steht](#3-wo-welcher-text-steht)
4. [Eine Leistung hinzufügen oder entfernen](#4-eine-leistung-hinzufügen-oder-entfernen)
5. [Eine Referenz hinzufügen](#5-eine-referenz-hinzufügen)
6. [Das Logo einsetzen](#6-das-logo-einsetzen)
7. [Einen ganzen Abschnitt entfernen](#7-einen-ganzen-abschnitt-entfernen)
8. [Veröffentlichen](#8-veröffentlichen)
9. [Wenn etwas nicht funktioniert](#9-wenn-etwas-nicht-funktioniert)

---

## 1. Node.js — bereits erledigt

Node.js ist das Programm, das aus den Textdateien die fertige Website baut.

**Auf diesem Rechner ist es bereits installiert** (Version 24.18.0, im Ordner
`~/.local/node`). Es muss nichts weiter getan werden.

Zum Prüfen: das Programm **Terminal** öffnen (über Spotlight, ⌘ + Leertaste,
„Terminal" eingeben), folgendes eintippen und Enter drücken:

```
node --version
```

Erscheint `v24.18.0`, ist alles in Ordnung.

<details>
<summary>Nur falls die Website einmal auf einen anderen Rechner umzieht</summary>

Dort [nodejs.org](https://nodejs.org) öffnen, die Schaltfläche mit dem Zusatz
**LTS** anklicken, die Datei herunterladen und öffnen. Den Installationsschritten
folgen — danach funktioniert alles Weitere identisch.

</details>

---

## 2. Die Website lokal starten

„Lokal" heißt: nur auf dem eigenen Rechner sichtbar, noch nicht im Internet. So
lassen sich Änderungen gefahrlos ausprobieren.

Die benötigten Hilfsprogramme wurden bereits geladen (`npm install` ist schon
gelaufen). Zum Starten genügt:

```
cd "/Users/tanmayagarwal/creative pototatoes"
npm start
```

Im Terminal erscheint eine Adresse, meist `http://localhost:8080`. Diese Adresse
im Browser öffnen — dort ist die Website zu sehen.

Solange `npm start` läuft, aktualisiert sich der Browser bei jeder gespeicherten
Änderung von selbst. Zum Beenden im Terminal **Strg + C** drücken.

---

## 3. Wo welcher Text steht

Alle Inhalte liegen im Ordner `src/_data/` als `.json`-Dateien.

| Datei | Inhalt |
| --- | --- |
| `site.json` | Name, Claim, Herkunftssatz, die drei Belegpunkte, E-Mail-Adresse |
| `services.json` | Die Leistungsgruppen mit ihren Einzelleistungen |
| `approach.json` | Überschrift und die Schritte Verstehen / Aufbauen / Skalieren |
| `references.json` | Die Referenzen |

Die Navigation besteht bewusst nur aus dem Logo und einem Kontakt-Link im
Kopfbereich. Es gibt keine Navigationsliste zum Pflegen.

### Die wichtigsten zwei Sätze

Beide stehen in `src/_data/site.json` und **nur dort**. Wer sie dort ändert,
ändert sie überall auf der Seite gleichzeitig:

```json
"tagline": "Marketing mit stiller Präzision.",
"originStatement": "Indische Kreativkraft. Deutsches Marktverständnis.",
```

### Regeln für JSON-Dateien

Das Format ist streng. Drei Dinge sind wichtig:

- Jeder Text steht **zwischen doppelten Anführungszeichen**: `"so"`.
- Zwischen zwei Einträgen steht ein **Komma**, nach dem letzten Eintrag **nicht**.
- Kommt im Text selbst ein Anführungszeichen vor, muss ein Schrägstrich davor:
  `"Er sagte \"hallo\"."`

Ein vergessenes oder überzähliges Komma ist mit Abstand der häufigste Fehler.
Siehe [Abschnitt 9](#9-wenn-etwas-nicht-funktioniert).

---

## 4. Eine Leistung hinzufügen oder entfernen

Datei: `src/_data/services.json`. Es muss **nur** diese Datei bearbeitet werden.

### Eine einzelne Leistung hinzufügen

Innerhalb der gewünschten Gruppe in der Liste `"items"` einen neuen Block
ergänzen — und das Komma nach dem vorherigen Block nicht vergessen:

```json
{
  "name": "Influencer Marketing",
  "description": "Auswahl, Briefing und Abwicklung von Kooperationen."
}
```

### Eine Leistung entfernen

Den kompletten Block von `{` bis `}` löschen, inklusive des Kommas davor
beziehungsweise dahinter.

### Eine ganze neue Leistungsgruppe

Einen Block auf oberster Ebene ergänzen. `"id"` muss eindeutig sein und darf
nur Kleinbuchstaben und Bindestriche enthalten — sie wird zum Sprungziel:

```json
{
  "id": "beratung",
  "title": "Beratung",
  "headline": "Ein Satz zur Einordnung der Gruppe.",
  "note": "Optionaler Hinweis. Diese Zeile darf ganz fehlen.",
  "items": [
    { "name": "Workshops", "description": "Beschreibung der Leistung." }
  ]
}
```

`"note"` ist freiwillig: fehlt die Zeile, wird nichts angezeigt.

Die Gruppen dürfen unterschiedlich lang sein — vier, sieben und drei Einträge
nebeneinander sind kein Problem. Die Seite übernimmt neue Gruppen und
Leistungen automatisch; Layout und Gestaltung müssen nicht angefasst werden.

---

## 5. Eine Referenz hinzufügen

Datei: `src/_data/references.json`. Ein neuer Block nach demselben Muster:

```json
{
  "client": "Name des Kunden",
  "sector": "Branche, Land",
  "summary": "Ein bis zwei Sätze zum Projekt.",
  "result": "Das messbare Ergebnis.",
  "url": "https://www.kundenseite.de"
}
```

`"url"` darf leer bleiben (`""`) — dann wird der Kundenname schlicht ohne Link
angezeigt.

Die drei vorhandenen Einträge sind Platzhalter und sollten ersetzt oder gelöscht
werden, bevor die Seite online geht.

---

## 6. Das Logo einsetzen

Die Seite erwartet die Logodatei hier:

```
src/assets/logo.svg
```

Die Datei einfach in diesen Ordner legen und exakt so benennen. Sobald sie da
ist, erscheint sie in Kopf- und Fußzeile.

Der Platz dafür ist bereits fest reserviert — **160 × 40 Pixel** am Computer,
**120 × 30 Pixel** am Handy. Die Datei sollte in diesem Seitenverhältnis
angelegt sein (4:1), damit nichts verzerrt oder springt.

**Solange keine Logodatei vorhanden ist**, zeigt die Seite ersatzweise den
Schriftzug „Creative Potatoes" an derselben Stelle. Die Seite ist also auch
ohne Logo vollständig benutzbar.

---

## 7. Einen ganzen Abschnitt entfernen

Datei: `src/index.njk`. Ganz unten steht die Reihenfolge der Abschnitte, eine
Zeile pro Abschnitt:

```
{% include "sections/hero.njk" %}
{% include "sections/positionierung.njk" %}
{% include "sections/leistungen.njk" %}
...
```

- **Abschnitt entfernen:** die entsprechende Zeile löschen.
- **Reihenfolge ändern:** die Zeilen verschieben.

Zwei Zeilen dürfen dabei nicht verschwinden: `hero.njk` ist der Kopfbereich der
Seite (Logo und Kontakt-Link), und `kontakt.njk` ist das Ziel dieses Links.
Wird eine davon gelöscht, fehlt der Seite ihr Kopf beziehungsweise der
Kontakt-Link führt ins Leere.

## Schriften

Die Schriften Fraunces und Schibsted Grotesk liegen als Dateien im Projekt
(`src/assets/fonts/`) und werden vom eigenen Server ausgeliefert — **nicht**
von Google Fonts. Das ist Absicht: Google Fonts überträgt die IP-Adresse jeder
Besucherin und jedes Besuchers in die USA, was deutsche Gerichte als
DSGVO-Verstoß gewertet haben. Es ist also nichts einzurichten, und es darf
kein Google-Fonts-Link ergänzt werden.

---

## 8. Veröffentlichen

Die Seite läuft auf **Cloudflare Pages**.

### Einrichtung (einmalig)

1. Auf [dash.cloudflare.com](https://dash.cloudflare.com) anmelden.
2. **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
3. Das Repository dieser Website auswählen.
4. Diese Einstellungen eintragen:

   | Feld | Wert |
   | --- | --- |
   | Framework preset | `Eleventy` |
   | Build command | `npm run build` |
   | Build output directory | `_site` |

5. **Save and Deploy**.

### Danach

Jede Änderung, die ins Repository gespeichert („gepusht") wird, baut die Seite
automatisch neu. Es ist kein manueller Schritt nötig.

### Eigene Domain

Im Cloudflare-Projekt unter **Custom domains** die Wunschdomain hinterlegen und
den Anweisungen folgen.

**Wichtig nach dem Umzug auf eine eigene Domain:** In `src/_data/site.json` den
Wert `"url"` auf die echte Adresse ändern:

```json
"url": "https://www.creativepotatoes.de",
```

Davon hängen die Sitemap, die Google-Angaben und die Vorschaubilder beim Teilen
in sozialen Netzwerken ab.

---

## 9. Wenn etwas nicht funktioniert

**Die Seite ist im Browser weiß oder eine Fehlermeldung erscheint.**
Fast immer ist eine `.json`-Datei fehlerhaft — meist ein Komma zu viel oder
zu wenig. Im Terminal steht die betroffene Datei und die Zeilennummer. Wer
sichergehen will: den Dateiinhalt auf [jsonlint.com](https://jsonlint.com)
einfügen, dort wird die Fehlerstelle markiert.

**Änderungen erscheinen nicht.**
Wurde die Datei gespeichert? Läuft `npm start` noch? Notfalls im Terminal
**Strg + C**, dann `npm start` erneut.

**`npm` oder `node` wird nicht gefunden.**
Node.js liegt hier nicht am Standardort, sondern in `~/.local/node`. Damit das
Terminal es findet, steht in der Datei `~/.zshrc` diese Zeile:

```
export PATH="$HOME/.local/node/bin:$PATH"
```

Fehlt sie oder wurde sie gelöscht, kann sie dort wieder ergänzt werden. Danach
ein **neues** Terminal-Fenster öffnen — bestehende Fenster übernehmen die
Änderung nicht.

**Umlaute werden falsch dargestellt.**
Die Datei wurde in einem Editor gespeichert, der nicht UTF-8 verwendet.
Empfehlenswert sind Visual Studio Code, TextEdit (im reinen Textmodus) oder
Notepad++.

---

## Für Entwicklerinnen und Entwickler

- **Eleventy 3**, Nunjucks-Templates, kein CSS- und kein JS-Framework.
- `npm start` — Dev-Server mit Live-Reload. `npm run build` — Produktionsbuild
  nach `_site/`.
- Gestaltung ist in Design-Tokens (`--cp-…` in `src/css/tokens.css`) und
  eigene Klassen (`cp-` Präfix) getrennt. Farben, Schriften und Abstände werden
  ausschließlich über Custom Properties referenziert.
- `src/css/signature.css`, `src/_includes/sections/hero.njk` und
  `src/_includes/sections/craft.njk` gehören dem Design-Team und werden hier
  nicht bearbeitet.
- Cloudflare-Konfiguration: `src/_headers` (Security-Header, Caching) und
  `src/_redirects`.
