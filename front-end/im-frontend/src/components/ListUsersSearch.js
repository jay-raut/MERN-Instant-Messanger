import React from "react";
import { Box, Typography, Avatar, Stack, ButtonBase } from "@mui/material";

export default function ListUsersSearch({ user, handleClick }) {
  const { first_name, last_name, username } = user;

  const initials = `${first_name.charAt(0)}`.toUpperCase();
  return (
    <ButtonBase
      onClick={() => handleClick(user)}
      sx={{ p: 2, border: "1px solid #ccc", marginTop: 2, borderRadius: "5px", width: "100%", textAlign: "left", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <Avatar sx={{ width: 50, height: 50 }}>{initials}</Avatar>
      <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", marginLeft: "auto", marginRight: "auto" }}>
        <Typography variant="h6" sx={{ marginBottom: 1 }}>
          {first_name} {last_name}
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Username: {username}
        </Typography>
      </Box>
    </ButtonBase>
  );
}
