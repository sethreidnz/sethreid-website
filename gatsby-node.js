const path = require(`path`);
const { paginate } = require("gatsby-awesome-pagination");
const { createFilePath } = require("gatsby-source-filesystem");

// local imports
const siteMetadata = require("./data/siteConfig");
const siteTags = require("./data/tags");
const siteTagSlugs = siteTags.map((tag) => tag.slug);
const siteTopics = require("./data/topics");
const siteTopicSlugs = siteTopics.map((topic) => topic.slug);

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions;

  // template paths
  const articleTemplate = path.resolve(`./src/templates/ArticleTemplate.js`);
  const articleListTemplate = path.resolve(
    `./src/templates/ArticleListTemplate.js`
  );

  const contentQuery = await graphql(
    `
      {
        allMdx(
          sort: { fields: [frontmatter___date], order: DESC }
          limit: 1000
        ) {
          edges {
            node {
              frontmatter {
                title
                tags
                topics
              }
              fields {
                slug
              }
            }
          }
        }
      }
    `
  );

  if (contentQuery.errors) {
    throw contentQuery.errors;
  }

  const articles = contentQuery.data.allMdx.edges;
  const articlePathPrefix = siteMetadata.articlePathPrefix;
  const [tagSet, topicSet] = getTagsAndTopics(articles);

  // Create page for each article.
  articles.forEach((article, index) => {
    const previous =
      index === articles.length - 1 ? null : articles[index + 1].node;
    const next = index === 0 ? null : articles[index - 1].node;
    let articlePage = {
      path: `${articlePathPrefix}${article.node.fields.slug}`,
      component: articleTemplate,
      context: {
        slug: article.node.fields.slug,
        previous,
        next,
      },
    };

    createPage(articlePage);
  });

  // create the post listing pages
  const resultsPerPage = siteMetadata.resultsPerPage;
  paginate({
    createPage,
    items: articles,
    itemsPerPage: resultsPerPage,
    pathPrefix: articlePathPrefix,
    component: articleListTemplate,
  });
};

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions;

  if (node.internal.type === `Mdx`) {
    const value = createFilePath({ node, getNode });
    createNodeField({
      name: `slug`,
      node,
      value,
    });
  }
};

exports.onCreatePage = async ({ page, actions }) => {
  const { createPage, deletePage } = actions;
  const resultsPerPage = siteMetadata.resultsPerPage;

  deletePage(page);
  createPage({
    ...page,
    context: {
      ...page.context,
      resultsPerPage,
    },
  });
};

const getTagsAndTopics = (articles) => {
  const tagSet = new Set();
  const topicSet = new Set();
  const validationErrors = [];
  articles.forEach((edge) => {
    let articleValidationErrors = [];
    if (edge.node.frontmatter.tags) {
      edge.node.frontmatter.tags.forEach((tag) => {
        if (tagSlugIsValid(tag)) {
          tagSet.add(tag);
        } else {
          articleValidationErrors.push(`Invalid tag '${tag}'`);
        }
      });
    }

    if (edge.node.frontmatter.topics) {
      edge.node.frontmatter.topics.forEach((tag) => {
        if (topicSlugIsValid(tag)) {
          topicSet.add(tag);
        } else {
          articleValidationErrors.push(`Invalid topic '${tag}'`);
        }
      });
    }

    if (articleValidationErrors.length > 0) {
      validationErrors.push({
        articleEdge: edge,
        errors: articleValidationErrors,
      });
    }
  });

  if (validationErrors.length > 0) {
    const errorMessages = validationErrors.map((articleValidationError) => {
      return `
      Article with slug ${
        articleValidationError.articleEdge.node.fields.slug
      } has the following error \n\n
        ${articleValidationError.errors.map((error) => `- ${error}`)}
      `;
    });
    errorMessages.forEach((message) => console.error(message));
    throw new Error(
      "There were errors in the tags or topics. See above for details"
    );
  }
  return [tagSet, topicSet];
};

const tagSlugIsValid = (tag) => siteTagSlugs.includes(tag);
const topicSlugIsValid = (tag) => siteTopicSlugs.includes(tag);
