import backtest from "../services/backtest/backtest.heart";

const testarConfiguracao = async (ctx) => {
    const params = {
        exchange: ctx.request.body.exchange,
        indicator: ctx.request.body.indicator,
        profit: ctx.request.body.profit,
        stop: ctx.request.body.stop,
        sellForIndicator: ctx.request.body.sellForIndicator,
        base_currency: ctx.request.body.base_currency,
        target_currency: ctx.request.body.target_currency,
        candle_size: ctx.request.body.candle_size,
        date: ctx.request.body.date,
    };

    const response = await backtest.carregarDados(params);

    return ctx.ok({
        data: response,
        status: 200,
    });
};

export default { testarConfiguracao };
