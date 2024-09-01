const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = {
  "example": "example"
};

const isValid = (username)=>{ //returns boolean

  if (users[username] && users[username] != '') {
    return true;
  }

  return false;

}

const authenticatedUser = (username,password)=>{ //returns boolean

  if (users[username] === password) {
    return true;
  }

  return false;

}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const {username, password} = req.body;

  if (!username || !password) {
    return res.status(404).json({message: "username &/ password are not provided."});
  }

  if (isValid(username)) {
    if (authenticatedUser(username,password)) {
        const accessToken = jwt.sign({
          data: password
        }, 'access', { expiresIn: 60 * 60 });

        req.session.authorization = {
          accessToken, username
        }

        return res.status(200).send({message:"User successfully logged in"});
    } else {
        return res.status(300).json({ message: "Invalid Login. Check username and password" });
      }
  }
  else {
    return res.status(300).json({message: "User not found"});
  }
  

});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  
  const isbn = req.params.isbn;
  const username = req.session.authorization.username;
  const review = req.query.review;  

  console.log(books[isbn])
    if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found" });
    }
  
    console.log('jose jua-', books[isbn].reviews[username]);
    if (books[isbn].reviews[username] != undefined) {
      
      books[isbn].reviews[username] = review;
      return res.status(200).json({ message: "Review modified successfully" });
    } 
    
    else {
      
      books[isbn].reviews[username] = review;
      return res.status(200).json({ message: "Review added successfully" });
    }

});


regd_users.delete("/auth/review/:isbn", (req, res) => {

  const isbn = req.params.isbn;
  const username = req.session.authorization.username;

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  if (books[isbn].reviews[username] != undefined) {
    books[isbn].reviews[username] = undefined;
    return res.status(200).json({ message: "Review deleted successfully" });
  } else {
    return res.status(404).json({ message: "Review not found" });
  }

});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
