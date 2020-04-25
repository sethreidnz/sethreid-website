export const getArticleFromPostEdge = (postEdge) => ({
  path: `articles/${postEdge.node.fields.slug}`,
  tags: postEdge.node.frontmatter.tags,
  // topics: postEdge.node.frontmatter.topics,
  // cover: postEdge.node.frontmatter.cover,
  title: postEdge.node.frontmatter.title,
  date: postEdge.node.fields.date,
  excerpt: postEdge.node.excerpt,
  // timeToRead: postEdge.node.timeToRead,
});

export const getArticlesFromPostEdges = (postEdges) =>
  postEdges.map((postEdge) => getArticleFromPostEdge(postEdge));
