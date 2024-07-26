import React from "react";
import { Box, Typography, Avatar } from "@mui/material";

export default function MessageComponent({ message, isCurrentUser }) {
  const sender = message.sender;
  const createdAt = new Date(message.createdAt).toLocaleString();

  return (
    <Box justifyContent={isCurrentUser ? "flex-end" : "flex-start"} display="flex" mb={2}>
      <Avatar>{sender.first_name.charAt(0).toUpperCase()}</Avatar>
      <Box ml={2} maxWidth="70%">
        <Box display="flex" alignItems="center" gap={1} mb={1}>
          <Typography fontSize={15} variant="body2" color="black">
            {sender.username}
          </Typography>
          <Typography fontSize={10} variant="body2" color="textSecondary">
            {createdAt}
          </Typography>
        </Box >
        <Typography
          variant="body1"
          sx={{
            whiteSpace: "pre-line",
            wordWrap: "break-word", // Ensure words break correctly
            width:150
          }}>
          {message.content}
        </Typography>
      </Box>
    </Box>
  );
}
