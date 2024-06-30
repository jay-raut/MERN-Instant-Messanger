import Header from "../components/Header";
import { Box } from "@mui/material";
import UserChats from "../components/UserChats";
import ChatWindow from "../components/ChatWindow";

export default function Chatpage() {
  return (   
    <div style={{ width: "100%" }}>

    
    <Box>
      <Header />
      <Box sx={{display:"flex", justifyContent:'space-between'}}>
        <UserChats>

        </UserChats>

        <ChatWindow>

        </ChatWindow>
      </Box>
    </Box>
    </div> 
  );
}
