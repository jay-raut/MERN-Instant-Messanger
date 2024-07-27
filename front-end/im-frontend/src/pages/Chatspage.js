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
  const [chatNotificationVisible, setChatNotificationVisible] = useState(false);
  const [chatNotificationContent, setChatNotificationContent] = useState("");
  const [newCurrentChat, setNewCurrentChat] = useState(null);
  const { user, setCurrentChat } = ChatState();
  return (
    user &&
    Object.keys(user).length > 0 && (
      <>
        <Header setSnackBarMessage={setSnackBarMessage} setSnackBarVisible={setSnackBarVisible} />
        <GroupChatDialog isDialogOpen={groupChatDialogOpen} setDialogVisible={setGroupChatDialogOpen} setSnackBarMessage={setSnackBarMessage} setSnackBarVisible={setSnackBarVisible}></GroupChatDialog>

        <Box sx={{ overflow: "auto", display: "flex", justifyContent: "space-between", height: "calc(100vh - 64px)" }}>
          <Box sx={{ width: "100%", maxHeight: "100%", maxWidth: "400px", margin: "5px" }}>
            <UserChats setGroupChatDialogOpen={setGroupChatDialogOpen} />
          </Box>
          <Box sx={{ width: "100%", maxHeight: "100%", margin: "5px" }}>
            <ChatWindow
              setSnackBarMessage={setSnackBarMessage}
              setSnackBarVisible={setSnackBarVisible}
              setChatNotificationVisible={setChatNotificationVisible}
              setChatNotificationContent={setChatNotificationContent}
              setNewCurrentChat={setNewCurrentChat}
            />
          </Box>
        </Box>
        <SnackBar open={snackBarVisible} setOpen={setSnackBarVisible} message={snackBarMessage}></SnackBar>
        <SnackBar
          open={chatNotificationVisible}
          setOpen={setChatNotificationVisible}
          message={chatNotificationContent}
          onClick={() => setCurrentChat(newCurrentChat)}
          onClickText="Go To Chat"></SnackBar>
      </>
    )
  );
}
