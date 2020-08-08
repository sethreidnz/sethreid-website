import React from "react";
import { graphql } from "gatsby";

// local imports
import siteConfig from "../../data/siteConfig";
import { getArticlesFromArticleEdges } from "../utilities/article";
import Layout from "../components/Layout";
import SEO from "../components/SEO";
import ArticleList from "../components/ArticleList";

const SiteIndex = ({ data, pageContext, location }) => {
  const articles = getArticlesFromArticleEdges(data.allMdx.edges);
  return (
    <Layout>
      <SEO title="Home" />
      <ArticleList
        title="All Posts"
        articles={articles}
        nextPagePath={`${siteConfig.articlePathPrefix}/2`}
        nextPageText="More posts"
      />
    </Layout>
  );
};

export default SiteIndex;

export const pageQuery = graphql`
  query($resultsPerPage: Int!) {
    allMdx(
      sort: { fields: [frontmatter___date], order: DESC }
      limit: $resultsPerPage
      skip: 0
    ) {
      edges {
        node {
          excerpt
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            title
            description
            slug
          }
        }
      }
    }
  }
`;
