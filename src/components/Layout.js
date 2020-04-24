import React from "react";
import GlobalStyles from "../styles/GlobalStyles";

const Layout = ({ children }) => {
  return (
    <main>
      <GlobalStyles />
      {children}
    </main>
  );
};

export default Layout;
