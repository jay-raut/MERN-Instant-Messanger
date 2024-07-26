import { Box, Typography } from "@mui/material";
import { ChatState } from "../../../Context/ChatProvider";
import { Button } from "@mui/material";
import { useState } from "react";

export default function AccountChangeInfo({ openNameChangeDialog, openUsernameChangeDialog }) {
  const { user } = ChatState();

  return (
    user &&
    Object.keys(user).length > 0 && (
      <Box>
        <Box sx={{ border: 1, borderColor: "grey.200", p: 2, borderRadius: "10px" }}>
          <Typography variant="h6">Profile Information</Typography>
          <Box
            sx={{
              display: "flex",
              borderTop: 1,
              borderColor: "grey.300",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: 3,
              "& > *": {
                marginTop: 3,
                marginBottom: 3,
              },
            }}>
            <Typography variant="h6" sx={{ fontSize: 12, color: "grey.700" }}>
              Name
            </Typography>
            <Typography variant="h6" color={"grey.700"}>
              {user.firstname} {user.lastname}
            </Typography>
            <Button variant="contained" onClick={() => openNameChangeDialog(true)}>
              Change Profile Name
            </Button>
          </Box>
          <Box
            sx={{
              display: "flex",
              borderTop: 1,
              borderColor: "grey.300",
              alignItems: "center",
              justifyContent: "space-between",
              "& > *": {
                marginTop: 3,
                marginBottom: 2,
              },
            }}>
            <Typography variant="h6" sx={{ fontSize: 12, color: "grey.700", marginRight: -11 }}>
              Username
            </Typography>
            <Typography variant="h6" color={"grey.700"}>
              {user.username}
            </Typography>
            <Button variant="contained" onClick={() => openUsernameChangeDialog(true)} >Change Username</Button>
          </Box>
        </Box>
      </Box>
    )
  );
}
