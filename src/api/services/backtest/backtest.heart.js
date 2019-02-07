import ccxt from 'ccxt';
import moment from 'moment';
import configuracao from '../../database/mongo/models/backtest.configuracao.model';
import strategy from './backtest.strategies';

async function carregarDados(params) {
    exchangeCCXT = new ccxt[params.exchange]();
    exchange.enableRateLimit = true;
    await exchangeCCXT.loadMarkets();

    const pair_currency = `${params.target_currency}/${params.base_currency}`;
    const market = exchangeCCXT.markets[pair_currency];
    const candle_size = params.candle_size;
    const configIndicators = params;

    let time = moment(params.date);

    const candle = await exchangeCCXT.fetchOHLCV(pair_currency, candle_size, time.format('x'));
    const result = await strategy.loadStrategy(configIndicators, candle, market);

    return {
        result,
    };
}

export default { carregarDados };