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

	eleventyConfig.addCollection('tag', collection => {
	  return collection.getFilteredByGlob('_tags/*.md');
	});


	return {
		dir: {
			input: "./",
			output: "./_site"
		}
	}
}