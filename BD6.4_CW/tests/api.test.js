const request = require('supertest');
const app = require('../index');

const {
    getBooks, getBookById, getReviews, getReviewById
} = require('../book');
const http = require('http');

jest.mock('../book.js', () => ({
    ...jest.requireActual('../book.js'),
    getBooks: jest.fn(),
    getBookById: jest.fn(),
    getReviews: jest.fn(),
    getReviewById: jest.fn(),
}));

let server;

beforeAll((done) => {
    server = http.createServer(app);
    server.listen(3001, done);
});

afterAll((done) => {
    server.close(done);
});

describe('API Error Hnadling Test', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("GET API /api/books should return 404 if no books are found", async () => {
        getBooks.mockReturnValue([]);

        const response = await request(server).get('/api/books');
        expect(response.status).toBe(404);
        expect(response.body.error).toBe("No books found.");
    });

    it("GET API /api/book/:id should return 404 for non-existing book", async () => {
        getBookById.mockReturnValue(null);

        const response = await request(server).get('/api/books/999');
        expect(response.status).toBe(404);
        expect(response.body.error).toBe("Book not found");
    })

    it("GET API /api/reviews should return 404 if no reviews are found", async () => {
        getReviews.mockReturnValue([]);

        const response = await request(server).get('/api/reviews');
        expect(response.status).toBe(404);
        expect(response.body.error).toBe("No reviews found.");
    });

    it("GET API /api/reviews/:id should return 404 for non-existing reviews", async () => {
        getReviewById.mockReturnValue(null);

        const response = await request(server).get('/api/reviews/999');
        expect(response.status).toBe(404);
        expect(response.body.error).toBe("Review not found.");
    })
});