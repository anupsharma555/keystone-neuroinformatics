module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addPassthroughCopy("src/_redirects");

  eleventyConfig.addFilter("absoluteUrl", function(path, site) {
    if (!path) {
      return site.url;
    }

    if (/^https?:\/\//.test(path)) {
      return path;
    }

    return new URL(path, site.url).toString();
  });

  eleventyConfig.addFilter("readableDate", function(value) {
    if (!value) {
      return "";
    }

    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    }).format(new Date(value));
  });

  eleventyConfig.addFilter("isoDate", function(value) {
    if (!value) {
      return "";
    }

    return new Date(value).toISOString();
  });

  eleventyConfig.addCollection("projects", function(collectionApi) {
    return collectionApi.getFilteredByTag("project").sort(function(a, b) {
      return a.data.title.localeCompare(b.data.title);
    });
  });

  eleventyConfig.addCollection("researchUpdates", function(collectionApi) {
    return collectionApi.getFilteredByTag("research_update").sort(function(a, b) {
      return new Date(b.data.date || 0) - new Date(a.data.date || 0);
    });
  });

  eleventyConfig.addCollection("publicPages", function(collectionApi) {
    return collectionApi.getAll().filter(function(item) {
      if (!item.url || !item.outputPath) {
        return false;
      }

      if (item.data.excludeFromSitemap) {
        return false;
      }

      return !(
        item.outputPath.endsWith(".xml") ||
        item.outputPath.endsWith(".txt") ||
        item.outputPath.endsWith("_redirects")
      );
    });
  });

  return {
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site"
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk"
  };
};
