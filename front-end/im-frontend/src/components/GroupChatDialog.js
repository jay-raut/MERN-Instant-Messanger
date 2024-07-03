import { Dialog } from "@mui/material";
import DialogTitle from "@mui/material/DialogTitle";
export default function GroupChatDialog({isDialogOpen, setDialogVisible}){



    function createGroupChat(){
        console.log("created group chat")
    }
    return(
        <Dialog
        open={isDialogOpen}
        onClose={() => setDialogVisible(false)}
        PaperProps={{
            component:'form',
            onSubmit:{createGroupChat}
        }}
        >
            <DialogTitle>Create Group Chat</DialogTitle>
            
        </Dialog>
    )
}