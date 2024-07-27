import React from "react";
import { Box, TextField, Button } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert } from "@mui/material";
export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const handleUserName = (event) => {
    setUsername(event.target.value);
  };

  const handlePassword = (event) => {
    setPassword(event.target.value);
  };

  async function loginUser(event) {
    event.preventDefault();
    const response = await fetch("http://localhost:4000/api/user/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    if (response.ok) {
      console.log("logged in");
      navigate("/chats");
    } else {
      console.log("could not login");
      setError(true);
    }
  }

  return (
    <Box component="form" noValidate autoComplete="off" onSubmit={loginUser}>
      <TextField fullWidth label="Username" margin="normal" variant="outlined" required onChange={handleUserName} />
      <TextField fullWidth label="Password" margin="normal" variant="outlined" type="password" required onChange={handlePassword} />
      <Button type="submit" fullWidth variant="contained" color="primary" sx={{ mt: 2 }}>
        Login
      </Button>
      {error && (
        <Alert variant="filled" severity="error" sx={{ marginTop: 1 }}>
          Could not login. Username or password incorrect.
        </Alert>
      )}
    </Box>
  );
}
