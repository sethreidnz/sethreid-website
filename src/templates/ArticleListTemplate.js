import React from "react";

//local imports
import { getArticlesFromArticleEdges } from "../utilities/article";
import Layout from "../components/Layout";
import SEO from "../components/SEO";

const ArticleListTemplate = ({
  location: { path },
  pageContext: { currentPage },
}) => {
  return (
    <Layout>
      <SEO
        title={`Articles Page ${currentPage}`}
        description="Lorem Ipsum"
        path={path}
      />
      Hello
    </Layout>
  );
};

export default ArticleListTemplate;
