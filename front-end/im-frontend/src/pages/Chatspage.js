import Header from "../components/Header";
import { Box } from "@mui/material";
import UserChats from "../components/UserChats";
import ChatWindow from "../components/ChatWindow";
import { useState } from "react";
import GroupChatDialog from "../components/GroupChatDialog";
import { ChatState } from "../Context/ChatProvider";

export default function Chatpage() {
  const [groupChatDialogOpen, setGroupChatDialogOpen] = useState(false);
  const { user } = ChatState();
  return (
    (user && Object.keys(user).length > 0 && 
    <>
      <Header />
      <GroupChatDialog isDialogOpen={groupChatDialogOpen} setDialogVisible={setGroupChatDialogOpen}></GroupChatDialog>
      <Box sx={{overflow:"auto", display: "flex", justifyContent: "space-between", height: "calc(100vh - 64px)" }}>
        <Box sx={{ width: "100%", maxHeight: "100%", maxWidth: "400px", margin: "5px" }}>
          <UserChats setGroupChatDialogOpen={setGroupChatDialogOpen} />
        </Box>
        <Box sx={{ width: "100%", maxHeight: "100%", margin: "5px" }}>
          <ChatWindow />
        </Box>
      </Box>
    </>
    )
  );
}
