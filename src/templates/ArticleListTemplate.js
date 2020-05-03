import React from "react";
import { graphql } from "gatsby";

//local imports
import { getArticlesFromArticleEdges } from "../utilities/article";
import Layout from "../components/Layout";
import SEO from "../components/SEO";
import ArticleList from "../components/ArticleList";

const ArticleListTemplate = ({
  path,
  data,
  pageContext: { humanPageNumber, nextPagePath, previousPagePath },
}) => {
  const articles = getArticlesFromArticleEdges(data.allMdx.edges);
  return (
    <Layout>
      <SEO
        title={`Articles Page ${humanPageNumber}`}
        description="Lorem Ipsum"
        path={path}
      />
      <ArticleList
        title={`Page`}
        articles={articles}
        currentPage={humanPageNumber}
        nextPagePath={nextPagePath}
        previousPagePath={previousPagePath}
      />
    </Layout>
  );
};

export default ArticleListTemplate;

export const articleListTemplate = graphql`
  query($skip: Int!, $limit: Int!) {
    allMdx(
      sort: { fields: [frontmatter___date], order: DESC }
      limit: $limit
      skip: $skip
    ) {
      edges {
        node {
          excerpt
          fields {
            slug
          }
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            title
            description
          }
        }
      }
    }
  }
`;
