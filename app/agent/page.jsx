"use client";

import MySideBar from "../../components/MySideBar";
import InteractiveAvatarNew from "../../components/interactiveAvatarNew";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useRoom } from "../RoomContext";
export default function Agent() {
  const { isRoomFull } = useRoom();
  const router = useRouter();

  useEffect(() => {
    if (isRoomFull) {
      router.replace("/");
    }
  }, [isRoomFull, router]);

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
            <InteractiveAvatarNew />
          </div>
        </div>
      </div>
    </main>
  );
}
