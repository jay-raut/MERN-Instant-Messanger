import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import { ChatState } from "../../Context/ChatProvider";
import LogoutIcon from "@mui/icons-material/Logout";
import { Avatar } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SearchSideDrawer from "./SidedrawerComponents/SearchSideDrawer";
export default function Header(setSnackBarMessage, setSnackBarVisible) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const { user, socket } = ChatState();

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleLogout = async () => {
    console.log("logout");
    socket.disconnect();
    const pastDate = new Date(0).toUTCString();
    document.cookie = `token=; expires=${pastDate}; path=/;`;
    window.location.href = "/";
  };

  const handleMyAccount = () => {
    window.location.href = "/myaccount";
  };

  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      id={"account-menu"}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}>
      <MenuItem onClick={handleLogout}>
        <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
          Logout
          <LogoutIcon sx={{ marginLeft: 2 }} />
        </Box>
      </MenuItem>
      <MenuItem onClick={handleMyAccount}>
        <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
          My account
          <AccountCircleIcon sx={{ marginLeft: 1 }} />
        </Box>
      </MenuItem>
    </Menu>
  );

  return (
    user &&
    Object.keys(user).length > 0 && (
      <Box>
        <AppBar position="sticky" sx={{ position: "sticky" }}>
          <Toolbar>
            <SearchSideDrawer></SearchSideDrawer>
            <Typography marginLeft={"15px"} variant="h6" noWrap component="div" sx={{ display: { xs: "none", sm: "block" } }}>
              Messenger
            </Typography>
            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ display: { xs: "none", md: "flex" } }}>
              <IconButton size="large" edge="end" aria-label="account of current user" aria-controls={"account-menu"} aria-haspopup="true" onClick={handleProfileMenuOpen} color="inherit">
                <Avatar sx={{ width: 32, height: 32 }}>{user.firstname.charAt(0).toUpperCase()}</Avatar>
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>
        {renderMenu}
      </Box>
    )
  );
}
