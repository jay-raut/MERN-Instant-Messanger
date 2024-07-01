import Header from "../components/Header";
import { Box } from "@mui/material";
import UserChats from "../components/UserChats";
import ChatWindow from "../components/ChatWindow";

export default function Chatpage() {
  return (
    <Box sx={{ height: '100vh', overflow: 'hidden' }}>
      <Header />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', height: 'calc(100vh - 64px)' }}>
        <Box sx={{ width: '100%', maxHeight: '100%', maxWidth:"400px" , margin: "5px"}}>
          <UserChats />
        </Box>
        <Box sx={{ width: '100%', maxHeight: '100%', margin: "5px"}}>
          <ChatWindow />
        </Box>
      </Box>
    </Box>
  );
}
