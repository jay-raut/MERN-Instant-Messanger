import { Dialog, DialogTitle } from "@mui/material";
import { useState } from "react";
import { ChatState } from "../../../Context/ChatProvider";
import { useEffect } from "react";
import { TextField } from "@mui/material";
import { DialogContent } from "@mui/material";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import { DialogContentText } from "@mui/material";
export default function ChangeUsernameDialog({ open, onClose, setSnackBarVisible, setSnackBarMessage }) {
  const { user, setUser, chats, socket } = ChatState();
  const [newUsername, setNewUsername] = useState(user.username);
  async function handleUsernameChange(event) {
    event.preventDefault();
    try {
      const response = await fetch("http://localhost:4000/api/user/username", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newUsername: newUsername }),
      });
      if (response.ok) {
        setSnackBarMessage("Changed username successfully");
        setSnackBarVisible(true);
        onClose();
        setUser({ ...user, username: newUsername });
        const allChatUsers = chats.flatMap((chat) => chat.users);
        const uniqueUsers = Array.from(new Set(allChatUsers.map((user) => user._id))).map((id) => allChatUsers.find((user) => user._id === id));
        socket.emit("profile-update", { firstname: user.firstname, lastname: user.lastname, username: newUsername, _id: user.userID }, uniqueUsers);
      } else {
        setSnackBarMessage("Could not change username. Username may already exist");
        setSnackBarVisible(true);
      }
    } catch (error) {
      console.log(error);
      setSnackBarMessage("An error occurred while changing username. Try reloading");
      setSnackBarVisible(true);
    }
  }
  useEffect(() => {
    setNewUsername(user.username);
  }, [user.username]);
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        component: "form",
        onSubmit: handleUsernameChange,
      }}>
      <DialogTitle>Change username</DialogTitle>
      <DialogContent>
        <DialogContentText>Change your username here</DialogContentText>
        <TextField margin="dense" id="firstname" name="First Name" type="text" fullWidth variant="standard" value={newUsername} onChange={(e) => setNewUsername(e.target.value)} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button type="submit">Save</Button>
      </DialogActions>
    </Dialog>
  );
}
