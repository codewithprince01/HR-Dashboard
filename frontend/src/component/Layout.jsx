import React from 'react';
import { useLocation, Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const Layout = () => {
  const location = useLocation();

  const hideSidebar = location.pathname === "/login" || location.pathname === "/register";

  return (
    <>
      <Navbar /> 
      <div className="flex pt-16">
        {!hideSidebar && <Sidebar />}
        <div className={hideSidebar ? "flex-1 p-6" : "flex-1 ml-64 p-6"}>
          <Outlet /> 
        </div>
      </div>
    </>
  );
};

export default Layout;
