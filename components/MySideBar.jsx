"use client";
import { redirect } from "next/navigation";
import React, { useEffect, useState, useRef } from "react";
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
import { useRoom } from "../app/RoomContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
const MySideBar = ({ sidebarOpen, setSidebarOpen }) => {
  const { setActivePlan } = useRoom();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [planName, setPlanName] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const router = useRouter();

  const dropdownRef = useRef(null);

  const handleToggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  async function handleLogout() {
    const result = await logout();
    if (result) {
      setLoggedIn(false);
      redirect("/discover");
    } else {
      redirect("/error");
    }
  }

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownOpen(false);
    }
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  async function getLoggedInUser() {
    const supabase = createClient();

    const { data, error } = await supabase.auth.getUser();

    setLoading(true);

    localStorage.setItem("usercreds", data?.user?.id);

    if (error) router.push("/login");
    const { data: paymentData, error: paymentError } = await supabase
      .from("payments")
      .select("plan_data")
      .eq("user_id", data?.user?.id);

    if (paymentError) {
      console.error("Error fetching payment data:", paymentError);
      return null;
    }

    if (paymentData && paymentData.length > 0) {
      const planData = paymentData[0].plan_data;
      if (planData && planData.name) {
        setPlanName(planData.name);
        setActivePlan(planData.name);
      } else {
        //show toast here
        console.error("Plan data or plan name not found");
      }
    } else {
      console.log("No payment data found for the given user ID.");
      // if (!toast.isActive("paymentErrorToast")) {
      //   toast.warning("Please Add your Pricing Plan", {
      //     toastId: "paymentErrorToast",
      //   });
      // }
    }
    console.log("user", user);
    if (!data?.user?.id) {
      setUser(false);
    } else {
      setLoggedIn(true);
      setUser({ ...data?.user?.user_metadata, id: data?.user?.id });
    }
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
          className="fixed h-[100%] inset-0 z-20 transition-opacity bg-black opacity-50 lg:hidden"
        ></div>
      )}

      <div
        // style={{ minHeight: "calc(100vh - 85px)" }}
        className={`fixed h-[100%] p-4 inset-y-0 left-0 z-30 w-[250px] border border-[#292932] overflow-y-auto transition duration-300 transform bg-[#1C1C24] lg:translate-x-0 lg:static lg:inset-0 ${
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

          {user &&
            (loading == true ? (
              <>Loading User Info...</>
            ) : (
              <>
                <div
                  ref={dropdownRef}
                  className={`relative mb-36  ${
                    loggedIn ? "" : "hidden"
                  } `}
                >
                  <button
                    onClick={handleToggleDropdown}
                    className="flex items-center text-white w-full focus:outline-none"
                  >
                    <div className="flex items-center space-x-2">
                      <div className="bg-yellow-500 text-black rounded-full h-8 w-8 flex items-center justify-center">
                        {user && user.avatar_url && (
                          <img
                            className="rounded-full"
                            src={user.avatar_url}
                            alt="User Avatar"
                          />
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
                    <div className="absolute top-full left-0 right-0 bg-gray-800 rounded-lg shadow-lg text-white z-10">
                      <div className="flex items-center py-2 px-4 border-b border-gray-700 hover:bg-gray-700 cursor-pointer">
                        <HiOutlineClipboardList className="mr-2" />
                        <p className="text-sm">Active plan: {planName}</p>
                      </div>
                      <div className="flex items-center py-2 px-4 hover:bg-gray-700 cursor-pointer">
                        <HiOutlineLogout className="mr-2" />
                        <form>
                          <button
                            type="submit"
                            formAction={handleLogout}
                            className="text-sm text-red-500 hover:underline"
                          >
                            Logout
                          </button>
                        </form>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ))}
        </nav>
      </div>
    </>
  );
};

export default MySideBar;
