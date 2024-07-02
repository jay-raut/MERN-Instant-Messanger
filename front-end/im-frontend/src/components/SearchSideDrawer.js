import React, { useEffect } from "react";
import { Drawer, IconButton } from "@mui/material";
import { Typography, Box } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";
import SnackBar from "./Snackbar";
import LoadingUsers from "./LoadingUsers";
import ListUsersSearch from "./ListUsersSearch";
import { ChatState } from "../Context/ChatProvider";
export default function SearchSideDrawer() {
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [hasSeached, setHasSearched] = useState(false);
  const [searchWord, setSearchWord] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackBarVisible, setSnackBarVisible] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState("");
  const { setCurrentChat } = ChatState();
  const { chats, setChats } = ChatState();
  useEffect(() => {
    //useState is async ??
    if (searchResult.length === 0 && hasSeached) {
      setSnackBarMessage("No results founds");
      setSnackBarVisible(true);
    }
  }, [searchResult, hasSeached]);
  async function HandleSearchButton() {
    if (!searchWord) {
      setSnackBarVisible(true);
      setSnackBarMessage("Please enter something in search");
      return;
    }
    setSnackBarVisible(false);

    try {
      setLoading(true);
      const response = await fetch(`http://localhost:4000/api/user/find-user?search=${encodeURIComponent(searchWord)}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (response.ok) {
        const search_results = await response.json();
        setSearchResult(search_results.users);
        setLoading(false);
        setHasSearched(true);
      } else {
        console.log(response);
        setSnackBarMessage("Unable to search for users try loading");
        setSnackBarVisible(true);
        setLoading(false);
      }
    } catch (e) {
      console.log(e);
      setSnackBarMessage("Unable to search for users try loading");
      setSnackBarVisible(true);
      setLoading(false);
    }
  }

  async function handleSearchClick(user) {
    //when a searched user is clicked in the search drawer
    const receiver = { _id: user._id };
    try {
      const response = await fetch("http://localhost:4000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ receiver, chatName: "Untitled" }),
      });
      if (response.ok) {
        const searched_chat = await response.json();
        const chatsContains = chats.find((c) => c._id === searched_chat.chat._id); //search for this chat 
        if (!chatsContains) {
          //if this is a new chat with this user then append this new chat to the chats list
          setChats([searched_chat.chat, ...chats]);
          setCurrentChat(searched_chat.chat);
        } else {
          setCurrentChat(chatsContains);
        }
        setDrawerOpen(false);
      } else {
        setSnackBarMessage("Something went wrong");
        setSnackBarVisible(true);
      }
    } catch (e) {
      console.log(e);
    }
  }
  return (
    <>
      <IconButton
        className="sidebar-icon"
        size="large"
        edge="end"
        color="inherit"
        aria-label="open drawer"
        onClick={() => setDrawerOpen(true)}
        sx={{
          color: "white",
          marginLeft: -2,
        }}>
        <SearchIcon />
      </IconButton>
      <Drawer anchor="left" open={isDrawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box p={2} width="400px" textAlign="center" role="presentation" sx={{ position: "relative", padding: 0 }}>
          <IconButton
            className="sidebar-icon"
            size="large"
            edge="start"
            color="inherit"
            aria-label="close drawer"
            onClick={() => setDrawerOpen(false)}
            sx={{
              color: "black",
              position: "absolute",
              left: 20,
              top: 6,
              zIndex: 1001,
            }}>
            <ChevronLeftIcon sx={{ width: "1.8rem", height: "1.8rem" }} />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{
              position: "absolute",
              top: 6,
              right: 0,
              left: 1,
              margin: 1,
              zIndex: 1000,
            }}></Typography>

          <Typography
            variant="h6"
            component="div"
            sx={{
              position: "absolute",
              top: 6,
              right: 0,
              left: 1,
              margin: 1,
              zIndex: 1000,
            }}>
            Search
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", marginTop: "60px", padding: "16px", borderTop: "2px solid grey", borderBottom: "2px solid grey" }}>
            <InputBase sx={{ ml: 1, flex: 1 }} placeholder="Search for people" inputProps={{ "aria-label": "search users" }} value={searchWord} onChange={(e) => setSearchWord(e.target.value)} />
            <IconButton type="button" sx={{ p: "10px" }} aria-label="search" onClick={HandleSearchButton}>
              <SearchIcon />
            </IconButton>
            <SnackBar open={snackBarVisible} setOpen={setSnackBarVisible} message={snackBarMessage}></SnackBar>
          </Box>
          {loading ? <LoadingUsers /> : <>{searchResult.length === 0 ? <div></div> : searchResult.map((user) => <ListUsersSearch key={user._id} user={user} handleClick={handleSearchClick} />)}</>}
        </Box>
      </Drawer>
    </>
  );
}
