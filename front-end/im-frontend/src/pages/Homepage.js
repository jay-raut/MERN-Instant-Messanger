import React, { useState } from "react";
import { Container, Box, Typography, Tabs, Tab } from "@mui/material";
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";

export default function Homepage() {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Container maxWidth="xl">
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100vh" textAlign="center">
        <div>
          <Typography variant="h2" component="h1" gutterBottom>
            Instant Messenger
          </Typography>
          <Typography variant="h5" component="p" gutterBottom marginBottom={5}>
            Connect with your friends and family instantly.
          </Typography>
        </div>
        <Box mt={4} width="100%" maxWidth="500px" bgcolor="background.paper" boxShadow={3} borderRadius={2}>
          <Tabs value={activeTab} onChange={handleTabChange} indicatorColor="primary" textColor="primary" variant="fullWidth">
            <Tab label="Login" />
            <Tab label="Register" />
          </Tabs>
          <Box p={3}>
            {activeTab === 0 && <LoginForm />}
            {activeTab === 1 && <RegisterForm />}
          </Box>
        </Box>
      </Box>
    </Container>
  );
}
