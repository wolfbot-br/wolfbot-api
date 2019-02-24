import _ from "lodash";

import Configuration from "../database/mongo/models/configuracao.model";

// Método que retorna uma configuração salva no banco
const get = (ctx) => {
    const { user_id } = ctx.request.params;

    Configuration.findOne({ "user.user_id": user_id }, (err, configuracao) => {
        if (configuracao == null) {
            return ctx.ok({
                configuracao: {},
                message: "Configuração não cadastrada!",
                status: "406",
            });
        }
        return ctx.ok({
            configuracao,
            message: "Configuração recuperada com sucesso!",
            status: "200",
        });
    });
};

// Método que salva uma configuração no banco de dados
const post = (ctx) => {
    const json = JSON.stringify(ctx.request.body);
    const config = JSON.parse(json);

    const nova_configuracao = new Configuration({
        exchange: config.exchange,
        api_key: config.apiKey,
        secret: config.secret,
        user: config.user,
        status: config.status,
        base_currency: config.base_currency,
        target_currency: config.target_currency,
        candle_size: config.candle_size,
        strategy: config.strategy,
    });

    nova_configuracao.save((err) => {
        if (err) {
            return ctx.internalServerError({
                message: "Não foi possível cadastrar uma nova configuração!",
                status: "500",
            });
        }
        return ctx.created({
            message: "Configuração cadastrada com sucesso!",
            status: "201",
        });
    });
};

/* Método que retorna altera uma informação da exchange
    @params : nome, id
*/
const put = (ctx) => ctx.ok({ message: "Não implementado ainda" });

/* Método que exclui uma exchange */
const exclusao = (ctx) => ctx.ok({ message: "Não implementado ainda" });

export default {
    get,
    post,
    put,
    exclusao,
};
