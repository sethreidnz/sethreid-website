import React from "react";
import PropTypes from "prop-types";
import { Link } from "gatsby";

const ArticleList = ({
  title,
  articles,
  currentPage,
  nextPagePath,
  nextPageText,
  previousPagePath,
  previousPageText,
}) => (
  <>
    {title ? (
      <h2>
        {title} - {currentPage}
      </h2>
    ) : (
      ""
    )}
    <ul>
      {articles.map((article) => (
        <li key={article.slug}>
          <article>
            <header>
              <h3>
                <Link to={article.path}>{article.title}</Link>
              </h3>
              <small>{article.date}</small>
            </header>
            <section>
              <p
                dangerouslySetInnerHTML={{
                  __html: article.excerpt,
                }}
              />
            </section>
          </article>
        </li>
      ))}
    </ul>
    <nav>
      <ul>
        {previousPagePath && (
          <li>
            <Link to={previousPagePath} rel="previous">
              {previousPageText}
            </Link>
          </li>
        )}
        {nextPagePath && (
          <li>
            <Link to={nextPagePath} rel="next">
              {nextPageText}
            </Link>
          </li>
        )}
      </ul>
    </nav>
  </>
);

ArticleList.defaultProps = {
  nextPagePath: null,
  nextPageText: "Next →",
  previousPagePath: null,
  previousPageText: "← Previous",
};

ArticleList.propTypes = {
  title: PropTypes.string.isRequired,
  articles: PropTypes.arrayOf(
    PropTypes.shape({
      slug: PropTypes.string.isRequired,
      path: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      excerpt: PropTypes.string.isRequired,
    })
  ),
  currentPage: PropTypes.number.isRequired,
  nextPagePath: PropTypes.string,
  nextPageText: PropTypes.string,
  previousPagePath: PropTypes.string,
  previousPageText: PropTypes.string,
};

export default ArticleList;
