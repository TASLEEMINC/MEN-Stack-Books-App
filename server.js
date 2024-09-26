// Imports
const express = require("express"); // library module name
const dotenv = require("dotenv"); // import .env variable library
const mongoose = require("mongoose");
const BookController = require("./controllers/Book.js");


// middleware that help with request conversion + logging
const methodOverride = require("method-override");
const morgan = require("morgan");

// APP + Configurations
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// opens connection to MongoDB
mongoose.connect(process.env.MONGODB_URI);

// mongoose connection event listeners
mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});
mongoose.connection.on("error", (err) => {
  console.log(err);
});

// IMPORT mongoose models
const Book = require("./models/Book");

// configure view engine
app.set("view engine", "ejs");

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
app.use(morgan("dev"));

// Landing Page - Home page
// ROLE - provide information about the app / site
app.get("/", (req, res) => {
  res.render("index");
});

// New Book Route - GET - /Book/new
// ROLE -> render a form (new.ejs)
app.get("/Book/new", BookController.getNewForm);

// Show Route
// ROLE -> display a single instance of a resource (Book) from the database
app.get("/Book/:id", BookController.getOneBook);

// app.get - Book index route - GET - /Books
app.get("/Book", BookController.getAllBooks);

// app.post - POST - /Books
app.post("/Book", BookController.createBook);

// app.delete
app.delete("/Book/:id", BookController.deleteBook);

// app.get - EDIT route
app.get("/Book/:BookId/edit", BookController.getEditForm);

// app.put - UPDATE route
app.put("/Book/:id", BookController.editBook);

// Server handler
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});