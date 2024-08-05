"use client";

import InteractiveAvatar from "../../components/InteractiveAvatar";
import MySideBar from "../../components/MySideBar";

export default function Agent() {
  return (
    <main className="relative flex flex-col w-full h-screen overflow-hidden">
      <div className="flex flex-row w-full h-full">
        {/* Sidebar Section */}
        <div className="hidden lg:flex lg:w-[250px]">
          <MySideBar />
        </div>
        {/* Main Content Section */}
        <div className="flex flex-1 justify-center items-center min-w-[360px] ">
          <div className="flex flex-col justify-center items-center w-full max-w-screen-lg">
            <InteractiveAvatar />
          </div>
        </div>
      </div>
    </main>
  );
}
