let books = [
    { id: 1, title: '1984', author: 'George Orwell' },
    { id: 2, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald' },
    { id: 3, title: 'Pride and Prejudice', author: 'Jane Austen' },
    { id: 4, title: 'To Kill a Mockingbird', author: 'Harper Lee'}
]

function getBooks () {
    return books;
}

function getBookById(id) {
    return books.find((book) => book.id === parseInt(id));
}

function addBook(bookData) {
    let newBook = {id: books.length + 1, ...bookData };
    books.push(newBook);
    return newBook;
}

module.exports = { getBooks, getBookById, addBook };