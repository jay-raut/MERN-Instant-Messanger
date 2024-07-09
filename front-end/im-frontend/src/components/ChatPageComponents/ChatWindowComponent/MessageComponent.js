import React from "react";
import { Box, Typography, Avatar } from "@mui/material";

export default function MessageComponent({ message, isCurrentUser }) {
  const sender = message.sender;
  const createdAt = new Date(message.createdAt).toLocaleString();

  return (
    <Box justifyContent={isCurrentUser ? "flex-end" : "flex-start"} display="flex" alignItems="center" mb={2}>
      <Avatar>{sender.first_name.charAt(0).toUpperCase()}</Avatar>
      <Box ml={2}>
        <Box display={"flex"} alignItems="center" gap={1}>
          <Typography fontSize={15} variant="body2" color="black">
            {sender.username}
          </Typography>
          <Typography fontSize={10} variant="body2" color="textSecondary">
            {createdAt}
          </Typography>
        </Box>
        <Box width={150}>
          <Typography sx={{ whiteSpace: "pre-line" }} variant="body1">
            {message.content}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
