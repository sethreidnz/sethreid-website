import siteConfig from "../../data/siteConfig";

export const getArticleFromArticleNode = (node) => ({
  path: getArticlePath(node.frontmatter.slug),
  slug: node.frontmatter.slug,
  tags:
    node.frontmatter.tags && node.frontmatter.tags.isArray
      ? node.frontmatter.tags
      : [],
  topics:
    node.frontmatter.topics && node.frontmatter.topics.isArray
      ? node.frontmatter.topics
      : [],
  cover: node.frontmatter.cover,
  title: node.frontmatter.title,
  date: node.frontmatter.date,
  excerpt: node.excerpt,
  body: node.body,
});

export const getArticlesFromArticleEdges = (articleEdges) =>
  articleEdges.map((postEdge) => getArticleFromArticleNode(postEdge.node));

export const getArticlePath = (slug) =>
  `${siteConfig.articlePathPrefix}/${slug}`;
