/* =========================================================
   Sprachauflösung — welche Inhalte sieht eine Seite?

   Die Inhalte liegen zweimal: src/_data/de/ und src/_data/en/.
   Eleventy stellt sie als de.* und en.* bereit (der Ordnername
   wird zum Namensraum).

   Hier wird pro Seite EIN Sprachpaket ausgewählt und unter den
   alten, unveränderten Namen bereitgestellt: site, ui, services,
   packages, process, faq, references. Die Vorlagen bleiben
   dadurch sprachneutral — {{ site.tagline }} funktioniert auf
   beiden Seiten, ohne dass irgendwo "de" oder "en" steht.

   Welche Sprache gilt, entscheidet der Wert "lang":
     - Vorgabe "de"            (eleventy.config.js, globale Daten)
     - "en" für alles unter /en/ (src/en/en.json, Ordnerdaten)
   ========================================================= */

/* Fällt auf Deutsch zurück, falls lang fehlt oder unbekannt ist.
   Ohne diesen Riegel würde eine Vorlage ohne lang-Wert still eine
   leere Seite rendern statt den Fehler zu zeigen. */
function bundle(data) {
  return data[data.lang] || data.de;
}

export default {
  site: (data) => bundle(data).site,
  ui: (data) => bundle(data).ui,
  services: (data) => bundle(data).services,
  packages: (data) => bundle(data).packages,
  process: (data) => bundle(data).process,
  faq: (data) => bundle(data).faq,
  references: (data) => bundle(data).references
};
