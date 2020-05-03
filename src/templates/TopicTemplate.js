import React from "react";
import { Link, graphql } from "gatsby";

// local imports
import Layout from "../components/Layout";
import SEO from "../components/SEO";
import ArticleList from "../components/ArticleList";

const TopicsPageTemplate = ({ location: { pathname } }) => {
  return (
    <Layout>
      <SEO
        title="Topics"
        description="Lorum ipsum"
        cover="https://spaceholder.cc/400x300"
        path={pathname}
      />
      Topics
    </Layout>
  );
};

export default TopicsPageTemplate;
