const backtestService = require("./services/backtest.heart");

const testSetup = async (req, res) => {
    try {
        const params = {
            exchange: req.body.exchange,
            indicator: req.body.indicator,
            profit: req.body.profit,
            stop: req.body.stop,
            sellForIndicator: req.body.sellForIndicator,
            base_currency: req.body.base_currency,
            target_currency: req.body.target_currency,
            candle_size: req.body.candle_size,
            date: req.body.date,
        };

        const backtestResult = await backtestService.loadTest(params);
        res.status(200).json({
            backtestResult,
        });
    } catch (error) {
        res.status(400).json({
            error,
        });
    }
};

module.exports = {
    testSetup,
};
