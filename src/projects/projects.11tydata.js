module.exports = {
  tags: ["project"],
  layout: "layouts/project.njk",
  pageType: "project",
  eleventyComputed: {
    metaTitle: function(data) {
      return (data.seo && data.seo.title) || data.title + " | Projects | " + data.site.name;
    },
    metaDescription: function(data) {
      return (data.seo && data.seo.description) || data.summary || data.site.description;
    },
    canonicalPath: function(data) {
      return "/project/" + data.page.fileSlug + "/";
    },
    permalink: function(data) {
      return "/project/" + data.page.fileSlug + "/index.html";
    }
  }
};
