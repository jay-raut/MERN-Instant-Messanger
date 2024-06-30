import React, { useState, useEffect, createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [user, setUser] = useState({});
  const [currentChat, setCurrentChat] = useState();
  const [chats, setChats] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    async function getProfile() {
      const response = await fetch("http://localhost:4000/api/user/profile", {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data);
        console.log(data);
      } else {
        navigate("/");
      }
    }
    getProfile();
  }, [navigate]);

  return <ChatContext.Provider value={{ user, setUser, currentChat, setCurrentChat, chats, setChats }}>{children}</ChatContext.Provider>;
};

export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;
