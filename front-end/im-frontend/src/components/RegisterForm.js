import React from "react";
import { useState } from "react";
import { Box, TextField, Button } from "@mui/material";
import SnackBar from "./Snackbar";

export default function RegisterForm() {
  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [snackBarVisible, setSnackBarVisible] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState("");

  const handleFirstName = (event) => {
    setFirstName(event.target.value);
  };

  const handleLastName = (event) => {
    setLastName(event.target.value);
  };

  const handleUserName = (event) => {
    setUsername(event.target.value);
  };

  const handlePassword = (event) => {
    setPassword(event.target.value);
  };

  const registerUser = (event) => {
    event.preventDefault();
    if (!firstname || !lastname || !username || !password) {
      setSnackBarVisible(true);
      
      return;
    }

    console.log("Registering user:", { firstname, lastname, username, password });
  };

  return (
    <>
    <Box component="form" noValidate autoComplete="off" onSubmit={registerUser}>
      <TextField fullWidth label="First Name" margin="normal" variant="outlined" required value={firstname} onChange={handleFirstName} />
      <TextField fullWidth label="Last Name" margin="normal" variant="outlined" required value={lastname} onChange={handleLastName} />
      <TextField fullWidth label="Username" margin="normal" variant="outlined" required value={username} onChange={handleUserName} />
      <TextField fullWidth label="Password" margin="normal" variant="outlined" type="password" required value={password} onChange={handlePassword} />
      <Button type="submit" fullWidth variant="contained" color="primary" sx={{ mt: 2 }}>
        Register
      </Button>
    </Box>
    <SnackBar open={snackBarVisible} setOpen={setSnackBarVisible} message={snackBarMessage} />
    </>
  );
}
