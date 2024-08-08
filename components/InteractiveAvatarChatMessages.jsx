/** @format */
"use client";
import React, { useEffect } from "react";
const InteractiveAvatarChatMessages = ({ messages }) => {
  const messagesRef = React.useRef();
  useEffect(() => {
    if (messagesRef.current) {
      console.log("Scrolling to bottom");
      messagesRef.current.scrollTo(0, messagesRef.current.scrollHeight);
    }
  }, [messages]);
  return (
    <div
      style={{
        position: "absolute",
        width: "40%",
        height: "35%",
        opacity: "0.6",
        bottom: "0",
        marginBottom: "100px",
        overflowY: "auto",
        fontSize: "12px",
      }}
      ref={messagesRef}
    >
      {messages.map((message) => (
        <div key={message.id}>
          {message.role === "user" && (
            <div className="flex justify-end mb-4 cursor-pointer">
              <div className="flex max-w-96 bg-indigo-500 text-white rounded-lg p-3 gap-3">
                <p>{message.content}</p>
              </div>
              <div className="w-9 h-9 rounded-full flex items-center justify-center ml-2 bg-blue-300">
                <img
                  src="/user_avatar.svg"
                  alt="My Avatar"
                  className="w-8 h-8 rounded-full"
                />
              </div>
            </div>
          )}
          {message.role === "assistant" && (
            <div className="flex mb-4 cursor-pointer">
              <div className="w-9 h-9 rounded-full flex items-center justify-center mr-2 bg-blue-300">
                <img
                  src="/openai.svg"
                  alt="User Avatar"
                  className="w-8 h-8 rounded-full"
                />
              </div>
              <div className="flex max-w-96 bg-white rounded-lg p-3 gap-3">
                <p className="text-gray-700">{message.content}</p>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default React.memo(InteractiveAvatarChatMessages);
