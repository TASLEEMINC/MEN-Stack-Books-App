// models/fruit

const mongoose = require('mongoose')

// define a schema for all Fruit documents
const BookSchema = new mongoose.Schema({
    // structure the keys / properties in our document
    name: String,
    isRead: Boolean,
}) 

// register the model using the schema
const Book = mongoose.model("Book", BookSchema)

// export the model object 
module.exports = Book // ??? - export a value that allows that value to be accessible outside of fruit.js