import React, { useEffect } from "react";
import { ChatState } from "../Context/ChatProvider";
import { Box, Typography, Button, Avatar, AvatarGroup, List, ListItem, ListItemAvatar } from "@mui/material";
import { useRef } from "react";
export default function UserChats({setGroupChatDialogOpen}) {
  const { currentChat, setCurrentChat, chats, setChats } = ChatState();
  const itemRefs = useRef([]);

  useEffect(() => {
    console.log("called change view");
    if (currentChat && itemRefs.current[currentChat._id]) {
      itemRefs.current[currentChat._id].scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [currentChat]);

  useEffect(() => {
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
          setChats(response_chats.chats); // Set chats state correctly
        } else {
          console.error("Failed to fetch chats:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching chats:", error);
      }
    }
    getUserChats();
  }, [setChats]);

  function compareChatID(chat1, chat2) {
    return chat1?._id === chat2?._id;
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%", 
        width: "100%",
        boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.4)",
        borderRadius: "10px",
      }}>
      <Box
        sx={{
          padding: 2,
          display: "flex",
          justifyContent: "space-between",
        }}>
        <Typography sx={{ fontSize: 25 }}>Messages</Typography>
        <Button size="small" variant="contained" onClick={() => setGroupChatDialogOpen(true)}>
          New Group Chat
        </Button>
      </Box>
      <Box
        sx={{
          overflow: "auto", // Allow vertical scrolling
        }}>
        <List>
          {chats && chats.length > 0 ? (
            chats.map((chat, index) => (
              <ListItem
                key={chat._id}
                onClick={() => setCurrentChat(chat)}
                ref={(el) => {
                  itemRefs.current[chat._id] = el;
                }}
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
                    <Avatar>{chat.users[0].first_name.charAt(0).toUpperCase()}</Avatar>
                  ) : (
                    <AvatarGroup max={2}>
                      {chat.users.map((user) => (
                        <Avatar key={user._id}>{user.first_name.charAt(0).toUpperCase()}</Avatar>
                      ))}
                    </AvatarGroup>
                  )}
                </ListItemAvatar>

                {!chat.isGroupChat ? (
                  <Box sx={{ marginLeft: 2 }}>
                    <Typography>{`${chat.users[0].first_name} ${chat.users[0].last_name}`}</Typography>
                    {chat.latestMessage !== null ? (
                      <Typography>
                        {chat.users[0].username} {chat.latestMessage}
                      </Typography>
                    ) : (
                      <Typography>{`${chat.users[0].username}: No latest message`}</Typography>
                    )}
                  </Box>
                ) : (
                  <Box sx={{ marginLeft: 2 }}>
                    <Typography>{chat.chatname}</Typography>
                    {chat.latestMessage !== null ? <Typography>{chat.latestMessage}</Typography> : <Typography>No latest message</Typography>}
                  </Box>
                )}
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
