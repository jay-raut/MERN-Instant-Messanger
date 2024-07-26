import { Box, Tabs, Typography } from "@mui/material";
import AccountPageHeader from "../components/AccountPageComponents/Header/AccountPageHeader";
import SnackBar from "../components/ChatPageComponents/Utils/Snackbar";
import { useState } from "react";
import { Tab } from "@mui/material";
import AccountSummary from "../components/AccountPageComponents/TabComponents/AccountSummary";
import AccountChangeInfo from "../components/AccountPageComponents/TabComponents/AccountChangeInfo";
import AccountChangePassword from "../components/AccountPageComponents/TabComponents/AccountChangePassword";
import ChangeNameDialog from "../components/AccountPageComponents/DialogComponents/ChangeNameDialog";
import ChangeUsernameDialog from "../components/AccountPageComponents/DialogComponents/ChangeUsernameDialog";
import ChangePasswordDialog from "../components/AccountPageComponents/DialogComponents/ChangePasswordDialog";
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div role="tabpanel" hidden={value !== index} id={`tabpanel-${index}`} aria-labelledby={`tab-${index}`} {...other}>
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
}

export default function AccountPage() {
  const [tab, setTab] = useState(0);
  const [isNameChangeDialogOpen, setIsNameChangeDialogOpen] = useState(false);
  const [isUsernameChangeDialogOpen, setIsUsernameChangeDialogOpen] = useState(false);
  const [isPasswordChangeDialogOpen, setIsPasswordChangeDialogOpen] = useState(false);
  const [isSnackBarVisible, setSnackBarVisible] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState("");
  const handleTabChange = (event, newTab) => {
    setTab(newTab);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <AccountPageHeader />
      <Box sx={{ display: "flex", flexGrow: 1 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            borderRight: 1,
            borderColor: "divider",
            minWidth: "200px",
          }}>
          <Tabs value={tab} onChange={handleTabChange} aria-label="account page tabs" orientation="vertical">
            <Tab label="Account Summary" id="tab-0" aria-controls="tabpanel-0" />
            <Tab label="Profile Info" id="tab-1" aria-controls="tabpanel-1" />
            <Tab label="Security" id="tab-2" aria-controls="tabpanel-2" />
          </Tabs>
        </Box>
        <Box sx={{ flexGrow: 1, padding: 3 }}>
          <TabPanel value={tab} index={0}>
            <AccountSummary />
          </TabPanel>
          <TabPanel value={tab} index={1}>
            <AccountChangeInfo openNameChangeDialog={setIsNameChangeDialogOpen} openUsernameChangeDialog={setIsUsernameChangeDialogOpen} />
          </TabPanel>
          <TabPanel value={tab} index={2}>
            <AccountChangePassword openChangePasswordDialog={setIsPasswordChangeDialogOpen} />
          </TabPanel>
        </Box>
      </Box>
      <ChangeNameDialog
        open={isNameChangeDialogOpen}
        onClose={() => setIsNameChangeDialogOpen(false)}
        setSnackBarVisible={setSnackBarVisible}
        setSnackBarMessage={setSnackBarMessage}></ChangeNameDialog>
      <ChangeUsernameDialog
        open={isUsernameChangeDialogOpen}
        onClose={() => setIsUsernameChangeDialogOpen(false)}
        setSnackBarVisible={setSnackBarVisible}
        setSnackBarMessage={setSnackBarMessage}></ChangeUsernameDialog>
      <ChangePasswordDialog
        open={isPasswordChangeDialogOpen}
        onClose={() => setIsPasswordChangeDialogOpen(false)}
        setSnackBarVisible={setSnackBarVisible}
        setSnackBarMessage={setSnackBarMessage}></ChangePasswordDialog>
      <SnackBar open={isSnackBarVisible} setOpen={setSnackBarVisible} message={snackBarMessage}></SnackBar>
    </Box>
  );
}
