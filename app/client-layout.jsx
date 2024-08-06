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
    <main className="relative flex flex-col ">
      <ToastContainer />
      <NavBar toggleSidebar={toggleSidebar} />
      <div className="flex flex-row flex-grow">
        <div
          className={`hidden max-lg:flex w-[250px] ${sidebarOpen ? "" : "w-0"}`}
        >
          <MySideBar
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          />
        </div>
        <div className="flex justify-center items-center flex-grow ">
          {children}
        </div>
      </div>
    </main>
  );
}
