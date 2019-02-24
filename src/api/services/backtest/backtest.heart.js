import ccxt from "ccxt";
import moment from "moment";
import configuracao from "../../database/mongo/models/backtest.configuracao.model";
import strategy from "./backtest.strategies";

async function carregarDados(params) {
    const exchangeCCXT = new ccxt[params.exchange]();
    exchange.enableRateLimit = true;
    await exchangeCCXT.loadMarkets();

    const pairCurrency = `${params.target_currency}/${params.base_currency}`;
    const market = exchangeCCXT.markets[pairCurrency];
    const { candle_size } = params;
    const configIndicators = params;

    const time = moment(params.date);

    const candle = await exchangeCCXT.fetchOHLCV(pairCurrency, candle_size, time.format("x"));
    const result = await strategy.loadStrategy(configIndicators, candle, market);

    return {
        result,
    };
}

export default { carregarDados };
