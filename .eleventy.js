const fs = require("fs");

module.exports = function(eleventyConfig) {

  // aliases for backwards support of jekyll layouts
  eleventyConfig.addLayoutAlias('blank', 'layouts/blank.html');
  eleventyConfig.addLayoutAlias('error', 'layouts/error.html');
  eleventyConfig.addLayoutAlias('default', 'layouts/default.html');
  eleventyConfig.addLayoutAlias('permalink', 'layouts/permalink.html');
  eleventyConfig.addLayoutAlias('post', 'layouts/post.html');
  eleventyConfig.addLayoutAlias('tag', 'layouts/tag.html');

  // configure post collection
  eleventyConfig.addCollection('post', collection => {
    return collection.getFilteredByGlob('_posts/*.md');
  });

  // non-template files that we want to serve
  eleventyConfig.addPassthroughCopy("images");
  eleventyConfig.addPassthroughCopy("js");
  eleventyConfig.addPassthroughCopy("main.css");
  eleventyConfig.addPassthroughCopy("*.png");
  eleventyConfig.addPassthroughCopy("favicon.ico");
  eleventyConfig.addPassthroughCopy("manifest.json");
  eleventyConfig.addPassthroughCopy("*.svg");
  eleventyConfig.addPassthroughCopy("sw.js");

  // 404 page for local server
  eleventyConfig.setBrowserSyncConfig({
    callbacks: {
      ready: function(err, bs) {
        bs.addMiddleware("*", (req, res) => {
          const content_404 = fs.readFileSync('_site/404.html');
          // Provides the 404 content without redirect.
          res.write(content_404);
          // Add 404 http status code in request header.
          // res.writeHead(404, { "Content-Type": "text/html" });
          res.writeHead(404);
          res.end();
        });
      }
    }
  });

  return {
    dir: {
      input: "./",
      output: "./_site"
    }
  }
}
