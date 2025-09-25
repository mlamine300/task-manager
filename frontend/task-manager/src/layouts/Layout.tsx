import React, { type ReactElement } from "react";
import { ThemeProvider } from "next-themes";
const Layout = ({ children }: { children: ReactElement }) => {
  return (
    <ThemeProvider>
      <div>{children}</div>
    </ThemeProvider>
  );
};

export default Layout;
