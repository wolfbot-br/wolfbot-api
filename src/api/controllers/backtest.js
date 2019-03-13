const backtest = require("../services/backtest/backtest.service");

const testarConfiguracao = async (req, res, next) => {
    try {
        params = {
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

        backtest.carregarDados(params).then(function(resp) {
            res.status(200).json({
                data: resp,
                status: "200",
            });
        });
    } catch (e) {
        res.status(400).json({
            message: e.message,
            status: "400",
        });
    }
};

module.exports = { testarConfiguracao };
