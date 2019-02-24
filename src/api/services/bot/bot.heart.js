import ccxt from "ccxt";
import _ from "lodash";
import moment from "moment";
import robo from "set-interval";
import strategy from "./bot.strategies";
import configuracao from "../../database/mongo/models/configuracao.model";
import order from "../order";

async function roboLigado(params) {
    const config = await configuracao.findOne({ "user.user_id": params.user_id });

    console.log("########## Robo Ligado ##########");
    acionarMonitoramento(config, params);
}

function roboDesligado(params) {
    console.log("########## Robo Desligado ##########");
    robo.clear(params.key);
}

async function acionarMonitoramento(config) {
    const nome_exchange = config.exchange.toLowerCase();
    const exchangeCCXT = new ccxt[nome_exchange]();
    exchangeCCXT.enableRateLimit = true;
    let periodo = "";
    const params_order = { action: "Automatic", user_id: config.user.user_id };
    const unidadeTempo = config.candle_size.substr(-1);
    const unidadeTamanho = Number.parseInt(config.candle_size.substr(0));
    const tamanhoCandle = config.candle_size;
    const arrayCurrencies = config.target_currency;

    if (unidadeTempo === "m") {
        periodo = "minutes";
    } else if (unidadeTempo === "h") {
        periodo = "hours";
    } else {
        periodo = "days";
    }
    const tempo = moment().subtract(100 * unidadeTamanho, periodo);
    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    robo.start(
        async function load() {
            for (let i = 0; i <= arrayCurrencies.length - 1; i++) {
                await sleep(exchangeCCXT.rateLimit); // milliseconds
                const parMoedas = `${arrayCurrencies[i].currency}/${config.base_currency}`;
                const candle = await exchangeCCXT.fetchOHLCV(
                    parMoedas,
                    tamanhoCandle,
                    (since = tempo.format("x")),
                    (limit = 1000)
                );
                params_order.currency = arrayCurrencies[i].currency;
                const ordersOpen = await order.getOrdersOpenByCurrency(params_order);
                await strategy.loadStrategy(
                    config,
                    params,
                    arrayCurrencies[i].currency,
                    candle,
                    ordersOpen
                );
            }
            console.log(
                "-----------------------------------------------------------------------------"
            );
        },
        config.status.interval_check,
        config.status.key
    );
}

export default { roboLigado, roboDesligado };
