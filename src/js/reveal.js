/* =========================================================
   reveal.js — Scroll-Reveal für die cp-Abschnitte

   Progressive Enhancement, bewusst als EXTERNE Datei: die CSP
   (script-src 'self') erlaubt keine Inline-Skripte. Aus demselben
   Grund werden Verzögerungen über das CSSOM gesetzt (el.style.…),
   nicht über setAttribute("style", …) — Letzteres blockiert die CSP.

   Prinzip: Ohne JavaScript ist ALLES sichtbar. Erst dieses Skript
   versteckt Elemente (Klasse cp-reveal) und blendet sie beim
   Eintritt in den Viewport wieder ein (cp-reveal--in). Es läuft
   mit defer nach dem Parsen — bevor die Abschnitte unterhalb des
   Kopfbereichs ins Bild gescrollt sind.

   Der sig-Bereich (Hero, Handwerk) animiert sich selbst in
   signature.css und wird hier nicht angefasst.

   Kein Layout-Shift: cp-reveal ändert nur opacity und transform.
   ========================================================= */

(function () {
  "use strict";

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (reduced.matches || !("IntersectionObserver" in window)) {
    return; // alles bleibt sichtbar, keine Bewegung
  }

  /* Was animiert wird: je Abschnitt der Kopf (Kicker + Überschrift)
     als eine Gruppe, danach die Karten/Einträge einzeln gestaffelt. */
  var GROUPS = [
    ".cp-section .cp-kicker",
    ".cp-section .cp-h2",
    ".cp-pillar",
    ".cp-pakete__note",
    ".cp-paket",
    ".cp-ablauf__note",
    ".cp-ablauf__step",
    ".cp-statement__text",
    ".cp-referenz-card",
    ".cp-faq__item",
    ".cp-kontakt__text",
    ".cp-kontakt__email"
  ];

  var targets = document.querySelectorAll(GROUPS.join(", "));
  if (targets.length === 0) return;

  /* Staffelung: Geschwister im selben Elternelement rücken je 90 ms
     versetzt ein — gedeckelt, damit späte Karten nicht nachhinken. */
  var STEP_MS = 90;
  var MAX_STEPS = 5;

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("cp-reveal--in");
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -10% 0px", threshold: 0.05 }
  );

  targets.forEach(function (el) {
    /* Bereits sichtbare Elemente (Seite mit Anker geladen, zurück-
       gescrollt) niemals verstecken — sonst blitzt der Inhalt. */
    var rect = el.getBoundingClientRect();
    var inView =
      rect.top < window.innerHeight * 0.9 && rect.bottom > 0;
    if (inView) return;

    var index = 0;
    var sibling = el;
    while ((sibling = sibling.previousElementSibling) && index < MAX_STEPS) {
      if (sibling.classList.contains(el.classList[0])) index += 1;
    }

    el.classList.add("cp-reveal");
    el.style.transitionDelay = index * STEP_MS + "ms";
    observer.observe(el);
  });

  /* Wechselt die Systemeinstellung während des Besuchs auf
     „Bewegung reduzieren", wird alles sofort eingeblendet. */
  reduced.addEventListener("change", function (event) {
    if (!event.matches) return;
    observer.disconnect();
    targets.forEach(function (el) {
      el.classList.add("cp-reveal--in");
      el.style.transitionDelay = "";
    });
  });
})();
