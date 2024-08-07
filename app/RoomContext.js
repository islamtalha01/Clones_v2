"use client";
import React, { createContext, useContext, useState } from "react";

const RoomContext = createContext();

export const RoomProvider = ({ children }) => {
  const [isRoomFull, setIsRoomFull] = useState(false);
  const [activePlan, setActivePlan] = useState("");

  return (
    <RoomContext.Provider
      value={{ isRoomFull, setIsRoomFull, activePlan, setActivePlan }}
    >
      {children}
    </RoomContext.Provider>
  );
};

export const useRoom = () => useContext(RoomContext);
