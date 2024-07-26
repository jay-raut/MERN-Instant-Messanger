import React, { useState, useEffect, createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { getSocket } from "./SocketContext";
import { initializeSocket } from "./SocketContext";
const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [user, setUser] = useState({});
  const [currentChat, setCurrentChat] = useState();
  const [currentChatMessages, setCurrentChatMessages] = useState([]);
  const [forceStateUpdate, setForceStateUpdate] = useState(false);
  const [messageLoading, setMessageLoading] = useState(false);
  const [chats, setChats] = useState([]);
  const [socket, setSocket] = useState(null);
  const navigate = useNavigate();
  async function getUserChats() {
    console.log("called get chats");
    try {
      const response = await fetch("http://localhost:4000/api/chat/", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (response.ok) {
        const response_chats = await response.json();
        response_chats.chats.sort(function(o1, o2){
          return new Date(o2.updatedAt) - new Date(o1.updatedAt)
        })
        setChats(response_chats.chats);
      } else {
        console.error("Failed to fetch chats:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching chats:", error);
    }
  }
  useEffect(() => {
    async function getProfile() {
      const response = await fetch("http://localhost:4000/api/user/profile", {
        credentials: "include",
      });
      if (response.ok) {
       
        const data = await response.json();
        console.log(data);
        setUser(data);
        getUserChats();
        const newSocketConnection = initializeSocket(data);
        setSocket(newSocketConnection);
      } else {
        navigate("/");
      }
    }
    getProfile();
  }, [navigate]);

  useEffect(() => {
    async function getMessages() {
      if (!currentChat) {
        return;
      }
      setMessageLoading(true);
      try {
        const response = await fetch(`http://localhost:4000/api/message?chatID=${currentChat._id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          setCurrentChatMessages(data.messages);
        }
      } catch (e) {
        console.log(e);
      }
      setMessageLoading(false);
    }
    getMessages();
  }, [currentChat]);

  return (
    <ChatContext.Provider value={{ user, setUser, currentChat, setCurrentChat, chats, setChats, currentChatMessages, setCurrentChatMessages, messageLoading, socket, forceStateUpdate, setForceStateUpdate }}>{children}</ChatContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;
