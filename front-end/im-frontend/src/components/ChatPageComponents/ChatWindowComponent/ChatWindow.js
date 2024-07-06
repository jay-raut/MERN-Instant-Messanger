import { Box, IconButton, TextField } from "@mui/material";
import { Typography } from "@mui/material";
import { ChatState } from "../../../Context/ChatProvider";
import { Button } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useState } from "react";
export default function ChatWindow() {
  const { currentChat } = ChatState();
  const [message, setMessage] = useState("");

  function sendMessage(event) {
    event.preventDefault();
    console.log(message);
  }
  return (
    <Box sx={{ boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.4)", p: 2, width: "100%", borderRadius: "10px", height: "100%" }}>
      {currentChat ? (
        <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
          {/*Checks if chat is group chat or not and renders chatbox header*/}
          {currentChat.isGroupChat ? (
            <Box display="flex" padding={2} justifyContent="space-between">
              <Typography sx={{ fontSize: 25 }}>{currentChat.chatname}</Typography>
              <Button variant="contained" sx={{ minWidth: 0 }}>
                Chat Details
              </Button>
            </Box>
          ) : (
            <Box display="flex" padding={2} justifyContent="space-between">
              <Box>
                <Typography sx={{ fontSize: 25 }}>
                  {currentChat.users[0].first_name} {currentChat.users[0].last_name}
                </Typography>
                <Typography sx={{ fontSize: 15 }}>Username: {currentChat.users[0].username}</Typography>
              </Box>
              <Box>
                <Button variant="contained">Chat Details</Button>
              </Box>
            </Box>
          )}
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
            <Box sx={{ flex: 1, padding: 2, overflowY: "auto" }}></Box>

            {/* Input Area */}
            <Box component="form" onSubmit={(event) => sendMessage(event)} sx={{ display: "flex", alignItems: "center", paddingTop: 2, borderTop: '1px solid #ccc'}}>
              <TextField
                fullWidth
                placeholder="Type a message..."
                variant="outlined"
                value={message}
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
    </Box>
  );
}
