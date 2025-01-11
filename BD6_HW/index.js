const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

let stocks = [
    { stockId: 1, ticker: 'AAPL', companyName: 'Apple Inc.', price: 150.75 },
    { stockId: 2, ticker: 'GOOGL', companyName: 'Alphabet Inc.', price: 2750.10 },
    { stockId: 3, ticker: 'TSLA', companyName: 'Tesla, Inc.', price: 695.50 },
];

let trades = [
    { tradeId: 1, stockId: 1, quantity: 10, tradeType: 'buy', tradeDate: '2024-08-07' },
    { tradeId: 2, stockId: 2, quantity: 5, tradeType: 'sell', tradeDate: '2024-08-06' },
    { tradeId: 3, stockId: 3, quantity: 7, tradeType: 'buy', tradeDate: '2024-08-05' },
];

// Function: Retrieve All Stocks
async function getStocks() {
    return stocks;
}

// Function: Retrieve Stock by Ticker
async function getStockByTicker(ticker) {
    return stocks.find((stock) => stock.ticker === ticker);
}

// Function: Add a New Trade
async function addNewTrade(trade) {
    let newTrade = {
        tradeId: trades.length + 1,
        stockId: trade.stockId,
        quantity: trade.quantity,
        tradeType: trade.tradeType,
        tradeDate: trade.tradeDate,
    }
    trades.push(newTrade);
    return newTrade;
}

app.get('/stocks', async (req, res) => {
    let stocks = await getStocks();
    res.status(200).json(stocks)
})

app.get('/stocks/:ticker', async (req, res) => {
    let ticker = req.params.ticker;
    let stock = await getStockByTicker(ticker);
    res.status(200).json(stock );
})

app.post('/trades/new', async (req, res) => {
    let trade = req.body;
    let newTrade = await addNewTrade(trade);
    res.status(201).json({trade: newTrade});
})

app.listen(3000, () => {
    console.log("Server started on port 3000");
})

module.exports = { app, getStocks, getStockByTicker, addNewTrade };