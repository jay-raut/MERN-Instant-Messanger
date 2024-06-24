const express = require("express");
const cors = require("cors");
const app = express();


app.use(cors({
    origin: "http://localhost:3000"
}));


app.post("/register", (req, res) => {
    
});

app.post("/login", (req, res) =>{

});

app.listen(4000, console.log("Server started on port 4000"));

