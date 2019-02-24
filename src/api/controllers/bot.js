import bot from "../services/bot/bot.heart";

// requisição que aciona ou desliga o robo
const acionarRobo = async (ctx) => {
    const params = {
        user_id: ctx.request.body.user_id,
        status_bot: ctx.request.body.status.status_bot,
        status_buy: ctx.request.body.status.status_buy,
        status_sell: ctx.request.body.status.status_sell,
        key: ctx.request.body.status.key,
    };

    if (params.status_bot) {
        bot.roboLigado(params);
        return ctx.ok(200).json({
            message: "Robo Ligado",
            status: "200",
        });
    }
    bot.roboDesligado(params);
    return ctx.ok(200).json({
        message: "Robo Desligado",
        status: "200",
    });
};

export default { acionarRobo };
