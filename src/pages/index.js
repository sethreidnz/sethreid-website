import React from "react";
import { graphql } from "gatsby";

// local imports
import { getArticlesFromArticleEdges } from "../utilities/article";
import Layout from "../components/Layout";
import SEO from "../components/SEO";
import ArticleList from "../components/ArticleList";

const SiteIndex = ({ data, location }) => {
  const articles = getArticlesFromArticleEdges(data.allMdx.edges);

  return (
    <Layout>
      <SEO title="All posts" />
      <ArticleList title="All Posts" articles={articles} />
    </Layout>
  );
};

export default SiteIndex;

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allMdx(sort: { fields: [frontmatter___date], order: DESC }) {
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
