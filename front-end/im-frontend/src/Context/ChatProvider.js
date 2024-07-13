import React, { useState, useEffect, createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [user, setUser] = useState({});
  const [currentChat, setCurrentChat] = useState();
  const [currentChatMessages, setCurrentChatMessages] = useState([]);
  const [messageLoading, setMessageLoading] = useState(false);
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
        navigate('/chats');
      } else {
        navigate("/");
      }
    }
    getProfile();
  }, [navigate]);


  useEffect(() => {
    async function getMessages(){
      if (!currentChat){
        return;
      }
      setMessageLoading(true);
      try{
        const response = await fetch(`http://localhost:4000/api/message?chatID=${currentChat._id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
        if (response.ok){
          const data = await response.json()
          setCurrentChatMessages(data.messages);
          
        }
      }catch (e){
        console.log(e);
      }
      setMessageLoading(false);
    }
    getMessages();
  }, [currentChat])

  return <ChatContext.Provider value={{ user, setUser, currentChat, setCurrentChat, chats, setChats, currentChatMessages, setCurrentChatMessages }}>{children}</ChatContext.Provider>;
};

export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;
