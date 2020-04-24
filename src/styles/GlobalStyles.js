import React from "react";
import { Global, css } from "@emotion/core";

const GlobalStyles = () => {
  return (
    <Global
      styles={css`
        body {
          margin: 0;
        }
      `}
    />
  );
};

export default GlobalStyles;
