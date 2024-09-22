const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (users[username]) {
    return res.status(409).json({ message: "Username already exists" });
  }

  users[username] = { password };
  return res.status(201).json({ message: "User registered successfully" });
});


// Get the book list available in the shop
// public_users.get('/',function (req, res) {
//   //Write your code here
//   let bookList = books;
//   return res.status(200).json(JSON.stringify(bookList, null, 2));
// });
public_users.get('/', async (req, res) => {
  try {
    const response = await axios.get('/'); 
    const bookList = response.data;
    return res.status(200).json(bookList);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching book list" });
  }
});


// Get book details based on ISBN
// public_users.get('/isbn/:isbn',function (req, res) {
//   //Write your code here
//   const isbn = req.params.isbn;
//   const bookDetails = getBookDetailsByISBN(isbn);
// 
//   if (bookDetails) {
//     return res.status(200).json(bookDetails);
//   } else {
//     return res.status(404).json({ message: "Book not found" });
//   }
//  });
public_users.get('/isbn/:isbn', async (req, res) => {
  const isbn = req.params.isbn;
  try {
    const response = await axios.get(`isbn/${isbn}`); // Replace with actual URL
    const bookDetails = response.data;
    return res.status(200).json(bookDetails);
  } catch (error) {
    return res.status(404).json({ message: "Book not found" });
  }
});
  
// Get book details based on author
// public_users.get('/author/:author',function (req, res) {
//   //Write your code here
//  const author = req.params.author;
//   const booksByAuthor = Object.values(books).filter(book => book.author === author);
// 
//   if (booksByAuthor.length > 0) {
//     return res.status(200).json(booksByAuthor);
//   } else {
//     return res.status(404).json({ message: "Books by this author not found" });
//   }
// });
public_users.get('/author/:author', async (req, res) => {
  const author = req.params.author;
  try {
    const response = await axios.get(`author/${author}`);
    const booksByAuthor = response.data;
    return res.status(200).json(booksByAuthor);
  } catch (error) {
    return res.status(404).json({ message: "Books by this author not found" });
  }
});

// Get all books based on title
// public_users.get('/title/:title',function (req, res) {
//   //Write your code here
//   const title = req.params.title;
//   const booksByTitle = Object.values(books).filter(book => book.title === title);
// 
//   if (booksByTitle.length > 0) {
//     return res.status(200).json(booksByTitle);
//   } else {
//     return res.status(404).json({ message: "Books with this title not found" });
//   }
// });
public_users.get('/title/:title', async (req, res) => {
  const title = req.params.title;
  try {
    const response = await axios.get(`title/${title}`);
    const booksByTitle = response.data;
    return res.status(200).json(booksByTitle);
  } catch (error) {
    return res.status(404).json({ message: "Books with this title not found" });
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book && book.reviews) {
    return res.status(200).json(book.reviews);
  } else {
    return res.status(404).json({ message: "Reviews for this book not found" });
  }
});

module.exports.general = public_users;
