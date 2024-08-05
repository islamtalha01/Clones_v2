"use client";
import React, { createContext, useContext, useState } from "react";

const RoomContext = createContext();

export const RoomProvider = ({ children }) => {
  const [isRoomFull, setIsRoomFull] = useState(false);

  return (
    <RoomContext.Provider value={{ isRoomFull, setIsRoomFull }}>
      {children}
    </RoomContext.Provider>
  );
};

export const useRoom = () => useContext(RoomContext);
