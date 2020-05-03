import React from "react";
import { graphql } from "gatsby";

// local components
import Layout from "../layout";
import SEO from "../components/SEO";
import ArticleList from "../components/ArticleList";

const ArticleListTemplate = ({
  location: { pathname },
  data: {
    allMdx: { edges },
  },
  pageContext
}) => {
  return (
    <Layout>
      <SEO
        title="Articles"
        description="Lorum ipsum"
        cover="https://spaceholder.cc/400x300"
        path={pathname}
      />
      Topics
    </Layout>
  );
};

export default ArticleListTemplate;
