const express = require('express');
const {getBooks, getBookById, addBook} = require("./book");
const app = express();
app.use(express.json());

app.get('/api/books', (req, res) => {
    res.json(getBooks());
});

app.get('/api/books/:id', (req, res) => {
    const book = getBookById(req.params.id);
    if (!book) return res.status(404).send('Book not found!');
    res.json(book);
});

app.post('/api/books', (req, res) => {
    const book = addBook(req.body);
    res.status(201).json(book);
})

app.listen(3000, () => console.log('Server started on port 3000'));

module.exports = app;