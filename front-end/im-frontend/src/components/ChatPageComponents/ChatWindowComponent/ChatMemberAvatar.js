import React from "react";
import { Box, Chip, Avatar } from "@mui/material";

export default function ChatMemberAvatar({ user }) {
  const { first_name, username } = user;
  const initials = `${first_name.charAt(0)}`.toUpperCase();
  return (
    <Box>
      <Chip label={username} variant="outlined" avatar={<Avatar sx={{ width: 32, height: 32 }}>{initials}</Avatar>} />
    </Box>
  );
}
