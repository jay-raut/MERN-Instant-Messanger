import React from 'react';
import { Box, TextField, Button } from '@mui/material';

export default function LoginForm() {
  return (
    <Box component="form" noValidate autoComplete="off">

      <TextField
        fullWidth
        label="Username"
        margin="normal"
        variant="outlined"
        required
      />
      <TextField
        fullWidth
        label="Password"
        margin="normal"
        variant="outlined"
        type="password"
        required
      />
      <Button fullWidth variant="contained" color="primary" sx={{ mt: 2 }}>
        Login
      </Button>
    </Box>
  );
}
