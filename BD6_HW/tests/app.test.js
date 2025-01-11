const request = require('supertest');
const { app } = require("../index.js");
const  { getStocks, getStockByTicker, addNewTrade, validateTicker,validateTrade } = require("../controllers");
const http = require('http');
const {getAllReviews, getReviewById, addReview, getUserById, addUser} = require("../../BD6.3_CW");

jest.mock("../controllers/index.js", () => ({
    ...jest.requireActual("../controllers/index.js"),
    getStocks: jest.fn(),
    getStockByTicker: jest.fn(),
    addNewTrade: jest.fn(),
}))

let server;

beforeAll((done) => {
    server = http.createServer(app);
    server.listen(3001, done);
});

afterAll((done) => {
    server.close(done);
});

describe('API Endpoints', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("GET API /stocks should retrieve all stocks", async() => {
        const mockStocks = [
            { stockId: 1, ticker: 'AAPL', companyName: 'Apple Inc.', price: 150.75 },
            { stockId: 2, ticker: 'GOOGL', companyName: 'Alphabet Inc.', price: 2750.10 },
            { stockId: 3, ticker: 'TSLA', companyName: 'Tesla, Inc.', price: 695.50 },
        ];

        getStocks.mockResolvedValue(mockStocks);

        const result = await request(server).get('/stocks');
        expect (result.statusCode).toEqual(200);
        expect(result.body).toEqual({ stocks: mockStocks });
    });

    it("GET API /stocks/:ticker should retrieve a specific stock by ticker", async() => {
        const mockStock = { stockId: 1, ticker: 'AAPL', companyName: 'Apple Inc.', price: 150.75 };
        getStockByTicker.mockResolvedValue(mockStock);

        const result = await request(server).get('/stocks/AAPL');
        expect(result.statusCode).toEqual(200);
        expect(result.body).toEqual({ stock: mockStock });
    });

    it("POST API /trades/new should add a new trade", async() => {
        const newTrade = { tradeId: 4, stockId: 1, quantity: 5, tradeType: 'sell', tradeDate: '2024-08-06' };
        addNewTrade.mockResolvedValue(newTrade);

        const res = await request(server).post('/trades/new')
            .send({ stockId: 1, quantity: 5, tradeType: 'sell', tradeDate: '2024-08-06' });

        expect(res.statusCode).toEqual(201);
        expect(res.body).toEqual({trade: newTrade});
    });

    it("GET API /stocks should return 404 if no stocks are found", async() => {
        getStocks.mockResolvedValue([]);
        const res = await request(server).get('/stocks');
        expect(res.statusCode).toEqual(404);
        expect(res.body.error).toBe("No stocks found.");
    })

    it("GET API /stocks/:ticker should return 404 for non-existing stock", async() => {
        getStockByTicker.mockResolvedValue(null);
        const res = await request(server).get('/stocks/INOX');
        expect(res.statusCode).toEqual(404);
        expect(res.body.error).toBe("Stock not found.");
    })

    it("POST API /trades/new should return 400 for invalid trade input", async() => {
        const res = await request(server).post("/trades/new").send(
            { tradeId: 4, quantity: 5, tradeType: 'sell', tradeDate: '2024-08-06' }
        );

        expect(res.statusCode).toEqual(400);
        expect(res.text).toEqual("Stock ID is required and must be a number.");
    })
});

describe("Function Tests", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    })

    it("getStocks should return a list of stocks", async () => {
        const mockStocks = [
            { stockId: 1, ticker: 'AAPL', companyName: 'Apple Inc.', price: 150.75 },
            { stockId: 2, ticker: 'GOOGL', companyName: 'Alphabet Inc.', price: 2750.10 },
            { stockId: 3, ticker: 'TSLA', companyName: 'Tesla, Inc.', price: 695.50 },
        ]
        getStocks.mockResolvedValue(mockStocks);

        let result = await getStocks();
        expect(result).toEqual(mockStocks);
        expect(getStocks).toHaveBeenCalled();
    })

    it("getStockByTicker should return Stock details", async () => {
        const mockStock = { stockId: 1, ticker: 'AAPL', companyName: 'Apple Inc.', price: 150.75 };

        getStockByTicker.mockResolvedValue(mockStock);

        let result = await getStockByTicker('AAPL');
        expect(result).toEqual(mockStock);
        expect(getStockByTicker).toHaveBeenCalledWith('AAPL');
    })

    it("addNewTrade should add a new trade", async () => {
        const newTrade = { tradeId: 4, stockId: 1, quantity: 5, tradeType: 'sell', tradeDate: '2024-08-06' }

        addNewTrade.mockResolvedValue(newTrade);

        let result = await addNewTrade(newTrade);

        expect(result).toEqual(newTrade);
        expect(addNewTrade).toHaveBeenCalledWith(newTrade);
    })
})

describe("Validation Functions", () => {
    it("should validate Ticker input correctly", () => {
        expect(validateTicker("AAPL")).toBeNull();
        expect(validateTicker()).toEqual("Ticker is required and must be a string.");
        expect(validateTicker(5)).toEqual("Ticker is required and must be a string.");
    });

    it("should validate Trade input correctly", () => {
        expect(validateTrade( { stockId: 1, quantity: 10, tradeType: 'buy', tradeDate: '2024-08-07' })).toBeNull();
        expect(validateTrade( {quantity: 10, tradeType: 'buy', tradeDate: '2024-08-07' })).toEqual("Stock ID is required and must be a number.");
        expect(validateTrade({ stockId: "String", quantity: 10, tradeType: 'buy', tradeDate: '2024-08-07' })).toEqual("Stock ID is required and must be a number.");
        expect(validateTrade( { stockId: 1, tradeType: 'buy', tradeDate: '2024-08-07' })).toEqual("Quantity is required and must be a number.");
        expect(validateTrade( { stockId: 1, quantity: "Quantity", tradeType: 'buy', tradeDate: '2024-08-07' })).toEqual("Quantity is required and must be a number.");
        expect(validateTrade( { stockId: 1, quantity: 10, tradeDate: '2024-08-07' })).toEqual("Trade Type is required and must be a string.");
        expect(validateTrade( { stockId: 1, quantity: 10, tradeType: 1, tradeDate: '2024-08-07' })).toEqual("Trade Type is required and must be a string.");
        expect(validateTrade( { stockId: 1, quantity: 10, tradeType: 'buy'})).toEqual("Trade Date is required and must be a string.");
        expect(validateTrade( { stockId: 1, quantity: 10, tradeType: 'buy', tradeDate: 2024 })).toEqual("Trade Date is required and must be a string.");
    })
})