module.exports = {
  tags: ["research_update"],
  layout: "layouts/research.njk",
  pageType: "research",
  eleventyComputed: {
    metaTitle: function(data) {
      return (data.seo && data.seo.title) || data.title + " | Research | " + data.site.name;
    },
    metaDescription: function(data) {
      return (data.seo && data.seo.description) || data.summary || data.site.description;
    },
    canonicalPath: function(data) {
      return "/research/" + data.page.fileSlug + "/";
    },
    permalink: function(data) {
      return "/research/" + data.page.fileSlug + "/index.html";
    }
  }
};
