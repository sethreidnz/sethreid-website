export const getArticleFromArticleNode = (node) => ({
  path: `/articles${node.fields.slug}`,
  slug: node.fields.slug,
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
