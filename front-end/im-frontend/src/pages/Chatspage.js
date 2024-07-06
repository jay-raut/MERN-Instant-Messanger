import Header from "../components/ChatPageComponents/Header";
import { Box } from "@mui/material";
import UserChats from "../components/ChatPageComponents/ListChatsComponent/UserChats";
import ChatWindow from "../components/ChatPageComponents/ChatWindowComponent/ChatWindow";
import { useState } from "react";
import GroupChatDialog from "../components/ChatPageComponents/DialogComponents/GroupChatDialog";
import { ChatState } from "../Context/ChatProvider";
import SnackBar from "../components/ChatPageComponents/Utils/Snackbar";
export default function Chatpage() {
  const [groupChatDialogOpen, setGroupChatDialogOpen] = useState(false);
  const [snackBarVisible, setSnackBarVisible] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState("");
  const { user } = ChatState();
  return (
    (user && Object.keys(user).length > 0 && 
    <>
      <Header />
      <GroupChatDialog isDialogOpen={groupChatDialogOpen} setDialogVisible={setGroupChatDialogOpen} setSnackBarMessage={setSnackBarMessage} setSnackBarVisible={setSnackBarVisible}></GroupChatDialog>
      
      <Box sx={{overflow:"auto", display: "flex", justifyContent: "space-between", height: "calc(100vh - 64px)" }}>
        <Box sx={{ width: "100%", maxHeight: "100%", maxWidth: "400px", margin: "5px" }}>
          <UserChats setGroupChatDialogOpen={setGroupChatDialogOpen} />
        </Box>
        <Box sx={{ width: "100%", maxHeight: "100%", margin: "5px" }}>
          <ChatWindow setSnackBarMessage={setSnackBarMessage} setSnackBarVisible={setSnackBarVisible} />
        </Box>
      </Box>
      <SnackBar open={snackBarVisible} setOpen={setSnackBarVisible} message={snackBarMessage}></SnackBar>
    </>
    )
  );
}
