export default function (eleventyConfig) {
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

  // Live-reload the browser when a stylesheet changes.
  eleventyConfig.addWatchTarget("src/css/");

  // Used by sitemap.xml and the canonical/OG tags.
  eleventyConfig.addFilter("isoDate", (value) =>
    new Date(value).toISOString().slice(0, 10)
  );

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
