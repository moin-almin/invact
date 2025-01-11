const express = require("express");
const cors = require("cors");
let { getStocks, getStockByTicker, addNewTrade, validateTicker, validateTrade } = require('./controllers/index.js');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/stocks', async (req, res) => {
    let stocks = await getStocks();

    if (stocks.length === 0) {
        return res.status(404).json({error: 'No stocks found.'});
    }

    res.status(200).json({stocks});
})

app.get('/stocks/:ticker', async (req, res) => {
    let ticker = req.params.ticker;

    let error = validateTicker(ticker);
    if (error) {
        return res.status(400).send(error);
    }

    let stock = await getStockByTicker(ticker);
    if (!stock) {
        return res.status(404).json({error: 'Stock not found.'});
    }

    res.status(200).json({stock});
})

app.post('/trades/new', async (req, res) => {
    let trade = req.body;

    let error = validateTrade(trade);
    if (error) return res.status(400).send(error);

    let newTrade = await addNewTrade(trade);
    res.status(201).json({trade: newTrade});
})

module.exports = { app };