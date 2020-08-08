import React from "react";
import { Link, graphql } from "gatsby";
import { MDXRenderer } from "gatsby-plugin-mdx";

// local imports
import {
  getArticleFromArticleNode,
  getArticlePath,
} from "../utilities/article";
import Layout from "../components/Layout";
import SEO from "../components/SEO";

const ArticleTemplate = ({ data, pageContext }) => {
  const { previous, next } = pageContext;
  const article = getArticleFromArticleNode(data.mdx);
  debugger;
  return (
    <Layout>
      <SEO
        title={article.title}
        description={article.excerpt}
        postMeta={{
          title: article.title,
          description: article.excerpt,
          image: article.cover,
          path: article.path,
        }}
      />
      <article>
        <header>
          <h1>{article.title}</h1>
          <p>{article.date}</p>
        </header>
        <section>
          <MDXRenderer>{article.body}</MDXRenderer>
        </section>
        <hr />
      </article>

      <nav>
        <ul>
          {previous && (
            <li>
              <Link to={getArticlePath(previous.fields.slug)} rel="prev">
                ← {previous.frontmatter.title}
              </Link>
            </li>
          )}
          {next && (
            <li>
              <Link to={getArticlePath(next.fields.slug)} rel="next">
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
    mdx(slug: { eq: $slug }) {
      excerpt(pruneLength: 160)
      body
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
