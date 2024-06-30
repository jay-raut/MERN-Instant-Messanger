import React, { useEffect } from "react";
import { ChatState } from "../Context/ChatProvider";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";

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
        console.log(response);
      }
    } catch (error) {
      console.error("Error fetching chats:", error);
    }
  }

  useEffect(() => {
    getUserChats();
  }, []);
  console.log(chats);

  return (
    <Box
      sx={{
        boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.4)",
        p: 2,
        width: "50%",
        borderRadius: "10px",
        margin: "5px",
        maxWidth: "400px",
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
      <Stack spacing={2}>
        {chats && chats.length > 0 ? (
          chats.map((chat) => (
            <Box
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
              {!chat.isGroupChat ? (
                <>
                  <Avatar>{`${chat.users[1].first_name.charAt(0).toUpperCase()}`}</Avatar>
                  <Box sx={{ marginLeft: 2 }}>
                    <Typography variant="subtitle1">{`${chat.users[1].first_name} ${chat.users[1].last_name}`}</Typography>
                    <Typography variant="subtitle2">{`${chat.users[1].username}`}</Typography>
                  </Box>
                </>
              ) : (
                <Typography variant="body1">Group Chat</Typography>
              )}
            </Box>
          ))
        ) : (
          <Typography variant="body1">Chats are empty</Typography>
        )}
      </Stack>
    </Box>
  );
}
