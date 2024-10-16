const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const joi = require('joi');
const Book = require('./models/book-model')
const port = process.env.PORT || 7070;
const app = express();
require('dotenv').config()
app.use(express.json());
app.use(morgan('dev'));
const url = "mongodb+srv://ashrafsamir:010203@book-api.pjyb5.mongodb.net/Siri-Booking?retryWrites=true&w=majority&appName=book-api";

mongoose.connect(url).then(()=>{
    console.log('Connected to Siri-Booking');
})

const bookschema = joi.object({
     title: joi.string().required(),
     author: joi.string().required(),
     description: joi.string().required(),
     genre: joi.string().required(),
     pages: joi.number().required(),
     quantity: joi.number().required(),
     price: joi.number().required(),
     publicationYear: joi.number().required(),
     available: joi.boolean().optional()
})

app.post('/api/book', async(req,res)=>{
    const {error,value} = bookschema.validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    const {title, author, description, genre, pages, quantity, price, publicationYear, available} =value;
    try {
       const netbook = new Book({title, author, description, genre, pages, quantity, price, publicationYear, available});
       await netbook.save();
       res.status(201).send(`Book saved successfully`);
    } catch (err) {
        console.log(`Error: ${err.message}`);
        res.status(500).send(`Failed to add the book :${err.message}`);
    }
})
app.get('/api/book', async(req,res)=>{ 
    try { 
        const books = await Book.find()
        if(books.length === 0) return res.status(404).send('No Books found') ;
        res.status(200).send(books)
    } catch (err) {
        console.log(`Error: ${err.message}`);
        res.status(500).send('Failed to retrieve the book');
    }
}) 
 
app.get('/api/book/:id', async(req,res)=>{
    try {
        const books = await Book.findById(req.params.id)
        if(!books) return res.status(404).send('No Books found') ;
        res.status(200).send(books)
    } catch (err) {
        console.log(`Error: ${err.message}`);
        res.status(500).send('Failed to retrieve the book');
    }
})


app.patch('/api/book/:id', async(req,res)=>{
    const {title, author, description, genre, pages, quantity, price, publicationYear, available} = req.body;
    try {
        const book = await Book.findByIdAndUpdate(req.params.id, {title, author, description, genre, pages, quantity, price, publicationYear, available}, { new : true })
        if(!book) return res.status(404).send('No Book found');
        res.status(200).send(`Book updated successfully \n${book}`);
    } catch (err) {
        console.log(`Error: ${err.message}`);
        res.status(500).send(`Failed to update the book :${err.message}`);
    }
})

app.delete('/api/book/:id', async(req,res)=>{
    try {
       const book = await Book.findByIdAndDelete(req.params.id);
       if(!book) return res.status(404).send('No Book found');
        res.status(200).send('Book deleted successfully');
     } catch (err) {
         console.log(`Error: ${err.message}`);
         res.status(500).send(`Failed to delete the book :${err.message}`);
     }
})

app.delete('/api/book', async(req,res)=>{
    try {
        const book = await Book.find()
        if(book.length === 0) return res.status(404).send('This books is empty') ;
        await Book.deleteMany();
        res.status(200).send('All books deleted successfully');
    } catch (err) {
        console.log(`Error: ${err.message}`);
        res.status(500).send(`Failed to delete all the books :${err.message}`);
    }
})

app.listen(port,()=>{
    console.log(`Server is running on port ${process.env.PORT}`);
})