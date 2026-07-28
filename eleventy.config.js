import fs from "node:fs";
import path from "node:path";
import { schemas, validateData } from "./lib/data-schema.js";

const DATA_DIR = "src/_data";

/* Prüft die Inhaltsdateien, bevor Eleventy irgendetwas rendert.
   Ein Fehler bricht den Build ab — siehe lib/data-schema.js. */
function assertDataShape() {
  const dataByFile = {};
  const parseErrors = [];

  for (const file of Object.keys(schemas)) {
    const full = path.join(DATA_DIR, file);
    try {
      dataByFile[file] = JSON.parse(fs.readFileSync(full, "utf8"));
    } catch (err) {
      parseErrors.push(`${file} → ist kein gültiges JSON: ${err.message}`);
    }
  }

  const errors = [...parseErrors, ...validateData(dataByFile)];

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

  // Live-reload the browser when a stylesheet changes.
  eleventyConfig.addWatchTarget("src/css/");

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
