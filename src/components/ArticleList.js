import React from "react";
import { Link } from "gatsby";

const ArticleList = ({ title, articles }) => (
  <>
    {title ? <h2>{title}</h2> : ""}
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
  </>
);

export default ArticleList;
