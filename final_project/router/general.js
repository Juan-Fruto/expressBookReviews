const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const {username, password} = req.body;

  if(!username) return res.status(400).json({message: "username has not been provided"});
  if(!password) return res.status(400).json({message: "password has not been provided"});
  
  users.map((u) => {
    if(u.username === username) {
      return res.status(400).json({message: "the user already exists"});
    }
  })

  const newUser = {
    username,
    password
  };

  users.push(newUser);
  res.status(201).send(`The user ${username} has been registered`);
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  res.status(200).send(JSON.stringify(books));
});

// Async version
public_users.get('/async/',async function (req, res) {
  await res.status(200).send(JSON.stringify(books));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',async function (req, res) {
  const {isbn} = req.params;

  const book = await books[isbn];
  if(!book) return res.status(404).json({message: 'book not found'});

  console.log(book);
  res.status(200).send(JSON.stringify(book));
 });

// Async version
public_users.get('/async/isbn/:isbn',async function (req, res) {
  const {isbn} = req.params;

  const book = await books[isbn];
  if(!book) return res.status(404).json({message: 'book not found'});

  console.log(book);
  res.status(200).send(JSON.stringify(book));
 });
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const {author} = req.params;
  let authorBooks = []; // An author could have multiple books
  
  for(let i = 1; i !== Object.keys(books).length + 1; i++) {
    if(books[i].author === author){
      authorBooks.push(books[i]);
    }
  }

  if(authorBooks.length == 0) {
    return res.status(404).send(JSON.stringify({message: 'the author was not found'}));
  }
  
  res.status(200).send(JSON.stringify({books: authorBooks}));
});

// Async version
public_users.get('/async/author/:author', function (req, res) {
  const {author} = req.params;
  
  const iteration = new Promise((resolve, reject) => {
    let authorBooks = []; // An author could have multiple books
    
    try {
      for(let i = 1; i !== Object.keys(books).length + 1; i++) {
        if(books[i].author === author){
          authorBooks.push(books[i]);
        }
      }
      resolve(authorBooks);
    } catch (error) {
      reject(error);
    }

  });

  iteration.then(
    (authorBooks) => {
      if(authorBooks.length == 0) {
        return res.status(404).send(JSON.stringify({message: 'the author was not found'}));
      }
      
      res.status(200).send(JSON.stringify({books: authorBooks}));
    },
    (err) => res.status(500).send(err)
  )
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const {title} = req.params;
  let specificBooks = [];
  
  for(let i = 1; i !== Object.keys(books).length + 1; i++) {
    if(books[i].title === title){
      specificBooks.push(books[i]);
    }
  }

  if(specificBooks.length == 0) {
    return res.status(404).send(JSON.stringify({message: 'the book was not found'}));
  }
  
  res.status(200).send(JSON.stringify({books: specificBooks}));
});

// Async version
public_users.get('/async/title/:title', function (req, res) {
  const {title} = req.params;
  
  const iteration = new Promise((resolve, reject) => {
    let specificBooks = [];
    
    try {
      for(let i = 1; i !== Object.keys(books).length + 1; i++) {
        if(books[i].title === title){
          specificBooks.push(books[i]);
        }
      }

      resolve(specificBooks);
    } catch (error) {
      reject(error);
    }
  })

  iteration.then((specificBooks) => {
    if(specificBooks.length == 0) {
      return res.status(404).send(JSON.stringify({message: 'the book was not found'}));
    }
    
    res.status(200).send(JSON.stringify({books: specificBooks}));
  })
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const {isbn} = req.params;

  const book = books[isbn];
  console.log(book);
  res.status(200).send(JSON.stringify(book.reviews));
});

module.exports.general = public_users;