import { Dialog, DialogContent } from "@mui/material";
import DialogTitle from "@mui/material/DialogTitle";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { useEffect, useState } from "react";
import DialogActions from "@mui/material/DialogActions";
import { Button } from "@mui/material";
import SnackBar from "./Snackbar";
import ListUsersDialog from "./ListUsersDialog";
import { List } from "@mui/material";
import LoadingUsersDialog from "./LoadingUsersDialog";
import AddedUserAvatar from "./AddedUserAvatar";
import { Grid } from "@mui/material";
import { ChatState } from "../Context/ChatProvider";

export default function GroupChatDialog({ isDialogOpen, setDialogVisible }) {
  const [groupChatName, setGroupChatName] = useState("");
  const [groupChatUsers, setGroupChatUsers] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [snackBarVisible, setSnackBarVisible] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [isCreateButtonDisabled, setIsCreateButtonDisabled] = useState(true);
  const { currentChat, setCurrentChat, chats, setChats } = ChatState();
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

  function addUser(user) {
    if (groupChatUsers.find((u) => u._id === user._id)) {
      setSnackBarMessage("This user is already in this group chat");
      setSnackBarVisible(true);
      return;
    }
    setGroupChatUsers([user, ...groupChatUsers]);
  }

  function removeUser(user) {
    const updatedGroupChatUsers = groupChatUsers.filter((u) => u._id !== user._id);
    setGroupChatUsers(updatedGroupChatUsers);
  }

  async function createGroupChat(event) {
    event.preventDefault();

    try {
      const response = await fetch("http://localhost:4000/api/chat/group", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          receiver: {
            users: groupChatUsers,
          },
          chatName: groupChatName,
        }),
      });

      if (response.ok) {
        const newChat = await response.json();
        const chatsContains = chats.find((c) => c._id === newChat.chat._id); //search for this chat
        if (!chatsContains) {
          //if this is a new chat with this user then append this new chat to the chats list
          setChats([newChat.chat, ...chats]);
          setCurrentChat(newChat.chat);
        } else {
          setCurrentChat(chatsContains);
        }
        setDialogVisible(false);
      } else {
        setSnackBarMessage("Could not create this chat try reloading");
        setSnackBarVisible(true);
      }
    } catch (error) {
        setSnackBarMessage("Could not create this chat try reloading");
        setSnackBarVisible(true);
    }
  }

  useEffect(() => {
    if (groupChatName && groupChatUsers.length >= 2) {
      setIsCreateButtonDisabled(false);
    } else {
      setIsCreateButtonDisabled(true);
    }
  }, [groupChatName, groupChatUsers]);

  return (
    <Dialog
      open={isDialogOpen}
      onClose={() => setDialogVisible(false)}
      PaperProps={{
        component: "form",
        onSubmit: createGroupChat,
        sx: {
          borderRadius: "10px",
        },
      }}
      maxWidth="sm"
      fullWidth>
      <DialogTitle>Create Group Chat</DialogTitle>
      <DialogContent overflowY="auto">
        <Box margin={1}>
          <TextField
            required
            id="outlined-required"
            label="Enter chat name"
            autoComplete="off"
            fullWidth
            value={groupChatName}
            onChange={(e) => {
              setGroupChatName(e.target.value);
            }}
          />
        </Box>
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
          <Box>
            <Grid container spacing={1}>
              {groupChatUsers.map((user, index) => (
                <Grid item key={user._id}>
                  <AddedUserAvatar index={index} user={user} handleDelete={removeUser} />
                </Grid>
              ))}
            </Grid>
          </Box>
          {searchLoading ? (
            <>
              <Box>
                <LoadingUsersDialog></LoadingUsersDialog>
              </Box>
            </>
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
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setDialogVisible(false)}>Cancel</Button>
        <Button variant="contained" type="submit" disabled={isCreateButtonDisabled}>
          Create Group Chat
        </Button>
      </DialogActions>
      <SnackBar open={snackBarVisible} setOpen={setSnackBarVisible} message={snackBarMessage}></SnackBar>
    </Dialog>
  );
}
