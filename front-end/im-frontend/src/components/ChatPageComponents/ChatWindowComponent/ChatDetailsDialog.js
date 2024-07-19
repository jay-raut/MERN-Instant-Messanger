import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import SaveIcon from "@mui/icons-material/Save";
import ChatMemberAvatar from "./ChatMemberAvatar";
import { ChatState } from "../../../Context/ChatProvider";
import LogoutIcon from "@mui/icons-material/Logout";
import ListUsersDialog from "../DialogComponents/ListUsersDialog";
import { Button, List, Typography } from "@mui/material";
export default function ChatDetailsDialog({ isDialogOpen, setDialogVisible, setSnackBarMessage, setSnackBarVisible }) {
  const { currentChat, setCurrentChat, chats, setChats, socket, user } = ChatState();
  const [newChatName, setNewChatName] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  async function handleChangeChatName(event) {
    event.preventDefault();

    const response = await fetch("http://localhost:4000/api/chat/rename", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ groupChatID: currentChat._id, newName: newChatName }),
    });
    if (response.ok) {
      const res = await response.json();
      console.log(res);
      currentChat.chatname = res.chat.chatname;
      const updated_chats = chats.filter((c) => c._id !== currentChat._id);

      setChats([currentChat, ...updated_chats]);
      setCurrentChat(currentChat);
      socket.emit("rename-chat", currentChat, res.chat.chatname);
    } else {
      setSnackBarMessage("Something went wrong try reloading");
      setSnackBarVisible(true);
    }
    setNewChatName("");
  }

  async function handleSearch(event) {
    setSearchLoading(true);
    const response = await fetch(`http://localhost:4000/api/user/find-user?search=${encodeURIComponent(event)}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    if (response.ok) {
      const users = await response.json();
      setSearchResult(users.users);
    } else {
      setSnackBarMessage("Could not search for users. Try reloading");
      setSnackBarVisible(true);
    }
    setSearchLoading(false);
  }

  function checkIfSimilarChatExists(user) {
    let returnCheck = false;

    chats.forEach((c) => {
      // Check if both chats have the same number of users
      if (c.users.length === currentChat.users.length + 1) {
        // Convert both user arrays to sets of user IDs
        const currentChatUserIds = new Set(currentChat.users.map((u) => u._id));
        const chatUserIds = new Set(c.users.map((u) => u._id));

        // Check if every user ID in the current chat is also in the other chat
        const hasSameUsers = Array.from(currentChatUserIds).every((id) => chatUserIds.has(id));

        if (hasSameUsers && c.users.some((u) => u._id === user._id)) {
          returnCheck = true;
        }
      }
    });
    return returnCheck;
  }

  async function addUser(user) {
    if (currentChat.users.find((u) => u._id === user._id)) {
      setSnackBarMessage("User is already in the group chat");
      setSnackBarVisible(true);
      return;
    }

    if (checkIfSimilarChatExists(user)) {
      setSnackBarMessage("A chat like this already exists. Add a different user");
      setSnackBarVisible(true);
      return;
    }

    try {
    } catch (e) {
      console.log(e);
    }
    const response = await fetch("http://localhost:4000/api/chat/adduser", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ groupChatID: currentChat._id, newUserID: user._id }),
    });
    if (response.ok) {
      const res = await response.json();
      console.log(res);
      currentChat.isGroupChat = res.chat.isGroupChat;
      currentChat.chatname = res.chat.chatname;
      currentChat.users = [user, ...currentChat.users];
      const updated_chats = chats.filter((c) => c._id !== currentChat._id);
      setChats([currentChat, ...updated_chats]);
      setCurrentChat(currentChat);
      socket.emit("add-user", currentChat, user);
    } else {
      setSnackBarMessage("Something went wrong try reloading");
      setSnackBarVisible(true);
    }
  }

  async function leaveGroup() {
    const response = await fetch("http://localhost:4000/api/chat/leave", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ groupChatID: currentChat._id }),
    });
    if (response.ok) {
      const updated_chats = chats.filter((c) => c._id !== currentChat._id);
      socket.emit("leave-chat", currentChat, user);
      setChats(updated_chats);
      setCurrentChat(null);
      setDialogVisible(false);
      
    } else {
      setSnackBarMessage("Something went wrong try reloading");
      setSnackBarVisible(true);
    }
  }

  return (
    <Dialog
      open={isDialogOpen}
      onClose={() => setDialogVisible(false)}
      PaperProps={{
        component: "form",
        onSubmit: handleChangeChatName,
        sx: {
          borderRadius: "10px",
        },
      }}
      maxWidth="sm"
      fullWidth>
      <DialogTitle>Chat Details</DialogTitle>
      <Box>
        <Grid container spacing={1}>
          {currentChat?.users.map((user, index) => (
            <Grid margin={1} item key={index}>
              <ChatMemberAvatar user={user} />
            </Grid>
          ))}
        </Grid>
      </Box>
      {currentChat?.isGroupChat ? (
        <Box margin={1} display="flex">
          <TextField required id="outlined-required" label="Enter new chat name" autoComplete="off" fullWidth value={newChatName} onChange={(e) => setNewChatName(e.target.value)} />
          <IconButton type="submit" variant="contained" color="primary">
            <SaveIcon />
          </IconButton>
        </Box>
      ) : (
        <Box></Box>
      )}

      <Box margin={1}>
        <TextField
          id="outlined-required-users"
          label="Enter users to add using their name or username"
          fullWidth
          autoComplete="off"
          onChange={(e) => {
            handleSearch(e.target.value);
          }}
        />
        {searchLoading ? (
          <></>
        ) : (
          <Box>
            <List>
              {searchResult?.slice(0, 4).map((user, index) => (
                <ListUsersDialog key={index} user={user} handleClick={() => addUser(user)} />
              ))}
            </List>
          </Box>
        )}
      </Box>
      {currentChat?.isGroupChat ? (
        <Box display="flex" justifyContent="flex-end" p={3}>
          <Button onClick={leaveGroup} variant="contained" color="primary">
            <Typography marginRight={1}>Leave Group</Typography>
            <LogoutIcon />
          </Button>
        </Box>
      ) : (
        <></>
      )}
    </Dialog>
  );
}
