"use client";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NavBar from "../components/NavBar";
import MySideBar from "../components/MySideBar";
import { useState } from "react";

export default function ClientLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <main className=" flex flex-col h-screen">
      <ToastContainer />
      <NavBar toggleSidebar={toggleSidebar} />
      <div className="flex flex-row flex-grow">
      <div className={` w-[250px] flex flex-col ${sidebarOpen ? "" : "w-0"}`}>
          <MySideBar
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          />
        </div>
        <div className="flex flex-col justify-center items-center flex-grow ">
       
          {children}
        </div>
      </div>
    </main>
  );
}
