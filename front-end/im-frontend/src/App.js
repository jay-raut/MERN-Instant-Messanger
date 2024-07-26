import React from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import Homepage from "./pages/Homepage";
import Chatpage from "./pages/Chatspage";
import Accountpage from "./pages/Accountpage";

function App() {
  return (
    <div className="routes-container">
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/chats" element={<Chatpage />}></Route>
        <Route path="/myaccount" element={<Accountpage></Accountpage>}></Route>
      </Routes>
    </div>
  );
}

export default App;
