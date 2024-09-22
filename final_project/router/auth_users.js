const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  // Check if the username is valid
  return users.some(user => user.username === username);
}

const authenticatedUser = (username, password) => {
  // Check if username and password match the records
  return users.some(user => user.username === username && user.password === password);
}

// Only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (!isValid(username)) {
    return res.status(401).json({ message: "Invalid username" });
  }

  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid password" });
  }

  const token = jwt.sign({ username }, 'your_jwt_secret', { expiresIn: '1h' });
  return res.status(200).json({ message: "Login successful", token });
});

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const { review } = req.body;
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ message: "Token is required" });
  }

  try {
    const decoded = jwt.verify(token, 'your_jwt_secret');
    const username = decoded.username;

    if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found" });
    }

    if (!books[isbn].reviews) {
      books[isbn].reviews = {};
    }

    books[isbn].reviews[username] = review;
    return res.status(200).json({ message: "Review added/updated successfully" });
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ message: "Token is required" });
  }

  try {
    const decoded = jwt.verify(token, 'your_jwt_secret');
    const username = decoded.username;

    if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found" });
    }

    if (!books[isbn].reviews || !books[isbn].reviews[username]) {
      return res.status(404).json({ message: "Review not found" });
    }

    delete books[isbn].reviews[username];
    return res.status(200).json({ message: "Review deleted successfully" });
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
