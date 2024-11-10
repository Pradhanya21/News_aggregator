/*=============================================================================
 | Purpose:  LAYOUT COMPONENT WRAPS AROUND THE NAVBAR, SIDEBAR AND ROUTES
 |           HELP MAINTAIN A CONSISTENT LAYOUT STRUCTURE ACROSS ALL PAGES
 |
 | Input / Parameters:  RECEIVES THE CHILD COMPONENTS TO BE DISPLAYED
 |   
 | Output / Returns:  RENDERS NAVBAR AND SIDEBAR AND DISPLAY THE CHILD
 |                    COMPONENT PASSED (IT WILL DISPLAY RIGHT NEXT TO THE
 |                    SIDEBAR.
 |
 *===========================================================================*/

import React from "react";
import NavBar from "./NavBar";
import SideBar from "./SideBar";
// import { Routes } from "react-router-dom";

const Layout = ({ children }) => {
  return (
    <>
      <NavBar></NavBar>
      <div style={{ display: "flex" }}>
        <SideBar></SideBar>
        <main style={{ flexGrow: 1, padding: "20px" }}>{children}</main>
      </div>
    </>
  );
};

export default Layout;
