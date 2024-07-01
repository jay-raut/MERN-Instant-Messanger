import React, { useEffect } from "react";
import { ChatState } from "../Context/ChatProvider";
import { Box, Typography, Button, Avatar, AvatarGroup, List, ListItem, ListItemAvatar, ListItemText } from "@mui/material";

export default function UserChats() {
  const { currentChat, setCurrentChat, chats, setChats } = ChatState();

  async function getUserChats() {
    try {
      const response = await fetch("http://localhost:4000/api/chat/", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (response.ok) {
        const response_chats = await response.json();
        setChats(response_chats.chats); // Set chats state correctly
      } else {
        console.error("Failed to fetch chats:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching chats:", error);
    }
  }

  useEffect(() => {
    getUserChats();
  }, []);

  function compareChatID(chat1, chat2) {
    return chat1?._id === chat2?._id;
  }
  console.log(chats)
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%", // Full viewport height
        width: "100%",
        boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.4)",
        borderRadius: "10px",
        overflow: "hidden", // Ensure no overflow outside the box
      }}>
      <Box
        sx={{
          padding: 2,
          display: "flex",
          justifyContent: "space-between",
        }}>
        <Typography sx={{ fontSize: 25 }}>Messages</Typography>
        <Button size="small" variant="contained">
          New Group Chat
        </Button>
      </Box>
      <Box
        sx={{
          flexGrow: 1,
          overflowY: "auto", // Allow vertical scrolling
        }}>
        <List sx={{ width: "100%" }}>
          {chats && chats.length > 0 ? (
            chats.map((chat) => (
              <ListItem
                key={chat._id}
                onClick={() => setCurrentChat(chat)}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  padding: 2,
                  cursor: "pointer",
                  backgroundColor: compareChatID(currentChat, chat) ? "#e0e0e0" : "transparent",
                  "&:hover": {
                    backgroundColor: "#e0e0e0",
                  },
                  borderRadius: "10px",
                }}>
                <ListItemAvatar>
                  {!chat.isGroupChat ? (
                    <Avatar>{`${chat.users[0].first_name.charAt(0).toUpperCase()}`}</Avatar>
                  ) : (
                    <AvatarGroup max={2}>
                      {chat.users.map((user) => (
                        <Avatar key={user._id}>{`${user.first_name.charAt(0).toUpperCase()}`}</Avatar>
                      ))}
                    </AvatarGroup>
                  )}
                </ListItemAvatar>
                <ListItemText
                  primary={!chat.isGroupChat ? `${chat.users[0].first_name} ${chat.users[0].last_name}` : chat.chatname}
                  secondary={chat.latestMessage !== null ? chat.latestMessage : !chat.isGroupChat ? `${chat.users[0].username}: No latest message` : "No latest message"}
                />
              </ListItem>
            ))
          ) : (
            <Typography variant="body1">Chats are empty</Typography>
          )}
        </List>
      </Box>
    </Box>
  );
}
