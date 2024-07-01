import React, { useEffect } from "react";
import { ChatState } from "../Context/ChatProvider";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import { AvatarGroup, List } from "@mui/material";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";



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
      }
    } catch (error) {
      console.error("Error fetching chats:", error);
    }
  }
  useEffect(() => {
    getUserChats();
  }, []);

  return (
    <Box
      sx={{
        boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.4)",
        p: 2,
        width: "50%",
        borderRadius: "10px",
        margin: "5px",
        maxWidth: "400px",
        height: "100%",
        minHeight: "100vh",
        maxHeight: "100%",
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
      <List sx={{ maxHeight: "100%", overflow: "auto", minHeight: "100%", height: "100%" }}>
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
                backgroundColor: currentChat === chat ? "#e0e0e0" : "transparent",
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

              {!chat.isGroupChat ? (
                <>
                  <Box sx={{ marginLeft: 2 }}>
                    <Typography>{`${chat.users[0].first_name} ${chat.users[0].last_name}`}</Typography>
                    {chat.latestMessage !== null ? <Typography>{chat.latestMessage}</Typography> : <Typography>{chat.users[0].username}: No latest message</Typography>}
                  </Box>
                </>
              ) : (
                <>
                  <Box sx={{ marginLeft: 2 }}>
                    <Typography>{chat.chatname}</Typography>
                    {chat.latestMessage !== null ? <Typography>{chat.latestMessage}</Typography> : <Typography>No latest message</Typography>}
                  </Box>
                </>
              )}
            </ListItem>
          ))
        ) : (
          <Typography variant="body1">Chats are empty</Typography>
        )}
      </List>
    </Box>
  );
}
