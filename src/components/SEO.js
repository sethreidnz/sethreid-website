import React from "react";
import PropTypes from "prop-types";
import { Helmet } from "react-helmet";
import { useStaticQuery, graphql } from "gatsby";
import urljoin from "url-join";

const SEO = ({
  title,
  description,
  path,
  cover,
  lang,
  meta,
  postMeta: articleMeta,
}) => {
  const {
    site: { siteMetadata },
  } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            title
            description
            logo
            siteUrl
            pathPrefix
            author {
              twitter
            }
          }
        }
      }
    `
  );

  // defaults
  const siteUrl = urljoin(siteMetadata.siteUrl, siteMetadata.pathPrefix);
  let siteTitle = siteMetadata.title;
  let siteDescription = siteMetadata.description;
  let siteImage = siteMetadata.logo;
  let metaTitle = title;
  let metaDescription = siteDescription;
  let metaImage = cover ? cover : siteImage;
  let pageUrl = path ? urljoin(siteUrl, path) : siteUrl;
  const schemaOrgJSONLD = [
    {
      "@context": "http://schema.org",
      "@type": "WebSite",
      url: siteUrl,
      name: siteTitle,
    },
  ];

  // if the page is an article
  if (articleMeta) {
    metaTitle = articleMeta.title;
    metaDescription = articleMeta.description;
    metaImage = articleMeta.logo;
    pageUrl = urljoin(siteUrl, articleMeta.path);
  }

  schemaOrgJSONLD.push(
    {
      "@context": "http://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          item: {
            "@id": pageUrl,
            name: title,
            metaImage,
          },
        },
      ],
    },
    {
      "@context": "http://schema.org",
      "@type": "BlogPosting",
      url: pageUrl,
      name: title,
      headline: title,
      image: {
        "@type": "ImageObject",
        url: metaImage,
      },
      description,
    }
  );

  return (
    <Helmet
      htmlAttributes={{
        lang,
      }}
      title={metaTitle}
      titleTemplate={`%s | ${siteTitle}`}
      defer={false}
      meta={[
        {
          name: `description`,
          content: metaDescription,
        },
        {
          name: `image`,
          content: metaImage,
        },
        {
          property: `og:title`,
          content: title,
        },
        {
          property: `og:description`,
          content: metaDescription,
        },
        {
          property: `og:image`,
          content: metaImage,
        },
        {
          property: `og:type`,
          content: `website`,
        },
        {
          name: `twitter:card`,
          content: `summary`,
        },
        {
          name: `twitter:creator`,
          content: siteMetadata.author,
        },
        {
          name: `twitter:title`,
          content: title,
        },
        {
          name: `twitter:description`,
          content: metaDescription,
        },
      ].concat(meta)}
    >
      {/* Schema.org tags */}
      <script type="application/ld+json">
        {JSON.stringify(schemaOrgJSONLD)}
      </script>

      {/* Twitter Card tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta
        name="twitter:creator"
        content={siteMetadata.author.twitter ? siteMetadata.author.twitter : ""}
      />
    </Helmet>
  );
};

SEO.defaultProps = {
  lang: `en`,
  meta: [],
  description: ``,
};

SEO.propTypes = {
  description: PropTypes.string,
  title: PropTypes.string.isRequired,
  lang: PropTypes.string,
  meta: PropTypes.arrayOf(PropTypes.object),
};

export default SEO;
