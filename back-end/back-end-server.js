require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const cookieparser = require("cookie-parser");
const UserRoutes = require("./routes/UserRoutes");


const mongoose = require("mongoose");
mongoose.connect(process.env.mongo_db, {
  tlsCertificateKeyFile: process.env.mongo_cert,
});


app.use(express.json());
app.use(cookieparser());
app.use(
  cors({credentials: true,
    origin: "http://localhost:3000",
  })
);

app.use('/api/user', UserRoutes);


app.listen(4000, console.log("Server started on port 4000"));
