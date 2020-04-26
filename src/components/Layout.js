import React from "react";

// local imports
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
