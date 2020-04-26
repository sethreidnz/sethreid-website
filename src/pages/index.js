import React from "react";
import { graphql } from "gatsby";

// local imports
import { getArticlesFromArticleEdges } from "../utilities/article";
import Layout from "../components/Layout";
import SEO from "../components/SEO";
import ArticleList from "../components/ArticleList";

const BlogIndex = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata.title;
  const articles = getArticlesFromArticleEdges(data.allMarkdownRemark.edges);

  return (
    <Layout location={location} title={siteTitle}>
      <SEO title="All posts" />
      <ArticleList title="All Posts" articles={articles} />
    </Layout>
  );
};

export default BlogIndex;

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
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
