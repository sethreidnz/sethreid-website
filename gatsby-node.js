const path = require(`path`);
const { paginate } = require("gatsby-awesome-pagination");
const { createFilePath } = require("gatsby-source-filesystem");

// local imports
const siteMetadata = require("./data/siteConfig");

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
  articles.forEach((edge) => {
    if (edge.node.frontmatter.tags) {
      edge.node.frontmatter.tags.forEach((tag) => {
        tagSet.add(tag);
      });
    }
    if (edge.node.frontmatter.topics) {
      edge.node.frontmatter.topics.forEach((tag) => {
        topicSet.add(tag);
      });
    }
  });
  return [tagSet, topicSet];
};
