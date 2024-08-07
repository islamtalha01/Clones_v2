"use client";
import { useState, useEffect } from "react";
import { createClient } from "../../utils/supabase/client";
const supabase = createClient();
import MySideBar from "../../components/MySideBar";

const ChatHistory = () => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [messages, setMessages] = useState([]);

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const handleDocumentClick = (e) => {
    // Close the menu if clicked outside
    if (
      !e.target.closest("#menuButton") &&
      !e.target.closest("#menuDropdown")
    ) {
      setMenuVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleDocumentClick);
    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      const { data, error } = await supabase.from("chats").select("*");

      if (error) {
        console.error("Error fetching messages:", error);
      } else {
        if (data) {
          setMessages(data);
        }
      }
    };

    fetchMessages();
  }, []);

  return (
    <div
      className="flex h-screen  overflow-hidden"
      style={{ width: "calc(100vw - 20px)" }}
    >
      <div className="flex  ">
        {/* Chat Header */}

        {/* Chat Messages */}
        <div
          className="h-screen overflow-y-auto p-4 pb-36"
          style={{ scrollbarWidth: "none" }}
        >
          {messages
            ?.slice()
            .reverse() // Reverse the order of chat objects
            .map((chatObj, chatIndex) =>
              chatObj.messages
                .slice()
                .reverse() // Reverse the order of messages within each chat
                .map((msg, msgIndex) => (
                  <div key={`${chatIndex}-${msgIndex}`}>
                    {msg.role === "user" && (
                      <div className="flex justify-end mb-4 cursor-pointer">
                        <div className="flex max-w-96 bg-indigo-500 text-white rounded-lg p-3 gap-3">
                          <p>{msg.content}</p>
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
                    {msg.role === "system" && (
                      <div className="flex mb-4 cursor-pointer">
                        <div className="w-9 h-9 rounded-full flex items-center justify-center mr-2 bg-blue-300">
                          <img
                            src="/openai.svg"
                            alt="User Avatar"
                            className="w-8 h-8 rounded-full"
                          />
                        </div>
                        <div className="flex max-w-96 bg-white rounded-lg p-3 gap-3">
                          <p className="text-gray-700">{msg.content}</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))
            )}
        </div>
      </div>
    </div>
  );
};

export default ChatHistory;
