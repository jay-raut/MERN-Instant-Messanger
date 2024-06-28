import React from "react";
import { Box, Typography, Avatar, Stack } from "@mui/material";

export default function ListUsersSearch({ user, handleClick }) {
  const { first_name, last_name, username } = user;

  const initials = `${first_name.charAt(0)}`.toUpperCase();

  const handleButtonClick = () => {
    // Handle click action, if needed
    if (handleClick) {
      handleClick(user._id);
    }
  };

  return (
    <Box sx={{ p: 2, border: "1px solid #ccc", marginTop: 2, borderRadius: "5px", display: "flex", alignItems: "center" }}>
      <Avatar sx={{ width: 50, height: 50, marginRight: 1 }}>{initials}</Avatar>
      <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "flex-start", marginLeft: 10 }}>
        <Typography variant="h6" sx={{ marginBottom: 1 }}>
          {first_name} {last_name}
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Username: {username}
        </Typography>
      </Box>
    </Box>
  );
}
