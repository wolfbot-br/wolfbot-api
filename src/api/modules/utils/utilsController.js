const ccxt = require("ccxt");

const listAllExchanges = (req, res, next) => {
    res.status(200).json({ exchanges: ccxt.exchanges });
};

module.exports = { listAllExchanges };
