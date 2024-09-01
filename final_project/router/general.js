const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  console.log("user: ", users)
  const {username, password} = req.body;


  if (!username || !password) {
    res.status(404).json({message: "username &/ password are not provided."});
  }

  if (isValid(username)) {
    return res.status(300).json({message: "Username already exists"});
  }


  users[username] = password;
  return res.status(200).json({message: "User created successfully"});



});



// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  try {
    const allBooks = await getBooksWithTimeOut(); 
    return res.status(200).json(allBooks); 
  } catch (error) {
    return res.status(500).json({ message: "Error trying to get list of books" });
  }
});


// Get book details based on ISBN
public_users.get('/isbn/:isbn',async function (req, res) {
  
  const isbn = req.params.isbn;
  
  const allBooks = await getBooksWithTimeOut(); 
  
  if (!allBooks[isbn]) {
    return res.status(404).json({message: "Book not found"});
  }
  
  return res.status(404).json(allBooks[isbn]);
  
  
});

const getBooksWithTimeOut = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(books); 
    }, 3000);
  });
};

// Get book details based on author
public_users.get('/author/:author',async function (req, res) {
  
  const allBooks = await getBooksWithTimeOut(); 
  
  const author = req.params.author;
  const result = {};
  for (let isbn in allBooks) {

    if (allBooks.hasOwnProperty(isbn)) {
      if (allBooks[isbn].author === author) {
        result[isbn] = allBooks[isbn];
      }
    }
  }

  if (Object.keys(result).length > 0) {
    return res.status(200).json(result);
  }

  return res.status(300).json({message: "Books not found"});
});

// Get all books based on title
public_users.get('/title/:title',async function (req, res) {

  const allBooks = await getBooksWithTimeOut(); 
  
  const title = req.params.title;

  for (let isbn in allBooks) {
    if (allBooks.hasOwnProperty(isbn)) {
      if (allBooks[isbn].title === title) {
        return res.status(200).json(allBooks[isbn]);
      }
    }
  }

  return res.status(404).json({message: "Book not found"});

});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  console.log(isbn);
  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  }
  return res.status(300).json({message: "Book not found"});
});

module.exports.general = public_users;
