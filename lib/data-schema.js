/* =========================================================
   Schema-Prüfung für die Inhaltsdateien in src/_data/

   Läuft bei jedem Build. Schlägt eine Prüfung fehl, bricht der
   Build ab — bewusst laut, nicht als Warnung.

   Hintergrund: Wird ein Schlüssel in einer JSON-Datei umbenannt,
   ohne dass das zugehörige Template mitzieht, rendert Nunjucks
   still einen leeren String. Die Seite baut sauber durch und der
   Fehler fällt erst im Browser auf — oder gar nicht. Deshalb gilt
   hier: ein unbekannter Schlüssel ist genauso ein Fehler wie ein
   fehlender. Eine Umbenennung, die den alten Schlüssel liegen
   lässt, scheitert am verwaisten Schlüssel.
   ========================================================= */

const str = { type: "string", required: true };
const strOpt = { type: "string", required: false };

/* Für jede Datei: erwartete Form.
   kind        "object" = die Datei ist ein Objekt
               "array"  = die Datei ist eine Liste von Datensätzen
   labelKey    welcher Schlüssel einen Datensatz in Fehlermeldungen benennt
   fields      erlaubte Schlüssel; alles andere ist ein Fehler        */

export const schemas = {
  "site.json": {
    kind: "object",
    fields: {
      name: str,
      tagline: str,
      originStatement: str,
      heroSubline: str,
      ctaPrimary: str,
      ctaSecondary: str,
      trustLine: str,
      description: str,
      email: str,
      locale: str,
      lang: str,
      url: str,
      proofPoints: {
        type: "array",
        required: true,
        of: { label: str, description: str },
        ofLabelKey: "label"
      }
    }
  },

  "services.json": {
    kind: "array",
    labelKey: "id",
    fields: {
      id: str,
      title: str,
      teaser: str,
      badge: strOpt,
      bullets: {
        type: "array",
        required: true,
        of: null, // Liste aus einfachen Strings, siehe checkRecord
        ofString: true
      }
    }
  },

  "packages.json": {
    kind: "object",
    fields: {
      note: str,
      items: {
        type: "array",
        required: true,
        of: {
          id: str,
          title: str,
          kind: str,
          contents: str,
          result: str,
          cta: str
        },
        ofLabelKey: "id"
      },
      addons: {
        type: "array",
        required: true,
        ofString: true
      }
    }
  },

  "process.json": {
    kind: "object",
    fields: {
      headline: str,
      note: strOpt,
      steps: {
        type: "array",
        required: true,
        of: { number: str, title: str, description: str },
        ofLabelKey: "title"
      }
    }
  },

  "faq.json": {
    kind: "array",
    labelKey: "q",
    fields: {
      q: str,
      a: str
    }
  },

  "references.json": {
    kind: "array",
    labelKey: "client",
    fields: {
      client: str,
      sector: str,
      summary: str,
      result: strOpt,
      url: strOpt
    }
  }
};

function typeOf(value) {
  if (Array.isArray(value)) return "array";
  if (value === null) return "null";
  return typeof value;
}

/* Prüft ein einzelnes Objekt gegen eine Feldliste und sammelt Fehler. */
function checkRecord(record, fields, where, errors) {
  if (typeOf(record) !== "object") {
    errors.push(`${where} → erwartet ein Objekt, gefunden: ${typeOf(record)}`);
    return;
  }

  const allowed = Object.keys(fields);

  // Unbekannte Schlüssel — hier landet die liegengebliebene Umbenennung.
  for (const key of Object.keys(record)) {
    if (!allowed.includes(key)) {
      errors.push(
        `${where} → unbekannter Schlüssel "${key}" ` +
          `(erlaubt sind: ${allowed.join(", ")})`
      );
    }
  }

  for (const [key, spec] of Object.entries(fields)) {
    const present = Object.prototype.hasOwnProperty.call(record, key);

    if (!present) {
      if (spec.required) {
        errors.push(`${where} → fehlender Pflichtschlüssel "${key}"`);
      }
      continue;
    }

    const actual = typeOf(record[key]);
    if (actual !== spec.type) {
      errors.push(
        `${where} → Schlüssel "${key}" hat Typ ${actual}, erwartet ${spec.type}`
      );
      continue;
    }

    if (spec.type === "string" && spec.required && record[key].trim() === "") {
      errors.push(`${where} → Schlüssel "${key}" ist leer`);
      continue;
    }

    // Liste aus einfachen Strings (bullets, addons)
    if (spec.type === "array" && spec.ofString) {
      if (record[key].length === 0) {
        errors.push(`${where} → "${key}" ist eine leere Liste`);
      }
      record[key].forEach((entry, i) => {
        if (typeOf(entry) !== "string") {
          errors.push(
            `${where} → "${key}" [${i}] hat Typ ${typeOf(entry)}, erwartet string`
          );
        } else if (entry.trim() === "") {
          errors.push(`${where} → "${key}" [${i}] ist leer`);
        }
      });
    }

    // Liste aus verschachtelten Datensätzen (items, steps)
    if (spec.type === "array" && spec.of) {
      if (record[key].length === 0) {
        errors.push(`${where} → "${key}" ist eine leere Liste`);
      }
      record[key].forEach((entry, i) => {
        const label =
          spec.ofLabelKey && entry && entry[spec.ofLabelKey]
            ? `"${entry[spec.ofLabelKey]}"`
            : `[${i}]`;
        checkRecord(entry, spec.of, `${where} → ${key} ${label}`, errors);
      });
    }
  }
}

/* Prüft alle bekannten Dateien. Gibt die Liste der Fehler zurück. */
export function validateData(dataByFile) {
  const errors = [];

  for (const [file, schema] of Object.entries(schemas)) {
    const data = dataByFile[file];

    if (data === undefined) {
      errors.push(`${file} → Datei fehlt oder ist nicht lesbar`);
      continue;
    }

    if (schema.kind === "object") {
      checkRecord(data, schema.fields, file, errors);
      continue;
    }

    if (typeOf(data) !== "array") {
      errors.push(`${file} → erwartet eine Liste, gefunden: ${typeOf(data)}`);
      continue;
    }

    if (data.length === 0) {
      errors.push(`${file} → die Liste ist leer`);
    }

    data.forEach((record, i) => {
      const label =
        schema.labelKey && record && record[schema.labelKey]
          ? `Eintrag "${record[schema.labelKey]}"`
          : `Eintrag [${i}]`;
      checkRecord(record, schema.fields, `${file} → ${label}`, errors);
    });
  }

  return errors;
}
