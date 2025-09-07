const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const {username,password}=req.body;
  if (!username||!password){
    return res.status(400).json({message:'Username and password are required'});
  }
  const userExists=username.some(user=>user.username===username);
  if(userExists){
    return res.status(409).json({message:"User already exists"});
  }
  users.push({username,password});
  return res.status(201).json({message:'User registered successfully'}); //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.status(200).send(json.stringify(books, null, 2));//Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  const isbn=req.params.isbn;
  try {
    const response = await axios.get(`http://localhost:5000/books/${isbn}`);
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(404).json({ message: "Book not found." });
  }

  const book=books[isbn];
  if (book){
    res.status(200).json(book);
  }else{
    res.status(404).json({message:'Book not found'});
  } //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
 });
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  const author=req.params.author;
  try {
    const response = await axios.get("http://localhost:5000/books");
    const booksByAuthor = Object.values(response.data).filter(book => book.author === author);

    return res.status(200).json(booksByAuthor);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books." });
  }

  const results=Object.values(books).filter(book=>book.author===author);
  if(results.length>0){
    res.status(200).json(results);
  }else{
    res.status(404).json({message:'No books found by this author'});
  } //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  const title=req.params.title;
  try {
    const response = await axios.get("http://localhost:5000/books");
    const booksByTitle = Object.values(response.data).filter(book => book.title === title);

    return res.status(200).json(booksByTitle);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books." });
  }
  const results=Object.values(books).filter(book=>book.title===title);
  if(results.length>0){
    res.status(200).json(results);
  }else{
    res.status(404).json({message:'No books found with this title'});
  } //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn', async function (req, res) {
  const isbn=req.params.isbn;
  try {
    const response = await axios.get(`http://localhost:5000/books/${isbn}`);
    const reviews = response.data.reviews;

    return res.status(200).json(reviews);
  } catch (error) {
    return res.status(404).json({ message: "Book not found." });
  }
  const book=books[isbn];
  if(book){
    res.status(200).json(book.reviews);
  }else{
    res.status(404).json({message: 'Book not found'});
  } //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
