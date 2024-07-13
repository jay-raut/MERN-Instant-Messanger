import { Box, IconButton, TextField } from "@mui/material";
import { Typography } from "@mui/material";
import { ChatState } from "../../../Context/ChatProvider";
import { Button } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useEffect, useState } from "react";
import ChatDetailsDialog from "./ChatDetailsDialog";
import MessageComponent from "./MessageComponent";
import { useRef } from "react";

export default function ChatWindow({ setSnackBarMessage, setSnackBarVisible }) {
  const { currentChat, currentChatMessages, setCurrentChatMessages, user, socket, chats, setChats } = ChatState();
  const [message, setMessage] = useState("");
  const [chatDetailsDialogOpen, setChatDetailsDialogOpen] = useState(false);

  const itemRefs = useRef({});
  useEffect(() => {
    // Scroll to the last message when it changes
    if (currentChatMessages.length > 0) {
      const lastMessage = currentChatMessages[currentChatMessages.length - 1];
      if (itemRefs.current[lastMessage._id]) {
        itemRefs.current[lastMessage._id].scrollIntoView({ behavior: "auto", block: "end", inline: "nearest" });
      }
    }
  }, [currentChatMessages]);

  async function sendMessage(event) {
    event.preventDefault();
    const response = await fetch("http://localhost:4000/api/message/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ groupChatID: currentChat._id, message: message }),
    });
    if (!response.ok) {
      setSnackBarMessage("Could not send message. Try reloading");
      setSnackBarVisible(true);
    } else {
      const res = await response.json();
      setCurrentChatMessages([...currentChatMessages, res.newMessage]);
      socket.emit("send-message", { groupChat: currentChat, messageContent: res.newMessage });
    }
    setMessage("");
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

  const handleMessageReceived = (receivedMessage) => {
    console.log(receivedMessage);
    if (currentChat && currentChat._id === receivedMessage.groupChat._id) {
      setCurrentChatMessages((prevMessages) => [...prevMessages, receivedMessage.messageContent]);
      return;
    }
    const chatExists = chats.some((search_chat) => search_chat._id === receivedMessage.groupChat._id);
    if (!chatExists) {
      const index = receivedMessage.groupChat.users.findIndex((chat_user) => chat_user._id === user.userID);
      const { groupChat } = receivedMessage;
      groupChat.users[index] = receivedMessage.messageContent.sender;
      setChats([groupChat, ...chats]);
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
              borderRadius: "10px",
            }}>
            {/* Render chat messages here */}
            <Box sx={{ flex: 1, padding: 2, overflowY: "auto" }}>
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
                value={message}
                autoComplete="off"
                onChange={(event) => setMessage(event.target.value)}
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
