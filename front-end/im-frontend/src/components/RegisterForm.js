import React, { useState } from "react";
import { Box, TextField, Button } from "@mui/material";
import SnackBar from "./Snackbar";

export default function RegisterForm() {
  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

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

  function registerUser(event) {
    event.preventDefault();
    console.log("Register Data:", { firstname, lastname, username, password });
  }

  return (
    <Box component="form" noValidate autoComplete="off" onSubmit={registerUser}>
      <TextField fullWidth label="First Name" margin="normal" variant="outlined" required onChange={handleFirstName} />
      <TextField fullWidth label="Last Name" margin="normal" variant="outlined" required onChange={handleLastName} />
      <TextField fullWidth label="Username" margin="normal" variant="outlined" required onChange={handleUserName} />
      <TextField fullWidth label="Password" margin="normal" variant="outlined" type="password" required onChange={handlePassword} />
      <Button type="submit" fullWidth variant="contained" color="primary" sx={{ mt: 2 }}>
        Register
      </Button>
      <SnackBar></SnackBar>
    </Box>
  );
}
