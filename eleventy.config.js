import fs from "node:fs";
import path from "node:path";
import { schemas, validateData } from "./lib/data-schema.js";

const DATA_DIR = "src/_data";

/* Die Sprachen der Seite. Die erste ist die Vorgabe und liegt unter "/",
   jede weitere unter "/<code>/". Eine Sprache ergänzen heißt: Ordner
   src/_data/<code>/ anlegen, hier eintragen, Einstiegsseite unter
   src/<code>/ anlegen. */
const LANGS = ["de", "en"];
const DEFAULT_LANG = LANGS[0];

/* Prüft die Inhaltsdateien, bevor Eleventy irgendetwas rendert.
   Ein Fehler bricht den Build ab — siehe lib/data-schema.js.

   Geprüft wird JEDES Sprachpaket gegen dieselbe Feldliste. Damit ist
   eine unvollständige Übersetzung ein Build-Fehler und keine stille
   Lücke auf der Seite: fehlt ein Schlüssel in en/, schlägt der Build
   fehl, statt an dieser Stelle leer zu rendern. */
function assertDataShape() {
  const parseErrors = [];
  const schemaErrors = [];

  for (const lang of LANGS) {
    const dataByFile = {};

    for (const file of Object.keys(schemas)) {
      const full = path.join(DATA_DIR, lang, file);
      try {
        dataByFile[file] = JSON.parse(fs.readFileSync(full, "utf8"));
      } catch (err) {
        parseErrors.push(
          `${lang}/${file} → ist kein gültiges JSON: ${err.message}`
        );
      }
    }

    schemaErrors.push(...validateData(dataByFile, `${lang}/`));
  }

  const errors = [...parseErrors, ...schemaErrors];

  if (errors.length > 0) {
    const lines = errors.map((e) => `  ✗ ${e}`).join("\n");
    throw new Error(
      `\n\nInhaltsdateien entsprechen nicht dem erwarteten Schema ` +
        `(${errors.length} ${errors.length === 1 ? "Fehler" : "Fehler"}):\n\n` +
        `${lines}\n\n` +
        `Der Build wurde abgebrochen. Siehe lib/data-schema.js.\n`
    );
  }
}

export default function (eleventyConfig) {
  // Läuft vor jedem Build und vor jedem Rebuild im Dev-Server.
  eleventyConfig.on("eleventy.before", assertDataShape);

  // Stylesheets are copied through untouched — no bundler, no framework.
  eleventyConfig.addPassthroughCopy("src/css");

  // Ebenso das Scroll-Reveal-Skript (siehe src/js/reveal.js).
  eleventyConfig.addPassthroughCopy("src/js");

  // Cloudflare Pages control files. Mapped explicitly so the leading
  // underscore is never mistaken for an Eleventy-internal directory.
  eleventyConfig.addPassthroughCopy({
    "src/_headers": "_headers",
    "src/_redirects": "_redirects"
  });

  // Static assets (logo SVG, images, favicons) once they exist.
  eleventyConfig.addPassthroughCopy("src/assets");

  // Ist der Schriftzug vorhanden? Die Antwort fällt beim Bauen, nicht
  // im Browser: ein onerror-Attribut im Markup ist ein Inline-Handler
  // und wird von der CSP (script-src 'self') blockiert — der Ersatz-
  // Schriftzug erschien deshalb nie. Siehe README, Abschnitt 6.
  eleventyConfig.addGlobalData("hasWordmark", () =>
    fs.existsSync(path.join("src", "assets", "logo.svg"))
  );

  // Vorgabesprache. Alles unter src/en/ überschreibt das auf "en"
  // (siehe src/en/en.json); welche Inhalte daraus folgen, entscheidet
  // src/_data/eleventyComputed.js.
  eleventyConfig.addGlobalData("lang", DEFAULT_LANG);

  // ---------------------------------------------------------------
  // VORSCHAU-MODUS — vor dem echten Start wieder entfernen!
  //
  // Solange die Seite noch [[Platzhalter]] enthält, soll Google sie
  // nicht in den Index aufnehmen. Jede Seite bekommt dadurch
  // <meta name="robots" content="noindex, follow"> (siehe head.njk).
  //
  // Bewusst KEIN "Disallow: /" in robots.txt: das würde das Abrufen
  // verbieten, Google bekäme das noindex nie zu sehen und könnte die
  // Adresse trotzdem listen. Crawlen erlauben, Indexieren verbieten.
  //
  // Zum Starten: diese eine Zeile löschen und die Sitemap-Zeile in
  // src/robots.njk wieder freigeben.
  eleventyConfig.addGlobalData("noindex", true);
  // ---------------------------------------------------------------

  // Live-reload the browser when a stylesheet changes.
  eleventyConfig.addWatchTarget("src/css/");
  eleventyConfig.addWatchTarget("src/js/");

  // Current year, for the footer copyright line.
  eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);

  // Joins a page URL onto the site's base URL without doubling the slash.
  eleventyConfig.addFilter("absoluteUrl", (path, base) =>
    new URL(path, base).href
  );

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data"
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    templateFormats: ["njk", "md", "html"]
  };
}
