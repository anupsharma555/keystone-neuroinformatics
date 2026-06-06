module.exports = {
  tags: ["service"],
  layout: "layouts/service.njk",
  pageType: "service",
  eleventyComputed: {
    metaTitle: function(data) {
      return (data.seo && data.seo.title) || data.title + " | Services | " + data.site.name;
    },
    metaDescription: function(data) {
      return (data.seo && data.seo.description) || data.summary || data.site.description;
    },
    canonicalPath: function(data) {
      return "/services/" + data.page.fileSlug + "/";
    },
    permalink: function(data) {
      return "/services/" + data.page.fileSlug + "/index.html";
    }
  }
};
