const Book = require("../models/Book");

const getAllBooks = async (req, res) => {
  try {
    const allBooks = await Book.find();
    console.log(allBooks)
    res.render("Book/index", { Book: allBooks, message: "Hi there" });
  } catch (err) {
    console.log(err);
    res.redirect("/");
  }
};

const getOneBook = async (req, res) => {
  try {
    const foundBook = await Book.findById(req.params.id);
    // findOne -> await Book.findOne({name: req.params.name})
    // const variable = await Model.findById()
    const contextData = { Book: foundBook };
    res.render("Book/show", contextData);
  } catch (err) {
    console.log(err);
    res.redirect("/");
  }
};

const getNewForm = (req, res) => {
  res.render("Book/new");
};

const createBook = async (req, res) => {
  if (req.body.isRead) {
    req.body.isRead = true;
  } else {
    req.body.isRead = false;
  }

  try {
    await Book.create(req.body);
    res.redirect("/Book"); // redirect -> GET / address provided 
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const deleteBook = async (req, res) => {
  try {
    await Book.findByIdAndDelete(req.params.id);
    // console.log(deletedBook, "response from db after deletion");
    res.redirect("/Book");
  } catch (err) {
    console.log(err);
    res.redirect(`/`);
  }
};

const getEditForm = async (req, res) => {
  try {
    const BookToEdit = await Book.findById(req.params.BookId);
    res.render("Book/edit", { Book: BookToEdit });
  } catch (err) {
    console.log(err);
    res.redirect(`/`);
  }
};

const editBook = async (req, res) => {
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
};

module.exports = {
  getAllBooks,
  getOneBook,
  createBook,
  deleteBook,
  editBook,
  getNewForm,
  getEditForm,
};