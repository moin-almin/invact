const request = require('supertest');
const  { app, validateUser, validateBook, validateReview } = require('../index');
const http = require('http');

// jest.mock('../index.js', () => ({
//     ...jest.requireActual('../index.js'),
//     validateUser: jest.fn(),
//     validateBook: jest.fn(),
//     validateReview: jest.fn(),
// }));

let server;

beforeAll((done) => {
    server = http.createServer(app);
    server.listen(3001, done);
});

afterAll((done) => {
    server.close(done);
});

describe("API Endpoints to add data", () => {
    it("should add a new user with valid input", async() => {
        const res = await request(server).post("/api/users").send({ name: "John Doe", email: "john@example.com" });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual({
            id: 1, name: "John Doe", email: "john@example.com"
        })
    });
    it("should return 400 for invalid user input", async() => {
        const res = await request(server).post("/api/users").send({ name: "John Doe" });

        expect(res.statusCode).toEqual(400);
        expect(res.text).toEqual("Email is required and should be a string.");
    });

    it("should add a new book with valid input", async() => {
        const res = await request(server).post("/api/books").send({ title: "The Great gatsby", author: "F Scott Fitzgerald" });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual({
            id: 1, title: "The Great gatsby", author: "F Scott Fitzgerald"
        })
    });

    it("should return 400 for invalid book input", async() => {
        const res = await request(server).post("/api/books").send({ title: "The Great gatsby" });

        expect(res.statusCode).toEqual(400);
        expect(res.text).toEqual("Author is required and should be a string.");
    })

    it("should add a new review with valid input", async() => {
        const res = await request(server).post("/api/reviews").send({ content: "Great Writing", userId: 1 });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual({
            id: 1, content: "Great Writing", userId: 1
        })
    });

    it("should return 400 for invalid review input", async() => {
        const res = await request(server).post("/api/reviews").send({ userId: 1 });

        expect(res.statusCode).toEqual(400);
        expect(res.text).toEqual("Content is required and should be a string.");
    })
})

describe("Validation Functions", () => {
    it("should validate user input correctly", () => {
        expect(validateUser({ name: "John", email: "john@example.com" })).toBeNull();
        expect(validateUser({ name: "John" })).toEqual("Email is required and should be a string.");
        expect(validateUser({ email: "john@example.com" })).toEqual("Name is required and should be a string.");
    });

    it("should validate user book correctly", () => {
        expect(validateBook({ title: "The Great gatsby", author: "F Scott Fitzgerald" })).toBeNull();
        expect(validateBook({ title: "The Great gatsby" })).toEqual("Author is required and should be a string.");
        expect(validateBook({  author: "F Scott Fitzgerald" })).toEqual("Title is required and should be a string.");
    })

    it("should validate user reviews correctly", () => {
        expect(validateReview({ content: "Great Writing", userId: 1 })).toBeNull();
        expect(validateReview({ content: "Great Writing" })).toEqual("User ID is required and should be a number.");
        expect(validateReview({ userId: 1 })).toEqual("Content is required and should be a string.");
    })
})