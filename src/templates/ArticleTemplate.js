import React from "react";
import { Link, graphql } from "gatsby";

// local imports
import { getArticleFromArticleNode } from "../utilities/article";
import Layout from "../components/Layout";
import SEO from "../components/SEO";

const ArticleTemplate = ({ data, pageContext, location }) => {
  const siteTitle = data.site.siteMetadata.title;
  const { previous, next } = pageContext;
  const article = getArticleFromArticleNode(data.markdownRemark);

  return (
    <Layout location={location} title={siteTitle}>
      <SEO title={article.title} description={article.excerpt} />
      <article>
        <header>
          <h1>{article.title}</h1>
          <p>{article.date}</p>
        </header>
        <section dangerouslySetInnerHTML={{ __html: article.html }} />
        <hr />
      </article>

      <nav>
        <ul>
          {previous && (
            <li>
              <Link to={previous.fields.slug} rel="prev">
                ← {previous.frontmatter.title}
              </Link>
            </li>
          )}
          {next && (
            <li>
              <Link to={next.fields.slug} rel="next">
                {next.frontmatter.title} →
              </Link>
            </li>
          )}
        </ul>
      </nav>
    </Layout>
  );
};

export default ArticleTemplate;

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    site {
      siteMetadata {
        title
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      excerpt(pruneLength: 160)
      html
      fields {
        slug
      }
      frontmatter {
        title
        description
        slug
        cover
        date(formatString: "DD MMMM YYYY")
      }
    }
  }
`;
