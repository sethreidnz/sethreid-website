const path = require(`path`);
const { createFilePath } = require(`gatsby-source-filesystem`);

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
        site {
          siteMetadata {
            resultsPerPage
            articlePathPrefix
            topics {
              title
              slug
              description
              cover
            }
          }
        }
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
  const siteMetadata = contentQuery.data.site.siteMetadata;
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
  const numberOfPages = Math.ceil(articles.length / resultsPerPage);
  for (let index = 0; index < numberOfPages; index++) {
    let articleListPage = {
      path:
        index === 0
          ? `${articlePathPrefix}`
          : `${articlePathPrefix}/${index + 1}`,
      component: articleListTemplate,
      context: {
        limit: resultsPerPage,
        skip: index * resultsPerPage,
        numPages: numberOfPages,
        currentPage: index + 1,
      },
    };
    createPage(articleListPage);
  }
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
