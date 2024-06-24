import React from 'react';
import { Box, TextField, Button } from '@mui/material';
import { useState } from 'react';

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleUserName = (event) => {
    setUsername(event.target.value);
  };

  const handlePassword = (event) => {
    setPassword(event.target.value);
  };

  async function loginUser(event){
    event.preventDefault();
    
  }

  return (
    <Box component="form" noValidate autoComplete="off" onSubmit={loginUser}>

      <TextField
        fullWidth
        label="Username"
        margin="normal"
        variant="outlined"
        required
        onChange={handleUserName}
      />
      <TextField
        fullWidth
        label="Password"
        margin="normal"
        variant="outlined"
        type="password"
        required
        onChange={handlePassword}
      />
      <Button type='submit' fullWidth variant="contained" color="primary" sx={{ mt: 2 }}>
        Login
      </Button>
    </Box>
  );
}
