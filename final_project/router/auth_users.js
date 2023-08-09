const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

// check is the username is valid
const isValid = (username) => { //returns boolean
 // use this function will create more code
}

// check if username and password match the one we have in records.
const authenticatedUser = (username,password)=>{ //returns boolean
  return users.some(u => u.username === username && u.password === password)
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const {username, password} = req.body;

  if(!username) return res.status(400).json({message: "username has not been provided"});
  if(!password) return res.status(400).json({message: "password has not been provided"});
  
  const userAuth = authenticatedUser(username, password);
  console.log(userAuth);
  if(userAuth) {
    const token = jwt.sign(
      {
        username,
        password
      },
      process.env.JWT_SECRET,
      {expiresIn: 60*60*24*7} // expires in one week
    )

    req.session.authorization = {
      token,
      username
    }

    return res.status(200).json(JSON.stringify({token}));
  }

  res.status(404).json({message: 'user not found or password incorrect'});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const {isbn} = req.params;
  const {review} = req.query
  const {username} = req.user

  if(!books[isbn]) return res.status(404).json({message: 'book not found'});

  books[isbn].reviews[username] = review

  res.status(200).send(`the ${books[isbn].title} book has been updated`);
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const {isbn} = req.params;
  const {username} = req.user

  if(!books[isbn]) return res.status(404).json({message: 'book not found'});

  delete  books[isbn].reviews[username];

  res.status(200).send("the book review was deleted");
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;