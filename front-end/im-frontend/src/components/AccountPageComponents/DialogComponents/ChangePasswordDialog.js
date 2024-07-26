import { Dialog, DialogTitle } from "@mui/material";
import { useEffect, useState } from "react";
import { TextField } from "@mui/material";
import { DialogContent } from "@mui/material";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import { DialogContentText } from "@mui/material";
export default function ChangePasswordDialog({ open, onClose, setSnackBarVisible, setSnackBarMessage }) {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  async function changePassword(event) {
    event.preventDefault();
    if (confirmNewPassword !== newPassword) {
      setSnackBarMessage("New passwords do not match");
      setSnackBarVisible(true);
      return;
    }
    try {
      const response = await fetch("http://localhost:4000/api/user/password", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newPassword: confirmNewPassword, oldPassword: oldPassword }),
      });
      if (response.ok) {
        setSnackBarMessage("Changed password successfully");
        setSnackBarVisible(true);
        onClose();
      } else {
        setSnackBarMessage("Could not change password. Old password may be incorrect");
        setSnackBarVisible(true);
      }
    } catch (error) {
      console.log(error);
      setSnackBarMessage("Could not change password. Try reloading");
      setSnackBarVisible(true);
    }
  }

  useEffect(() => {
    setOldPassword("");
    setConfirmNewPassword("");
    setNewPassword("");
  }, [open]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        component: "form",
        onSubmit: changePassword,
        style: { width: "600px", maxWidth: "600px" },
      }}>
      <DialogTitle>Change password</DialogTitle>
      <DialogContent>
        <DialogContentText>Enter old password</DialogContentText>
        <TextField
          required
          margin="dense"
          id="old-password"
          name="old-password"
          label="Old Password"
          type="password"
          fullWidth
          variant="standard"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
        />
        <DialogContentText>Enter new password</DialogContentText>
        <TextField
          required
          margin="dense"
          id="new-password"
          name="new-password"
          label="New Password"
          type="password"
          fullWidth
          variant="standard"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <DialogContentText>Confirm password</DialogContentText>
        <TextField
          required
          margin="dense"
          id="confirm-password"
          name="confirm-password"
          label="Confirm Password"
          type="password"
          fullWidth
          variant="standard"
          value={confirmNewPassword}
          onChange={(e) => setConfirmNewPassword(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button type="submit">Save</Button>
      </DialogActions>
    </Dialog>
  );
}
