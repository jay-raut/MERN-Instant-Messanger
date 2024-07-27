import { Box, IconButton, TextField } from "@mui/material";
import { Typography } from "@mui/material";
import { ChatState } from "../../../Context/ChatProvider";
import { Button } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useEffect, useState } from "react";
import ChatDetailsDialog from "./ChatDetailsDialog";
import MessageComponent from "./MessageComponent";
import { useRef } from "react";

export default function ChatWindow({ setSnackBarMessage, setSnackBarVisible, setChatNotificationVisible, setChatNotificationContent, setNewCurrentChat }) {
  const { currentChat, setCurrentChat, currentChatMessages, setCurrentChatMessages, user, socket, chats, setChats, forceStateUpdate, setForceStateUpdate } = ChatState();
  const [chatDetailsDialogOpen, setChatDetailsDialogOpen] = useState(false);
  const [localMessageID, setLocalMessageID] = useState(0);

  const itemRefs = useRef({});
  const inputRef = useRef(null);

  useEffect(() => {
    // Scroll to the last message when it changes
    if (currentChatMessages.length > 0) {
      const lastMessage = currentChatMessages[currentChatMessages.length - 1];
      if (itemRefs.current[lastMessage._id]) {
        itemRefs.current[lastMessage._id].scrollIntoView({ behavior: "auto", block: "end", inline: "nearest" });
      }
    }
  }, [currentChatMessages]);

  useEffect(() => {
    setLocalMessageID(0);
  }, [currentChat]);

  async function sendMessage(event) {
    event.preventDefault();
    if (inputRef.current.value.length <= 0) {
      return;
    }
    const send_message = inputRef.current.value;
    inputRef.current.value = "";
    const newMessage = {
      _id: localMessageID,
      chat: currentChat._id,
      content: send_message,
      createdAt: new Date().toISOString(),
      sender: { first_name: user.firstname, last_name: user.lastname, username: user.username, _id: user.userID },
    };
    setCurrentChatMessages([...currentChatMessages, newMessage]);
    setLocalMessageID((prev) => prev + 1);
    currentChat.latestMessage = newMessage;
    setForceStateUpdate(!forceStateUpdate); //force state update by updating state in context
    const response = await fetch("http://localhost:4000/api/message/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ groupChatID: currentChat._id, message: send_message }),
    });
    if (!response.ok) {
      setSnackBarMessage("Could not send message. Try reloading");
      setSnackBarVisible(true);
    } else {
      const res = await response.json();
      socket.emit("send-message", { groupChat: currentChat, messageContent: res.newMessage });
      if (chats.length > 0 && currentChat !== chats[0]) {
        //if current chat is not at the top of the list then move it to the top
        console.log("moved to top");
        const newChats = [...chats];
        const currentChatIndex = newChats.findIndex((search_chat) => search_chat._id === currentChat._id);
        const push_chat = newChats.splice(currentChatIndex, 1)[0];
        newChats.unshift(push_chat);
        setChats(newChats);
      }
    }
  }

  useEffect(() => {
    if (currentChat) {
      socket.emit("join-chat", currentChat);
    }
  }, [currentChat]);

  useEffect(() => {
    // Subscribe to socket events
    socket.on("message-received", handleMessageReceived);

    // Clean up socket event listener
    return () => {
      socket.off("message-received", handleMessageReceived);
    };
  }, [currentChat, chats]); // Dependency on currentChat ensures useEffect runs when currentChat changes

  useEffect(() => {
    socket.on("user-left", handleUserLeft);
    return () => {
      socket.off("user-left", handleUserLeft);
    };
  }, [currentChat, chats]);

  useEffect(() => {
    socket.on("user-added", handleUserAdded);
    return () => {
      socket.off("user-added", handleUserAdded);
    };
  }, [currentChat, chats]);

  useEffect(() => {
    socket.on("chat-renamed", handleRenamedChat);
    return () => {
      socket.off("chat-renamed", handleRenamedChat);
    };
  }, [currentChat, chats]);

  useEffect(() => {
    socket.on("update-profile", handleProfileUpdate);
    return () => {
      socket.off("update-profile", handleProfileUpdate);
    };
  });

  const handleProfileUpdate = (updatedProfile) => {
    console.log(updatedProfile);
    console.log(currentChatMessages);
    console.log(chats);
    const newChats = chats.map((chat) => ({
      ...chat,
      users: chat.users.map((user) =>
        user._id === updatedProfile._id ? { ...user, first_name: updatedProfile.firstname, last_name: updatedProfile.lastname, username: updatedProfile.username } : user
      ),
    }));
    setChats(newChats);
    if (currentChat) {
      const setNewCurrentChat = newChats.find((chat) => chat._id === currentChat._id);
      setCurrentChat(setNewCurrentChat);
      const newCurrentChatMessages = currentChatMessages.map((message) => ({
        ...message,
        sender:
          message.sender._id === updatedProfile._id
            ? { ...message.sender, first_name: updatedProfile.firstname, last_name: updatedProfile.lastname, username: updatedProfile.username }
            : message.sender,
      }));
      setCurrentChatMessages(newCurrentChatMessages);
    }
  };

  const handleRenamedChat = (newName, room) => {
    console.log(newName);
    console.log(room);
    const newChats = chats.map((chat) =>
      chat._id === room._id
        ? {
            ...chat,
            chatname: room.chatname,
          }
        : chat
    );
    setChats(newChats);
    if (currentChat && currentChat._id === room._id) {
      const setNewCurrentChat = newChats.find((chat) => chat._id === room._id);
      setCurrentChat(setNewCurrentChat);
    }
  };

  const handleUserAdded = (addedUser, room) => {
    const newChats = chats.map((chat) =>
      chat._id === room._id
        ? {
            ...chat,
            isGroupChat: room.isGroupChat,
            users: [addedUser, ...chat.users],
          }
        : chat
    );
    setChats(newChats);
    if (currentChat && currentChat._id === room._id) {
      const setNewCurrentChat = newChats.find((chat) => chat._id === room._id);
      console.log(setNewCurrentChat);
      setCurrentChat(setNewCurrentChat);
    }
  };

  const handleMessageReceived = (receivedMessage) => {
    if (currentChat && currentChat._id === receivedMessage.groupChat._id) {
      currentChat.latestMessage = receivedMessage.groupChat.latestMessage;
      setForceStateUpdate(!forceStateUpdate); //force state update by updating state in context
      setCurrentChatMessages((prevMessages) => [...prevMessages, receivedMessage.messageContent]);
      return;
    }
    var chatIndex = chats.findIndex((search_chat) => search_chat._id === receivedMessage.groupChat._id);
    var changeCurrentChat = null;
    if (chatIndex === -1) {
      const index = receivedMessage.groupChat.users.findIndex((chat_user) => chat_user._id === user.userID);
      const { groupChat } = receivedMessage;
      groupChat.users[index] = receivedMessage.messageContent.sender;
      setChats([groupChat, ...chats]);
      chatIndex = index;
      changeCurrentChat = groupChat;
    } else {
      const newChats = chats.map((chat, index) => (index === chatIndex ? { ...chat, latestMessage: receivedMessage.groupChat.latestMessage } : chat));
      changeCurrentChat = newChats[chatIndex];
      if (newChats.length > 0 && receivedMessage.groupChat._id !== newChats[0]._id) {
        //if its not at the top then move it to the top.
        console.log("moved to top");
        const currentChatIndex = newChats.findIndex((search_chat) => search_chat._id === receivedMessage.groupChat._id);
        const push_chat = newChats.splice(currentChatIndex, 1)[0];
        newChats.unshift(push_chat);
        changeCurrentChat = push_chat;
      }
      setChats(newChats);
    }
    setChatNotificationContent(receivedMessage.messageContent.sender.username + ": " + receivedMessage.messageContent.content);
    setChatNotificationVisible(true);
    setNewCurrentChat(changeCurrentChat);
  };

  const handleUserLeft = (leftUser, room) => {
    const newChats = chats.map((chat) =>
      chat._id === room._id
        ? {
            ...chat,
            isGroupChat: room.isGroupChat,
            users: chat.users.filter((chat_user) => chat_user._id !== leftUser.userID),
          }
        : chat
    );
    setChats(newChats);
    if (currentChat && currentChat._id === room._id) {
      const setNewCurrentChat = newChats.find((chat) => chat._id === room._id);
      console.log(setNewCurrentChat);
      setCurrentChat(setNewCurrentChat);
    }
  };

  return (
    <Box sx={{ boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.4)", p: 2, width: "100%", borderRadius: "10px", height: "100%" }}>
      {currentChat ? (
        <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
          {/*Checks if chat is group chat or not and renders chatbox header*/}
          <Box display="flex" padding={2} justifyContent="space-between">
            {currentChat.isGroupChat ? (
              <Typography sx={{ fontSize: 25 }}>{currentChat.chatname}</Typography>
            ) : (
              <Box>
                <Typography sx={{ fontSize: 25 }}>
                  {currentChat.users[0].first_name} {currentChat.users[0].last_name}
                </Typography>
                <Typography sx={{ fontSize: 15 }}>Username: {currentChat.users[0].username}</Typography>
              </Box>
            )}
            <Box>
              <Button variant="contained" onClick={() => setChatDetailsDialogOpen(true)}>
                Chat Details
              </Button>
            </Box>
          </Box>
          {/* message box rendered here*/}
          <Box
            sx={{
              backgroundColor: "grey.200",
              width: "100%",
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              padding: 2,
              overflowY: "auto",
              overflowX: "hidden",
              borderRadius: "10px",
            }}>
            {/* Render chat messages here */}
            <Box sx={{ flex: 1, padding: 2, overflowY: "auto", overflowX: "hidden" }}>
              {currentChatMessages.map((message, index) => (
                <div key={message._id} ref={(el) => (itemRefs.current[message._id] = el)}>
                  <MessageComponent message={message} isCurrentUser={message.sender._id === user.userID} />
                </div>
              ))}
            </Box>

            {/* Input Area */}
            <Box component="form" onSubmit={(event) => sendMessage(event)} sx={{ width: "100%", display: "flex", alignItems: "center", paddingTop: 2, borderTop: "1px solid #ccc" }}>
              <TextField
                fullWidth
                placeholder="Type a message..."
                variant="outlined"
                inputRef={inputRef}
                autoComplete="off"
                sx={{
                  marginRight: 2,
                  "& fieldset": {
                    border: "none",
                  },
                }}
              />
              <IconButton type="submit" variant="contained" color="primary">
                <SendIcon></SendIcon>
              </IconButton>
            </Box>
          </Box>
        </Box>
      ) : (
        <Box display={"flex"} justifyContent={"center"}>
          <Typography sx={{ fontSize: 25 }}>No chat selected. Select a chat to start</Typography>
        </Box>
      )}
      <ChatDetailsDialog
        isDialogOpen={chatDetailsDialogOpen}
        setDialogVisible={setChatDetailsDialogOpen}
        setSnackBarMessage={setSnackBarMessage}
        setSnackBarVisible={setSnackBarVisible}></ChatDetailsDialog>
    </Box>
  );
}
