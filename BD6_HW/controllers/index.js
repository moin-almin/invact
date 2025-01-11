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

function validateTicker(ticker) {
    if (!ticker || typeof ticker !== 'string') {
        return "Ticker is required and must be a string.";
    }

    return null;
}

function validateTrade(trade) {
    if (!trade.stockId || typeof trade.stockId !== 'number') {
        return "Stock ID is required and must be a number.";
    }

    if (!trade.quantity || typeof trade.quantity !== 'number') {
        return "Quantity is required and must be a number.";
    }

    if (!trade.tradeType || typeof trade.tradeType !== 'string') {
        return "Trade Type is required and must be a string.";
    }

    if (!trade.tradeDate || typeof trade.tradeDate !== 'string') {
        return "Trade Date is required and must be a string.";
    }

    return null;
}

module.exports = { getStocks, getStockByTicker, addNewTrade, validateTicker,validateTrade };