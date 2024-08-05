"use client";

import React, { useEffect, useState } from "react";
import SideBarItem from "./SideBarItem";
import ChatItem from "./ChatItem";
import { logout } from "../app/actions";
import {
  HiOutlineClipboardList,
  HiCog,
  HiOutlineLogout,
  HiChevronDown,
} from "react-icons/hi";
import { createClient } from "../utils/supabase/client";
import { useRouter } from "next/navigation";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const MySideBar = ({ sidebarOpen, setSidebarOpen }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loader, setLoading] = useState(false);
  const router = useRouter();
  const handleToggleDropdown = () => {
    setDropdownOpen((prevState) => !prevState);
  };
  async function getLoggedInUser() {
    const supabase = createClient();

    const { data, error } = await supabase.auth.getUser();

    setLoading(true);
    // const { data, error } = await supabase.auth.getSession();

    console.log("user data", data?.user);

    // const userCred = {
    //   id: data?.user?.id,
    // };
    console.log("user cred", data?.user?.id);

    localStorage.setItem("usercreds", data?.user?.id);

    if (error) router.push("/login");

    setUser({ ...data?.user?.user_metadata, id: data?.user?.id });
    setLoading(false);
  }
  useEffect(() => {
    getLoggedInUser();
  }, []);

  return (
    <>
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-20 transition-opacity bg-black opacity-50 lg:hidden"
        ></div>
      )}

      <div
        style={{ minHeight: "calc(100vh - 85px)" }}
        className={`fixed p-4 inset-y-0 left-0 z-30 w-[250px] border border-[#292932] overflow-y-auto transition duration-300 transform bg-[#1C1C24] lg:translate-x-0 lg:static lg:inset-0 ${
          sidebarOpen ? "translate-x-0 ease-out" : "-translate-x-full ease-in"
        }`}
      >
        <nav className="flex flex-col h-full justify-between">
          <div>
            <SideBarItem label="Discover" route="/" />
            <SideBarItem label="Pricing" status="pricing" route="/pricing" />
            <div className="mx-5 my-9 text-sm text-gray-400">YOUR CHATS</div>
            <ChatItem route="/chatHistory" />
          </div>

          {/* Name Tile at the Bottom */}
          <div className="relative  mb-24">
            <button
              onClick={handleToggleDropdown}
              className="flex items-center text-white w-full focus:outline-none"
            >
              <div className="flex items-center space-x-2">
                <div className="bg-yellow-500 text-black rounded-full h-8 w-8 flex items-center justify-center">
                  {loader ? (
                    <AiOutlineLoading3Quarters className="animate-spin" />
                  ) : (
                    user &&
                    user.avatar_url && (
                      <img className="rounded-full" src={user.avatar_url} />
                    )
                  )}
                </div>
                <span className="flex-1 text-left">
                  {user ? user.full_name : "Loading Name ..."}
                </span>
                <HiChevronDown
                  className={`transform transition-transform ${
                    dropdownOpen ? "rotate-180" : "rotate-0"
                  }`}
                />
              </div>
            </button>
            {dropdownOpen && (
              <div className="absolute bottom-10 left-0 right-0 bg-gray-800 rounded-lg shadow-lg text-white z-10">
                <div className="flex items-center py-2 px-4 border-b border-gray-700 hover:bg-gray-700 cursor-pointer">
                  <HiOutlineClipboardList className="mr-2" />
                  <p className="text-sm">Active plan: Pro</p>
                </div>
                <div className="flex items-center py-2 px-4 border-b border-gray-700 hover:bg-gray-700 cursor-pointer">
                  <HiCog className="mr-2" />
                  <p className="text-sm">Settings</p>
                </div>
                <div className="flex items-center py-2 px-4 hover:bg-gray-700 cursor-pointer">
                  <HiOutlineLogout className="mr-2" />
                  <form>
                    <button
                      type="submit"
                      formAction={logout}
                      className="text-sm text-red-500 hover:underline"
                    >
                      Logout
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </nav>
      </div>
    </>
  );
};

export default MySideBar;
