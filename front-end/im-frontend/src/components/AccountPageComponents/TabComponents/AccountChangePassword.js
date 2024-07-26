import { Box, Typography } from "@mui/material";
import { Button } from "@mui/material";
export default function AccountChangePassword({openChangePasswordDialog}) {
  return (
    <Box>
      <Box sx={{ border: 1, borderColor: "grey.200", p: 2, borderRadius: "10px" }}>
        <Typography variant="h6">Change Password</Typography>
        <Box
          sx={{
            display: "flex",
            borderTop: 1,
            borderColor: "grey.300",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 3,
            "& > *": {
              marginTop: 3,
              marginBottom: 3,
            },
          }}>
          <Button variant="contained" onClick={() => openChangePasswordDialog(true)}>
            Change password
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
