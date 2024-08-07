const jwt = require("jsonwebtoken");

const generateToken = ({ firstname, lastname, username, userID }) => {
  return jwt.sign({ firstname: firstname, lastname: lastname, username: username, userID: userID }, process.env.secret_token_key, { expiresIn: "5h" });
};


module.exports=generateToken;