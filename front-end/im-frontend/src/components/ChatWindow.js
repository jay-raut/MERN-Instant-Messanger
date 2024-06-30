import { Box } from "@mui/material"
import { Typography }  from "@mui/material"
export default function ChatWindow (){
    return (
        <Box sx={{ boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.4)", p: 2, width: "100%", borderRadius: "10px", margin: "5px" }}>
        <Box sx={{ padding: 2 }}>
          <Typography sx={{ fontSize: 25 }}>Chat Window</Typography>
        </Box>
      </Box>
    )
}