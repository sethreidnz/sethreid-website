const topics = require("./topics");

const siteConfig = {
  title: "Seth Reid",
  titleShort: "Seth Reid",
  description: "For the writings of Seth Reid.",
  logo: "/src/assets/icons/site-logo.svg",
  siteUrl: "https://sethreid-website.netlify.com",
  github: "https://github.com/sethreidnz/sethreid-website",
  pathPrefix: "/",
  rss: "/rss.xml",
  googleAnalyticsID: "",
  themeColor: "#B6131B",
  backgroundColor: "#ffffff",
  resultsPerPage: "2",
  articlePathPrefix: "/articles",
  author: {
    name: "Seth Reid",
    summary: "Technologist, musician, writer and creative.",
    twitter: "sethreidnz",
    email: "contact@sethreid.co.nz",
    linkedIn: "sethreidnz",
  },
  topics,
};

module.exports = siteConfig;
