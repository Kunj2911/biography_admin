import React from "react";
import Nav from "./Nav";

const Layout = ({ children }) => {
  return (
    <div className="app-layout">
      <div className="sidebar">
        <Nav /> {/* Only appears for logged-in users */}
      </div>
      <div className="main-content">{children}</div>
    </div>
  );
};

export default Layout;
