// Imports
const express = require("express"); // library module name
const dotenv = require("dotenv"); // import .env variable library
const mongoose = require("mongoose");

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
app.get("/Book/new", (req, res) => {
  res.render("Book/new.ejs");
});

// Show Route
// ROLE -> display a single instance of a resource (Book) from the database
app.get("/Book/:id", async (req, res) => {
  try {
    const foundBook = await Book.findById(req.params.id);
    // const variable = await Model.findById()
    const contextData = { Book: foundBook };
    res.render("Book/show", contextData);
  } catch (err) {
    console.log(err);
    res.redirect("/");
  }
});

// app.get - Book index route - GET - /Books
app.get("/Book", async (req, res) => {
  try {
    const allBook = await Book.find();
    res.render("Book/index", { Book: allBook, message: "Hello Friend" });
  } catch (err) {
    console.log(err);
    res.redirect("/");
  }
});

// app.post - POST - /Books
app.post("/Book", async (req, res) => {
  if (req.body.isRead) {
    req.body.isRead = true;
  } else {
    req.body.isRead = false;
  }

  try {
    await Book.create(req.body);
    res.redirect("/Book");
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// app.delete
app.delete("/Book/:id", async (req, res) => {
  try {
    await Book.findByIdAndDelete(req.params.id);
    // console.log(deletedBook, "response from db after deletion");
    res.redirect("/Book");
  } catch (err) {
    console.log(err);
    res.redirect(`/`);
  }
});

// app.get - EDIT route
app.get("/Book/:BookId/edit", async (req, res) => {
  try {
    const BookToEdit = await Book.findById(req.params.BookId);
    res.render("Book/edit", { Book: BookToEdit });
  } catch (err) {
    console.log(err);
    res.redirect(`/`);
  }
});

// app.put - UPDATE route
app.put("/Book/:id", async (req, res) => {
  try {
    // console.log(req.body, 'testing data from form')

    if (req.body.isRead === "on") {
      req.body.isRead = true;
    } else {
      req.body.isRead = false;
    }

    await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });

    // findByIdAndUpdate - breakdown of arguments:
    // 1. id - the resource _id property for looking the document
    // 2. req.body - data from the form
    // 3. {new: true} option is provided as an optional third argument

    res.redirect(`/Book/${req.params.id}`);
  } catch (err) {
    console.log(err);
    res.redirect(`/Book/${req.params.id}`);
  }
});

// Server handler
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});