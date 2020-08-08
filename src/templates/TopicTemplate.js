import React from "react";

// local imports
import Layout from "../components/Layout";
import SEO from "../components/SEO";

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
