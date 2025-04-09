import React from 'react';
import { useLocation, Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const Layout = () => {
  const location = useLocation();

  const hideSidebar = location.pathname === "/login" || location.pathname === "/register";

  return (
    <>
      <Navbar /> {/* Always on top */}
      <div className="flex pt-16"> {/* Account for fixed navbar height */}
        {!hideSidebar && <Sidebar />}
        <div className={hideSidebar ? "flex-1 p-6" : "flex-1 ml-64 p-6"}>
          <Outlet /> {/* This is where nested routes render */}
        </div>
      </div>
    </>
  );
};

export default Layout;
