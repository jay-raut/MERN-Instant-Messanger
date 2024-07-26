import { Avatar, Box, Typography } from "@mui/material";
import { ChatState } from "../../../Context/ChatProvider";

export default function AccountSummary() {
  const { user } = ChatState();

  return (
    user &&
    Object.keys(user).length > 0 && (
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1, padding: 2 }}>
        <Avatar sx={{ width: 56, height: 56 }}>
          <Typography fontSize={30}>{user.firstname.charAt(0).toUpperCase()}</Typography>
        </Avatar>
        <Typography sx={{ textAlign: "center" }}>
          Welcome, {user.firstname.charAt(0).toUpperCase() + user.firstname.slice(1)} {user.lastname.charAt(0).toUpperCase() + user.lastname.slice(1)}
        </Typography>

        
      </Box>
    )
  );
}
