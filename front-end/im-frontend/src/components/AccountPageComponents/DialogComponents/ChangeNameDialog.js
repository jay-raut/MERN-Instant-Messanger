import { Dialog, DialogContentText, DialogTitle } from "@mui/material";
import { useEffect, useState } from "react";
import { ChatState } from "../../../Context/ChatProvider";
import { TextField } from "@mui/material";
import { DialogContent } from "@mui/material";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
export default function ChangeNameDialog({ open, onClose, setSnackBarVisible, setSnackBarMessage }) {
  const { user, setUser, chats, socket } = ChatState();

  const [newFirstName, setNewFirstName] = useState(user.firstname);
  const [newLastName, setNewLastName] = useState(user.lastname);
  async function handleNameChange(event) {
    event.preventDefault();
    try {
      const response = await fetch("http://localhost:4000/api/user/profile-name", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ firstname: newFirstName, lastname: newLastName }),
      });
      if (response.ok) {
        setSnackBarMessage("Changed profile name successfully");
        setSnackBarVisible(true);
        onClose();
        setUser({ ...user, firstname: newFirstName, lastname: newLastName });
        const allChatUsers = chats.flatMap((chat) => chat.users);
        const uniqueUsers = Array.from(new Set(allChatUsers.map((user) => user._id))).map((id) => allChatUsers.find((user) => user._id === id));
        socket.emit("profile-update", { firstname: newFirstName, lastname: newLastName, username: user.username, _id: user.userID }, uniqueUsers);
      } else {
        setSnackBarMessage("Could not change profile name. Try reloading");
        setSnackBarVisible(true);
      }
    } catch (error) {
      console.log(error);
      setSnackBarMessage("An error occurred while changing profile name. Try reloading");
      setSnackBarVisible(true);
    }
  }
  useEffect(() => {
    setNewFirstName(user.firstname);
  }, [user.firstname]);
  useEffect(() => {
    setNewLastName(user.lastname);
  }, [user.lastname]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        component: "form",
        onSubmit: handleNameChange,
      }}>
      <DialogTitle>Change name</DialogTitle>
      <DialogContent>
        <DialogContentText>Change your profile name here</DialogContentText>
        <TextField margin="dense" id="firstname" name="First Name" type="text" fullWidth variant="standard" value={newFirstName} onChange={(e) => setNewFirstName(e.target.value)} />
        <TextField margin="dense" id="lastname" name="Last Name" type="text" fullWidth variant="standard" value={newLastName} onChange={(e) => setNewLastName(e.target.value)} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button type="submit">Save</Button>
      </DialogActions>
    </Dialog>
  );
}
